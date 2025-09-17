import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowDownNarrowWideIcon,
  ArrowUpWideNarrowIcon,
  LoaderCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Tipos
export type ServerTableSortDirection = "asc" | "desc" | null;

export interface ServerTableColumn<T> {
  id: string;
  header: string;
  dataKey: string;
  render: (row: T) => React.ReactNode;
  sortable?: boolean;
}

export interface ServerTablePaginationOptions {
  noPagination?: boolean;
  pageSizeOptions: number[];
  defaultPageSize: number;
}

export interface ServerTableSearchFields {
  value: string;
  label: string;
  default?: boolean;
}

export interface ServerTableDefaultSortField {
  dataKey: string;
  direction: "ASC" | "DESC";
}

export interface ServerTableProps<T> {
  columns: ServerTableColumn<T>[];
  data: T[];
  totalItems: number;
  loading?: boolean;
  pagination?: ServerTablePaginationOptions;
  fixedHeight?: string;
  sortField?: ServerTableDefaultSortField;
  responsive?: boolean;
  enableRowSelection?: boolean;
  tdClassName?: string;
  thClassName?: string;
  keyExtractor: (item: T) => string | number;
  onSort?: (columnId: string, direction: ServerTableSortDirection) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onRowsSelected?: (selectedRows: T[]) => void;
  onRowDblClick?: (row: T) => void;
}

export function ServerTable<T>({
  columns,
  data,
  totalItems,
  loading = false,
  pagination = { pageSizeOptions: [10, 25, 50, 100], defaultPageSize: 10 },
  fixedHeight,
  enableRowSelection = false,
  responsive = true,
  tdClassName,
  thClassName,
  keyExtractor,
  onSort,
  onPageChange,
  onPageSizeChange,
  onRowsSelected,
  onRowDblClick,
}: ServerTableProps<T>) {
  // Estados
  const [sortedColumn, setSortedColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] =
    useState<ServerTableSortDirection>(null);
  const [pageSize, setPageSize] = useState(pagination.defaultPageSize);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [currentRow, setCurrentRow] = useState<T | null>(null);
  const [page, setPage] = useState(1);

  // Verifica a largura da tela
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // Calcula o número total de páginas
  const totalPages = Math.ceil(totalItems / pageSize);

  // Manipuladores de eventos
  const handleSort = (columnId: string) => {
    let newDirection: ServerTableSortDirection = "asc";

    if (sortedColumn === columnId) {
      if (sortDirection === "asc") {
        newDirection = "desc";
      } else if (sortDirection === "desc") {
        newDirection = null;
      }
    }

    setSortedColumn(columnId);
    setSortDirection(newDirection);

    if (onSort) {
      onSort(columnId, newDirection);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);

    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newPageSize = parseInt(event.target.value, 10);
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size

    if (onPageSizeChange) {
      onPageSizeChange(newPageSize);
    }
  };

  const handleRowSelection = (row: T) => {
    let newSelectedRows: T[];

    if (
      selectedRows.some(
        (selectedRow) => keyExtractor(selectedRow) === keyExtractor(row)
      )
    ) {
      newSelectedRows = selectedRows.filter(
        (selectedRow) => keyExtractor(selectedRow) !== keyExtractor(row)
      );
    } else {
      newSelectedRows = [...selectedRows, row];
    }

    setSelectedRows(newSelectedRows);

    if (onRowsSelected) {
      onRowsSelected(newSelectedRows);
    }
  };

  const toggleAllRows = () => {
    const newSelectedRows =
      selectedRows.length === data.length ? [] : [...data];
    setSelectedRows(newSelectedRows);

    if (onRowsSelected) {
      onRowsSelected(newSelectedRows);
    }
  };

  // Renderização condicional baseada no modo de visualização (desktop ou mobile)
  return (
    <div className="w-full overflow-hidden bg-white rounded-md shadow">
      {/* Indicador de carregamento */}
      {loading && (
        <div className="flex justify-center items-center p-8">
          <LoaderCircle className="animate-spin text-blue-600" />
        </div>
      )}

      {/* Tabela (para desktop) */}
      {!isMobile || !responsive ? (
        <div
          className={`w-full overflow-x-auto ${
            fixedHeight ? "overflow-y-auto" : ""
          }`}
          style={fixedHeight ? { height: fixedHeight } : {}}
        >
          <table className="min-w-full table-fixed">
            <thead
              className={`bg-gray-200 ${fixedHeight ? "sticky top-0" : ""}`}
            >
              <tr>
                {enableRowSelection && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={
                        selectedRows.length === data.length && data.length > 0
                      }
                      onChange={toggleAllRows}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                )}

                {columns.map((column, index) => (
                  <th
                    key={`${column.id}_${index}`}
                    className={cn(
                      "px-2 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider border border-neutral-300 relative h-fit",
                      column.sortable && "hover:bg-gray-300 cursor-pointer",
                      thClassName
                    )}
                  >
                    <div
                      className="flex items-center gap-2 select-none"
                      onClick={() => {
                        if (!column.sortable) return;
                        handleSort(column.id);
                      }}
                    >
                      {column.header}

                      {column.sortable && (
                        <div>
                          {sortedColumn === column.id &&
                            sortDirection === "asc" && (
                              <ArrowDownNarrowWideIcon className="size-4" />
                            )}
                          {sortedColumn === column.id &&
                            sortDirection === "desc" && (
                              <ArrowUpWideNarrowIcon
                                size={12}
                                className="size-4"
                              />
                            )}
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {data.length > 0 ? (
                data.map((row) => (
                  <tr
                    key={keyExtractor(row)}
                    className={cn(
                      "hover:bg-gray-100 even:bg-gray-50",
                      currentRow === row ? "!bg-blue-200" : ""
                    )}
                    onClick={() => {
                      setCurrentRow(row);
                    }}
                    onDoubleClick={(e) => {
                      e.preventDefault();
                      onRowDblClick?.(row);
                    }}
                  >
                    {enableRowSelection && (
                      <td className="px-6 py-2 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedRows.some(
                            (selectedRow) =>
                              keyExtractor(selectedRow) === keyExtractor(row)
                          )}
                          onChange={() => handleRowSelection(row)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                    )}

                    {columns.map((column, index) => (
                      <td
                        key={`${column.dataKey}_${index}`}
                        className={cn(
                          "px-2 py-2 whitespace-nowrap border relative h-fit",
                          tdClassName
                        )}
                      >
                        {column.render(row)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={
                      enableRowSelection ? columns.length + 1 : columns.length
                    }
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Nenhum resultado encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        // Visualização de cards para dispositivos móveis
        <div className="divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((row) => (
              <div key={keyExtractor(row)} className="p-4 hover:bg-gray-50">
                {enableRowSelection && (
                  <div className="mb-2">
                    <input
                      type="checkbox"
                      checked={selectedRows.some(
                        (selectedRow) =>
                          keyExtractor(selectedRow) === keyExtractor(row)
                      )}
                      onChange={() => handleRowSelection(row)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                )}

                {columns.map((column) => (
                  <div key={column.dataKey} className="py-2">
                    <div className="text-xs font-medium text-gray-500 uppercase">
                      {column.header}
                    </div>
                    <div>{column.render(row)}</div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              Nenhum resultado encontrado
            </div>
          )}
        </div>
      )}

      {/* Paginação */}

      {!pagination.noPagination && (
        <div className="flex flex-col md:flex-row items-center justify-between p-4 border-t">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Exibindo {Math.min((page - 1) * pageSize + 1, totalItems)} -{" "}
              {Math.min(page * pageSize, totalItems)} de {totalItems}
            </span>

            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="px-2 py-1 text-sm border rounded-md"
            >
              {pagination.pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size} por página
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4 md:mb-0 text-sm text-gray-600">
            Página {page} de {totalPages || 1}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={page === 1}
              className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsLeft size={16} />
            </button>

            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex items-center gap-1">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNumber;

                // Lógica para mostrar 5 números de página em torno da página atual
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (page <= 3) {
                  pageNumber = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = page - 2 + i;
                }

                return (
                  <button
                    key={i}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`
                    w-8 h-8 flex items-center justify-center rounded-md text-sm
                    ${
                      page === pageNumber
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }
                  `}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>

            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={page === totalPages}
              className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
