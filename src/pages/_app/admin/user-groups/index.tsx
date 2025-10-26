import { AppPageHeader } from "@/components/layout/app-page-header";
import {
  ServerTable,
  type ServerTableSearchField,
} from "@/components/server-table/server-table";
import type { UserGroupModel } from "@/models/user-group.model";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { columns } from "./-components/columns";
import { useState } from "react";
import { useAppDialog } from "@/components/app-dialog/use-app-dialog";
import { UserGroupsService } from "@/services/admin/user-groups.service";

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
  component: UserGroupsPageComponent,
});

function UserGroupsPageComponent() {
  const [tableToken, setTableToken] = useState(new Date().valueOf());
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
          })}
          showAddButton
          onAdd={() => handleAdd()}
          dataUrl="/admin/user-groups/list-paged"
        />
      </div>
    </AppPageHeader>
  );
}
