import React, { useState, useEffect } from "react";
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

// Interface para os itens do combobox
export interface SearchComboItem {
  value: string;
  label: string;
  keyworks?: string[];
  extra?: any;
}

// Props do componente
interface SearchComboProps {
  items?: SearchComboItem[];
  apiEndpoint?: string;
  queryStringName?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  noResultsText?: string;
  disabled?: boolean;
  defaultValue?: SearchComboItem[];
  onChange: (value: string) => void;
  className?: string;
  showValueInSelectedItem?: boolean;
  multipleSelect?: boolean;
  onSelectOption?: (value: SearchComboItem[]) => void;
  showSelectButtons?: boolean;
  valueProp?: string;
  labelProp?: string;
}

export const SearchCombo: React.FC<SearchComboProps> = ({
  items: staticItems,
  apiEndpoint,
  disabled,
  queryStringName = "search",
  placeholder = "Selecione um item...",
  searchPlaceholder = "Buscar item...",
  noResultsText = "Nenhum resultado encontrado.",
  multipleSelect = false,
  defaultValue,
  onChange,
  className,
  showValueInSelectedItem,
  showSelectButtons,
  onSelectOption,
  valueProp,
  labelProp,
}) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<SearchComboItem[]>(staticItems || []);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<SearchComboItem[]>(
    defaultValue ?? []
  );

  // Função para buscar itens da API
  const fetchItems = async (query: string = "") => {
    if (!apiEndpoint) return;

    if (!valueProp || !labelProp) {
      throw new Error(
        "valueProp e labelProp devem ser especificados quando usar api"
      );
    }

    setLoading(true);
    try {
      const url = query
        ? `${apiEndpoint}${
            apiEndpoint.includes("?") ? "&" : "?"
          }${queryStringName}=${encodeURIComponent(query)}`
        : apiEndpoint;

      const { data } = await api(url);

      const convertedData = convertArrayToSearchComboItem(
        data,
        valueProp ?? "",
        labelProp ?? "",
        true
      );

      setItems(convertedData);
    } catch (error) {
      console.error("Erro ao buscar itens:", error);
    } finally {
      setLoading(false);
    }
  };

  // Efeito para carregar itens iniciais da API
  useEffect(() => {
    if (apiEndpoint) {
      fetchItems();
    }
  }, [apiEndpoint]);

  // Efeito para atualizar o item selecionado quando o valor mudar externamente
  // useEffect(() => {
  //   // if (value) {
  //   //   const found = items.filter((item) => item.value === value);
  //   //   setSelectedItems(found);
  //   // } else {
  //   //   setSelectedItems(undefined);
  //   // }
  // }, [value, items]);

  // Manipulador de pesquisa
  const handleSearch = (search: string) => {
    setSearchTerm(search);
    if (apiEndpoint) {
      fetchItems(search);
    }
  };

  // Filtrar itens localmente caso não use API
  const filteredItems = apiEndpoint
    ? items
    : items.filter(
        (item) =>
          item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.value.toLowerCase().includes(searchTerm.toLowerCase())
      );

  // Manipulador de seleção de item
  const handleSelect = (currentValue: string) => {
    const itemSelected = items.find((item) => item.value === currentValue);
    if (itemSelected) {
      const hasSelected = isItemSelected(currentValue);
      let newItems = [];
      if (!multipleSelect) {
        newItems = [itemSelected];
      } else {
        if (hasSelected && multipleSelect) {
          //deselect
          newItems = selectedItems.filter((f) => f.value != currentValue);
        } else {
          newItems = [...selectedItems, itemSelected];
        }
      }

      setSelectedItems(newItems);
      onChange(currentValue);
      onSelectOption?.(newItems);
      if (!multipleSelect) setOpen(false);
    }
  };

  function isItemSelected(currentValue: string) {
    if (!selectedItems) return false;
    return selectedItems.findIndex((f) => f.value == currentValue) > -1;
  }

  const renderSelectedItem = React.useMemo(() => {
    if (multipleSelect) {
      if (selectedItems.length === 0) return placeholder;
      if (selectedItems.length > 1)
        return (
          <div>
            Vários{" "}
            <Badge className="size-4 text-tiny text-white">
              {selectedItems.length}
            </Badge>
          </div>
        );
      return showValueInSelectedItem
        ? `${selectedItems[0].value} - ${selectedItems[0].label}`
        : selectedItems[0].label;
    }
    if (selectedItems.length > 0) return selectedItems[0].label;
    return placeholder;
  }, [multipleSelect, selectedItems, placeholder, showValueInSelectedItem]);

  function handleSelectAll() {
    setSelectedItems(items);
    onSelectOption?.(items);
  }

  function handleClearSelection() {
    setSelectedItems([]);
    onSelectOption?.([]);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="w-full">
        <Button
          useAnimation={false}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between disabled:bg-neutral-200 disabled:cursor-not-allowed",
            className
          )}
        >
          {renderSelectedItem}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="!w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
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
                  {filteredItems.map((item) => (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      onSelect={handleSelect}
                      keywords={item.keyworks}
                      className={cn(
                        "cursor-pointer hover:!bg-blue-600 hover:!text-white",
                        isItemSelected(item.value) && "bg-accent1"
                      )}
                    >
                      <div
                        className={cn(
                          "rounded size-4 flex items-center justify-center",
                          multipleSelect && "border",
                          isItemSelected(item.value) &&
                            multipleSelect &&
                            "bg-blue-600"
                        )}
                      >
                        <Check
                          className={cn(
                            "size-3",
                            multipleSelect && " text-white",
                            isItemSelected(item.value)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </div>
                      {`${showValueInSelectedItem ? `${item.value.toString()} - ` : ""}${item.label}`}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
          {showSelectButtons && (
            <div className="border-t py-2">
              <div className="flex items-center justify-center gap-x-2">
                <Button
                  type="button"
                  size="sm"
                  variant="green"
                  className="w-[80px] text-xs"
                  onClick={() => handleSelectAll()}
                >
                  Marca
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="w-[80px] text-xs"
                  onClick={() => handleClearSelection()}
                >
                  Desmarca
                </Button>
              </div>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};
