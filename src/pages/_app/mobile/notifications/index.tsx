import { useAppDialog } from "@/components/app-dialog/use-app-dialog";
import { AppPageHeader } from "@/components/layout/app-page-header";
import {
  ServerTable,
  type ServerTableSearchField,
} from "@/components/server-table/server-table";
import type { MobileNotificationModel } from "@/models/mobile/notification.model";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { columns } from "./-components/columns";
import { MobileNotificationsService } from "@/services/mobile/notifications.service";

const searchFieldsList: ServerTableSearchField[] = [
  {
    id: "id",
    label: "Código",
  },
  {
    id: "title",
    label: "Títulos",
  },
];

export const Route = createFileRoute("/_app/mobile/notifications/")({
  component: MobileNotificationsPageComponent,
});

function MobileNotificationsPageComponent() {
  const [tableToken, setTableToken] = useState(new Date().valueOf());
  const { showAppDialog } = useAppDialog();
  const navigate = useNavigate();

  const handleAdd = () => {
    navigate({ to: `/mobile/notifications/new-notification` });
  };

  const handleEdit = (data: MobileNotificationModel) => {
    navigate({ to: `/mobile/notifications/${data.id}` });
  };

  const handleDelete = async (data: MobileNotificationModel) => {
    const continueDelete = await showAppDialog({
      type: "confirm",
      title: "Atenção",
      message: "Excluir esta Notificação?",
      buttons: [
        { text: "Excluir", variant: "danger", value: "ok", autoClose: true },
        { text: "Cancelar", variant: "secondary", value: "", autoClose: true },
      ],
    });

    if (continueDelete) {
      await MobileNotificationsService.delete(data.id);
      setTableToken(new Date().valueOf());
    }
  };

  const handleSend = async (data: MobileNotificationModel) => {
    const continueSend = await showAppDialog({
      type: "confirm",
      title: "Atenção",
      message: "Confirma o Envio para todos os números de telefone vinculados?",
      buttons: [
        { text: "Enviar", variant: "danger", value: "ok", autoClose: true },
        { text: "Cancelar", variant: "secondary", value: "", autoClose: true },
      ],
    });

    if (continueSend) {
      await MobileNotificationsService.send(data.id);
      setTableToken(new Date().valueOf());
    }
  };

  return (
    <AppPageHeader titleSlot="Manutenção de Notificações no App">
      <div className="p-2">
        <ServerTable<MobileNotificationModel>
          key={tableToken}
          defaultSearchField="id"
          defaultSortFieldDataIndex="id"
          searchFields={searchFieldsList}
          columns={columns({
            fnEdit: handleEdit,
            fnDelete: handleDelete,
            fnSend: handleSend,
          })}
          showAddButton
          onAdd={() => handleAdd()}
          dataUrl="/mobile/notifications/list-paged"
        />
      </div>
    </AppPageHeader>
  );
}
