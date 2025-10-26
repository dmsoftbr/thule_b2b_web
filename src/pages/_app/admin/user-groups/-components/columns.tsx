import type { ServerTableColumn } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import type { UserGroupModel } from "@/models/user-group.model";
import { EditIcon, TrashIcon } from "lucide-react";

interface Props {
  fnEdit: (data: UserGroupModel) => void;
  fnDelete: (data: UserGroupModel) => void;
}

export const columns = ({ fnEdit, fnDelete }: Props): ServerTableColumn[] => [
  {
    title: "Código",
    dataIndex: "id",
    key: "id",
    sortable: true,
    renderItem: (item: UserGroupModel) => {
      return <span className="text-blue-600 font-semibold">{item.id}</span>;
    },
  },
  {
    title: "Nome",
    dataIndex: "name",
    key: "name",
    sortable: true,
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
      </div>
    ),
  },
];
