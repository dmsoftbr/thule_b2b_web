import type { ServerTableColumn } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { UserModel } from "@/models/user.model";
import {
  EditIcon,
  LockKeyholeIcon,
  MoreHorizontalIcon,
  Settings2Icon,
  TrashIcon,
} from "lucide-react";

interface Props {
  fnEdit: (data: UserModel) => void;
  fnDelete: (data: UserModel) => void;
  fnPermissions: (data: UserModel) => void;
  fnChangePassword: (data: UserModel) => void;
}

export const columns = ({
  fnEdit,
  fnDelete,
  fnPermissions,
  fnChangePassword,
}: Props): ServerTableColumn[] => [
  {
    title: "Código",
    dataIndex: "id",
    key: "id",
    sortable: true,
    renderItem: (item: UserModel) => {
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
    title: "E-mail",
    dataIndex: "email",
    key: "email",
    sortable: true,
  },
  {
    title: "Grupo",
    dataIndex: "groupId",
    key: "groupId",
    sortable: true,
  },
  {
    title: "Ativo",
    dataIndex: "isActive",
    key: "isActive",
    sortable: false,
    renderItem: (row: UserModel) => (
      <span
        className={cn(
          row.isActive ? "bg-blue-600" : "bg-red-400",
          "text-white text-xs rounded-md p-1"
        )}
      >
        {row.isActive ? "Sim" : "Não"}
      </span>
    ),
  },
  {
    title: "Ações",
    dataIndex: "id",
    key: "actions",
    renderItem: (row: UserModel) => (
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
          type="button"
          variant="destructive"
          onClick={() => {
            fnDelete(row);
          }}
        >
          <TrashIcon className="size-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm">
              <MoreHorizontalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end">
            <DropdownMenuItem
              disabled={row.role == "0"}
              onClick={() => {
                fnPermissions(row);
              }}
            >
              <Settings2Icon className="size-4" />
              Permissões do Usuário
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                fnChangePassword(row);
              }}
            >
              <LockKeyholeIcon className="size-4" />
              Alterar a Senha
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
