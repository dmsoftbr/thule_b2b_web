import { AppPageHeader } from "@/components/layout/app-page-header";
import {
  ServerTable,
  type ServerTableSearchField,
} from "@/components/server-table/server-table";
import type { UserModel } from "@/models/user.model";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { columns } from "./-components/columns";
import { useAppDialog } from "@/components/app-dialog/use-app-dialog";
import { UsersService } from "@/services/admin/users.service";
import { useState } from "react";
import { PermissionsModal } from "./-components/permissions-modal";
import { ChangePasswordModal } from "./-components/change-password-modal";

const searchFieldsList: ServerTableSearchField[] = [
  {
    id: "id",
    label: "Código",
  },
  {
    id: "name",
    label: "Nome",
  },
  {
    id: "email",
    label: "E-mail",
  },
];

export const Route = createFileRoute("/_app/admin/users/")({
  component: UsersPageComponent,
});

function UsersPageComponent() {
  const [tableToken, setTableToken] = useState(new Date().valueOf());
  const [showPermissions, setShowPermissions] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserModel | null>(null);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const navigate = useNavigate();
  const { showAppDialog } = useAppDialog();

  const handleAdd = () => {
    navigate({ to: `/admin/users/new-user` });
  };
  const handleEdit = (data: UserModel) => {
    navigate({ to: `/admin/users/${data.id}` });
  };
  const handleDelete = async (data: UserModel) => {
    const continueDelete = await showAppDialog({
      type: "confirm",
      title: "Atenção",
      message: "Excluir este Usuário?",
      buttons: [
        { text: "Excluir", variant: "danger", value: "ok", autoClose: true },
        { text: "Cancelar", variant: "secondary", value: "", autoClose: true },
      ],
    });

    if (continueDelete) {
      await new UsersService().delete(data.id);
      setTableToken(new Date().valueOf());
    }
  };
  const handlePermissions = (data: UserModel) => {
    setCurrentUser(data);
    setShowPermissions(true);
  };

  const handleChangePassword = (data: UserModel) => {
    setCurrentUser(data);
    setShowChangePassword(true);
  };

  return (
    <AppPageHeader titleSlot="Manutenção de Usuários">
      <div className="p-2">
        <ServerTable<UserModel>
          key={tableToken}
          defaultSearchField="name"
          defaultSortFieldDataIndex="name"
          searchFields={searchFieldsList}
          columns={columns({
            fnEdit: handleEdit,
            fnDelete: handleDelete,
            fnPermissions: handlePermissions,
            fnChangePassword: handleChangePassword,
          })}
          showAddButton
          onAdd={() => handleAdd()}
          dataUrl="/admin/users/list-paged"
        />
      </div>
      {showPermissions && currentUser && (
        <PermissionsModal
          isOpen={showPermissions}
          onClose={() => {
            setCurrentUser(null);
            setShowPermissions(false);
          }}
          user={currentUser}
        />
      )}
      {showChangePassword && currentUser && (
        <ChangePasswordModal
          isOpen={showChangePassword}
          onClose={() => {
            setCurrentUser(null);
            setShowChangePassword(false);
          }}
          user={currentUser}
        />
      )}
    </AppPageHeader>
  );
}
