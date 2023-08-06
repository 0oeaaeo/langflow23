from fastapi.testclient import TestClient
from langflow.settings import settings


def test_llms_settings(client: TestClient):
    response = client.get("api/v1/all")
    assert response.status_code == 200
    json_response = response.json()
    llms = json_response["llms"]
    assert set(llms.keys()) == set(settings.LLMS)


# def test_hugging_face_hub(client: TestClient):
#     response = client.get("api/v1/all")
#     assert response.status_code == 200
#     json_response = response.json()
#     language_models = json_response["llms"]

#     model = language_models["HuggingFaceHub"]
#     template = model["template"]

#     assert template["cache"] == {
#         "required": False,
#         "placeholder": "",
#         "show": False,
#         "multiline": False,
#         "password": False,
#         "name": "cache",
#         "type": "bool",
#         "list": False,
#         "advanced": False,
#     }
#     assert template["verbose"] == {
#         "required": False,
#         "placeholder": "",
#         "show": False,
#         "multiline": False,
#         "value": False,
#         "password": False,
#         "name": "verbose",
#         "type": "bool",
#         "list": False,
#         "advanced": False,
#     }
#     assert template["client"] == {
#         "required": False,
#         "placeholder": "",
#         "show": False,
#         "multiline": False,
#         "password": False,
#         "name": "client",
#         "type": "Any",
#         "list": False,
#         "advanced": False,
#     }
#     assert template["repo_id"] == {
#         "required": False,
#         "placeholder": "",
#         "show": True,
#         "multiline": False,
#         "value": "gpt2",
#         "password": False,
#         "name": "repo_id",
#         "type": "str",
#         "list": False,
#         "advanced": False,
#     }
#     assert template["task"] == {
#         "required": True,
#         "placeholder": "",
#         "show": True,
#         "multiline": False,
#         "password": False,
#         "options": ["text-generation", "text2text-generation"],
#         "name": "task",
#         "type": "str",
#         "list": True,
#         "advanced": True,
#     }
#     assert template["model_kwargs"] == {
#         "required": False,
#         "placeholder": "",
#         "show": True,
#         "multiline": False,
#         "password": False,
#         "name": "model_kwargs",
#         "type": "code",
#         "list": False,
#         "advanced": True,
#     }
#     assert template["huggingfacehub_api_token"] == {
#         "required": False,
#         "placeholder": "",
#         "show": True,
#         "multiline": False,
#         "password": True,
#         "name": "huggingfacehub_api_token",
#         "display_name": "HuggingFace Hub API Token",
#         "type": "str",
#         "list": False,
#         "advanced": False,
#     }


def test_openai(client: TestClient):
    response = client.get("api/v1/all")
    assert response.status_code == 200
    json_response = response.json()
    language_models = json_response["llms"]

    model = language_models["OpenAI"]
    template = model["template"]

    assert template["cache"] == {
        "required": False,
        "dynamic": False,
        "placeholder": "",
        "show": False,
        "multiline": False,
        "password": False,
        "name": "cache",
        "type": "bool",
        "list": False,
        "advanced": False,
        "info": "",
    }
    assert template["verbose"] == {
        "required": False,
        "dynamic": False,
        "placeholder": "",
        "show": False,
        "multiline": False,
        "password": False,
        "name": "verbose",
        "type": "bool",
        "list": False,
        "advanced": False,
        "info": "",
    }
    assert template["client"] == {
        "required": False,
        "dynamic": False,
        "placeholder": "",
        "show": False,
        "multiline": False,
        "password": False,
        "name": "client",
        "type": "Any",
        "list": False,
        "advanced": False,
        "info": "",
    }
    assert template["model_name"] == {
        "required": False,
        "dynamic": False,
        "placeholder": "",
        "show": True,
        "multiline": False,
        "value": "text-davinci-003",
        "password": False,
        "options": [
            "text-davinci-003",
            "text-davinci-002",
            "text-curie-001",
            "text-babbage-001",
            "text-ada-001",
        ],
        "name": "model_name",
        "type": "str",
        "list": True,
        "advanced": False,
        "info": "",
    }
    # Add more assertions for other properties here
    assert template["temperature"] == {
        "required": False,
        "dynamic": False,
        "placeholder": "",
        "show": True,
        "multiline": False,
        "value": 0.7,
        "password": False,
        "name": "temperature",
        "type": "float",
        "list": False,
        "advanced": False,
        "info": "",
    }
    assert template["max_tokens"] == {
        "required": False,
        "dynamic": False,
        "placeholder": "",
        "show": True,
        "multiline": False,
        "value": 256,
        "password": True,
        "name": "max_tokens",
        "type": "int",
        "list": False,
        "advanced": False,
        "info": "",
    }
    assert template["top_p"] == {
        "required": False,
        "dynamic": False,
        "placeholder": "",
        "show": False,
        "multiline": False,
        "value": 1,
        "password": False,
        "name": "top_p",
        "type": "float",
        "list": False,
        "advanced": False,
        "info": "",
    }
    assert template["frequency_penalty"] == {
        "required": False,
        "dynamic": False,
        "placeholder": "",
        "show": False,
        "multiline": False,
        "value": 0,
        "password": False,
        "name": "frequency_penalty",
        "type": "float",
        "list": False,
        "advanced": False,
        "info": "",
    }
    assert template["presence_penalty"] == {
        "required": False,
        "dynamic": False,
        "placeholder": "",
        "show": False,
        "multiline": False,
        "value": 0,
        "password": False,
        "name": "presence_penalty",
        "type": "float",
        "list": False,
        "advanced": False,
        "info": "",
    }
    assert template["n"] == {
        "required": False,
        "dynamic": False,
        "placeholder": "",
        "show": False,
        "multiline": False,
        "value": 1,
        "password": False,
        "name": "n",
        "type": "int",
        "list": False,
        "advanced": False,
        "info": "",
    }
    assert template["best_of"] == {
        "required": False,
        "dynamic": False,
        "placeholder": "",
        "show": False,
        "multiline": False,
        "value": 1,
        "password": False,
        "name": "best_of",
        "type": "int",
        "list": False,
        "advanced": False,
        "info": "",
    }
    assert template["model_kwargs"] == {
        "required": False,
        "dynamic": False,
        "placeholder": "",
        "show": True,
        "multiline": False,
        "password": False,
        "name": "model_kwargs",
        "type": "code",
        "list": False,
        "advanced": True,
        "info": "",
    }
    assert template["openai_api_key"] == {
        "required": False,
        "dynamic": False,
        "placeholder": "",
        "show": True,
        "multiline": False,
        "value": "",
        "password": True,
        "name": "openai_api_key",
        "display_name": "OpenAI API Key",
        "type": "str",
        "list": False,
        "advanced": False,
        "info": "",
    }
    assert template["batch_size"] == {
        "required": False,
        "dynamic": False,
        "placeholder": "",
        "show": False,
        "multiline": False,
        "value": 20,
        "password": False,
        "name": "batch_size",
        "type": "int",
        "list": False,
        "advanced": False,
        "info": "",
    }
    assert template["request_timeout"] == {
        "required": False,
        "dynamic": False,
        "placeholder": "",
        "show": False,
        "multiline": False,
        "password": False,
        "name": "request_timeout",
        "type": "float",
        "list": False,
        "advanced": False,
        "info": "",
    }
    assert template["logit_bias"] == {
        "required": False,
        "dynamic": False,
        "placeholder": "",
        "show": False,
        "multiline": False,
        "password": False,
        "name": "logit_bias",
        "type": "code",
        "list": False,
        "advanced": False,
        "info": "",
    }
    assert template["max_retries"] == {
        "required": False,
        "dynamic": False,
        "placeholder": "",
        "show": False,
        "multiline": False,
        "value": 6,
        "password": False,
        "name": "max_retries",
        "type": "int",
        "list": False,
        "advanced": False,
        "info": "",
    }
    assert template["streaming"] == {
        "required": False,
        "dynamic": False,
        "placeholder": "",
        "show": False,
        "multiline": False,
        "value": False,
        "password": False,
        "name": "streaming",
        "type": "bool",
        "list": False,
        "advanced": False,
        "info": "",
    }


def test_chat_open_ai(client: TestClient):
    response = client.get("api/v1/all")
    assert response.status_code == 200
    json_response = response.json()
    language_models = json_response["llms"]

    model = language_models["ChatOpenAI"]
    template = model["template"]

    assert template["verbose"] == {
        "required": False,
        "dynamic": False,
        "placeholder": "",
        "show": False,
        "multiline": False,
        "value": False,
        "password": False,
        "name": "verbose",
        "type": "bool",
        "list": False,
        "advanced": False,
        "info": "",
    }
    assert template["client"] == {
        "required": False,
        "dynamic": False,
        "placeholder": "",
        "show": False,
        "multiline": False,
        "password": False,
        "name": "client",
        "type": "Any",
        "list": False,
        "advanced": False,
        "info": "",
    }
    assert template["model_name"] == {
        "required": False,
        "dynamic": False,
        "placeholder": "",
        "show": True,
        "multiline": False,
        "value": "gpt-3.5-turbo-0613",
        "password": False,
        "options": [
            "gpt-3.5-turbo-0613",
            "gpt-3.5-turbo",
            "gpt-3.5-turbo-16k-0613",
            "gpt-3.5-turbo-16k",
            "gpt-4-0613",
            "gpt-4-32k-0613",
            "gpt-4",
            "gpt-4-32k",
        ],
        "name": "model_name",
        "type": "str",
        "list": True,
        "advanced": False,
        "info": "",
    }
    assert template["temperature"] == {
        "required": False,
        "dynamic": False,
        "placeholder": "",
        "show": True,
        "multiline": False,
        "value": 0.7,
        "password": False,
        "name": "temperature",
        "type": "float",
        "list": False,
        "advanced": False,
        "info": "",
    }
    assert template["model_kwargs"] == {
        "required": False,
        "dynamic": False,
        "placeholder": "",
        "show": True,
        "multiline": False,
        "password": False,
        "name": "model_kwargs",
        "type": "code",
        "list": False,
        "advanced": True,
        "info": "",
    }
    assert template["openai_api_key"] == {
        "required": False,
        "dynamic": False,
        "placeholder": "",
        "show": True,
        "multiline": False,
        "value": "",
        "password": True,
        "name": "openai_api_key",
        "display_name": "OpenAI API Key",
        "type": "str",
        "list": False,
        "advanced": False,
        "info": "",
    }
    assert template["request_timeout"] == {
        "required": False,
        "dynamic": False,
        "placeholder": "",
        "show": False,
        "multiline": False,
        "password": False,
        "name": "request_timeout",
        "type": "float",
        "list": False,
        "advanced": False,
        "info": "",
    }
    assert template["max_retries"] == {
        "required": False,
        "dynamic": False,
        "placeholder": "",
        "show": False,
        "multiline": False,
        "value": 6,
        "password": False,
        "name": "max_retries",
        "type": "int",
        "list": False,
        "advanced": False,
        "info": "",
    }
    assert template["streaming"] == {
        "required": False,
        "dynamic": False,
        "placeholder": "",
        "show": False,
        "multiline": False,
        "value": False,
        "password": False,
        "name": "streaming",
        "type": "bool",
        "list": False,
        "advanced": False,
        "info": "",
    }
    assert template["n"] == {
        "required": False,
        "dynamic": False,
        "placeholder": "",
        "show": False,
        "multiline": False,
        "value": 1,
        "password": False,
        "name": "n",
        "type": "int",
        "list": False,
        "advanced": False,
        "info": "",
    }

    assert template["max_tokens"] == {
        "required": False,
        "dynamic": False,
        "placeholder": "",
        "show": True,
        "multiline": False,
        "password": True,
        "name": "max_tokens",
        "type": "int",
        "list": False,
        "advanced": False,
        "info": "",
    }
    assert template["_type"] == "ChatOpenAI"
    assert (
        model["description"]
        == "Wrapper around OpenAI Chat large language models."  # noqa E501
    )
    assert set(model["base_classes"]) == {
        "BaseLLM",
        "BaseChatModel",
        "ChatOpenAI",
        "BaseLanguageModel",
    }


# Commenting this out for now, as it requires to activate the nodes
# def test_azure_open_ai(client: TestClient):
#     response = client.get("/all")
#     assert response.status_code == 200
#     json_response = response.json()
#     language_models = json_response["llms"]

#     model = language_models["AzureOpenAI"]
#     template = model["template"]

#     assert template["model_name"]["show"] is False
#     assert template["deployment_name"] == {
#         "required": False,
#         "placeholder": "",
#         "show": True,
#         "multiline": False,
#         "value": "",
#         "password": False,
#         "name": "deployment_name",
#         "advanced": False,
#         "type": "str",
#         "list": False,
#     }


# def test_azure_chat_open_ai(client: TestClient):
#     response = client.get("/all")
#     assert response.status_code == 200
#     json_response = response.json()
#     language_models = json_response["llms"]

#     model = language_models["AzureChatOpenAI"]
#     template = model["template"]

#     assert template["model_name"]["show"] is False
#     assert template["deployment_name"] == {
#         "required": False,
#         "placeholder": "",
#         "show": True,
#         "multiline": False,
#         "value": "",
#         "password": False,
#         "name": "deployment_name",
#         "advanced": False,
#         "type": "str",
#         "list": False,
#     }
#     assert template["openai_api_type"] == {
#         "required": False,
#         "placeholder": "",
#         "show": False,
#         "multiline": False,
#         "value": "azure",
#         "password": False,
#         "name": "openai_api_type",
#         "display_name": "OpenAI API Type",
#         "advanced": False,
#         "type": "str",
#         "list": False,
#     }
#     assert template["openai_api_version"] == {
#         "required": False,
#         "placeholder": "",
#         "show": True,
#         "multiline": False,
#         "value": "2023-03-15-preview",
#         "password": False,
#         "name": "openai_api_version",
#         "display_name": "OpenAI API Version",
#         "advanced": False,
#         "type": "str",
#         "list": False,
#     }
