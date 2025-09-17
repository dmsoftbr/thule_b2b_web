"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface UserChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export const UserChangePasswordModal = ({
  isOpen,
  onClose,
}: UserChangePasswordModalProps) => {
  const handleChangePassword = () => {
    toast.success("Senha alterada com sucesso!");
    onClose();
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Senha</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-2">
            <div className="space-y-1">
              <Label>Nova Senha</Label>
              <Input type="password" />
            </div>
            <div className="space-y-1">
              <Label>Confirmação</Label>
              <Input type="password" />
            </div>
            <div className="flex items-end justify-end gap-x-2 mt-2">
              <Button type="button" onClick={() => handleChangePassword()}>
                Alterar
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => onClose()}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
