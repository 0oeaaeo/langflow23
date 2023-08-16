import { useContext, useEffect, useState } from "react";
import EditFlowSettings from "../../components/EditFlowSettingsComponent";
import IconComponent from "../../components/genericIconComponent";
import { Button } from "../../components/ui/button";
import { SETTINGS_DIALOG_SUBTITLE } from "../../constants/constants";
import { alertContext } from "../../contexts/alertContext";
import { TabsContext } from "../../contexts/tabsContext";
import BaseModal from "../baseModal";

export default function FlowSettingsModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { setSuccessData } = useContext(alertContext);
  const { flows, tabId, updateFlow, saveFlow } = useContext(TabsContext);
  const flow = flows.find((f) => f.id === tabId);
  useEffect(() => {
    setName(flow.name);
    setDescription(flow.description);
  }, [flow.name, flow.description]);
  const [name, setName] = useState(flow.name);
  const [description, setDescription] = useState(flow.description);
  const [invalidName, setInvalidName] = useState(false);

  function handleClick() {
    let savedFlow = flows.find((f) => f.id === tabId);
    savedFlow.name = name;
    savedFlow.description = description;
    saveFlow(savedFlow);
    setSuccessData({ title: "Changes saved successfully" });
    setOpen(false);
  }
  return (
    <BaseModal open={open} setOpen={setOpen} size="smaller">
      <BaseModal.Header description={SETTINGS_DIALOG_SUBTITLE}>
        <span className="pr-2">Settings</span>
        <IconComponent name="Settings2" className="mr-2 h-4 w-4 " />
      </BaseModal.Header>
      <BaseModal.Content>
        <EditFlowSettings
          invalidName={invalidName}
          setInvalidName={setInvalidName}
          name={name}
          description={description}
          flows={flows}
          tabId={tabId}
          setName={setName}
          setDescription={setDescription}
          updateFlow={updateFlow}
        />
      </BaseModal.Content>

      <BaseModal.Footer>
        <Button disabled={invalidName} onClick={handleClick} type="submit">
          Save
        </Button>
      </BaseModal.Footer>
    </BaseModal>
  );
}
