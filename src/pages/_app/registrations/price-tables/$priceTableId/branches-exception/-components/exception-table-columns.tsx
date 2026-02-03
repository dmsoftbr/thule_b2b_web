import type { ServerTableColumn } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import type { PriceTableBranchExceptionModel } from "@/models/registrations/price-table-branch-exception.model";

import { TrashIcon } from "lucide-react";

interface Props {
  fnDelete: (data: PriceTableBranchExceptionModel) => void;
}

export const exceptionTableColumns = ({
  fnDelete,
}: Props): ServerTableColumn[] => [
  {
    key: "branchId",
    dataIndex: "branchId",
    title: "Estabelecimento",
  },
  {
    key: "actions",
    dataIndex: "priceTableId",
    title: "Ações",
    renderItem: (row: PriceTableBranchExceptionModel) => (
      <div>
        <Button variant="destructive" onClick={() => fnDelete(row)}>
          <TrashIcon className="size-4" />
        </Button>
      </div>
    ),
  },
];
