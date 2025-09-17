import { createContext, useCallback, useState, type ReactNode } from "react";
import { AppDialogContainer } from "./app-dialog";
import type { AppDialog } from "./types";

export interface AppDialogContextValue {
  dialogs: AppDialog[];
  showAppDialog: (dialog: Omit<AppDialog, "id">) => Promise<any>;
  hideAppDialog: (id: string, result?: any) => void;
  clearAllAppDialogs: () => void;
}

// Context
export const AppDialogContext = createContext<
  AppDialogContextValue | undefined
>(undefined);

// Store para promises dos diálogos
const dialogPromises = new Map<
  string,
  { resolve: (value: any) => void; reject: (reason?: any) => void }
>();

// Provider
export const AppDialogProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [dialogs, setDialogs] = useState<AppDialog[]>([]);

  const showAppDialog = useCallback(
    (dialogData: Omit<AppDialog, "id">): Promise<any> => {
      const id = Math.random().toString(36).substr(2, 9);

      return new Promise((resolve, reject) => {
        dialogPromises.set(id, { resolve, reject });

        const dialog: AppDialog = {
          id,
          showCloseButton: true,
          backdrop: true,
          buttons:
            dialogData.type === "confirm"
              ? [
                  {
                    text: "Cancelar",
                    variant: "secondary",
                    value: false,
                    autoClose: true,
                  },
                  {
                    text: "Confirmar",
                    variant: "primary",
                    value: true,
                    autoClose: true,
                  },
                ]
              : dialogData.type === "question"
                ? [
                    {
                      text: "OK",
                      variant: "primary",
                      value: true,
                      autoClose: true,
                    },
                  ]
                : [],
          ...dialogData,
        };

        setDialogs((prev) => [...prev, dialog]);
      });
    },
    []
  );

  const hideAppDialog = useCallback((id: string, result?: any) => {
    const promise = dialogPromises.get(id);
    if (promise) {
      promise.resolve(result);
      dialogPromises.delete(id);
    }

    setDialogs((prev) => {
      const dialog = prev.find((d) => d.id === id);
      if (dialog && dialog.onClose) {
        dialog.onClose(result);
      }
      return prev.filter((dialog) => dialog.id !== id);
    });
  }, []);

  const clearAllAppDialogs = useCallback(() => {
    // Rejeita todas as promises pendentes
    dialogPromises.forEach(({ reject }) => reject("Dialog cleared"));
    dialogPromises.clear();
    setDialogs([]);
  }, []);

  return (
    <AppDialogContext.Provider
      value={{ dialogs, showAppDialog, hideAppDialog, clearAllAppDialogs }}
    >
      {children}
      <AppDialogContainer />
    </AppDialogContext.Provider>
  );
};
