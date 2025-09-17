// Tipos
export interface AppDialogButton {
  text: string;
  variant?: "primary" | "secondary" | "danger";
  value?: any;
  autoClose?: boolean;
}

export interface AppDialog {
  id: string;
  type: "success" | "warning" | "error" | "info" | "question" | "confirm";
  title: string;
  message: string;
  buttons?: AppDialogButton[];
  showCloseButton?: boolean;
  onClose?: (result?: any) => void;
  backdrop?: boolean;
}
