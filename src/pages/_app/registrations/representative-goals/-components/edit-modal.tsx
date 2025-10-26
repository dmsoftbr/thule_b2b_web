import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api, handleError } from "@/lib/api";
import type { RepresentativeGoalModel } from "@/models/registrations/representative-goal.model";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  initialData: RepresentativeGoalModel;
  isOpen: boolean;
  onClose: (refresh: boolean) => void;
}
export const EditModal = ({ initialData, isOpen, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await api.patch("/registrations/representative-goals", initialData);
      onClose(true);
    } catch (error) {
      console.error(error);
      toast.error(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        if (isLoading) return false;
        onClose(false);
      }}
    >
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Alteração de Metas</DialogTitle>
          <DialogDescription>
            Utilize esta tela para realizar ajustes pontuais nas metas dos
            representantes.
          </DialogDescription>
        </DialogHeader>
        <div></div>
        <div className="flex justify-between w-full flex-1">
          <div></div>
          <div className="flex gap-x-2">
            <Button
              variant="blue"
              onClick={() => handleSave()}
              disabled={isLoading}
            >
              {isLoading && (
                <div className="flex gap-x-2">
                  <Loader2Icon className="animate-spin" />
                  Aguarde...
                </div>
              )}
              {!isLoading && <span>Gravar</span>}
            </Button>
            <Button
              variant="secondary"
              onClick={() => onClose(false)}
              disabled={isLoading}
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
