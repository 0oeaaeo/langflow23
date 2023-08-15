from http import HTTPStatus
from typing import Annotated, Optional

from langflow.cache.utils import save_uploaded_file
from langflow.database.models.flow import Flow
from langflow.processing.process import process_graph_cached, process_tweaks
from langflow.utils.logger import logger
from langflow.settings import settings

from fastapi import APIRouter, Depends, HTTPException, UploadFile, Body

from langflow.interface.custom.custom_component import CustomComponent


from langflow.api.v1.schemas import (
    ProcessResponse,
    UploadFileResponse,
    CustomComponentCode,
)

from langflow.api.utils import merge_nested_dicts_with_renaming

from langflow.interface.types import (
    build_langchain_types_dict,
    build_langchain_template_custom_component,
    build_langchain_custom_component_list_from_path,
)

from langflow.database.base import get_session
from sqlmodel import Session

# build router
router = APIRouter(tags=["Base"])


@router.get("/all")
def get_all():
    logger.debug("Building langchain types dict")
    native_components = build_langchain_types_dict()
    # custom_components is a list of dicts
    # need to merge all the keys into one dict
    custom_components_from_file = {}
    if settings.COMPONENTS_PATH:
        logger.info(f"Building custom components from {settings.COMPONENTS_PATH}")

        custom_component_dicts = []
        processed_paths = []
        for path in settings.COMPONENTS_PATH:
            if str(path) in processed_paths:
                continue
            custom_component_dict = build_langchain_custom_component_list_from_path(
                str(path)
            )
            custom_component_dicts.append(custom_component_dict)
            processed_paths.append(str(path))

        logger.info(f"Loading {len(custom_component_dicts)} category(ies)")
        for custom_component_dict in custom_component_dicts:
            # custom_component_dict is a dict of dicts
            category = list(custom_component_dict.keys())[0]
            logger.info(
                f"Loading {len(custom_component_dict[category])} component(s) from category {category}"
            )
            logger.debug(custom_component_dict)
            custom_components_from_file = merge_nested_dicts_with_renaming(
                custom_components_from_file, custom_component_dict
            )

    return merge_nested_dicts_with_renaming(
        native_components, custom_components_from_file
    )


# For backwards compatibility we will keep the old endpoint
@router.post("/predict/{flow_id}", response_model=ProcessResponse)
@router.post("/process/{flow_id}", response_model=ProcessResponse)
async def process_flow(
    flow_id: str,
    inputs: Optional[dict] = None,
    tweaks: Optional[dict] = None,
    clear_cache: Annotated[bool, Body(embed=True)] = False,  # noqa: F821
    session: Session = Depends(get_session),
):
    """
    Endpoint to process an input with a given flow_id.
    """

    try:
        flow = session.get(Flow, flow_id)
        if flow is None:
            raise ValueError(f"Flow {flow_id} not found")

        if flow.data is None:
            raise ValueError(f"Flow {flow_id} has no data")
        graph_data = flow.data
        if tweaks:
            try:
                graph_data = process_tweaks(graph_data, tweaks)
            except Exception as exc:
                logger.error(f"Error processing tweaks: {exc}")
        response = process_graph_cached(graph_data, inputs, clear_cache)
        return ProcessResponse(
            result=response,
        )
    except Exception as e:
        # Log stack trace
        logger.exception(e)
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.post(
    "/upload/{flow_id}",
    response_model=UploadFileResponse,
    status_code=HTTPStatus.CREATED,
)
async def create_upload_file(file: UploadFile, flow_id: str):
    # Cache file
    try:
        file_path = save_uploaded_file(file.file, folder_name=flow_id)

        return UploadFileResponse(
            flowId=flow_id,
            file_path=file_path,
        )
    except Exception as exc:
        logger.error(f"Error saving file: {exc}")
        raise HTTPException(status_code=500, detail=str(exc)) from exc


# get endpoint to return version of langflow
@router.get("/version")
def get_version():
    from langflow import __version__

    return {"version": __version__}


@router.post("/custom_component", status_code=HTTPStatus.OK)
async def custom_component(
    raw_code: CustomComponentCode,
):
    extractor = CustomComponent(code=raw_code.code)
    extractor.is_check_valid()

    return build_langchain_template_custom_component(extractor)
