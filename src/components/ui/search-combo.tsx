import React, { useState, useEffect, useCallback, useMemo } from "react";
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
import { Badge } from "./badge";
import { api } from "@/lib/api";
import { convertArrayToSearchComboItem } from "@/lib/search-combo-utils";

export interface SearchComboItem {
  value: string;
  label: string;
  keywords?: string[]; // Fix: typo "keyworks"
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
  className?: string;
  showValueInSelectedItem?: boolean;
  multipleSelect?: boolean;
  onSelectOption?: (value: SearchComboItem[]) => void;
  showSelectButtons?: boolean;
  valueProp?: string;
  labelProp?: string;
  deSelectOnClick?: boolean;
  selectAllAsDefaultValue?: boolean;
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
  className,
  showValueInSelectedItem = false,
  showSelectButtons = false,
  onSelectOption,
  valueProp,
  labelProp,
  deSelectOnClick = false,
}) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<SearchComboItem[]>(staticItems);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<SearchComboItem[]>([]);

  // Fetch items from API com debounce implícito
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
          true
        );

        setItems(convertedData);
      } catch (error) {
        console.error("Erro ao buscar itens:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [apiEndpoint, queryStringName, valueProp, labelProp]
  );

  // Load initial items from API
  useEffect(() => {
    if (apiEndpoint) {
      fetchItems();
    }
  }, [apiEndpoint, fetchItems]);

  // Update items when staticItems change
  useEffect(() => {
    if (!apiEndpoint) {
      setItems(staticItems);
    }
  }, [staticItems, apiEndpoint]);

  // Normalize defaultValue to array format
  const normalizeDefaultValue = useCallback(
    (value: typeof defaultValue): SearchComboItem[] => {
      if (!value) return [];

      // Se já é array de SearchComboItem
      if (Array.isArray(value)) {
        if (value.length === 0) return [];

        // Se é array de strings
        if (typeof value[0] === "string") {
          return items.filter((item) =>
            (value as string[]).includes(item.value)
          );
        }

        // Se é array de SearchComboItem
        return value as SearchComboItem[];
      }

      // Se é um único SearchComboItem
      if (typeof value === "object" && "value" in value) {
        return [value as SearchComboItem];
      }

      // Se é string única
      if (typeof value === "string") {
        const item = items.find((item) => item.value === value);
        return item ? [item] : [];
      }

      return [];
    },
    [items]
  );

  // Handle defaultValue changes
  useEffect(() => {
    const normalized = normalizeDefaultValue(defaultValue);
    setSelectedItems(normalized);
  }, [defaultValue, normalizeDefaultValue]);

  // Handle search with API or local filtering
  const handleSearch = useCallback(
    (search: string) => {
      setSearchTerm(search);
      if (apiEndpoint) {
        fetchItems(search);
      }
    },
    [apiEndpoint, fetchItems]
  );

  // Filter items locally if not using API
  const filteredItems = useMemo(() => {
    if (apiEndpoint) return items;

    const lowerSearch = searchTerm.toLowerCase();
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(lowerSearch) ||
        item.value.toLowerCase().includes(lowerSearch) ||
        item.keywords?.some((keyword) =>
          keyword.toLowerCase().includes(lowerSearch)
        )
    );
  }, [apiEndpoint, items, searchTerm]);

  // Check if item is selected
  const isItemSelected = useCallback(
    (value: string): boolean => {
      return selectedItems.some((item) => item.value === value);
    },
    [selectedItems]
  );

  // Handle item selection
  const handleSelect = useCallback(
    (currentValue: string) => {
      const itemSelected = items.find((item) => item.value === currentValue);
      if (!itemSelected) return;

      let newItems: SearchComboItem[] = [];

      if (!multipleSelect) {
        // Single select mode
        const isAlreadySelected = selectedItems.some(
          (item) => item.value === currentValue
        );

        if (deSelectOnClick && isAlreadySelected) {
          newItems = [];
          onChange?.("");
        } else {
          newItems = [itemSelected];
          onChange?.(currentValue);
        }
        setOpen(false);
      } else {
        // Multiple select mode
        const isAlreadySelected = selectedItems.some(
          (item) => item.value === currentValue
        );

        if (isAlreadySelected) {
          newItems = selectedItems.filter(
            (item) => item.value !== currentValue
          );
        } else {
          newItems = [...selectedItems, itemSelected];
        }

        // Para multiple select, onChange passa o valor do último item selecionado
        onChange?.(currentValue);
      }

      setSelectedItems(newItems);
      onSelectOption?.(newItems);
    },
    [
      items,
      selectedItems,
      multipleSelect,
      deSelectOnClick,
      onChange,
      onSelectOption,
    ]
  );

  // Render selected items label
  const renderSelectedItem = useMemo(() => {
    if (selectedItems.length === 0) return placeholder;

    if (multipleSelect) {
      if (selectedItems.length > 1) {
        return (
          <div className="flex items-center gap-2">
            <span>Vários</span>
            <Badge className="h-5 px-2 text-xs">{selectedItems.length}</Badge>
          </div>
        );
      }

      const item = selectedItems[0];
      return showValueInSelectedItem
        ? `${item.value} - ${item.label}`
        : item.label;
    }

    const item = selectedItems[0];
    return showValueInSelectedItem
      ? `${item.value} - ${item.label}`
      : item.label;
  }, [selectedItems, placeholder, multipleSelect, showValueInSelectedItem]);

  // Select all items
  const handleSelectAll = useCallback(() => {
    setSelectedItems(filteredItems);
    onSelectOption?.(filteredItems);
  }, [filteredItems, onSelectOption]);

  // Clear selection
  const handleClearSelection = useCallback(() => {
    setSelectedItems([]);
    onSelectOption?.([]);
    onChange?.("");
  }, [onSelectOption, onChange]);

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
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
            className
          )}
        >
          <span className="truncate">{renderSelectedItem}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command shouldFilter={false} loop={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            onValueChange={handleSearch}
            value={searchTerm}
          />
          <CommandList>
            {loading ? (
              <div className="py-6 text-center text-sm">Carregando...</div>
            ) : (
              <>
                <CommandEmpty>{noResultsText}</CommandEmpty>
                <CommandGroup>
                  {filteredItems.map((item) => {
                    const selected = isItemSelected(item.value);
                    return (
                      <CommandItem
                        key={item.value}
                        value={item.value}
                        onSelect={handleSelect}
                        keywords={item.keywords}
                        className={cn(
                          "cursor-pointer",
                          "aria-selected:bg-accent aria-selected:text-accent-foreground",
                          selected && "!bg-blue-500 text-white"
                        )}
                      >
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded",
                            multipleSelect && "border border-primary",
                            selected &&
                              multipleSelect &&
                              "!bg-blue-600 !border-blue-600"
                          )}
                        >
                          <Check
                            className={cn(
                              "h-3 w-3",
                              multipleSelect && "text-white",
                              selected
                                ? "opacity-100 !stroke-white"
                                : "opacity-0"
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
                </CommandGroup>
              </>
            )}
          </CommandList>
          {showSelectButtons && multipleSelect && (
            <div className="border-t p-2">
              <div className="flex items-center justify-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="default"
                  className="flex-1 text-xs"
                  onClick={handleSelectAll}
                  disabled={loading}
                >
                  Selecionar Todos
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="flex-1 text-xs"
                  onClick={handleClearSelection}
                  disabled={loading}
                >
                  Limpar
                </Button>
              </div>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};
