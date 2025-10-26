import React from "react";
import {
  X,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  HelpCircle,
} from "lucide-react";
import { useAppDialog } from "./use-app-dialog";
import type { AppDialog, AppDialogButton } from "./types";

// Container dos diálogos
export const AppDialogContainer: React.FC = () => {
  const { dialogs } = useAppDialog();

  if (dialogs.length === 0) return null;

  // Mostra apenas o diálogo mais recente (modal behavior)
  const currentDialog = dialogs[dialogs.length - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {currentDialog.backdrop && (
        <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-md" />
      )}
      <AppDialogItem dialog={currentDialog} />
    </div>
  );
};

// Item individual do diálogo
const AppDialogItem: React.FC<{ dialog: AppDialog }> = ({ dialog }) => {
  const { hideAppDialog } = useAppDialog();

  const handleButtonClick = (button: AppDialogButton) => {
    if (button.autoClose !== false) {
      hideAppDialog(dialog.id, button.value);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && dialog.showCloseButton) {
      hideAppDialog(dialog.id, null);
    }
  };

  const getDialogStyles = () => {
    switch (dialog.type) {
      case "success":
        return {
          icon: CheckCircle,
          iconColor: "text-green-600",
          iconBg: "bg-green-100",
        };
      case "warning":
        return {
          icon: AlertTriangle,
          iconColor: "text-yellow-600",
          iconBg: "bg-yellow-100 fill-yellow-100",
        };
      case "error":
        return {
          icon: XCircle,
          iconColor: "text-red-600",
          iconBg: "bg-red-100",
        };
      case "question":
        return {
          icon: HelpCircle,
          iconColor: "text-blue-600",
          iconBg: "bg-blue-100",
        };
      case "confirm":
        return {
          icon: AlertTriangle,
          iconColor: "text-orange-600",
          iconBg: "bg-orange-100",
        };
      case "info":
      default:
        return {
          icon: Info,
          iconColor: "text-blue-600",
          iconBg: "bg-blue-100",
        };
    }
  };

  const getButtonStyles = (variant?: string) => {
    switch (variant) {
      case "primary":
        return "bg-blue-600 hover:bg-blue-700 text-white";
      case "danger":
        return "bg-red-600 hover:bg-red-700 text-white";
      case "secondary":
      default:
        return "bg-gray-200 hover:bg-gray-300 text-gray-800";
    }
  };

  const styles = getDialogStyles();
  const IconComponent = styles.icon;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ease-out animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start p-6 pb-4">
          <div
            className={`${styles.iconBg} rounded-full p-2 mr-4 flex-shrink-0`}
          >
            <IconComponent className={`${styles.iconColor} w-6 h-6`} />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {dialog.title}
            </h3>
          </div>

          {dialog.showCloseButton && (
            <button
              onClick={() => hideAppDialog(dialog.id, null)}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="px-6 pb-6">
          <p className="text-gray-600 leading-relaxed">{dialog.message}</p>
        </div>

        {/* Footer com botões */}
        {dialog.buttons && dialog.buttons.length > 0 && (
          <div className="px-6 pb-6">
            <div className="flex gap-3 justify-end">
              {dialog.buttons.map((button, index) => (
                <button
                  key={index}
                  onClick={() => handleButtonClick(button)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${getButtonStyles(button.variant)}`}
                >
                  {button.text}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
