import { cloneDeep } from "lodash";
import { useContext, useEffect, useState } from "react";
import { NodeToolbar, useUpdateNodeInternals } from "reactflow";
import ShadTooltip from "../../components/ShadTooltipComponent";
import Tooltip from "../../components/TooltipComponent";
import IconComponent from "../../components/genericIconComponent";
import { useSSE } from "../../contexts/SSEContext";
import { TabsContext } from "../../contexts/tabsContext";
import { typesContext } from "../../contexts/typesContext";
import NodeToolbarComponent from "../../pages/FlowPage/components/nodeToolbarComponent";
import { NodeDataType } from "../../types/flow";
import { cleanEdges } from "../../utils/reactflowUtils";
import { nodeColors, nodeIconsLucide } from "../../utils/styleUtils";
import { classNames, toTitleCase } from "../../utils/utils";
import ParameterComponent from "./components/parameterComponent";

export default function GenericNode({
  data: olddata,
  selected,
}: {
  data: NodeDataType;
  selected: boolean;
}) {
  const [data, setData] = useState(olddata);
  const { updateFlow, flows, tabId } = useContext(TabsContext);
  const updateNodeInternals = useUpdateNodeInternals();
  const { types, deleteNode, reactFlowInstance } = useContext(typesContext);
  const name = nodeIconsLucide[data.type] ? data.type : types[data.type];
  const [validationStatus, setValidationStatus] = useState(null);
  // State for outline color
  const { sseData, isBuilding } = useSSE();
  useEffect(() => {
    olddata.node = data.node;
    let myFlow = flows.find((flow) => flow.id === tabId);
    if (reactFlowInstance && myFlow) {
      let flow = cloneDeep(myFlow);
      flow.data = reactFlowInstance.toObject();
      cleanEdges({
        flow: {
          edges: flow.data.edges,
          nodes: flow.data.nodes,
        },
        updateEdge: (edge) => {
          flow.data.edges = edge;
          reactFlowInstance.setEdges(edge);
          updateNodeInternals(data.id);
        },
      });
      updateFlow(flow);
    }
  }, [data]);

  // New useEffect to watch for changes in sseData and update validation status
  useEffect(() => {
    const relevantData = sseData[data.id];
    if (relevantData) {
      // Extract validation information from relevantData and update the validationStatus state
      setValidationStatus(relevantData);
    } else {
      setValidationStatus(null);
    }
  }, [sseData, data.id]);

  return (
    <>
      <NodeToolbar>
        <NodeToolbarComponent
          data={data}
          setData={setData}
          deleteNode={deleteNode}
        ></NodeToolbarComponent>
      </NodeToolbar>

      <div
        className={classNames(
          selected ? "border border-ring" : "border",
          "generic-node-div"
        )}
      >
        {data.node.beta && (
          <div className="beta-badge-wrapper">
            <div className="beta-badge-content">BETA</div>
          </div>
        )}
        <div className="generic-node-div-title">
          <div className="generic-node-title-arrangement">
            <IconComponent
              name={name}
              className="generic-node-icon"
              iconColor={`${nodeColors[types[data.type]]}`}
            />
            <div className="generic-node-tooltip-div">
              <ShadTooltip content={data.node.display_name}>
                <div className="generic-node-tooltip-div text-primary">
                  {data.node.display_name}
                </div>
              </ShadTooltip>
            </div>
          </div>
          <div className="round-button-div">
            <div>
              <Tooltip
                title={
                  isBuilding ? (
                    <span>Building...</span>
                  ) : !validationStatus ? (
                    <span className="flex">
                      Build{" "}
                      <IconComponent
                        name="Zap"
                        className="mx-0.5 h-5 fill-build-trigger stroke-build-trigger stroke-1"
                      />{" "}
                      flow to validate status.
                    </span>
                  ) : (
                    <div className="max-h-96 overflow-auto">
                      {typeof validationStatus.params === "string"
                        ? validationStatus.params
                            .split("\n")
                            .map((line, index) => <div key={index}>{line}</div>)
                        : ""}
                    </div>
                  )
                }
              >
                <div className="generic-node-status-position">
                  <div
                    className={classNames(
                      validationStatus && validationStatus.valid
                        ? "green-status"
                        : "status-build-animation",
                      "status-div"
                    )}
                  ></div>
                  <div
                    className={classNames(
                      validationStatus && !validationStatus.valid
                        ? "red-status"
                        : "status-build-animation",
                      "status-div"
                    )}
                  ></div>
                  <div
                    className={classNames(
                      !validationStatus || isBuilding
                        ? "yellow-status"
                        : "status-build-animation",
                      "status-div"
                    )}
                  ></div>
                </div>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="generic-node-desc">
          <div className="generic-node-desc-text">{data.node.description}</div>

          <>
            {Object.keys(data.node.template)
              .filter((t) => t.charAt(0) !== "_")
              .map((t: string, idx) => (
                <div key={idx}>
                  {data.node.template[t].show &&
                  !data.node.template[t].advanced ? (
                    <ParameterComponent
                      key={
                        (data.node.template[t].input_types?.join(";") ??
                          data.node.template[t].type) +
                        "|" +
                        t +
                        "|" +
                        data.id
                      }
                      data={data}
                      setData={setData}
                      color={
                        nodeColors[types[data.node.template[t].type]] ??
                        nodeColors[data.node.template[t].type] ??
                        nodeColors.unknown
                      }
                      title={
                        data.node.template[t].display_name
                          ? data.node.template[t].display_name
                          : data.node.template[t].name
                          ? toTitleCase(data.node.template[t].name)
                          : toTitleCase(t)
                      }
                      info={data.node.template[t].info}
                      name={t}
                      tooltipTitle={
                        data.node.template[t].input_types?.join("\n") ??
                        data.node.template[t].type
                      }
                      required={data.node.template[t].required}
                      id={
                        (data.node.template[t].input_types?.join(";") ??
                          data.node.template[t].type) +
                        "|" +
                        t +
                        "|" +
                        data.id
                      }
                      left={true}
                      type={data.node.template[t].type}
                      optionalHandle={data.node.template[t].input_types}
                    />
                  ) : (
                    <></>
                  )}
                </div>
              ))}
            <div
              className={classNames(
                Object.keys(data.node.template).length < 1 ? "hidden" : "",
                "flex-max-width justify-center"
              )}
            >
              {" "}
            </div>
            <ParameterComponent
              key={[data.type, data.id, ...data.node.base_classes].join("|")}
              data={data}
              setData={setData}
              color={nodeColors[types[data.type]] ?? nodeColors.unknown}
              title={
                data.node.output_types && data.node.output_types.length > 0
                  ? data.node.output_types.join("|")
                  : data.type
              }
              tooltipTitle={data.node.base_classes.join("\n")}
              id={[data.type, data.id, ...data.node.base_classes].join("|")}
              type={data.node.base_classes.join("|")}
              left={false}
            />
          </>
        </div>
      </div>
    </>
  );
}
