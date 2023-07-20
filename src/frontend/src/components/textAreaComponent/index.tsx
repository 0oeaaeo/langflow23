import { useContext, useEffect, useState } from "react";
import { TypeModal } from "../../constants/enums";
import { PopUpContext } from "../../contexts/popUpContext";
import { TabsContext } from "../../contexts/tabsContext";
import GenericModal from "../../modals/genericModal";
import { TextAreaComponentType } from "../../types/components";
import IconComponent from "../genericIconComponent";

export default function TextAreaComponent({
  value,
  onChange,
  disabled,
  editNode = false,
}: TextAreaComponentType) {
  const [myValue, setMyValue] = useState(value);
  const { openPopUp, closePopUp } = useContext(PopUpContext);
  const { setDisableCopyPaste } = useContext(TabsContext);

  // Clear text area
  useEffect(() => {
    if (disabled) {
      setMyValue("");
      onChange("");
    }
  }, [disabled, onChange]);

  useEffect(() => {
    setMyValue(value);
  }, [closePopUp]);

  return (
    <div className={disabled ? "pointer-events-none w-full " : " w-full"}>
      <div className="flex w-full items-center">
        <input
          value={myValue}
          onFocus={() => {
            setDisableCopyPaste(true);
          }}
          onBlur={() => {
            setDisableCopyPaste(false);
          }}
          className={
            editNode
              ? " input-edit-node "
              : " input-primary " + (disabled ? " input-disable" : "")
          }
          placeholder={"Type something..."}
          onChange={(e) => {
            setMyValue(e.target.value);
            onChange(e.target.value);
          }}
        />

        <button
          onClick={() => {
            openPopUp(
              <GenericModal
                type={TypeModal.TEXT}
                buttonText="Finishing Editing"
                modalTitle="Edit Text"
                value={myValue}
                setValue={(t: string) => {
                  setMyValue(t);
                  onChange(t);
                }}
              />
            );
          }}
        >
          {!editNode && (
            <IconComponent
              name="ExternalLink"
              className={
                "icons-parameters-comp" +
                (disabled ? " text-ring" : " hover:text-accent-foreground")
              }
            />
          )}
        </button>
      </div>
    </div>
  );
}
