import { AppTooltip } from "@/components/layout/app-tooltip";
import type { ServerTableColumn } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import type { UserModel } from "@/models/user.model";
import { EditIcon, LockIcon, Settings2Icon, TrashIcon } from "lucide-react";

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
        <AppTooltip message="Permissões do Usuário">
          <Button
            size="sm"
            type="button"
            variant="secondary"
            onClick={() => {
              fnPermissions(row);
            }}
          >
            <Settings2Icon className="size-4" />
          </Button>
        </AppTooltip>

        <AppTooltip message="Alterar a senha do Usuário">
          <Button
            size="sm"
            type="button"
            variant="secondary"
            onClick={() => {
              fnChangePassword(row);
            }}
          >
            <LockIcon className="size-4" />
          </Button>
        </AppTooltip>
      </div>
    ),
  },
];
