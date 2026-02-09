import { AppPageHeader } from "@/components/layout/app-page-header";
import {
  ServerTable,
  type ServerTableSearchField,
} from "@/components/server-table/server-table";
import type { SkuMessageModel } from "@/models/registrations/sku-message.model";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { columns } from "./-components/columns";
import { useAppDialog } from "@/components/app-dialog/use-app-dialog";
import { api } from "@/lib/api";

export const Route = createFileRoute("/_app/registrations/sku-messages/")({
  component: SkuMessagesComponent,
});

const searchFieldsList: ServerTableSearchField[] = [
  {
    id: "productId",
    label: "Código do Produto",
  },
];

function SkuMessagesComponent() {
  const [tableToken, setTableToken] = useState(new Date().valueOf());
  const { showAppDialog } = useAppDialog();
  const navigate = useNavigate();
  const handleAdd = () => {
    navigate({ to: `/registrations/sku-messages/new-sku-message` });
  };

  const handleEdit = (data: SkuMessageModel) => {
    navigate({ to: `/registrations/sku-messages/${data.productId}` });
  };

  const handleDelete = async (data: SkuMessageModel) => {
    const continueDelete = await showAppDialog({
      title: "Atenção",
      message: "Excluir este registro?",
      type: "confirm",
    });

    if (!continueDelete) return;

    await api.delete(`/registrations/sku-messages/${data.productId}`);
    setTableToken(new Date().valueOf());
  };

  return (
    <AppPageHeader titleSlot="Mensagens em SKU">
      <div className="p-2">
        <ServerTable<SkuMessageModel>
          defaultSearchField="productId"
          key={tableToken}
          defaultSortFieldDataIndex="productId"
          searchFields={searchFieldsList}
          columns={columns({
            fnEdit: handleEdit,
            fnDelete: handleDelete,
          })}
          onAdd={handleAdd}
          dataUrl="/registrations/sku-messages/list-paged"
        />
      </div>
    </AppPageHeader>
  );
}
