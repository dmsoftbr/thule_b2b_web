import { Button } from "@/components/ui/button";
import { ServerTable } from "@/components/server-table/server-table";
import { RefreshCcwIcon } from "lucide-react";
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

import type { ProductModel } from "@/models/product.model";
import { createProductsTableColumns } from "./table-columns";
import { ProductsService } from "@/services/registrations/products.service";
import { DetailsModal } from "./details-modal";

export const ProductsTable = () => {
  const [searchText, setSearchText] = useState("");
  const [tableData, setTableData] = useState<ProductModel[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchFieldId, setSearchFieldId] = useState("id");
  const [sortFieldId, setSortFieldId] = useState("id");
  const [sortDir, setSortDir] = useState("asc");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(8);
  const [currentData, setCurrentData] = useState<ProductModel | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const debouncedSearchText = useDebounceCallback(setSearchText, 500);
  const navigate = useNavigate();

  const columns = createProductsTableColumns({
    fnDetails: handleDetails,
  });

  async function getData() {
    const response = await ProductsService.listPaged({
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

  function handleDetails(data: ProductModel) {
    setCurrentData(data);
    //setShowDetails(true);
    navigate({ to: `/registrations/products/${data.id}` });
  }

  useEffect(() => {
    getData();
  }, [searchText, searchFieldId, sortDir, sortFieldId, pageSize, currentPage]);

  return (
    <>
      <div className="p-2">
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
              <SelectItem value="abbreviation">Descrição</SelectItem>
            </SelectContent>
          </Select>
          <Input
            defaultValue={searchText}
            onChange={(e) => debouncedSearchText(e.target.value)}
            placeholder="Procurar"
            className="flex-1"
          />
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
          onRowDblClick={(row) => handleDetails(row)}
          keyExtractor={function (item: ProductModel): string | number {
            return item.id;
          }}
        />
      </div>
      {showDetails && currentData && (
        <DetailsModal
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
};
