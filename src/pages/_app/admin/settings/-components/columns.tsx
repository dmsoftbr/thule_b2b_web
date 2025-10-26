import type { ServerTableColumn } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import type { SettingModel } from "@/models/admin/setting.model";
import { EditIcon } from "lucide-react";

interface Props {
  fnEdit: (data: SettingModel) => void;
}

export const columns = ({ fnEdit }: Props): ServerTableColumn[] => [
  {
    title: "Código",
    dataIndex: "id",
    key: "id",
    sortable: true,
    renderItem: (item: SettingModel) => {
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
    title: "Conteúdo",
    dataIndex: "content",
    key: "content",
    sortable: false,
  },
  {
    title: "Ações",
    dataIndex: "id",
    key: "actions",
    renderItem: (row: SettingModel) => (
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
      </div>
    ),
  },
];
