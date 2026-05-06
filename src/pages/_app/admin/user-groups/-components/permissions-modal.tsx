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
import type { UserGroupModel } from "@/models/user-group.model";
import { toast } from "sonner";
import { handleError } from "@/lib/api";
import { UserGroupsService } from "@/services/admin/user-groups.service";
import { ALL_PERMISSIONS } from "@/lib/permissions";
import {
  PermissionsForm,
  type PermissionsFormValue,
} from "@/pages/_app/admin/users/-components/permissions-form";
import type { GroupPermissionModel } from "@/models/admin/group-permission.model";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  group: UserGroupModel;
}

export const GroupPermissionsModal = ({ group, isOpen, onClose }: Props) => {
  const [permissions, setPermissions] = useState<PermissionsFormValue[]>([]);
  const service = new UserGroupsService();

  useEffect(() => {
    if (!isOpen) return;
    load();
  }, [isOpen, group.id]);

  const load = async () => {
    const data = await service.getPermissions(group.id);
    const merged: PermissionsFormValue[] = ALL_PERMISSIONS.map((p) => {
      const found = data.find((e) => e.permissionId === p.id);
      return {
        permissionId: p.id,
        isPermitted: found?.isPermitted ?? false,
        fromGroup: false,
      };
    });
    setPermissions(merged);
  };

  const handleSave = async () => {
    try {
      const payload: GroupPermissionModel[] = permissions
        .filter((p) => p.isPermitted)
        .map((p) => ({
          permissionId: p.permissionId,
          groupId: group.id,
          isPermitted: true,
        }));
      await service.setPermissions(group.id, payload);
      toast.success("Permissões do Grupo Gravadas!");
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
            Permissões do Grupo:{" "}
            <span className="text-blue-600 font-semibold">{group.name}</span>
          </DialogTitle>
          <DialogDescription>
            As permissões marcadas aqui serão aplicadas a todos os usuários
            pertencentes a este grupo.
          </DialogDescription>
        </DialogHeader>

        <PermissionsForm
          mode="group"
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
