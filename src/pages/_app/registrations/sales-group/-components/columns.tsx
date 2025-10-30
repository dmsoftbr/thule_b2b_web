import type { ServerTableColumn } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SalesGroupModel } from "@/models/registrations/sales-group.model";
import { EditIcon, ListChecksIcon, MenuIcon, TrashIcon } from "lucide-react";

interface Props {
  fnEdit: (data: SalesGroupModel) => void;
  fnDelete: (data: SalesGroupModel) => void;
  fnDetails: (data: SalesGroupModel) => void;
}

export const columns = ({
  fnEdit,
  fnDelete,
  fnDetails,
}: Props): ServerTableColumn[] => [
  {
    key: "id",
    dataIndex: "id",
    title: "Código",
    renderItem: (group: any) => (
      <span className="font-semibold text-blue-600 ">{group.id}</span>
    ),
    sortable: true,
  },
  {
    key: "name",
    dataIndex: "name",
    title: "Nome",
    renderItem: (group: any) => <span>{group.name}</span>,
    sortable: true,
  },

  {
    key: "actions",
    dataIndex: "id",
    title: "Ações",
    className: "w-[120px]",
    renderItem: (group: any) => (
      <div className="flex">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="secondary">
              <MenuIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="">
            <DropdownMenuItem onClick={() => fnEdit(group)}>
              <EditIcon className="size-4" />
              Alterar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => fnDelete(group)}>
              <TrashIcon className="size-4" />
              Excluir
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => fnDetails(group)}>
              <ListChecksIcon className="size-4" />
              Detalhe
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
