import React, { useState, useMemo, useCallback, useRef, type JSX } from "react";
import {
  ChevronUp,
  ChevronDown,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useVirtualization } from "@/hooks/use-virtualization";
import { cn } from "@/lib/utils";

export interface VirtualTableColumn<T> {
  key: string;
  header: string;
  accessor: (row: T) => any;
  render?: (row: T) => React.ReactNode;
  footer?: (data: T[]) => JSX.Element;
  width?: number | string;
  sortable?: boolean;
}

interface VirtualTableProps<T> {
  data: Array<T>;
  columns: VirtualTableColumn<T>[];
  pageSize: number;
  searchable: boolean;
  sortable: boolean;
  paginated: boolean;
  virtualized: boolean;
  rowHeight: number;
  showFooter: boolean;
  loading: boolean;
  borderStyle: "horizontal" | "vertical" | "both" | "none";
  cellClassName?: string;
  containerHeight?: number | string;
}

// Componente DataTable otimizado para grandes volumes
export const VirtualTable = <T,>({
  data = [],
  columns = [],
  pageSize = 50,
  searchable = true,
  sortable = true,
  paginated = true,
  virtualized = false,
  rowHeight = 53,
  showFooter = false,
  loading = false,
  borderStyle = "horizontal",
  containerHeight = virtualized ? 600 : "auto",
  cellClassName, // 'horizontal' | 'vertical' | 'both' | 'none'
}: VirtualTableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const scrollContainerRef = useRef(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Gera o template de grid baseado nas larguras das colunas
  const gridTemplate = columns.map((col) => col.width || "1fr").join(" ");

  // Classes de borda baseadas no estilo
  const getBorderClasses = () => {
    const verticalBorder =
      borderStyle === "vertical" || borderStyle === "both"
        ? "border-r border-gray-300 last:border-r-0"
        : "";
    const horizontalBorder =
      borderStyle === "horizontal" || borderStyle === "both"
        ? "border-b border-gray-200"
        : "";

    return { verticalBorder, horizontalBorder };
  };

  const { verticalBorder, horizontalBorder } = getBorderClasses();

  // Filtragem com useMemo e debounce implícito
  const filteredData = useMemo(() => {
    if (!searchable || !searchTerm) return data;

    const lowerSearch = searchTerm.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        const value = col.accessor(row);
        return String(value).toLowerCase().includes(lowerSearch);
      }),
    );
  }, [data, searchTerm, columns, searchable]);

  // Ordenação otimizada
  const sortedData = useMemo(() => {
    if (!columns.length) throw new Error("Tabela sem colunas!!");
    if (!sortable || !sortConfig.key) return filteredData;

    const col = columns.find((c) => c.key === sortConfig.key);
    if (!col)
      throw new Error(
        `Coluna com key [${sortConfig.key}] é inválida p/ordenação`,
      );
    const sorted = [...filteredData].sort((a, b) => {
      const aVal = col.accessor(a);
      const bVal = col.accessor(b);

      if (aVal === bVal) return 0;

      let comparison;
      if (aVal == null && bVal == null) {
        comparison = 0;
      } else if (aVal == null) {
        comparison = -1; // Place null/undefined values before defined values
      } else if (bVal == null) {
        comparison = 1; // Place defined values after null/undefined values
      } else {
        // Both aVal and bVal are guaranteed not to be null or undefined.
        // Convert them to strings for consistent comparison across different types.
        const strA = String(aVal);
        const strB = String(bVal);
        comparison = strA < strB ? -1 : strA > strB ? 1 : 0;
      }
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [filteredData, sortConfig, columns, sortable]);

  // Dados para renderizar (paginados ou virtualizados)

  const virtual = useVirtualization(
    sortedData.length,
    rowHeight,
    typeof containerHeight === "number" ? containerHeight : 600,
  );

  const displayData = useMemo(() => {
    if (virtualized) {
      return sortedData.slice(virtual.visibleStart, virtual.visibleEnd);
    }

    if (!paginated) return sortedData;

    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [
    sortedData,
    virtualized,
    paginated,
    currentPage,
    pageSize,
    virtual.visibleStart,
    virtual.visibleEnd,
  ]);

  // Cálculo dos totais do footer
  const footerTotals = useMemo(() => {
    if (!showFooter) return null;

    return columns.map((col) => {
      if (col.footer && typeof col.footer === "function") {
        return {
          key: col.key,
          value: col.footer(sortedData),
        };
      }
      return { key: col.key, value: null };
    });
  }, [showFooter, columns, sortedData]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Handler de busca com debounce
  const handleSearch = useCallback((e: any) => {
    const value = e.target.value;

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setSearchTerm(value);
      setCurrentPage(1);
    }, 300);
  }, []);

  const handleSort = useCallback(
    (key: any) => {
      if (!sortable) return;

      setSortConfig((prev) => ({
        key,
        direction:
          prev.key === key && prev.direction === "asc" ? "desc" : "asc",
      }));
    },
    [sortable],
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleScroll = useCallback(
    (e: any) => {
      if (virtualized) {
        virtual.setScrollTop(e.target.scrollTop);
      }
    },
    [virtualized, virtual],
  );

  return (
    <div className="w-full space-y-4 relative">
      {/* Informações e busca */}
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm text-gray-600">
          <strong>{sortedData.length.toLocaleString()}</strong> registros
          {searchTerm && ` (filtrados de ${data.length.toLocaleString()})`}
        </div>

        {searchable && (
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              onChange={handleSearch}
              disabled={loading}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        )}
      </div>

      {/* Tabela usando CSS Grid */}
      <div className="overflow-hidden border border-gray-200 rounded-lg relative">
        {/* Overlay de loading */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-medium text-gray-700">
                Carregando dados...
              </p>
            </div>
          </div>
        )}

        {/* Header fixo */}
        <div
          className="grid bg-gray-50 sticky top-0 z-10"
          style={{ gridTemplateColumns: gridTemplate }}
        >
          {columns.map((col) => (
            <div
              key={col.key}
              onClick={() => col.sortable !== false && handleSort(col.key)}
              className={`px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider ${
                sortable && col.sortable !== false
                  ? "cursor-pointer hover:bg-gray-100"
                  : ""
              } ${verticalBorder}`}
            >
              <div className="flex items-center gap-2">
                {col.header}
                {sortable &&
                  col.sortable !== false &&
                  sortConfig.key === col.key &&
                  (sortConfig.direction === "asc" ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Container com scroll */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="overflow-auto"
          style={{
            maxHeight: virtualized ? containerHeight : "500px",
          }}
        >
          {!virtualized ? (
            /* Modo paginado */
            <div className="bg-white">
              {displayData.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  Nenhum resultado encontrado
                </div>
              ) : (
                displayData.map((row, idx) => (
                  <div
                    key={idx}
                    className={`grid hover:bg-gray-50 ${horizontalBorder}`}
                    style={{ gridTemplateColumns: gridTemplate }}
                  >
                    {columns.map((col) => (
                      <div
                        key={col.key}
                        className={`px-6 py-4 text-sm text-gray-900 ${verticalBorder}`}
                      >
                        <div className="overflow-hidden text-ellipsis">
                          {col.render ? col.render(row) : col.accessor(row)}
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          ) : (
            /* Modo virtualizado */
            <div
              style={{ height: virtual.totalHeight, position: "relative" }}
              className="bg-white"
            >
              <div
                style={{
                  transform: `translateY(${virtual.offsetY}px)`,
                  position: "absolute",
                  width: "100%",
                  top: 0,
                }}
              >
                {displayData.map((row, idx) => (
                  <div
                    key={virtual.visibleStart + idx}
                    className={`grid hover:bg-gray-50 ${horizontalBorder}`}
                    style={{
                      gridTemplateColumns: gridTemplate,
                      height: rowHeight,
                    }}
                  >
                    {columns.map((col) => (
                      <div
                        key={col.key}
                        className={cn(
                          "px-6 py-4 text-sm text-gray-900 flex items-center",
                          verticalBorder,
                          cellClassName,
                        )}
                      >
                        <div className="overflow-hidden text-ellipsis">
                          {col.render ? col.render(row) : col.accessor(row)}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer fixo */}
        {showFooter && footerTotals && (
          <div
            className="grid bg-gray-50 sticky bottom-0 border-t-2 border-gray-300 z-10"
            style={{ gridTemplateColumns: gridTemplate }}
          >
            {footerTotals.map((total) => (
              <div
                key={total.key}
                className={`px-6 py-4 text-sm font-semibold text-gray-900 ${verticalBorder}`}
              >
                {total.value !== null ? total.value : ""}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Paginação */}
      {paginated && !virtualized && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando {(currentPage - 1) * pageSize + 1} até{" "}
            {Math.min(currentPage * pageSize, sortedData.length)} de{" "}
            {sortedData.length} resultados
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {[...Array(Math.min(totalPages, 7))].map((_, i) => {
              let page;
              if (totalPages <= 7) {
                page = i + 1;
              } else if (currentPage <= 4) {
                page = i + 1;
              } else if (currentPage >= totalPages - 3) {
                page = totalPages - 6 + i;
              } else {
                page = currentPage - 3 + i;
              }

              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 border rounded-md ${
                    currentPage === page
                      ? "bg-blue-500 text-white border-blue-500"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
