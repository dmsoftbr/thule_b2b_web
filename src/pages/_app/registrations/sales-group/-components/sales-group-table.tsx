import { Button } from "@/components/ui/button";
import { ServerTable } from "@/components/server-table/server-table";
import { PlusIcon, RefreshCcwIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounceCallback } from "usehooks-ts";
import { createSalesGroupTableColumns } from "./table-columns";
import type { SalesGroupModel } from "@/models/registrations/sales-group.model";
import { SalesGroupsService } from "@/services/registrations/sales-group.service";

export const SalesGroupTable = () => {
  const [searchText, setSearchText] = useState("");
  const [tableData, setTableData] = useState<SalesGroupModel[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchFieldId, setSearchFieldId] = useState("id");
  const [sortFieldId, setSortFieldId] = useState("id");
  const [sortDir, setSortDir] = useState("asc");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(8);

  const debouncedSearchText = useDebounceCallback(setSearchText, 500);
  const navigate = useNavigate();

  const onAddGroup = () => {
    navigate({ to: "/registrations/sales-group/new-group" });
  };

  const handleView = (order: SalesGroupModel) => {
    console.log(order);
  };

  const columns = createSalesGroupTableColumns({ fnView: handleView });

  async function getData() {
    const response = await SalesGroupsService.listPaged({
      search: searchText,
      searchField: searchFieldId,
      sortDir,
      sortField: sortFieldId,
      currentPage,
      pageSize,
    });
    setTableData(response.result);
    setTotalRecords(response.totalRecords);
  }

  useEffect(() => {
    getData();
  }, [searchText, searchFieldId, sortDir, sortFieldId, pageSize, currentPage]);

  return (
    <div className="">
      <div className="flex items-center gap-x-1 mb-2">
        <Button
          size="sm"
          variant="blue"
          className="h-9"
          onClick={() => getData()}
        >
          <RefreshCcwIcon className="size-4" />
        </Button>
        <Select
          defaultValue={searchFieldId}
          onValueChange={(value) => setSearchFieldId(value)}
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
          defaultValue={searchText}
          onChange={(e) => debouncedSearchText(e.target.value)}
          placeholder="Procurar"
          className="flex-1"
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
        columns={columns}
        data={tableData}
        pagination={{ defaultPageSize: 8, pageSizeOptions: [8, 16, 32] }}
        totalItems={totalRecords}
        onPageChange={(newPage) => setCurrentPage(newPage)}
        onPageSizeChange={(newSize) => setPageSize(newSize)}
        onSort={(colId, dir) => {
          setSortFieldId(colId);
          setSortDir(dir == "asc" ? "asc" : "desc");
        }}
        tdClassName="text-xs"
        onRowDblClick={(row) => handleView(row)}
        keyExtractor={function (item: SalesGroupModel): string | number {
          return item.id;
        }}
      />
    </div>
  );
};
