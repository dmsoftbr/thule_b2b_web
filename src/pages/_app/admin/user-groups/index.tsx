import { AppPageHeader } from "@/components/layout/app-page-header";
import {
  ServerTable,
  type ServerTableSearchField,
} from "@/components/server-table/server-table";
import type { UserGroupModel } from "@/models/user-group.model";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { TableSkeleton } from "@/pages/_app/-components/route-skeleton";
import { columns } from "./-components/columns";
import { useState } from "react";
import { useAppDialog } from "@/components/app-dialog/use-app-dialog";
import { UserGroupsService } from "@/services/admin/user-groups.service";
import { GroupPermissionsModal } from "./-components/permissions-modal";
import { RequirePermission } from "@/components/auth/require-permission";

const searchFieldsList: ServerTableSearchField[] = [
  {
    id: "id",
    label: "Código",
  },
  {
    id: "name",
    label: "Nome",
  },
];

export const Route = createFileRoute("/_app/admin/user-groups/")({
  component: GuardedUserGroupsPage,
  pendingComponent: TableSkeleton,
});

function GuardedUserGroupsPage() {
  return (
    <RequirePermission permissionId="11">
      <UserGroupsPageComponent />
    </RequirePermission>
  );
}

function UserGroupsPageComponent() {
  const [tableToken, setTableToken] = useState(new Date().valueOf());
  const [showPermissions, setShowPermissions] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<UserGroupModel | null>(null);
  const { showAppDialog } = useAppDialog();
  const navigate = useNavigate();

  const handleAdd = () => {
    navigate({ to: `/admin/user-groups/new-user-group` });
  };

  const handleEdit = (data: UserGroupModel) => {
    navigate({ to: `/admin/user-groups/${data.id}` });
  };

  const handleDelete = async (data: UserGroupModel) => {
    const continueDelete = await showAppDialog({
      type: "confirm",
      title: "Atenção",
      message: "Excluir este Grupo?",
      buttons: [
        { text: "Excluir", variant: "danger", value: "ok", autoClose: true },
        { text: "Cancelar", variant: "secondary", value: "", autoClose: true },
      ],
    });

    if (continueDelete) {
      await new UserGroupsService().delete(data.id);
      setTableToken(new Date().valueOf());
    }
  };

  const handlePermissions = (data: UserGroupModel) => {
    setCurrentGroup(data);
    setShowPermissions(true);
  };

  return (
    <AppPageHeader titleSlot="Manutenção de Grupos de Usuários">
      <div className="p-2">
        <ServerTable<UserGroupModel>
          key={tableToken}
          defaultSearchField="name"
          defaultSortFieldDataIndex="name"
          searchFields={searchFieldsList}
          columns={columns({
            fnEdit: handleEdit,
            fnDelete: handleDelete,
            fnPermissions: handlePermissions,
          })}
          showAddButton
          onAdd={() => handleAdd()}
          dataUrl="/admin/user-groups/list-paged"
        />
      </div>
      {showPermissions && currentGroup && (
        <GroupPermissionsModal
          isOpen={showPermissions}
          onClose={() => {
            setCurrentGroup(null);
            setShowPermissions(false);
          }}
          group={currentGroup}
        />
      )}
    </AppPageHeader>
  );
}
