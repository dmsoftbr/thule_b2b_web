import { ServerTable } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, RefreshCcwIcon } from "lucide-react";
import { useGetUsersPaged } from "../-hooks/use-get-users-paged";
import { columns } from "./columns";

import type { UserModel } from "@/models/user.model";
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

export const UsersTable = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchText, setSearchText] = useState("");
  const [searchField, setSearchField] = useState("id");
  const [sortDir, setSortDir] = useState("");
  const [sortField, setSortField] = useState("id");

  const queryClient = useQueryClient();

  const { isLoading, isError, data } = useGetUsersPaged({
    currentPage,
    pageSize,
    search: searchText,
    searchField,
    sortDir,
    sortField,
  });

  function onAddUser() {
    navigate({ to: "/admin/users/new-user" });
  }

  if (isError) {
    return <div>Erro ao obter usuários</div>;
  }

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["users-paged"] });
  }, [currentPage, pageSize, searchText, searchField, sortDir, sortField]);

  return (
    <div>
      <div className="flex items-center gap-x-1 mb-2">
        <Button size="sm" variant="blue" className="h-9" onClick={() => {}}>
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
            <SelectItem value="id">Usuário</SelectItem>
            <SelectItem value="cliente">Nome</SelectItem>
            <SelectItem value="cliente">E-mail</SelectItem>
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
          onClick={() => onAddUser()}
          className="h-9"
        >
          <PlusIcon className="size-4" /> Novo Usuário
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
        columns={columns}
        data={data?.result || []}
        pagination={{ defaultPageSize: 8, pageSizeOptions: [8, 16, 32] }}
        totalItems={data?.totalRecords ?? 0}
        tdClassName="text-xs"
        keyExtractor={function (item: UserModel): string {
          return item.id;
        }}
      />
    </div>
  );
};
