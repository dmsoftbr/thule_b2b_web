import type { ServerTableColumn } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PriceExceptionTableModel } from "@/models/registrations/price-exception-table.model";
import { ListChecksIcon, MenuIcon, TrashIcon } from "lucide-react";

interface Props {
  fnConfigure: (data: PriceExceptionTableModel) => void;
  fnDelete: (data: PriceExceptionTableModel) => void;
}

export const columns = ({
  fnConfigure,
  fnDelete,
}: Props): ServerTableColumn[] => [
  {
    key: "id",
    dataIndex: "id",
    title: "Código",
    renderItem: (row: any) => (
      <span className="font-semibold text-blue-600 ">{row.id}</span>
    ),
    sortable: true,
  },
  {
    key: "name",
    dataIndex: "name",
    title: "Nome",
    renderItem: (row: any) => <span>{row.name}</span>,
    sortable: true,
  },
  {
    key: "actions",
    dataIndex: "id",
    title: "Ações",
    className: "w-[120px]",
    renderItem: (row: any) => (
      <div className="flex">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="secondary">
              <MenuIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="">
            <DropdownMenuItem onClick={() => fnConfigure(row)}>
              <ListChecksIcon className="size-4" />
              Configurar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => fnDelete(row)}>
              <TrashIcon className="size-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
