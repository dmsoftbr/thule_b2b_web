import type { ServerTableColumn } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import type { CustomerPriceExceptionTableModel } from "@/models/registrations/customer-price-exception-table.model";
import { TrashIcon } from "lucide-react";

interface Props {
  fnDelete: (data: CustomerPriceExceptionTableModel) => void;
}

export const exceptionTableColumns = ({
  fnDelete,
}: Props): ServerTableColumn[] => [
  {
    key: "exceptionTableId",
    dataIndex: "exceptionTableId",
    title: "Grupo de Desconto",
  },
  {
    key: "order",
    dataIndex: "order",
    title: "Ordem (prioridade)",
  },
  {
    key: "actions",
    dataIndex: "exceptionTableId",
    title: "Ações",
    renderItem: (row: CustomerPriceExceptionTableModel) => (
      <div>
        <Button variant="destructive" onClick={() => fnDelete(row)}>
          <TrashIcon className="size-4" />
        </Button>
      </div>
    ),
  },
];
