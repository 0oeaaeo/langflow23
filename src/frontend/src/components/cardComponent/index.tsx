import { useContext } from "react";
import { TabsContext } from "../../contexts/tabsContext";
import { FlowType } from "../../types/flow";
import { gradients } from "../../utils/styleUtils";
import IconComponent from "../genericIconComponent";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

export const CardComponent = ({
  flow,
  id,
  onDelete,
  button,
}: {
  flow: FlowType;
  id: string;
  onDelete?: () => void;
  button?: JSX.Element;
}) => {
  const { removeFlow } = useContext(TabsContext);

  return (
    <Card className="group">
      <CardHeader>
        <CardTitle className="card-component-title-display">
          <span
            className={
              "card-component-image " +
              gradients[parseInt(flow.id.slice(0, 12), 16) % gradients.length]
            }
          ></span>
          <span className="card-component-title-size">{flow.name}</span>
          {onDelete && (
            <button className="card-component-delete-button" onClick={onDelete}>
              <IconComponent
                name="Trash2"
                className="card-component-delete-icon"
              />
            </button>
          )}
        </CardTitle>
        <CardDescription className="card-component-desc">
          <div className="card-component-desc-text">
            {flow.description}
            {/* {flow.description} */}
          </div>
        </CardDescription>
      </CardHeader>

      <CardFooter>
        <div className="card-component-footer-arrangement">
          <div className="card-component-footer"></div>
          {button && button}
        </div>
      </CardFooter>
    </Card>
  );
};
