import type { ServerTableColumn } from "@/components/server-table/server-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CustomerPriceTableModel } from "@/models/registrations/customer-price-table.model";
import { ChevronDownIcon, ChevronUpIcon, TrashIcon } from "lucide-react";

interface Props {
  fnDelete: (data: CustomerPriceTableModel) => void;
  fnReorder: (data: CustomerPriceTableModel, direction: string) => void;
}

export const priceTableColumns = ({
  fnDelete,
  fnReorder,
}: Props): ServerTableColumn[] => [
  {
    key: "priceTableId",
    dataIndex: "priceTableId",
    title: "Tabela de Preço",
  },
  {
    key: "isException",
    dataIndex: "isException",
    title: "Tabela de Excessão?",
    cellClassName: "text-center",
    renderItem: (row) => {
      return row.isException ? (
        <Badge variant="destructive">Sim</Badge>
      ) : (
        <span></span>
      );
    },
  },
  {
    key: "actions",
    dataIndex: "priceTableId",
    title: "Ações",
    renderItem: (row: CustomerPriceTableModel) => (
      <div className="flex gap-x-1">
        <Button variant="destructive" onClick={() => fnDelete(row)}>
          <TrashIcon className="size-4" />
        </Button>
        {row.priceTableId !== "PrBase" && (
          <>
            {" "}
            <Button variant="secondary" onClick={() => fnReorder(row, "up")}>
              <ChevronUpIcon className="size-4" />
            </Button>
            <Button variant="secondary" onClick={() => fnReorder(row, "down")}>
              <ChevronDownIcon className="size-4" />
            </Button>
          </>
        )}
      </div>
    ),
  },
];
