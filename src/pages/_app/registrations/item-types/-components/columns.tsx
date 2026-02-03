import type { ServerTableColumn } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import type { ItemTypeModel } from "@/models/registrations/item-type.model";
import { EditIcon, TrashIcon } from "lucide-react";

interface Props {
  fnEdit: (data: ItemTypeModel) => void;
  fnDelete: (data: ItemTypeModel) => void;
}

export const columns = ({ fnEdit, fnDelete }: Props): ServerTableColumn[] => [
  {
    key: "id",
    dataIndex: "id",
    title: "Código",
    renderItem: (row: ItemTypeModel) => (
      <span className="font-semibold text-blue-600 ">{row.id}</span>
    ),
    sortable: true,
  },
  {
    key: "name",
    dataIndex: "name",
    title: "Descrição",
    renderItem: (row: ItemTypeModel) => <span>{row.name}</span>,
    sortable: true,
  },
  {
    key: "actions",
    dataIndex: "id",
    title: "Ações",
    renderItem: (row: ItemTypeModel) => (
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
