import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { UserModel } from "@/models/user.model";

import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { UsersService } from "@/services/admin/users.service";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: UserModel;
}

export const ChangePasswordModal = ({ user, isOpen, onClose }: Props) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (confirm !== newPassword) {
        toast.warning("Senha não confere!");
        return;
      }

      await new UsersService().changePassword(user.id, newPassword);
      toast.success("Senha Alterada!");
      onClose();
    } catch (error) {
      console.log(error);
      toast.error((error as any).message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Alterar Senha do Usuário:{" "}
            <span className="text-blue-600 font-semibold">{user.id}</span>
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <div className="form-group">
            <Label>Nova Senha:</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              maxLength={50}
            />
          </div>
          <div className="form-group">
            <Label>Confirmação:</Label>
            <Input
              type="password"
              maxLength={50}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={() => handleSave()}
            variant="green"
            disabled={isLoading}
          >
            Alterar a Senha
          </Button>
          <Button
            type="button"
            onClick={() => onClose()}
            variant="secondary"
            disabled={isLoading}
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
