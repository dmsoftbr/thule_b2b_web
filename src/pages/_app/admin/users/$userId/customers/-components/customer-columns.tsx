import type { ServerTableColumn } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import type { UserCustomerModel } from "@/models/admin/user-customer.model";
import { TrashIcon } from "lucide-react";

interface Props {
  fnDelete: (data: UserCustomerModel) => void;
}

export const userCustomerColumns = ({
  fnDelete,
}: Props): ServerTableColumn[] => [
  {
    key: "customerId",
    dataIndex: "customerId",
    title: "Código",
    sortable: true,
  },
  {
    key: "abbreviation",
    dataIndex: "customer.abbreviation",
    title: "Nome",
    renderItem: (row: UserCustomerModel) =>
      row.customer
        ? `${row.customer.abbreviation || row.customer.name || ""}`
        : "",
  },
  {
    key: "actions",
    dataIndex: "customerId",
    title: "Ações",
    renderItem: (row: UserCustomerModel) => (
      <div>
        <Button variant="destructive" onClick={() => fnDelete(row)}>
          <TrashIcon className="size-4" />
        </Button>
      </div>
    ),
  },
];
