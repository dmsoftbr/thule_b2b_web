import type { AppDialogContextValue } from "./app-dialog-context";
import type { AppDialog, AppDialogButton } from "./types";

// Funções utilitárias para facilitar o uso
export const createDialogFunctions = () => {
  let dialogContext: AppDialogContextValue | null = null;

  const initDialogs = (context: AppDialogContextValue) => {
    dialogContext = context;
  };

  const showSuccess = (
    title: string,
    message: string,
    options?: Partial<AppDialog>
  ): Promise<any> => {
    if (!dialogContext) throw new Error("DialogProvider não foi inicializado");
    return dialogContext.showAppDialog({
      type: "success",
      title,
      message,
      buttons: [
        { text: "OK", variant: "primary", value: true, autoClose: true },
      ],
      ...options,
    });
  };

  const showError = (
    title: string,
    message: string,
    options?: Partial<AppDialog>
  ): Promise<any> => {
    if (!dialogContext) throw new Error("DialogProvider não foi inicializado");
    return dialogContext.showAppDialog({
      type: "error",
      title,
      message,
      buttons: [
        { text: "OK", variant: "primary", value: true, autoClose: true },
      ],
      ...options,
    });
  };

  const showQuestion = (
    title: string,
    message: string,
    buttons?: AppDialogButton[]
  ): Promise<any> => {
    if (!dialogContext) throw new Error("DialogProvider não foi inicializado");
    return dialogContext.showAppDialog({
      type: "question",
      title,
      message,
      buttons: buttons || [
        { text: "OK", variant: "primary", value: true, autoClose: true },
      ],
    });
  };

  const showConfirm = (
    title: string,
    message: string,
    options?: { confirmText?: string; cancelText?: string }
  ): Promise<boolean> => {
    if (!dialogContext) throw new Error("DialogProvider não foi inicializado");
    return dialogContext.showAppDialog({
      type: "confirm",
      title,
      message,
      buttons: [
        {
          text: options?.cancelText || "Cancelar",
          variant: "secondary",
          value: false,
          autoClose: true,
        },
        {
          text: options?.confirmText || "Confirmar",
          variant: "primary",
          value: true,
          autoClose: true,
        },
      ],
    });
  };

  return {
    initDialogs,
    showSuccess,
    showError,
    showQuestion,
    showConfirm,
  };
};
