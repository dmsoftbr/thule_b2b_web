import type { ServerTableColumn } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/number-utils";
import type { ApprovalLevelLimitModel } from "@/models/registrations/approval-level-limit.model";
import { EditIcon, TrashIcon } from "lucide-react";

interface Props {
  fnEdit: (data: ApprovalLevelLimitModel) => void;
  fnDelete: (data: ApprovalLevelLimitModel) => void;
}

export const limitsColumns = ({
  fnEdit,
  fnDelete,
}: Props): ServerTableColumn[] => [
  {
    title: "Usuário",
    dataIndex: "userId",
    key: "userId",
    sortable: true,
    renderItem: (item: ApprovalLevelLimitModel) => {
      return <span className="text-blue-600 font-semibold">{item.userId}</span>;
    },
  },
  {
    title: "Alternativo",
    dataIndex: "alternativeId",
    key: "alternativeId",
    sortable: true,
  },
  {
    title: "Limite R$",
    dataIndex: "limitValue",
    key: "limitValue",
    sortable: true,
    renderItem: (row: ApprovalLevelLimitModel) => (
      <span>{formatNumber(row.limitValue, 2)}</span>
    ),
  },
  {
    title: "Ações",
    dataIndex: "id",
    key: "actions",
    renderItem: (row: ApprovalLevelLimitModel) => (
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
            console.log(row);
            fnDelete(row);
          }}
        >
          <TrashIcon className="size-4" />
        </Button>
      </div>
    ),
  },
];
