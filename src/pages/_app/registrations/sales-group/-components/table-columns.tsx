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
import { CopyIcon, MenuIcon, SearchIcon, TrashIcon } from "lucide-react";

interface Props {
  fnView: (order: SalesGroupModel) => void;
}

export const createSalesGroupTableColumns = ({
  fnView,
}: Props): ServerTableColumn<SalesGroupModel>[] => [
  {
    id: "id",
    dataKey: "id",
    header: "Código",
    render: (group) => (
      <span className="font-semibold text-blue-600 ">{group.id}</span>
    ),
    sortable: true,
  },
  {
    id: "name",
    dataKey: "name",
    header: "Nome",
    render: (group) => <span>{group.name}</span>,
    sortable: true,
  },

  {
    id: "id",
    dataKey: "id",
    header: "Ações",
    render: (group) => (
      <div className="flex justify-end">
        <Button onClick={() => fnView(group)} variant="secondary" size="sm">
          <SearchIcon className="size-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="secondary">
              <MenuIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="">
            <DropdownMenuItem>
              <CopyIcon className="size-4" />
              Duplicar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <TrashIcon className="size-4 text-red-500" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
