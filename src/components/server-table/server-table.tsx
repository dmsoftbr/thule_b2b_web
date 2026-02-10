import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  FilterIcon,
  Loader2Icon,
  RefreshCwIcon,
  SearchIcon,
  SortAscIcon,
  SortDescIcon,
} from "lucide-react";
import { type PagedResponseModel } from "@/models/dto/responses/paged-response.model";
import { AppTooltip } from "../layout/app-tooltip";
import { api } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useDebounceValue } from "usehooks-ts";
import React from "react";

export type ServerTableSearchField = {
  id: string;
  label: string;
  customWhere?: string;
};

export type ServerTableColumn = {
  title: string;
  dataIndex: string;
  key: string;
  className?: string;
  cellClassName?: string;
  renderItem?: (row: any) => React.ReactNode;
  sortable?: boolean;
};

export type ServerTableGroupConfig = {
  field: string;
  label?: string;
  renderGroupHeader?: (
    groupValue: any,
    items: any[],
    groupId?: any,
  ) => React.ReactNode;
  defaultExpanded?: boolean;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
  idField?: string;
  showEmptyGroups?: boolean;
  allPossibleGroups?: any[];
};

interface ServerTableProps<T> {
  items?: T[];
  searchAutoFocus?: boolean;
  tableId?: string;
  columns: ServerTableColumn[];
  dataUrl: string;
  dataMethod?: "GET" | "POST";
  showAddButton?: boolean;
  addButtonContent?: React.ReactNode;
  defaultSortFieldDataIndex?: string;
  defaultSortDesc?: boolean;
  defaultSearchField?: string;
  defaultPageSize?: number;
  searchFields: ServerTableSearchField[];
  isPending?: boolean;
  additionalInfo?: {};
  tableClassNames?: string;
  groupedBy?: string;
  showAdvancedFilter?: boolean;
  advancedFilterSlot?: React.ReactNode;
  groupConfig?: ServerTableGroupConfig;
  refreshDataToken?: string | number | Date | undefined;
  additionalButtons?: React.ReactNode | React.ReactNode[];
  searchSlot?: React.ReactNode | React.ReactNode[];
  searchPlaceHolder?: string;
  hideToolbar?: boolean;
  onAdd?: () => void;
  onAfterGetData?: (data: any) => void;
  rowCss?: (row: T) => string;
  onSelectRow?: (row: T) => void;
  onRowDblClick?: (row: T) => void;
}

type GroupedData<T> = {
  [key: string]: T[];
};

const DEBUG_GROUP_INFO = false;

export const ServerTable = <T,>({
  items,
  tableId,
  columns,
  searchAutoFocus,
  dataUrl,
  dataMethod = "POST",
  showAddButton = true,
  addButtonContent = "Adicionar",
  defaultSortFieldDataIndex,
  defaultSearchField,
  defaultSortDesc = false,
  defaultPageSize = 10,
  searchFields,
  isPending = false,
  showAdvancedFilter = false,
  advancedFilterSlot,
  searchSlot,
  additionalInfo = {},
  tableClassNames = "",
  refreshDataToken = "",
  additionalButtons,
  hideToolbar,
  searchPlaceHolder = "Pesquisar",
  rowCss = (_) => "",
  groupConfig,
  onAdd,
  onAfterGetData,
  onSelectRow,
  onRowDblClick,
}: ServerTableProps<T>) => {
  const [searchText, setSearchText] = useDebounceValue("", 300);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [searchField, setSearchField] = useState(defaultSearchField);
  const [customWhere, setCustomWhere] = useState("");
  const [sortField, setSortField] = useState(defaultSortFieldDataIndex);
  const [sortAsc, setSortAsc] = useState(!defaultSortDesc);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<PagedResponseModel<T>>();
  const [selectedItem, setSelectedItem] = useState<T | undefined>(undefined);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [showAdvancedFilterSlot, setShowAdvancedFilterSlot] = useState(false);

  // Função para acessar propriedades aninhadas usando notação de ponto
  const getNestedProperty = (obj: any, path: string) => {
    if (DEBUG_GROUP_INFO)
      console.log("getNestedProperty chamada:", { obj, path });
    const result = path.split(".").reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
    if (DEBUG_GROUP_INFO) console.log("getNestedProperty resultado:", result);
    return result;
  };

  // Função para agrupar dados
  const groupData = (items: T[]): GroupedData<T> => {
    // console.log("=== INICIO groupData ===", {
    //   field: groupConfig?.field,
    //   showEmptyGroups: groupConfig?.showEmptyGroups,
    //   hasAllPossibleGroups: !!groupConfig?.allPossibleGroups,
    //   allPossibleGroupsLength: groupConfig?.allPossibleGroups?.length,
    //   itemsLength: items?.length,
    //   allPossibleGroups: groupConfig?.allPossibleGroups,
    // });

    if (!groupConfig?.field) {
      //console.log("Saindo - sem field configurado");
      return {};
    }

    // Criar grupos baseado nos itens existentes
    const grouped = (items || []).reduce((acc, item) => {
      const groupValue =
        getNestedProperty(item, groupConfig.field) || "Sem Categoria";
      const groupKey = String(groupValue);

      //console.log("Processando item:", { item, groupValue, groupKey });

      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(item);

      return acc;
    }, {} as GroupedData<T>);

    //console.log("Grupos baseados nos itens existentes:", Object.keys(grouped));

    // Se deve mostrar grupos vazios e há uma lista de todos os grupos possíveis
    if (groupConfig.showEmptyGroups && groupConfig.allPossibleGroups) {
      //console.log("Processando grupos vazios...");

      groupConfig.allPossibleGroups.forEach((possibleGroup) => {
        const groupValue =
          getNestedProperty(possibleGroup, groupConfig.field) ||
          "Sem Categoria";
        const groupKey = String(groupValue);

        // Se o grupo não existe nos dados agrupados, criar um array vazio
        if (!grouped[groupKey]) {
          grouped[groupKey] = [];
          //console.log("Adicionado grupo vazio:", groupKey);
        }
      });

      //console.log("Grupos finais após adicionar vazios:", Object.keys(grouped));
    } else {
      if (DEBUG_GROUP_INFO)
        console.log("Não processando grupos vazios:", {
          showEmptyGroups: groupConfig.showEmptyGroups,
          hasAllPossibleGroups: !!groupConfig?.allPossibleGroups,
        });
    }

    //console.log("=== FIM groupData ===", grouped);
    return grouped;
  };

  // Função para ordenar grupos
  const getSortedGroupKeys = (groupedData: GroupedData<T>): string[] => {
    const groupKeys = Object.keys(groupedData);

    if (!groupConfig?.orderBy) {
      return groupKeys.sort();
    }

    return groupKeys.sort((keyA, keyB) => {
      const itemsA = groupedData[keyA];
      const itemsB = groupedData[keyB];

      let valueA, valueB;

      if (itemsA.length > 0) {
        valueA = getNestedProperty(itemsA[0], groupConfig.orderBy!);
      } else if (groupConfig.allPossibleGroups) {
        const possibleGroupA = groupConfig.allPossibleGroups.find((pg) => {
          const pgValue =
            getNestedProperty(pg, groupConfig.field) || "Sem Categoria";
          return String(pgValue) === keyA;
        });
        valueA = possibleGroupA
          ? getNestedProperty(possibleGroupA, groupConfig.orderBy!)
          : null;
      }

      if (itemsB.length > 0) {
        valueB = getNestedProperty(itemsB[0], groupConfig.orderBy!);
      } else if (groupConfig.allPossibleGroups) {
        const possibleGroupB = groupConfig.allPossibleGroups.find((pg) => {
          const pgValue =
            getNestedProperty(pg, groupConfig.field) || "Sem Categoria";
          return String(pgValue) === keyB;
        });
        valueB = possibleGroupB
          ? getNestedProperty(possibleGroupB, groupConfig.orderBy!)
          : null;
      }

      if (valueA === null && valueB === null) return keyA.localeCompare(keyB);
      if (valueA === null) return 1;
      if (valueB === null) return -1;

      if (typeof valueA === "number" && typeof valueB === "number") {
        const result = valueA - valueB;
        return groupConfig.orderDirection === "desc" ? -result : result;
      }

      const stringA = String(valueA).toLowerCase();
      const stringB = String(valueB).toLowerCase();

      if (stringA < stringB) {
        return groupConfig.orderDirection === "desc" ? 1 : -1;
      }
      if (stringA > stringB) {
        return groupConfig.orderDirection === "desc" ? -1 : 1;
      }

      return 0;
    });
  };

  // Função para alternar expansão do grupo
  const toggleGroupExpansion = (groupKey: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupKey)) {
        newSet.delete(groupKey);
      } else {
        newSet.add(groupKey);
      }
      return newSet;
    });
  };

  // Função para expandir/recolher todos os grupos
  const toggleAllGroups = (expand: boolean) => {
    if (expand && data?.result) {
      const groupedData = groupData(data.result);
      setExpandedGroups(new Set(Object.keys(groupedData)));
    } else {
      setExpandedGroups(new Set());
    }
  };

  // Inicializar grupos expandidos com base na configuração
  useEffect(() => {
    if (groupConfig?.defaultExpanded && data?.result) {
      const groupedData = groupData(data.result);
      setExpandedGroups(new Set(Object.keys(groupedData)));
    }
  }, [data, groupConfig]);

  const handleChangePage = (direction: "next" | "previous") => {
    let newPage = currentPage;
    if (direction == "next" && currentPage + 1 == totalPages) return;
    if (direction == "previous" && currentPage == 0) return;

    if (direction == "next") newPage++;

    if (direction == "previous") newPage--;

    setCurrentPage(newPage);
  };

  const handleGetData = async () => {
    try {
      setIsLoading(true);
      if (!dataUrl) {
        setData({
          result: [],
          totalRecords: 0,
        });

        if (items) {
          setData({
            result: items,
            totalRecords: items.length,
          });
        }

        onAfterGetData?.([]);
        return;
      }
      if (dataMethod == "POST") {
        let { data: serverData } = await api.post<PagedResponseModel<T>>(
          dataUrl,
          {
            currentPage,
            pageSize,
            searchField,
            searchText,
            sortField,
            sortAsc,
            customWhere,
            ...additionalInfo,
          },
        );

        if (Array.isArray(serverData)) {
          serverData = { result: serverData, totalRecords: serverData.length };
        }

        if (serverData.result == null) serverData.result = [];
        setData(serverData);
        onAfterGetData?.(serverData.result);
        // set pages
        if (pageSize > 0) {
          setTotalPages(Math.ceil(serverData.totalRecords / pageSize));
          if (serverData.totalRecords == 0) setTotalPages(1);
        } else {
          setTotalPages(1);
        }
      } else {
        const { data: serverData } =
          await api.get<PagedResponseModel<T>>(dataUrl);
        if (serverData.result == null) serverData.result = [];
        setData(serverData);
        onAfterGetData?.(serverData.result);
        // set pages
        if (pageSize > 0) {
          setTotalPages(Math.ceil(serverData.totalRecords / pageSize));
          if (serverData.totalRecords == 0) setTotalPages(1);
        } else {
          setTotalPages(1);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = () => {
    setCurrentPage(0);
    setTimeout(() => {}, 250);
    handleGetData();
  };

  useEffect(() => {
    handleFilter();
  }, [searchText]);

  useEffect(() => {
    handleGetData();
  }, [items, currentPage, pageSize, sortAsc, sortField, searchField]);

  useEffect(() => {
    setIsLoading(isPending);
  }, [isPending]);

  useEffect(() => {
    handleGetData();
  }, [refreshDataToken]);

  // Renderizar conteúdo da tabela (agrupado ou normal)
  const renderTableContent = () => {
    //console.log("renderTableContent chamada");

    if (!data?.result || data.result.length === 0) {
      if (groupConfig?.showEmptyGroups && groupConfig?.allPossibleGroups) {
        if (DEBUG_GROUP_INFO)
          console.log("Sem dados, mas tem grupos vazios para mostrar");
        const emptyGroupedData = groupData([]);
        const groupKeys = getSortedGroupKeys(emptyGroupedData);

        return groupKeys.map((groupKey) => {
          const groupItems = emptyGroupedData[groupKey];
          const isExpanded = expandedGroups.has(groupKey);

          return (
            <React.Fragment key={`empty-group-${groupKey}`}>
              <tr
                className="bg-neutral-200 hover:bg-neutral-300 cursor-pointer border-b-2 border-neutral-400"
                onClick={() => toggleGroupExpansion(groupKey)}
              >
                <td
                  colSpan={columns.length}
                  className="border px-2 py-3 font-semibold text-sm"
                >
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronDownIcon className="size-4 text-neutral-600" />
                    ) : (
                      <ChevronRightIcon className="size-4 text-neutral-600" />
                    )}
                    <>
                      {groupConfig.renderGroupHeader
                        ? groupConfig.renderGroupHeader(
                            groupKey,
                            groupItems,
                            groupConfig.idField && groupConfig.allPossibleGroups
                              ? (() => {
                                  const possibleGroup =
                                    groupConfig.allPossibleGroups!.find(
                                      (pg) => {
                                        const pgValue =
                                          getNestedProperty(
                                            pg,
                                            groupConfig.field,
                                          ) || "Sem Categoria";
                                        return String(pgValue) === groupKey;
                                      },
                                    );
                                  return possibleGroup
                                    ? getNestedProperty(
                                        possibleGroup,
                                        groupConfig.idField!,
                                      )
                                    : undefined;
                                })()
                              : undefined,
                          )
                        : `${
                            groupConfig.label || groupConfig.field
                          }: ${groupKey} (${groupItems.length})`}
                    </>
                  </div>
                </td>
              </tr>
            </React.Fragment>
          );
        });
      }

      return (
        <tr>
          <td className="text-center p-4 border" colSpan={columns.length}>
            Sem dados para exibir
          </td>
        </tr>
      );
    }

    if (!groupConfig?.field) {
      // Renderização normal (sem agrupamento)
      return data.result.map((row, rowIndex) => (
        <tr
          key={rowIndex}
          className={cn(
            "even:bg-neutral-100 hover:bg-neutral-50 cursor-pointer",
            selectedItem == row ? "!bg-primary/30 " : "",
            rowCss?.(row),
          )}
          onDoubleClick={(e) => {
            setSelectedItem(row);
            onRowDblClick?.(row);
            e.preventDefault();
          }}
          onClick={(e) => {
            setSelectedItem(row);
            onSelectRow?.(row);
            e.preventDefault();
          }}
        >
          {columns.map((column, index) => (
            <td
              className={cn(
                "border px-1.5 py-2 text-sm break-words break-all",
                column.cellClassName,
              )}
              key={index}
            >
              {column.renderItem
                ? column.renderItem(row)
                : (row as any)[column.dataIndex]}
            </td>
          ))}
        </tr>
      ));
    }

    // Renderização com agrupamento
    const groupedData = groupData(data.result);
    const groupKeys = getSortedGroupKeys(groupedData);

    return groupKeys.map((groupKey) => {
      const groupItems = groupedData[groupKey];
      const isExpanded = expandedGroups.has(groupKey);

      return (
        <React.Fragment key={`group-${groupKey}`}>
          {/* Linha do cabeçalho do grupo */}
          <tr
            className="bg-neutral-200 hover:bg-neutral-300 cursor-pointer border-b-2 border-neutral-400"
            onClick={() => toggleGroupExpansion(groupKey)}
          >
            <td
              colSpan={columns.length}
              className="border px-2 py-3 font-semibold text-sm"
            >
              <div className="flex items-center gap-2">
                {isExpanded ? (
                  <ChevronDownIcon className="size-4 text-neutral-600" />
                ) : (
                  <ChevronRightIcon className="size-4 text-neutral-600" />
                )}
                <span className="w-full">
                  {groupConfig.renderGroupHeader
                    ? groupConfig.renderGroupHeader(
                        groupKey,
                        groupItems,
                        groupItems.length > 0
                          ? groupConfig.idField
                            ? getNestedProperty(
                                groupItems[0],
                                groupConfig.idField,
                              )
                            : undefined
                          : groupConfig.allPossibleGroups && groupConfig.idField
                            ? (() => {
                                const possibleGroup =
                                  groupConfig.allPossibleGroups!.find((pg) => {
                                    const pgValue =
                                      getNestedProperty(
                                        pg,
                                        groupConfig.field,
                                      ) || "Sem Categoria";
                                    return String(pgValue) === groupKey;
                                  });
                                return possibleGroup
                                  ? getNestedProperty(
                                      possibleGroup,
                                      groupConfig.idField!,
                                    )
                                  : undefined;
                              })()
                            : undefined,
                      )
                    : `${
                        groupConfig.label || groupConfig.field
                      }: ${groupKey} (${groupItems.length})`}
                </span>
              </div>
            </td>
          </tr>

          {/* Linhas dos itens do grupo (se expandido) */}
          {isExpanded &&
            groupItems.map((row, rowIndex) => (
              <tr
                key={`${groupKey}-${rowIndex}`}
                className={cn(
                  "even:bg-neutral-50 odd:bg-white hover:bg-neutral-100 cursor-pointer",
                  selectedItem == row ? "!bg-primary/30" : "",
                  rowCss?.(row),
                )}
                onClick={(e) => {
                  setSelectedItem(row);
                  e.preventDefault();
                }}
              >
                {columns.map((column, index) => (
                  <td
                    className={cn(
                      "border px-1.5 py-2 text-sm break-words break-all",
                      column.cellClassName,
                      index === 0 && "pl-8", // Indentação para mostrar hierarquia
                    )}
                    key={index}
                  >
                    {column.renderItem
                      ? column.renderItem(row)
                      : (row as any)[column.dataIndex]}
                  </td>
                ))}
              </tr>
            ))}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="w-full relative min-h-full">
      <div className={cn("flex flex-col w-full", hideToolbar && "hidden")}>
        <div className="flex flex-wrap md:flex-nowrap gap-y-1.5 items-center justify-between gap-x-2">
          <AppTooltip message="Atualizar Lista">
            <Button
              size="sm"
              className="h-9"
              type="button"
              onClick={handleGetData}
            >
              <RefreshCwIcon className="size-4" />
            </Button>
          </AppTooltip>

          {/* Botões de controle de agrupamento */}
          {groupConfig?.field &&
            ((data?.result && data.result.length > 0) ||
              groupConfig.allPossibleGroups) && (
              <div className="flex gap-1">
                <AppTooltip message="Expandir Todos">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 px-2"
                    type="button"
                    onClick={() => toggleAllGroups(true)}
                  >
                    <ChevronDownIcon className="size-4" />
                  </Button>
                </AppTooltip>
                <AppTooltip message="Recolher Todos">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 px-2"
                    type="button"
                    onClick={() => toggleAllGroups(false)}
                  >
                    <ChevronUpIcon className="size-4" />
                  </Button>
                </AppTooltip>
              </div>
            )}
          <div>{searchSlot}</div>
          {searchFields.length > 0 && (
            <Select
              onValueChange={(e) => {
                setSearchField(e);
                const _searchField = searchFields.find((f) => f.id == e);
                setCustomWhere(_searchField?.customWhere ?? "");
              }}
              value={searchField}
            >
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {searchFields &&
                  searchFields.length > 0 &&
                  searchFields.map((item, index) => (
                    <SelectItem key={index} value={item.id}>
                      {item.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}
          <div className="relative flex items-center justify-center w-full">
            <div className="absolute left-3 select-none text-neutral-600">
              <SearchIcon className="size-3" />
            </div>
            <Input
              placeholder={searchPlaceHolder}
              defaultValue={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className={cn(searchText && "bg-yellow-50", "pl-8")}
              type="search"
              autoFocus={searchAutoFocus}
            />
          </div>
          <div className="flex gap-x-2">
            {additionalButtons}
            {showAddButton && (
              <Button
                type="button"
                onClick={() => {
                  onAdd?.();
                }}
                className="w-full md:w-fit"
              >
                {addButtonContent}
              </Button>
            )}

            {showAdvancedFilter && (
              <Button
                type="button"
                onClick={() => {
                  setShowAdvancedFilterSlot(!showAdvancedFilterSlot);
                }}
                className="w-full md:w-fit"
              >
                <FilterIcon className="size-4" />
              </Button>
            )}
          </div>
        </div>
        {showAdvancedFilterSlot && <>{advancedFilterSlot}</>}
      </div>

      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-neutral-800 opacity-30"></div>
          <div className="p-8 w-52 h-20 flex items-center justify-center rounded-md bg-white z-50">
            <span>
              <Loader2Icon className="size-4 animate-spin mr-1" />
            </span>
            Aguarde...
          </div>
        </div>
      )}
      <div className="rounded-t-md mt-2 overflow-hidden">
        <table
          id={tableId}
          className={cn("w-full table-fixed", tableClassNames)}
        >
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  className={cn(
                    "border border-neutral-300 text-sm h-8 text-left font-semibold bg-neutral-200",
                    column.className,
                  )}
                  key={column.key}
                >
                  {!column.sortable && (
                    <span className="p-1">{column.title}</span>
                  )}
                  {column.sortable && (
                    <div
                      className={cn(
                        "flex items-center justify-between p-1 h-full w-full cursor-pointer",
                        column.dataIndex == sortField && "bg-neutral-300",
                        column.sortable && "hover:bg-neutral-400/45",
                      )}
                    >
                      <div
                        className="w-full"
                        role="button"
                        onClick={() => {
                          if (sortField == column.dataIndex) {
                            setSortAsc(!sortAsc);
                          } else {
                            setSortField(column.dataIndex);
                            setSortAsc(true);
                          }
                        }}
                      >
                        {column.title}
                      </div>

                      {sortField == column.dataIndex && (
                        <span>
                          {sortAsc && <SortAscIcon className="size-3" />}
                          {!sortAsc && <SortDescIcon className="size-3" />}
                        </span>
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{renderTableContent()}</tbody>
        </table>
      </div>

      <div className="mt-1 flex justify-between">
        <div className="text-xs flex items-center gap-x-1">
          Exibir:
          <Select
            onValueChange={(e) => setPageSize(parseInt(e))}
            value={pageSize.toString()}
          >
            <SelectTrigger className="text-xs">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="text-xs" value="0">
                Todos
              </SelectItem>
              <SelectItem className="text-xs" value="6">
                6
              </SelectItem>
              <SelectItem className="text-xs" value="8">
                8
              </SelectItem>
              <SelectItem className="text-xs" value="10">
                10
              </SelectItem>
              <SelectItem className="text-xs" value="25">
                25
              </SelectItem>
              <SelectItem className="text-xs" value="50">
                50
              </SelectItem>
              <SelectItem className="text-xs" value="100">
                100
              </SelectItem>
            </SelectContent>
          </Select>
          <span className="hidden md:block ml-1 text-xs">
            Total de Registros: {data?.totalRecords}
          </span>
        </div>
        <div className="flex items-center gap-x-2 justify-end text-xs">
          Página: {currentPage + 1} / {totalPages == 0 ? 1 : totalPages}
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleChangePage("previous")}
            disabled={(totalPages == 0 || totalPages == 1) && currentPage == 0}
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleChangePage("next")}
            disabled={(totalPages == 0 || totalPages == 1) && currentPage == 0}
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
