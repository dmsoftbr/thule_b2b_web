import type { ServerTableColumn } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import type { MobileNotificationModel } from "@/models/mobile/notification.model";
import { formatDate } from "date-fns";
import { EditIcon, SendIcon, TrashIcon } from "lucide-react";

interface Props {
  fnEdit: (data: MobileNotificationModel) => void;
  fnDelete: (data: MobileNotificationModel) => void;
  fnSend: (data: MobileNotificationModel) => void;
}

export const columns = ({
  fnEdit,
  fnDelete,
  fnSend,
}: Props): ServerTableColumn[] => [
  {
    title: "Identificador",
    dataIndex: "id",
    key: "id",
    sortable: true,
    renderItem: (item: MobileNotificationModel) => {
      return <span className="text-blue-600 font-semibold">{item.id}</span>;
    },
  },
  {
    title: "Título",
    dataIndex: "title",
    key: "title",
    sortable: true,
  },
  {
    title: "Enviado em",
    dataIndex: "sentAt",
    key: "sentAt",
    sortable: true,
    renderItem: (item: MobileNotificationModel) => {
      return (
        <span>
          {item.sentAt
            ? formatDate(item.sentAt, "dd/MM/yyyy HH:mm:ss")
            : "Não Enviado"}
        </span>
      );
    },
  },
  {
    title: "Mensagem",
    dataIndex: "message",
    key: "message",
    sortable: false,
    renderItem: (item: MobileNotificationModel) => (
      <span className="text-xs">{item.message}</span>
    ),
  },
  {
    title: "Endereço de Imagem (URL)",
    dataIndex: "imageUrl",
    key: "imageUrl",
    sortable: false,
    renderItem: (item: MobileNotificationModel) => (
      <span className="text-xs">{item.imageUrl}</span>
    ),
  },
  {
    title: "Ações",
    dataIndex: "id",
    key: "actions",
    renderItem: (row: MobileNotificationModel) => {
      if (row.statusId == "SENT") return "";

      return (
        <div className="flex flex-wrap gap-x-1 items-center">
          <Button
            size="sm"
            type="button"
            onClick={() => {
              fnEdit(row);
            }}
          >
            <EditIcon className="size-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            type="button"
            onClick={() => {
              fnDelete(row);
            }}
          >
            <TrashIcon className="size-4" />
          </Button>
          <Button
            size="sm"
            variant="green"
            type="button"
            onClick={() => {
              fnSend(row);
            }}
          >
            <SendIcon className="size-4" />
          </Button>
        </div>
      );
    },
  },
];
