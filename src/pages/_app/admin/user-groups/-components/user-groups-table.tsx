import { ServerTable } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, RefreshCcwIcon } from "lucide-react";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { columns } from "./columns";
import { useGetUserGroupsPaged } from "../-hooks/use-get-user-groups-paged";
import type { UserGroupModel } from "@/models/user-group.model";
import { useAppDialog } from "@/components/app-dialog/use-app-dialog";
import { UserGroupsService } from "@/services/security/user-groups.service";

export const UserGroupsTable = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchText, setSearchText] = useState("");
  const [searchField, setSearchField] = useState("id");
  const [sortDir, setSortDir] = useState("");
  const [sortField, setSortField] = useState("id");

  const queryClient = useQueryClient();
  const { showAppDialog } = useAppDialog();

  const { isLoading, isError, data } = useGetUserGroupsPaged({
    currentPage,
    pageSize,
    search: searchText,
    searchField,
    sortDir,
    sortField,
  });

  function refreshData() {
    queryClient.invalidateQueries({ queryKey: ["user-groups-paged"] });
  }

  function onAddGroup() {
    navigate({ to: "/admin/user-groups/new-group" });
  }

  if (isError) {
    return <div>Erro ao obter grupos de Usuários</div>;
  }

  useEffect(() => {
    refreshData();
  }, [currentPage, pageSize, searchText, searchField, sortDir, sortField]);

  function onEdit(group: UserGroupModel) {
    navigate({ to: `/admin/user-groups/${group.id}` });
  }

  async function onDelete(group: UserGroupModel) {
    const confirmed = await showAppDialog({
      type: "confirm",
      message: "Excluir este Grupo?",
      title: "Atenção",
      buttons: [
        { text: "Sim", value: true, variant: "primary" },
        { text: "Não", value: false, variant: "secondary" },
      ],
    });

    if (confirmed) {
      const service = new UserGroupsService();
      await service.delete(group.id);
      refreshData();
    }
  }

  return (
    <div>
      <div className="flex items-center gap-x-1 mb-2">
        <Button
          size="sm"
          variant="blue"
          className="h-9"
          onClick={() => {
            refreshData();
          }}
        >
          <RefreshCcwIcon className="size-4" />
        </Button>
        <Select
          defaultValue={searchField}
          onValueChange={(e) => setSearchField(e)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar Campo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="id">Código</SelectItem>
            <SelectItem value="name">Nome</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Procurar"
          className="flex-1"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button
          size="sm"
          variant="default"
          onClick={() => onAddGroup()}
          className="h-9"
        >
          <PlusIcon className="size-4" /> Novo Grupo
        </Button>
      </div>

      <ServerTable
        onPageChange={(page) => setCurrentPage(page)}
        onPageSizeChange={(pageSize) => setPageSize(pageSize)}
        onSort={(col, dir) => {
          setSortDir(dir == "asc" ? "" : "desc");
          setSortField(col);
        }}
        loading={isLoading}
        columns={columns({
          onEdit: (group) => onEdit(group),
          onDelete: (group) => onDelete(group),
        })}
        data={data?.result || []}
        pagination={{ defaultPageSize: 8, pageSizeOptions: [8, 16, 32] }}
        totalItems={data?.totalRecords ?? 0}
        tdClassName="text-xs"
        keyExtractor={function (item: UserGroupModel): string {
          return item.id;
        }}
      />
    </div>
  );
};
