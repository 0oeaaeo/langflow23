import { ReactElement, ReactNode } from "react";
import { ReactFlowJsonObject } from "reactflow";
import { APIClassType, APITemplateType, TemplateVariableType } from "../api";
import { ChatMessageType } from "../chat";
import { FlowStyleType, FlowType, NodeDataType, NodeType } from "../flow/index";
import { typesContextType } from "../typesContext";

export type InputComponentType = {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  password: boolean;
  editNode?: boolean;
  onChangePass?: (value: boolean | boolean) => void;
  showPass?: boolean;
};
export type ToggleComponentType = {
  enabled: boolean;
  setEnabled: (state: boolean) => void;
  disabled: boolean | undefined;
  size: "small" | "medium" | "large";
};
export type DropDownComponentType = {
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  editNode?: boolean;
  apiModal?: boolean;
  numberOfOptions?: number;
};
export type ParameterComponentType = {
  data: NodeDataType;
  setData: (value: NodeDataType) => void;
  title: string;
  id: string;
  color: string;
  left: boolean;
  type: string | undefined;
  required?: boolean;
  name?: string;
  tooltipTitle: string | undefined;
  dataContext?: typesContextType;
  optionalHandle?: Array<String> | null;
  info?: string;
};
export type InputListComponentType = {
  value: string[];
  onChange: (value: string[]) => void;
  disabled: boolean;
  editNode?: boolean;
};

export type TextAreaComponentType = {
  field_name?: string;
  nodeClass?: APIClassType;
  setNodeClass?: (value: APIClassType) => void;
  disabled: boolean;
  onChange: (value: string[] | string) => void;
  value: string;
  editNode?: boolean;
};

export type CodeAreaComponentType = {
  disabled: boolean;
  onChange: (value: string[] | string) => void;
  value: string;
  editNode?: boolean;
  nodeClass?: APIClassType;
  setNodeClass?: (value: APIClassType) => void;
  dynamic?: boolean;
};

export type FileComponentType = {
  disabled: boolean;
  onChange: (value: string[] | string) => void;
  value: string;
  suffixes: Array<string>;
  fileTypes: Array<string>;
  onFileChange: (value: string) => void;
  editNode?: boolean;
};

export type DisclosureComponentType = {
  children: ReactNode;
  openDisc: boolean;
  button: {
    title: string;
    Icon: React.ElementType;
    buttons?: {
      Icon: ReactElement;
      title: string;
      onClick: (event?: React.MouseEvent) => void;
    }[];
  };
};
export type FloatComponentType = {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  editNode?: boolean;
};

export type TooltipComponentType = {
  children: ReactElement;
  title: string | ReactElement;
  placement?:
    | "bottom-end"
    | "bottom-start"
    | "bottom"
    | "left-end"
    | "left-start"
    | "left"
    | "right-end"
    | "right-start"
    | "right"
    | "top-end"
    | "top-start"
    | "top";
};

export type ProgressBarType = {
  children?: ReactElement;
  value?: number;
  max?: number;
};

export type RadialProgressType = {
  value?: number;
  color?: string;
};

export type AccordionComponentType = {
  children?: ReactElement;
  open?: string[];
  trigger?: string | ReactElement;
  keyValue?: string;
};
export type Side = "top" | "right" | "bottom" | "left";

export type ShadTooltipProps = {
  delayDuration?: number;
  side?: Side;
  content: ReactNode;
  children: ReactNode;
  style?: string;
};
export type ShadToolTipType = {
  content?: ReactNode | null;
  side?: "top" | "right" | "bottom" | "left";
  asChild?: boolean;
  children?: ReactElement;
  delayDuration?: number;
  styleClasses?: string;
};

export type TextHighlightType = {
  value?: string;
  side?: "top" | "right" | "bottom" | "left";
  asChild?: boolean;
  children?: ReactElement;
  delayDuration?: number;
};

export interface IVarHighlightType {
  name: string;
}

export type IconComponentProps = {
  name: string;
  className: string;
  iconColor?: string;
};

export type InputProps = {
  name: string | null;
  description: string | null;
  maxLength?: number;
  flows: Array<{ id: string; name: string; description: string }>;
  tabId: string;
  invalidName?: boolean;
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  setInvalidName?: (invalidName: boolean) => void;
};

export type TooltipProps = {
  selector: string;
  content?: string;
  disabled?: boolean;
  htmlContent?: React.ReactNode;
  className?: string; // This should use !impornant to override the default styles eg: '!bg-white'
  position?: "top" | "right" | "bottom" | "left";
  clickable?: boolean;
  children: React.ReactNode;
  delayShow?: number;
};

export type LoadingComponentProps = {
  remSize: number;
};

export type ContentProps = { children: ReactNode };
export type HeaderProps = { children: ReactNode; description: string };

export interface languageMap {
  [key: string]: string | undefined;
}

export type groupedObjType = {
  family: string;
  type: string;
};

type test = {
  [char: string]: string;
};

export type tweakType = Array<{
  [key: string]: {
    [char: string]: string;
  } & FlowStyleType;
}>;

export type uniqueTweakType = {
  [key: string]: {
    [char: string]: string;
  } & FlowStyleType;
};

export type apiModalTweakType = {
  current: Array<{
    [key: string]: {
      [char: string]: string | number;
    };
  }>;
};

export type nodeToolbarType = {
  data: {
    id: string;
    type: string;
    node: {
      base_classes: string[];
      description: string;
      display_name: string;
      documentation: string;
      template: APITemplateType;
    };
    value: void;
  };
  deleteNode: (idx: string) => void;
  openPopUp: (element: JSX.Element) => JSX.Element;
};

export type chatTriggerPropType = {
  open: boolean;
  isBuilt: boolean;
  canOpen: boolean;
  setOpen: (can: boolean) => void;
};

export type headerFlowsType = {
  data: ReactFlowJsonObject | null;
  description: string;
  id: string;
  name: string;
  style?: FlowStyleType;
};

export type menuBarPropsType = {
  flows: Array<headerFlowsType>;
  tabId: string;
};

export type chatInputType = {
  chatValue: string;
  inputRef: {
    current: any;
  };
  lockChat: boolean;
  noInput: boolean;
  sendMessage: () => void;
  setChatValue: (value: string) => void;
};

export type editNodeToggleType = {
  advanced?: boolean;
  info?: string;
  list: boolean;
  multiline?: boolean;
  name?: string;
  password?: boolean;
  placeholder?: string;
  required: boolean;
  show: boolean;
  type: string;
};

export interface Props {
  language: string;
  value: string;
}

export type fileCardPropsType = {
  fileName: string;
  content: string;
  fileType: string;
};

export type nodeToolbarPropsType = {
  data: NodeDataType;
  deleteNode: (idx: string) => void;
  setData: (newState: NodeDataType) => void;
};

export type parsedDataType = {
  id: string;
  params: string;
  progress: number;
  valid: boolean;
};

export type SanitizedHTMLWrapperType = {
  className: string;
  content: string;
  onClick: () => void;
  suppressWarning?: boolean;
};

export type iconsType = {
  [key: string]: React.ElementType;
};

export type modalHeaderType = {
  children: ReactNode;
  description: string | null;
};

export type codeAreaModalPropsType = {
  setValue: (value: string) => void;
  value: string;
  nodeClass: APIClassType | undefined;
  setNodeClass: (Class: APIClassType) => void | undefined;
  children: ReactNode;
  dynamic?: boolean;
};

export type chatMessagePropsType = {
  chat: ChatMessageType;
  lockChat: boolean;
  lastMessage: boolean;
};

export type formModalPropsType = {
  open: boolean;
  setOpen: Function;
  flow: FlowType;
};

export type genericModalPropsType = {
  field_name?: string;
  setValue: (value: string) => void;
  value: string;
  buttonText: string;
  modalTitle: string;
  type: number;
  nodeClass?: APIClassType;
  setNodeClass?: (Class: APIClassType) => void;
  children: ReactNode;
};

export type buttonBoxPropsType = {
  onClick: () => void;
  title: string;
  description: string;
  icon: ReactNode;
  bgColor: string;
  textColor: string;
  deactivate?: boolean;
  size: "small" | "medium" | "big";
};

export type FlowSettingsPropsType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export type groupDataType = {
  [char: string]: string;
};

export type cardComponentPropsType = {
  flow: FlowType;
  id: string;
  onDelete?: () => void;
  button?: JSX.Element;
};

type tabsArrayType = {
  code: string;
  image: string;
  language: string;
  mode: string;
  name: string;
  description?: string;
};

type getValueNodeType = {
  id: string;
  node: NodeType;
  type: string;
  value: null;
};

type codeTabsFuncTempType = {
  [key: string]: string | boolean;
};

export type codeTabsPropsType = {
  flow?: FlowType;
  tabs: Array<tabsArrayType>;
  activeTab: string;
  setActiveTab: (value: string) => void;
  isMessage?: boolean;
  tweaks?: {
    tweak?: { current: tweakType };
    tweaksList?: { current: Array<string> };
    buildContent?: (value: string) => ReactNode;
    getValue?: (
      value: string,
      node: NodeType,
      template: TemplateVariableType
    ) => string;
    buildTweakObject?: (
      tw: string,
      changes: string | string[] | boolean | number,
      template: TemplateVariableType
    ) => string | void;
  };
};

export type crashComponentPropsType = {
  error: {
    message: string;
    stack: string;
  };
  resetErrorBoundary: (args) => void;
};

export type validationStatusType = {
  id: string;
  params: string;
  progress: number;
  valid: boolean;
};
