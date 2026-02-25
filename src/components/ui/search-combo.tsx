import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useDebouncedCallback } from "use-debounce";
import { api } from "@/lib/api";
import { convertArrayToSearchComboItem } from "@/lib/search-combo-utils";

export interface SearchComboItem {
  value: string;
  label: string;
  keywords?: string[];
  extra?: any;
}

interface SearchComboProps {
  staticItems?: SearchComboItem[];
  apiEndpoint?: string;
  queryStringName?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  noResultsText?: string;
  disabled?: boolean;
  defaultValue?: SearchComboItem[] | string | string[] | SearchComboItem;
  onChange?: (value: string) => void;
  onSelectOption?: (value: SearchComboItem[]) => void;
  className?: string;
  showValueInSelectedItem?: boolean;
  multipleSelect?: boolean;
  showSelectButtons?: boolean;
  valueProp?: string;
  labelProp?: string;
  deSelectOnClick?: boolean;
  selectFirstOptionOnLoad?: boolean;
  /** Seleciona todos os itens automaticamente após carregar. Requer multipleSelect=true. */
  selectAllOnLoad?: boolean;
  /** Altura da lista virtualizada em px. Padrão: 300 */
  listHeight?: number;
  /** Altura estimada de cada item em px. Padrão: 36 */
  itemHeight?: number;
}

export const SearchCombo: React.FC<SearchComboProps> = ({
  staticItems = [],
  apiEndpoint,
  disabled = false,
  queryStringName = "search",
  placeholder = "Selecione um item...",
  searchPlaceholder = "Buscar item...",
  noResultsText = "Nenhum resultado encontrado.",
  multipleSelect = false,
  defaultValue,
  onChange,
  onSelectOption,
  className,
  showValueInSelectedItem = false,
  showSelectButtons = false,
  valueProp,
  labelProp,
  deSelectOnClick = false,
  selectFirstOptionOnLoad = false,
  selectAllOnLoad = false,
  listHeight = 300,
  itemHeight = 36,
}) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<SearchComboItem[]>(staticItems);
  const [loading, setLoading] = useState(false);

  // Separar o valor exibido no input do termo usado para filtrar,
  // permitindo debounce na filtragem sem atrasar a digitação.
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedItems, setSelectedItems] = useState<SearchComboItem[]>([]);

  // ------------------------------------------------------------------
  // Set para lookup O(1) em isItemSelected
  // ------------------------------------------------------------------
  const selectedSet = useMemo(
    () => new Set(selectedItems.map((i) => i.value)),
    [selectedItems],
  );

  const isItemSelected = useCallback(
    (value: string): boolean => selectedSet.has(value),
    [selectedSet],
  );

  // ------------------------------------------------------------------
  // Fetch items from API
  // ------------------------------------------------------------------
  const fetchItems = useCallback(
    async (query: string = "") => {
      if (!apiEndpoint) return;

      if (!valueProp || !labelProp) {
        console.error("valueProp e labelProp são obrigatórios ao usar API");
        return;
      }

      setLoading(true);
      try {
        const separator = apiEndpoint.includes("?") ? "&" : "?";
        const url = query
          ? `${apiEndpoint}${separator}${queryStringName}=${encodeURIComponent(query)}`
          : apiEndpoint;

        const { data } = await api(url);

        const convertedData = convertArrayToSearchComboItem(
          data,
          valueProp,
          labelProp,
          false,
        );
        setItems(convertedData);

        if (selectAllOnLoad && convertedData.length > 0) {
          setSelectedItems(convertedData);
          onSelectOption?.(convertedData);
          onChange?.(convertedData.map((i) => i.value).join(","));
        } else if (selectFirstOptionOnLoad && convertedData.length > 0) {
          handleSelect(convertedData[0].value);
        }
      } catch (error) {
        console.error("Erro ao buscar itens:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      apiEndpoint,
      queryStringName,
      valueProp,
      labelProp,
      selectFirstOptionOnLoad,
      selectAllOnLoad,
    ], // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Load initial items from API
  useEffect(() => {
    if (apiEndpoint) {
      fetchItems();
    }
  }, [apiEndpoint, fetchItems]);

  // Update items when staticItems change
  useEffect(() => {
    if (!apiEndpoint && staticItems.length > 0) {
      setItems(staticItems);
      if (selectAllOnLoad) {
        setSelectedItems(staticItems);
        onSelectOption?.(staticItems);
        onChange?.(staticItems.map((i) => i.value).join(","));
      }
    }
  }, [staticItems, apiEndpoint]); // eslint-disable-line react-hooks/exhaustive-deps

  // ------------------------------------------------------------------
  // Normalize defaultValue
  // ------------------------------------------------------------------
  const normalizeDefaultValue = useCallback(
    (value: typeof defaultValue): SearchComboItem[] => {
      if (!value || items.length === 0) return [];

      if (Array.isArray(value)) {
        if (value.length === 0) return [];
        if (typeof value[0] === "string") {
          const set = new Set(value as string[]);
          return items.filter((item) => set.has(item.value));
        }
        return value as SearchComboItem[];
      }

      if (typeof value === "object" && "value" in value) {
        return [value as SearchComboItem];
      }

      if (typeof value === "string") {
        const item = items.find((item) => item.value === value);
        return item ? [item] : [];
      }

      return [];
    },
    [items],
  );

  useEffect(() => {
    if (defaultValue !== undefined) {
      const normalized = normalizeDefaultValue(defaultValue);
      setSelectedItems(normalized);
    }
  }, [defaultValue, normalizeDefaultValue]);

  // ------------------------------------------------------------------
  // Search com debounce: atualiza o termo de filtragem 300ms após digitar
  // ------------------------------------------------------------------
  const applySearch = useDebouncedCallback((search: string) => {
    setSearchTerm(search);
    if (apiEndpoint) {
      fetchItems(search);
    }
  }, 300);

  const handleSearch = useCallback(
    (search: string) => {
      setInputValue(search);
      applySearch(search);
    },
    [applySearch],
  );

  // ------------------------------------------------------------------
  // Filtro local (somente quando não usa API)
  // ------------------------------------------------------------------
  const filteredItems = useMemo(() => {
    if (apiEndpoint || !searchTerm) return items;

    const lowerSearch = searchTerm.toLowerCase();
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(lowerSearch) ||
        item.value.toLowerCase().includes(lowerSearch) ||
        item.keywords?.some((keyword) =>
          keyword.toLowerCase().includes(lowerSearch),
        ),
    );
  }, [apiEndpoint, items, searchTerm]);

  // ------------------------------------------------------------------
  // handleSelect
  // ------------------------------------------------------------------
  const handleSelect = useCallback(
    (currentValue: string) => {
      const itemSelected = items.find((item) => item.value === currentValue);
      if (!itemSelected) return;

      let newItems: SearchComboItem[] = [];

      if (!multipleSelect) {
        const isAlreadySelected = selectedSet.has(currentValue);

        if (deSelectOnClick && isAlreadySelected) {
          newItems = [];
          onChange?.("");
        } else {
          newItems = [itemSelected];
          onChange?.(currentValue);
        }
        setOpen(false);
      } else {
        if (selectedSet.has(currentValue)) {
          newItems = selectedItems.filter(
            (item) => item.value !== currentValue,
          );
        } else {
          newItems = [...selectedItems, itemSelected];
        }
        onChange?.(currentValue);
      }

      setSelectedItems(newItems);
      onSelectOption?.(newItems);
    },
    [
      items,
      selectedItems,
      selectedSet,
      multipleSelect,
      deSelectOnClick,
      onChange,
      onSelectOption,
    ],
  );

  // ------------------------------------------------------------------
  // Render selected label
  // ------------------------------------------------------------------
  const renderSelectedItem = useMemo(() => {
    if (selectedItems.length === 0) return placeholder;

    if (multipleSelect) {
      if (selectedItems.length > 1) {
        const isAll = selectedItems.length === items.length;
        return (
          <div className="flex items-center gap-2">
            <span>{isAll ? "Todos" : "Vários"}</span>
            {!isAll && (
              <Badge className="h-5 px-2 text-xs">{selectedItems.length}</Badge>
            )}
          </div>
        );
      }
    }

    const item = selectedItems[0];
    return showValueInSelectedItem
      ? `${item.value} - ${item.label}`
      : item.label;
  }, [
    selectedItems,
    placeholder,
    multipleSelect,
    showValueInSelectedItem,
    items.length,
  ]);

  // ------------------------------------------------------------------
  // Select all / Clear
  // ------------------------------------------------------------------
  const handleSelectAll = useCallback(() => {
    setSelectedItems(filteredItems);
    onSelectOption?.(filteredItems);
    if (filteredItems.length > 0) {
      onChange?.(filteredItems.map((item) => item.value).join(","));
    }
  }, [filteredItems, onSelectOption, onChange]);

  const handleClearSelection = useCallback(() => {
    setSelectedItems([]);
    onSelectOption?.([]);
    onChange?.("");
  }, [onSelectOption, onChange]);

  // ------------------------------------------------------------------
  // Virtualização
  // O ref aponta para o CommandList, que já tem overflow:auto interno.
  // Não adicionamos outro elemento com overflow para evitar scroll duplo.
  // ------------------------------------------------------------------
  const listRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: filteredItems.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => itemHeight,
    overscan: 10,
  });

  // Quando o popover abre, o CommandList acabou de montar e o ref foi preenchido.
  // Chamamos virtualizer.measure() via rAF para garantir que o DOM já foi pintado,
  // caso contrário o virtualizer acha que o container tem altura 0 e não renderiza nada.
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        virtualizer.measure();
        if (listRef.current) {
          listRef.current.scrollTop = 0;
        }
      });
    }
  }, [open]);

  // Resetar scroll ao mudar o filtro (sem remedir, o container já existe)
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [filteredItems]);

  // ------------------------------------------------------------------
  // JSX
  // ------------------------------------------------------------------
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between",
            "disabled:bg-neutral-200 disabled:cursor-not-allowed disabled:border-neutral-300",
            "overflow-hidden",
            className,
          )}
        >
          <span className="truncate">{renderSelectedItem}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      {/* Só montar o conteúdo do popover quando estiver aberto */}
      {open && (
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={searchPlaceholder}
              onValueChange={handleSearch}
              value={inputValue}
            />
            <CommandList
              ref={listRef}
              style={{ maxHeight: `${listHeight}px`, overflow: "auto" }}
            >
              {loading ? (
                <div className="py-6 text-center text-sm">Carregando...</div>
              ) : filteredItems.length === 0 ? (
                <CommandEmpty>{noResultsText}</CommandEmpty>
              ) : (
                <CommandGroup>
                  <div
                    style={{
                      height: `${virtualizer.getTotalSize()}px`,
                      position: "relative",
                    }}
                  >
                    {virtualizer.getVirtualItems().map((virtualItem) => {
                      const item = filteredItems[virtualItem.index];
                      const selected = isItemSelected(item.value);

                      return (
                        <CommandItem
                          key={item.value}
                          value={item.value}
                          onSelect={handleSelect}
                          style={{
                            position: "absolute",
                            top: virtualItem.start,
                            left: 0,
                            right: 0,
                            height: `${virtualItem.size}px`,
                          }}
                          className={cn(
                            "cursor-pointer",
                            selected &&
                              "bg-white hover:bg-blue-600 hover:!text-white group",
                          )}
                        >
                          <div
                            className={cn(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded",
                              multipleSelect &&
                                "border border-blue-400 !text-white",
                              selected &&
                                multipleSelect &&
                                "bg-blue-400 !text-white",
                            )}
                          >
                            <Check
                              className={cn(
                                "h-3 w-3 group-hover:!stroke-white",
                                selected
                                  ? "opacity-100 text-white"
                                  : "opacity-0",
                              )}
                            />
                          </div>
                          <span className="truncate">
                            {showValueInSelectedItem
                              ? `${item.value} - ${item.label}`
                              : item.label}
                          </span>
                        </CommandItem>
                      );
                    })}
                  </div>
                </CommandGroup>
              )}
            </CommandList>

            {showSelectButtons &&
              multipleSelect &&
              filteredItems.length > 0 && (
                <div className="border-t p-2">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="default"
                      className="flex-1 text-xs"
                      onClick={handleSelectAll}
                      disabled={
                        loading || selectedItems.length === filteredItems.length
                      }
                    >
                      Selecionar Todos
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="flex-1 text-xs"
                      onClick={handleClearSelection}
                      disabled={loading || selectedItems.length === 0}
                    >
                      Limpar
                    </Button>
                  </div>
                </div>
              )}
          </Command>
        </PopoverContent>
      )}
    </Popover>
  );
};
