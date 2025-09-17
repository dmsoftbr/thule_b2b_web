import type { ServerTableColumn } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UserGroupModel } from "@/models/user-group.model";
import { MenuIcon } from "lucide-react";

interface Props {
  onEdit: (data: UserGroupModel) => void;
  onDelete: (data: UserGroupModel) => void;
}

export const columns = ({
  onEdit,
  onDelete,
}: Props): ServerTableColumn<UserGroupModel>[] => [
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="secondary">
              <MenuIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onEdit(group)}>
              Alterar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(group)}>
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
