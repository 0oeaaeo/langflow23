import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ADJECTIVES, DESCRIPTIONS, NOUNS } from "../flow_constants";
import {
  IVarHighlightType,
  groupedObjType,
  tweakType,
} from "../types/components";
import { FlowType } from "../types/flow";
import { TabsState } from "../types/tabs";
import { buildTweaks } from "./reactflowUtils";
import { APIClassType } from "../types/api";

export function classNames(...classes: Array<string>): string {
  return classes.filter(Boolean).join(" ");
}

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function toNormalCase(str: string): string {
  let result = str
    .split("_")
    .map((word, index) => {
      if (index === 0) {
        return word[0].toUpperCase() + word.slice(1).toLowerCase();
      }
      return word.toLowerCase();
    })
    .join(" ");

  return result
    .split("-")
    .map((word, index) => {
      if (index === 0) {
        return word[0].toUpperCase() + word.slice(1).toLowerCase();
      }
      return word.toLowerCase();
    })
    .join(" ");
}

export function normalCaseToSnakeCase(str: string): string {
  return str
    .split(" ")
    .map((word, index) => {
      if (index === 0) {
        return word[0].toUpperCase() + word.slice(1).toLowerCase();
      }
      return word.toLowerCase();
    })
    .join("_");
}

export function toTitleCase(str: string): string {
  let result = str
    .split("_")
    .map((word, index) => {
      if (index === 0) {
        return checkUpperWords(
          word[0].toUpperCase() + word.slice(1).toLowerCase()
        );
      }
      return checkUpperWords(word.toLowerCase());
    })
    .join(" ");

  return result
    .split("-")
    .map((word, index) => {
      if (index === 0) {
        return checkUpperWords(
          word[0].toUpperCase() + word.slice(1).toLowerCase()
        );
      }
      return checkUpperWords(word.toLowerCase());
    })
    .join(" ");
}

export const upperCaseWords: string[] = ["llm", "uri"];
export function checkUpperWords(str: string): string {
  const words = str.split(" ").map((word) => {
    return upperCaseWords.includes(word.toLowerCase())
      ? word.toUpperCase()
      : word[0].toUpperCase() + word.slice(1).toLowerCase();
  });

  return words.join(" ");
}

export const isWrappedWithClass = (event: any, className: string | undefined) =>
  event.target.closest(`.${className}`);

export function groupByFamily(data: APIClassType, baseClasses: string, left: boolean, type: string): groupedObjType[] {
  let parentOutput: string;
  let arrOfParent: string[] = [];
  let arrOfType: { family: string; type: string; component: string }[] = [];
  let arrOfLength: { length: number; type: string }[] = [];
  let lastType = "";
  Object.keys(data).forEach((d) => {
    Object.keys(data[d]).forEach((n) => {
      try {
        if (
          data[d][n].base_classes.some((r) =>
            baseClasses.split("\n").includes(r)
          )
        ) {
          arrOfParent.push(d);
        }
        if (n === type) {
          parentOutput = d;
        }

        if (d !== lastType) {
          arrOfLength.push({
            length: Object.keys(data[d]).length,
            type: d,
          });

          lastType = d;
        }
      } catch (e) {
        console.log(e);
      }
    });
  });

  Object.keys(data).map((d) => {
    Object.keys(data[d]).map((n) => {
      try {
        baseClasses.split("\n").forEach((tol) => {
          data[d][n].base_classes.forEach((data) => {
            if (tol === data) {
              arrOfType.push({
                family: d,
                type: data,
                component: n,
              });
            }
          });
        });
      } catch (e) {
        console.log(e);
      }
    });
  });

  if (left === false) {
    let groupedBy = arrOfType.filter((object, index, self) => {
      const foundIndex = self.findIndex(
        (o) => o.family === object.family && o.type === object.type
      );
      return foundIndex === index;
    });

    return groupedBy.reduce((result, item) => {
      const existingGroup = result.find(
        (group) => group.family === item.family
      );

      if (existingGroup) {
        existingGroup.type += `, ${item.type}`;
      } else {
        result.push({
          family: item.family,
          type: item.type,
          component: item.component,
        });
      }

      if (left === false) {
        let resFil = result.filter((group) => group.family === parentOutput);
        result = resFil;
      }

      return result;
    }, []);
  } else {
    const groupedArray = [];
    const groupedData = {};

    arrOfType.forEach((item) => {
      const { family, type, component } = item;
      const key = `${family}-${type}`;

      if (!groupedData[key]) {
        groupedData[key] = { family, type, component: [component] };
      } else {
        groupedData[key].component.push(component);
      }
    });

    for (const key in groupedData) {
      groupedArray.push(groupedData[key]);
    }

    groupedArray.forEach((object, index, self) => {
      const findObj = arrOfLength.find((x) => x.type === object.family);
      if (object.component.length === findObj.length) {
        self[index]["type"] = "";
      } else {
        self[index]["type"] = object.component.join(", ");
      }
    });
    return groupedArray;
  }
}

export function buildInputs(tabsState: TabsState, id: string): string {
  console.log(tabsState)
  return tabsState &&
    tabsState[id] &&
    tabsState[id].formKeysData &&
    tabsState[id].formKeysData.input_keys &&
    Object.keys(tabsState[id].formKeysData.input_keys).length > 0
    ? JSON.stringify(tabsState[id].formKeysData.input_keys)
    : '{"input": "message"}';
}

export function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}
export function getRandomDescription(): string {
  return getRandomElement(DESCRIPTIONS);
}

export function getRandomName(
  retry: number = 0,
  noSpace: boolean = false,
  maxRetries: number = 3
): string {
  const left: string[] = ADJECTIVES;
  const right: string[] = NOUNS;

  const lv = getRandomElement(left);
  const rv = getRandomElement(right);

  // Condition to avoid "boring wozniak"
  if (lv === "boring" && rv === "wozniak") {
    if (retry < maxRetries) {
      return getRandomName(retry + 1, noSpace, maxRetries);
    } else {
      console.warn("Max retries reached, returning as is");
    }
  }

  // Append a suffix if retrying and noSpace is true
  if (retry > 0 && noSpace) {
    const retrySuffix = Math.floor(Math.random() * 10);
    return `${lv}_${rv}${retrySuffix}`;
  }

  // Construct the final name
  let final_name = noSpace ? `${lv}_${rv}` : `${lv} ${rv}`;
  // Return title case final name
  return toTitleCase(final_name);
}

export function getRandomKeyByssmm(): string {
  const now = new Date();
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const milliseconds = String(now.getMilliseconds()).padStart(3, "0");
  return seconds + milliseconds + Math.abs(Math.floor(Math.random() * 10001));
}

export function varHighlightHTML({ name }: IVarHighlightType): string {
  const html = `<span class="font-semibold chat-message-highlight">{${name}}</span>`;
  return html;
}

export function buildTweakObject(tweak: tweakType[]): string {
  tweak.forEach((el) => {
    Object.keys(el).forEach((key) => {
      for (let kp in el[key]) {
        try {
          el[key][kp] = JSON.parse(el[key][kp]);
        } catch {}
      }
    });
  });

  const tweakString = JSON.stringify(tweak.at(-1), null, 2);
  return tweakString;
}

/**
 * Function to get the python code for the API
 * @param {string} flowId - The id of the flow
 * @returns {string} - The python code
 */
export function getPythonApiCode(
  flow: FlowType,
  tweak?: any[],
  tabsState?: TabsState
): string {
  const flowId = flow.id;

  // create a dictionary of node ids and the values is an empty dictionary
  // flow.data.nodes.forEach((node) => {
  //   node.data.id
  // }
  const tweaks = buildTweaks(flow);
  const inputs = buildInputs(tabsState, flow.id);
  return `import requests
from typing import Optional

BASE_API_URL = "${window.location.protocol}//${
    window.location.host
  }/api/v1/process"
FLOW_ID = "${flowId}"
# You can tweak the flow by adding a tweaks dictionary
# e.g {"OpenAI-XXXXX": {"model_name": "gpt-4"}}
TWEAKS = ${
    tweak && tweak.length > 0
      ? buildTweakObject(tweak)
      : JSON.stringify(tweaks, null, 2)
  }

def run_flow(inputs: dict, flow_id: str, tweaks: Optional[dict] = None) -> dict:
    """
    Run a flow with a given message and optional tweaks.

    :param message: The message to send to the flow
    :param flow_id: The ID of the flow to run
    :param tweaks: Optional tweaks to customize the flow
    :return: The JSON response from the flow
    """
    api_url = f"{BASE_API_URL}/{flow_id}"

    payload = {"inputs": inputs}

    if tweaks:
        payload["tweaks"] = tweaks

    response = requests.post(api_url, json=payload)
    return response.json()

# Setup any tweaks you want to apply to the flow
inputs = ${inputs}
print(run_flow(inputs, flow_id=FLOW_ID, tweaks=TWEAKS))`;
}

/**
 * Function to get the curl code for the API
 * @param {string} flowId - The id of the flow
 * @returns {string} - The curl code
 */
export function getCurlCode(
  flow: FlowType,
  tweak?: any[],
  tabsState?: TabsState
): string {
  console.log(tweak)
  const flowId = flow.id;
  const tweaks = buildTweaks(flow);
  const inputs = buildInputs(tabsState, flow.id);

  return `curl -X POST \\
  ${window.location.protocol}//${
    window.location.host
  }/api/v1/process/${flowId} \\
  -H 'Content-Type: application/json' \\
  -d '{"inputs": ${inputs}, "tweaks": ${
    tweak && tweak.length > 0
      ? buildTweakObject(tweak)
      : JSON.stringify(tweaks, null, 2)
  }}'`;
}

/**
 * Function to get the python code for the API
 * @param {string} flowName - The name of the flow
 * @returns {string} - The python code
 */
export function getPythonCode(
  flow: FlowType,
  tweak?: any[],
  tabsState?: TabsState
): string {
  const flowName = flow.name;
  const tweaks = buildTweaks(flow);
  const inputs = buildInputs(tabsState, flow.id);
  return `from langflow import load_flow_from_json
TWEAKS = ${
    tweak && tweak.length > 0
      ? buildTweakObject(tweak)
      : JSON.stringify(tweaks, null, 2)
  }
flow = load_flow_from_json("${flowName}.json", tweaks=TWEAKS)
# Now you can use it like any chain
inputs = ${inputs}
flow(inputs)`;
}
