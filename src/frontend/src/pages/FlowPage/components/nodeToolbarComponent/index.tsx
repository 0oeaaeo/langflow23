import { useContext, useState } from "react";
import { useReactFlow } from "reactflow";
import ShadTooltip from "../../../../components/ShadTooltipComponent";
import IconComponent from "../../../../components/genericIconComponent";
import { TabsContext } from "../../../../contexts/tabsContext";
import EditNodeModal from "../../../../modals/EditNodeModal";
import { classNames } from "../../../../utils/utils";
import { nodeToolbarType } from "../../../../types/components";

const NodeToolbarComponent = (props): JSX.Element => {
  console.log(props);
  const [nodeLength, setNodeLength] = useState(
    Object.keys(props.data.node.template).filter(
      (t) =>
        t.charAt(0) !== "_" &&
        props.data.node.template[t].show &&
        (props.data.node.template[t].type === "str" ||
          props.data.node.template[t].type === "bool" ||
          props.data.node.template[t].type === "float" ||
          props.data.node.template[t].type === "code" ||
          props.data.node.template[t].type === "prompt" ||
          props.data.node.template[t].type === "file" ||
          props.data.node.template[t].type === "Any" ||
          props.data.node.template[t].type === "int")
    ).length
  );

  const { setLastCopiedSelection, paste } = useContext(TabsContext);
  const reactFlowInstance = useReactFlow();
  return (
    <>
      <div className="w-26 h-10">
        <span className="isolate inline-flex rounded-md shadow-sm">
          <ShadTooltip content="Delete" side="top">
            <button
              className="relative inline-flex items-center rounded-l-md  bg-background px-2 py-2 text-foreground shadow-md ring-1 ring-inset ring-ring transition-all duration-500 ease-in-out hover:bg-muted focus:z-10"
              onClick={() => {
                props.deleteNode(props.data.id);
              }}
            >
              <IconComponent name="Trash2" className="h-4 w-4" />
            </button>
          </ShadTooltip>

          <ShadTooltip content="Duplicate" side="top">
            <button
              className={classNames(
                "relative -ml-px inline-flex items-center bg-background px-2 py-2 text-foreground shadow-md ring-1 ring-inset ring-ring  transition-all duration-500 ease-in-out hover:bg-muted focus:z-10"
              )}
              onClick={(event) => {
                event.preventDefault();
                paste(
                  {
                    nodes: [reactFlowInstance.getNode(props.data.id)],
                    edges: [],
                  },
                  {
                    x: 50,
                    y: 10,
                    paneX: reactFlowInstance.getNode(props.data.id).position.x,
                    paneY: reactFlowInstance.getNode(props.data.id).position.y,
                  }
                );
              }}
            >
              <IconComponent name="Copy" className="h-4 w-4" />
            </button>
          </ShadTooltip>

          <ShadTooltip
            content={
              props.data.node.documentation === ""
                ? "Coming Soon"
                : "Documentation"
            }
            side="top"
          >
            <a
              className={classNames(
                "relative -ml-px inline-flex items-center bg-background px-2 py-2 text-foreground shadow-md ring-1 ring-inset ring-ring  transition-all duration-500 ease-in-out hover:bg-muted focus:z-10" +
                  (props.data.node.documentation === ""
                    ? " text-muted-foreground"
                    : " text-foreground")
              )}
              target="_blank"
              rel="noopener noreferrer"
              href={props.data.node.documentation}
              // deactivate link if no documentation is provided
              onClick={(event) => {
                if (props.data.node.documentation === "") {
                  event.preventDefault();
                }
              }}
            >
              <IconComponent name="FileText" className="h-4 w-4 " />
            </a>
          </ShadTooltip>

          <ShadTooltip content="Edit" side="top">
            <button
              className={classNames(
                "relative -ml-px inline-flex items-center rounded-r-md bg-background px-2 py-2 text-foreground shadow-md ring-1 ring-inset  ring-ring transition-all duration-500 ease-in-out hover:bg-muted focus:z-10" +
                  (nodeLength == 0
                    ? " text-muted-foreground"
                    : " text-foreground")
              )}
              onClick={(event) => {
                if (nodeLength == 0) {
                  event.preventDefault();
                }
                event.preventDefault();
                props.openPopUp(<EditNodeModal data={props.data} />);
              }}
            >
              <IconComponent name="Settings2" className="h-4 w-4 " />
            </button>
          </ShadTooltip>
        </span>
      </div>
    </>
  );
};

export default NodeToolbarComponent;
