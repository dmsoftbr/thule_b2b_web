import type { ServerTableColumn } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import type { PriceTableProductExceptionModel } from "@/models/registrations/price-table-product-exception.model";
import { TrashIcon } from "lucide-react";

interface Props {
  fnDelete: (data: PriceTableProductExceptionModel) => void;
}

export const exceptionTableColumns = ({
  fnDelete,
}: Props): ServerTableColumn[] => [
  {
    key: "productId",
    dataIndex: "productId",
    title: "Código do Produto",
  },
  {
    key: "productName",
    dataIndex: "productName",
    title: "Descrição",
  },
  {
    key: "branchId",
    dataIndex: "branchId",
    title: "Estabelecimento",
  },
  {
    key: "actions",
    dataIndex: "priceTableId",
    title: "Ações",
    renderItem: (row: PriceTableProductExceptionModel) => (
      <div>
        <Button variant="destructive" onClick={() => fnDelete(row)}>
          <TrashIcon className="size-4" />
        </Button>
      </div>
    ),
  },
];
