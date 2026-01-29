import type { ServerTableColumn } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";

import type { CustomerSalesGroupModel } from "@/models/registrations/customer-sales-group-model";
import { TrashIcon } from "lucide-react";

interface Props {
  fnDelete: (data: CustomerSalesGroupModel) => void;
}

export const salesGroupColumns = ({ fnDelete }: Props): ServerTableColumn[] => [
  {
    key: "groupId",
    dataIndex: "groupId",
    title: "Grupo de Venda",
  },
  {
    key: "actions",
    dataIndex: "groupId",
    title: "Ações",
    renderItem: (row: CustomerSalesGroupModel) => (
      <div>
        <Button variant="destructive" onClick={() => fnDelete(row)}>
          <TrashIcon className="size-4" />
        </Button>
      </div>
    ),
  },
];
