import { useEffect, useState } from "react";
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
import { toast } from "sonner";
import { handleError } from "@/lib/api";
import { UsersService } from "@/services/admin/users.service";
import { ALL_PERMISSIONS } from "@/lib/permissions";
import {
  PermissionsForm,
  type PermissionsFormValue,
} from "./permissions-form";
import type { UserPermissionModel } from "@/models/admin/user-permission.model";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: UserModel;
}

export const PermissionsModal = ({ user, isOpen, onClose }: Props) => {
  const [permissions, setPermissions] = useState<PermissionsFormValue[]>([]);
  const usersService = new UsersService();

  useEffect(() => {
    if (!isOpen) return;
    load();
  }, [isOpen, user.id]);

  const load = async () => {
    const effective = await usersService.getPermissions(user.id);
    const merged: PermissionsFormValue[] = ALL_PERMISSIONS.map((p) => {
      const found = effective.find((e) => e.permissionId === p.id);
      return {
        permissionId: p.id,
        isPermitted: found?.isPermitted ?? false,
        fromGroup: found?.fromGroup ?? false,
      };
    });
    setPermissions(merged);
  };

  const handleSave = async () => {
    try {
      const payload: UserPermissionModel[] = permissions
        .filter((p) => p.isPermitted && !p.fromGroup)
        .map((p) => ({
          permissionId: p.permissionId,
          userId: user.id,
          isPermitted: true,
        }));
      await usersService.setPermissions(user.id, payload);
      toast.success("Permissões Gravadas!");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(handleError(error));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Permissões do Usuário:{" "}
            <span className="text-blue-600 font-semibold">{user.id}</span>
          </DialogTitle>
          <DialogDescription>
            Permissões marcadas em cinza são herdadas do grupo do usuário e não
            podem ser removidas — apenas adicionadas como liberações especiais.
          </DialogDescription>
        </DialogHeader>

        <PermissionsForm
          mode="user"
          value={permissions}
          onChange={setPermissions}
        />

        <DialogFooter>
          <Button type="button" onClick={handleSave} variant="green">
            Gravar
          </Button>
          <Button type="button" onClick={onClose} variant="secondary">
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
