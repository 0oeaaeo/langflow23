from collections import defaultdict
from fastapi import WebSocket, status
from langflow.api.v1.schemas import ChatMessage, ChatResponse, FileResponse
from langflow.cache import cache_manager
from langflow.cache.manager import Subject
from langflow.chat.utils import process_graph
from langflow.interface.utils import pil_to_base64
from langflow.utils.logger import logger


import asyncio
import json
from typing import Any, Dict, List

from langflow.cache.flow import InMemoryCache


class ChatHistory(Subject):
    def __init__(self):
        super().__init__()
        self.history: Dict[str, List[ChatMessage]] = defaultdict(list)

    def add_message(self, client_id: str, message: ChatMessage):
        """Add a message to the chat history."""

        self.history[client_id].append(message)

        if not isinstance(message, FileResponse):
            self.notify()

    def get_history(self, client_id: str, filter_messages=True) -> List[ChatMessage]:
        """Get the chat history for a client."""
        if history := self.history.get(client_id, []):
            if filter_messages:
                return [msg for msg in history if msg.type not in ["start", "stream"]]
            return history
        else:
            return []

    def empty_history(self, client_id: str):
        """Empty the chat history for a client."""
        self.history[client_id] = []


class ChatManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.chat_history = ChatHistory()
        self.cache_manager = cache_manager
        self.cache_manager.attach(self.update)
        self.in_memory_cache = InMemoryCache()

    def on_chat_history_update(self):
        """Send the last chat message to the client."""
        client_id = self.cache_manager.current_client_id
        if client_id in self.active_connections:
            chat_response = self.chat_history.get_history(
                client_id, filter_messages=False
            )[-1]
            if chat_response.is_bot:
                # Process FileResponse
                if isinstance(chat_response, FileResponse):
                    # If data_type is pandas, convert to csv
                    if chat_response.data_type == "pandas":
                        chat_response.data = chat_response.data.to_csv()
                    elif chat_response.data_type == "image":
                        # Base64 encode the image
                        chat_response.data = pil_to_base64(chat_response.data)
                # get event loop
                loop = asyncio.get_event_loop()

                coroutine = self.send_json(client_id, chat_response)
                asyncio.run_coroutine_threadsafe(coroutine, loop)

    def update(self):
        if self.cache_manager.current_client_id in self.active_connections:
            self.last_cached_object_dict = self.cache_manager.get_last()
            # Add a new ChatResponse with the data
            chat_response = FileResponse(
                message=None,
                type="file",
                data=self.last_cached_object_dict["obj"],
                data_type=self.last_cached_object_dict["type"],
            )

            self.chat_history.add_message(
                self.cache_manager.current_client_id, chat_response
            )

    async def connect(self, client_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[client_id] = websocket

    def disconnect(self, client_id: str):
        self.active_connections.pop(client_id, None)

    async def send_message(self, client_id: str, message: str):
        websocket = self.active_connections[client_id]
        await websocket.send_text(message)

    async def send_json(self, client_id: str, message: ChatMessage):
        websocket = self.active_connections[client_id]
        await websocket.send_json(message.dict())

    async def close_connection(self, client_id: str, code: int, reason: str):
        if websocket := self.active_connections[client_id]:
            try:
                await websocket.close(code=code, reason=reason)
                self.disconnect(client_id)
            except RuntimeError as exc:
                # This is to catch the following error:
                #  Unexpected ASGI message 'websocket.close', after sending 'websocket.close'
                if "after sending" in str(exc):
                    logger.error(f"Error closing connection: {exc}")

    async def process_message(
        self, client_id: str, payload: Dict, langchain_object: Any
    ):
        # Process the graph data and chat message
        chat_inputs = payload.pop("inputs", "")
        chat_inputs = ChatMessage(message=chat_inputs)
        self.chat_history.add_message(client_id, chat_inputs)

        # graph_data = payload
        start_resp = ChatResponse(message=None, type="start", intermediate_steps="")
        await self.send_json(client_id, start_resp)

        # is_first_message = len(self.chat_history.get_history(client_id=client_id)) <= 1
        # Generate result and thought
        try:
            logger.debug("Generating result and thought")

            result, intermediate_steps = await process_graph(
                langchain_object=langchain_object,
                chat_inputs=chat_inputs,
                websocket=self.active_connections[client_id],
            )
        except Exception as e:
            # Log stack trace
            logger.exception(e)
            self.chat_history.empty_history(client_id)
            raise e
        # Send a response back to the frontend, if needed
        intermediate_steps = intermediate_steps or ""
        history = self.chat_history.get_history(client_id, filter_messages=False)
        file_responses = []
        if history:
            # Iterate backwards through the history
            for msg in reversed(history):
                if isinstance(msg, FileResponse):
                    if msg.data_type == "image":
                        # Base64 encode the image
                        if isinstance(msg.data, str):
                            continue
                        msg.data = pil_to_base64(msg.data)
                    file_responses.append(msg)
                if msg.type == "start":
                    break

        response = ChatResponse(
            message=result,
            intermediate_steps=intermediate_steps.strip(),
            type="end",
            files=file_responses,
        )
        await self.send_json(client_id, response)
        self.chat_history.add_message(client_id, response)

    def set_cache(self, client_id: str, langchain_object: Any) -> bool:
        """
        Set the cache for a client.
        """

        self.in_memory_cache.set(client_id, langchain_object)
        return client_id in self.in_memory_cache

    async def handle_websocket(self, client_id: str, websocket: WebSocket):
        await self.connect(client_id, websocket)

        try:
            chat_history = self.chat_history.get_history(client_id)
            # iterate and make BaseModel into dict
            chat_history = [chat.dict() for chat in chat_history]
            await websocket.send_json(chat_history)

            while True:
                json_payload = await websocket.receive_json()
                try:
                    payload = json.loads(json_payload)
                except TypeError:
                    payload = json_payload
                if "clear_history" in payload:
                    self.chat_history.history[client_id] = []
                    continue

                with self.cache_manager.set_client_id(client_id):
                    langchain_object = self.in_memory_cache.get(client_id)
                    await self.process_message(client_id, payload, langchain_object)

        except Exception as exc:
            # Handle any exceptions that might occur
            logger.error(f"Error handling websocket: {exc}")
            await self.close_connection(
                client_id=client_id,
                code=status.WS_1011_INTERNAL_ERROR,
                reason=str(exc)[:120],
            )
        finally:
            try:
                await self.close_connection(
                    client_id=client_id,
                    code=status.WS_1000_NORMAL_CLOSURE,
                    reason="Client disconnected",
                )
            except Exception as exc:
                logger.error(f"Error closing connection: {exc}")
            self.disconnect(client_id)
