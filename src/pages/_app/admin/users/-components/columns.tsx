import type { ServerTableColumn } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUserRoleName } from "@/lib/user-role-utils";
import type { UserModel } from "@/models/user.model";
import { MenuIcon, SearchIcon } from "lucide-react";

export const columns: ServerTableColumn<UserModel>[] = [
  {
    id: "id",
    dataKey: "id",
    header: "Usuário",
    render: (user) => (
      <span className="font-semibold text-blue-600 ">{user.id}</span>
    ),
    sortable: true,
  },
  {
    id: "name",
    dataKey: "name",
    header: "Nome",
    render: (user) => <span>{user.name}</span>,
    sortable: true,
  },
  {
    id: "email",
    dataKey: "email",
    header: "E-mail",
    render: (user) => <span>{user.email}</span>,
    sortable: true,
  },
  {
    id: "groupId",
    dataKey: "groupId",
    header: "Grupo",
    render: (user) => <span>{user.groupId}</span>,
    sortable: true,
  },
  {
    id: "role",
    dataKey: "role",
    header: "Perfil",
    render: (user) => (
      <div className="text-center">{getUserRoleName(user.role)}</div>
    ),
    sortable: true,
  },
  {
    id: "id",
    dataKey: "id",
    header: "Ações",
    render: (order) => (
      <div className="flex justify-end">
        <Button onClick={() => handleView(order)} variant="secondary" size="sm">
          <SearchIcon className="size-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="secondary">
              <MenuIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Duplicar</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Alterar Senha</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];

function handleView(user: UserModel) {
  console.log(user);
}
