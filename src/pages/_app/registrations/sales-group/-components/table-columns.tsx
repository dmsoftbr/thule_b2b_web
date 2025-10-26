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
import { MenuIcon } from "lucide-react";

interface Props {
  fnEdit: (data: SalesGroupModel) => void;
  fnDelete: (data: SalesGroupModel) => void;
  fnDetails: (data: SalesGroupModel) => void;
}

export const createSalesGroupTableColumns = ({
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
    key: "id",
    dataIndex: "id",
    title: "Ações",
    renderItem: (group: any) => (
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="secondary">
              <MenuIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="">
            <DropdownMenuItem onClick={() => fnEdit(group)}>
              Alterar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => fnDelete(group)}>
              Excluir
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => fnDetails(group)}>
              Detalhe
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
