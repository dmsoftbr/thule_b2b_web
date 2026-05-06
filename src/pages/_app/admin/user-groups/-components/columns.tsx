import type { ServerTableColumn } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import type { UserGroupModel } from "@/models/user-group.model";
import { EditIcon, Settings2Icon, TrashIcon } from "lucide-react";

interface Props {
  fnEdit: (data: UserGroupModel) => void;
  fnDelete: (data: UserGroupModel) => void;
  fnPermissions: (data: UserGroupModel) => void;
}

export const columns = ({
  fnEdit,
  fnDelete,
  fnPermissions,
}: Props): ServerTableColumn[] => [
  {
    title: "Código",
    dataIndex: "id",
    key: "id",
    sortable: true,
    renderItem: (item: UserGroupModel) => {
      return (
        <span className="text-blue-600 font-semibold">
          {item.id.toUpperCase()}
        </span>
      );
    },
  },
  {
    title: "Nome",
    dataIndex: "name",
    key: "name",
    sortable: true,
    renderItem: (row: UserGroupModel) => <span>{row.name.toUpperCase()}</span>,
  },
  {
    title: "Ações",
    dataIndex: "id",
    key: "actions",
    renderItem: (row: UserGroupModel) => (
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
        <Button
          size="sm"
          variant="secondary"
          type="button"
          title="Permissões do Grupo"
          onClick={() => {
            fnPermissions(row);
          }}
        >
          <Settings2Icon className="size-4" />
        </Button>
      </div>
    ),
  },
];
