import { useAppDialog } from "@/components/app-dialog/use-app-dialog";
import { AppPageHeader } from "@/components/layout/app-page-header";
import {
  ServerTable,
  type ServerTableSearchField,
} from "@/components/server-table/server-table";
import type { MobileLinkModel } from "@/models/mobile/link.model";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { columns } from "./-components/columns";
import { MobileLinksService } from "@/services/mobile/links.service";

const searchFieldsList: ServerTableSearchField[] = [
  {
    id: "id",
    label: "Código",
  },
  {
    id: "title",
    label: "Título",
  },
];

export const Route = createFileRoute("/_app/mobile/links/")({
  component: MobileLinksPageComponent,
});

function MobileLinksPageComponent() {
  const [tableToken, setTableToken] = useState(new Date().valueOf());
  const { showAppDialog } = useAppDialog();
  const navigate = useNavigate();

  const handleAdd = () => {
    navigate({ to: `/mobile/links/new-link` });
  };

  const handleEdit = (data: MobileLinkModel) => {
    navigate({ to: `/mobile/Links/${data.id}` });
  };

  const handleDelete = async (data: MobileLinkModel) => {
    const continueDelete = await showAppDialog({
      type: "confirm",
      title: "Atenção",
      message: "Excluir este Link?",
      buttons: [
        { text: "Excluir", variant: "danger", value: "ok", autoClose: true },
        { text: "Cancelar", variant: "secondary", value: "", autoClose: true },
      ],
    });

    if (continueDelete) {
      await MobileLinksService.delete(data.id);
      setTableToken(new Date().valueOf());
    }
  };

  return (
    <AppPageHeader titleSlot="Manutenção de Links no App Mobile">
      <div className="p-2">
        <ServerTable<MobileLinkModel>
          key={tableToken}
          defaultSearchField="title"
          defaultSortFieldDataIndex="title"
          searchFields={searchFieldsList}
          columns={columns({
            fnEdit: handleEdit,
            fnDelete: handleDelete,
          })}
          showAddButton
          onAdd={() => handleAdd()}
          dataUrl="/mobile/links/list-paged"
        />
      </div>
    </AppPageHeader>
  );
}
