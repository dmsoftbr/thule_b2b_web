import { useAppDialog } from "@/components/app-dialog/use-app-dialog";
import { AppPageHeader } from "@/components/layout/app-page-header";
import {
  ServerTable,
  type ServerTableSearchField,
} from "@/components/server-table/server-table";
import type { MobileCommunicationModel } from "@/models/mobile/communication.model";
import { MobileCommunicationsService } from "@/services/mobile/communications.service";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { columns } from "./-components/columns";

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

export const Route = createFileRoute("/_app/mobile/communications/")({
  component: MobileCommunicationsPageComponent,
});

function MobileCommunicationsPageComponent() {
  const [tableToken, setTableToken] = useState(new Date().valueOf());
  const { showAppDialog } = useAppDialog();
  const navigate = useNavigate();

  const handleAdd = () => {
    navigate({ to: `/mobile/communications/new-communicate` });
  };

  const handleEdit = (data: MobileCommunicationModel) => {
    navigate({ to: `/mobile/communications/${data.id}` });
  };

  const handleDelete = async (data: MobileCommunicationModel) => {
    const continueDelete = await showAppDialog({
      type: "confirm",
      title: "Atenção",
      message: "Excluir este Comunicado?",
      buttons: [
        { text: "Excluir", variant: "danger", value: "ok", autoClose: true },
        { text: "Cancelar", variant: "secondary", value: "", autoClose: true },
      ],
    });

    if (continueDelete) {
      await MobileCommunicationsService.delete(data.id);
      setTableToken(new Date().valueOf());
    }
  };

  const handleSend = async (data: MobileCommunicationModel) => {
    const continueSend = await showAppDialog({
      type: "confirm",
      title: "Atenção",
      message: "Liberar este comunicado a todos no App Mobile?",
      buttons: [
        { text: "Liberar", variant: "danger", value: "ok", autoClose: true },
        { text: "Cancelar", variant: "secondary", value: "", autoClose: true },
      ],
    });

    if (continueSend) {
      await MobileCommunicationsService.send(data.id);
      setTableToken(new Date().valueOf());
    }
  };

  return (
    <AppPageHeader titleSlot="Manutenção de Comunicados no App Mobile">
      <div className="p-2">
        <ServerTable<MobileCommunicationModel>
          key={tableToken}
          defaultSearchField="title"
          defaultSortFieldDataIndex="title"
          searchFields={searchFieldsList}
          columns={columns({
            fnEdit: handleEdit,
            fnDelete: handleDelete,
            fnSend: handleSend,
          })}
          showAddButton
          onAdd={() => handleAdd()}
          dataUrl="/mobile/communications/list-paged"
        />
      </div>
    </AppPageHeader>
  );
}
