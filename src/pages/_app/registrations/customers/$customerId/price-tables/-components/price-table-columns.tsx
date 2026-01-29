import type { ServerTableColumn } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import type { CustomerPriceTableModel } from "@/models/registrations/customer-price-table.model";
import { TrashIcon } from "lucide-react";

interface Props {
  fnDelete: (data: CustomerPriceTableModel) => void;
}

export const priceTableColumns = ({ fnDelete }: Props): ServerTableColumn[] => [
  {
    key: "priceTableId",
    dataIndex: "priceTableId",
    title: "Tabela de Preço",
  },
  {
    key: "actions",
    dataIndex: "priceTableId",
    title: "Ações",
    renderItem: (row: CustomerPriceTableModel) => (
      <div>
        <Button variant="destructive" onClick={() => fnDelete(row)}>
          <TrashIcon className="size-4" />
        </Button>
      </div>
    ),
  },
];
