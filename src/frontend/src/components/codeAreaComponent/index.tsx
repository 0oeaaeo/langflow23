import { useEffect, useState } from "react";
import CodeAreaModal from "../../modals/codeAreaModal";
import { CodeAreaComponentType } from "../../types/components";

import IconComponent from "../genericIconComponent";

export default function CodeAreaComponent({
  value,
  onChange,
  disabled,
  editNode = false,
  nodeClass,
  dynamic,
  setNodeClass,
}: CodeAreaComponentType) {
  const [myValue, setMyValue] = useState(
    typeof value == "string" ? value : JSON.stringify(value)
  );
  useEffect(() => {
    if (disabled) {
      setMyValue("");
      onChange("");
    }
  }, [disabled, onChange]);

  useEffect(() => {
    setMyValue(typeof value == "string" ? value : JSON.stringify(value));
  }, [value]);

  return (
    <div className={disabled ? "pointer-events-none w-full " : " w-full"}>
      <CodeAreaModal
        dynamic={dynamic}
        value={myValue}
        nodeClass={nodeClass}
        setNodeClass={setNodeClass}
        setValue={(t: string) => {
          setMyValue(t);
          onChange(t);
        }}
      >
        <div className="flex w-full items-center">
          <span
            className={
              editNode
                ? "input-edit-node input-dialog"
                : (disabled ? " input-disable input-ring " : "") +
                  " primary-input text-muted-foreground "
            }
          >
            {myValue !== "" ? myValue : "Type something..."}
          </span>
          {!editNode && (
            <IconComponent
              name="ExternalLink"
              className={
                "icons-parameters-comp" +
                (disabled ? " text-ring" : " hover:text-accent-foreground")
              }
            />
          )}
        </div>
      </CodeAreaModal>
    </div>
  );
}
