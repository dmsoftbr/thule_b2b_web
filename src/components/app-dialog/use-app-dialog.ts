import { useContext } from "react";
import { AppDialogContext } from "./app-dialog-context";

// Hook para usar os diálogos
export const useAppDialog = () => {
  const context = useContext(AppDialogContext);
  if (!context) {
    throw new Error("useAppDialog deve ser usado dentro de AppDialogProvider");
  }
  return context;
};
