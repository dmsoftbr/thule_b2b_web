import { AppTooltip } from "@/components/layout/app-tooltip";
import type { ServerTableColumn } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import type { ApprovalLevelModel } from "@/models/registrations/approval-level.model";
import { EditIcon, TrashIcon, UsersIcon } from "lucide-react";

interface Props {
  fnEdit: (data: ApprovalLevelModel) => void;
  fnDelete: (data: ApprovalLevelModel) => void;
  fnConfig: (data: ApprovalLevelModel) => void;
}

export const columns = ({
  fnConfig,
  fnEdit,
  fnDelete,
}: Props): ServerTableColumn[] => [
  {
    title: "Código",
    dataIndex: "id",
    key: "id",
    sortable: true,
    renderItem: (item: ApprovalLevelModel) => {
      return <span className="text-blue-600 font-semibold">{item.id}</span>;
    },
  },
  {
    title: "Descrição",
    dataIndex: "description",
    key: "description",
    sortable: true,
  },
  {
    title: "Tipo",
    dataIndex: "type",
    key: "type",
    sortable: true,
    renderItem: (row: ApprovalLevelModel) => (
      <span>{row.type == "UNIQUE" ? "Aprovador Único" : "Cadeia"}</span>
    ),
  },
  {
    title: "Ações",
    dataIndex: "id",
    key: "actions",
    renderItem: (row: ApprovalLevelModel) => (
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
        <AppTooltip message="Usuários e Limites">
          <Button
            size="sm"
            variant="secondary"
            type="button"
            onClick={() => {
              fnConfig(row);
            }}
          >
            <UsersIcon className="size-4" />
          </Button>
        </AppTooltip>
      </div>
    ),
  },
];
