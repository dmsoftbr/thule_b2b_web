import { AppPageHeader } from "@/components/layout/app-page-header";
import {
  ServerTable,
  type ServerTableSearchField,
} from "@/components/server-table/server-table";
import type { ItemTypeModel } from "@/models/registrations/item-type.model";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { columns } from "./-components/columns";
import { useAppDialog } from "@/components/app-dialog/use-app-dialog";
import { api } from "@/lib/api";

export const Route = createFileRoute("/_app/registrations/item-types/")({
  component: RouteComponent,
});

const searchFieldsList: ServerTableSearchField[] = [
  {
    id: "id",
    label: "Código",
  },
  {
    id: "description",
    label: "Descrição",
  },
];

function RouteComponent() {
  const [tableToken, setTableToken] = useState(new Date().valueOf());
  const { showAppDialog } = useAppDialog();
  const navigate = useNavigate();

  const handleAdd = () => {
    navigate({ to: `/registrations/item-types/new-item-type` });
  };

  const handleEdit = (data: ItemTypeModel) => {
    navigate({ to: `/registrations/item-types/${data.id}` });
  };

  const handleDelete = async (data: ItemTypeModel) => {
    const continueDelete = await showAppDialog({
      title: "Atenção",
      message: "Excluir este registro?",
      type: "confirm",
    });

    if (!continueDelete) return;

    await api.delete(`/registrations/item-types/${data.id}`);
    setTableToken(new Date().valueOf());
  };

  return (
    <AppPageHeader titleSlot="Tipo Item">
      <div className="p-2">
        <ServerTable<ItemTypeModel>
          defaultSearchField="id"
          key={tableToken}
          defaultSortFieldDataIndex="id"
          searchFields={searchFieldsList}
          columns={columns({
            fnEdit: handleEdit,
            fnDelete: handleDelete,
          })}
          onAdd={handleAdd}
          dataUrl="/registrations/item-types/list-paged"
        />
      </div>
    </AppPageHeader>
  );
}
