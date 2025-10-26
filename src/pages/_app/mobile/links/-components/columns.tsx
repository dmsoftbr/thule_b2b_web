import type { ServerTableColumn } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import type { MobileLinkModel } from "@/models/mobile/link.model";
import { EditIcon, TrashIcon } from "lucide-react";

interface Props {
  fnEdit: (data: MobileLinkModel) => void;
  fnDelete: (data: MobileLinkModel) => void;
}

export const columns = ({ fnEdit, fnDelete }: Props): ServerTableColumn[] => [
  {
    title: "Código",
    dataIndex: "id",
    key: "id",
    sortable: true,
    renderItem: (item: MobileLinkModel) => {
      return <span className="text-blue-600 font-semibold">{item.id}</span>;
    },
  },
  {
    title: "Título",
    dataIndex: "title",
    key: "title",
    sortable: true,
  },
  {
    title: "Endereço (URL)",
    dataIndex: "linkUrl",
    key: "linkUrl",
    sortable: false,
    renderItem: (item: MobileLinkModel) => (
      <span className="text-xs">{item.linkUrl}</span>
    ),
  },
  {
    title: "Ações",
    dataIndex: "id",
    key: "actions",
    renderItem: (row: MobileLinkModel) => (
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
