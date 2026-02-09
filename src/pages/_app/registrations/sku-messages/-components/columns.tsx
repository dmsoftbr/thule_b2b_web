import type { ServerTableColumn } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import type { SkuMessageModel } from "@/models/registrations/sku-message.model";
import { EditIcon, TrashIcon } from "lucide-react";

interface Props {
  fnEdit: (data: SkuMessageModel) => void;
  fnDelete: (data: SkuMessageModel) => void;
}

export const columns = ({ fnEdit, fnDelete }: Props): ServerTableColumn[] => [
  {
    key: "productId",
    dataIndex: "productId",
    title: "Código do Produto",
    renderItem: (row: SkuMessageModel) => (
      <span className="font-semibold text-blue-600 ">{row.productId}</span>
    ),
    sortable: true,
  },
  {
    key: "message",
    dataIndex: "message",
    title: "Mensagem",
    renderItem: (row: SkuMessageModel) => <span>{row.message}</span>,
    sortable: true,
  },
  {
    key: "actions",
    dataIndex: "id",
    title: "Ações",
    renderItem: (row: SkuMessageModel) => (
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
      </div>
    ),
  },
];
