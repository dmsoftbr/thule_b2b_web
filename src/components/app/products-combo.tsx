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
import { useRef, useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import type { ProductModel } from "@/models/product.model";
import { ProductImage } from "./product-image";

interface Props {
  onSelect?: (product: ProductModel | undefined) => void;
  className?: string;
  disabled?: boolean;
  customerId: number;
  priceTableId: string;
  closeOnSelect?: boolean;
}

export const ProductsCombo = ({
  customerId,
  priceTableId,
  className,
  disabled,
  onSelect,
  closeOnSelect = false,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<ProductModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<number | undefined>(undefined);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Memoiza o item selecionado
  const selectedItem = useMemo(() => {
    if (!value) return "";
    const item = data.find((item) => item.id === value);
    return item ? `${item.id} - ${item.description}` : "";
  }, [value, data]);

  // Função de busca otimizada com abort controller
  const performSearch = useCallback(
    async (searchText: string) => {
      // Cancela requisição anterior se existir
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      if (!searchText.trim()) {
        setData([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      abortControllerRef.current = new AbortController();

      try {
        const { data: products } = await api.post(
          "/registrations/products/search",
          {
            search: searchText,
            customerId,
            priceTableId,
          },
          {
            signal: abortControllerRef.current.signal,
          }
        );
        setData(products);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Erro na busca:", error);
          setData([]);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [customerId, priceTableId]
  );

  // Debounce na busca
  const onSearch = useCallback(
    (searchText: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = window.setTimeout(() => {
        performSearch(searchText);
      }, 300);
    },
    [performSearch]
  );

  // Handler de seleção otimizado
  const handleSelect = useCallback(
    (item: ProductModel) => {
      setValue(""); // Limpa a seleção visual
      onSelect?.(item);

      if (closeOnSelect) {
        setIsOpen(false);
      }

      if (searchInputRef.current) {
        searchInputRef.current.value = ""; // Limpa o input de busca
        searchInputRef.current.focus();
      }

      setData([]); // Limpa os resultados
    },
    [onSelect, closeOnSelect]
  );

  // Componente de item memoizado
  const ProductItem = useMemo(() => {
    return ({ item }: { item: ProductModel }) => (
      <CommandItem
        key={item.id}
        disabled={!item.isActive}
        value={item.id.toString()}
        onSelect={() => handleSelect(item)}
        keywords={[item.id, item.referenceCode, item.description]}
        className={cn(
          "even:bg-neutral-50 border-t rounded-none",
          className,
          value === item.id.toString() && "!bg-blue-100"
        )}
      >
        <div className="grid grid-cols-[128px_1fr] gap-2">
          <div className="w-[128px] h-[128px] relative bg-transparent flex-shrink-0">
            <ProductImage productId={`${item.id}`} alt="Foto do Produto" />
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <span className="font-bold text-blue-600 truncate">
              {item.id} - {item.description}
            </span>
            <p className="text-xs text-muted-foreground truncate">
              Classificação: {item.productGroup?.name}
            </p>
          </div>
        </div>
      </CommandItem>
    );
  }, [className, value, handleSelect]);

  // Cleanup de timers e abort controllers
  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);

    if (!open) {
      // Limpa debounce ao fechar
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      // Cancela requisições pendentes
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }
  }, []);

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild disabled={disabled}>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          className="w-full flex-1 justify-between hover:not-disabled:!bg-white"
        >
          {value
            ? selectedItem
            : isLoading
              ? "Procurando..."
              : "Selecione o Produto"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-popover">
        <Command shouldFilter={false}>
          <CommandInput
            ref={searchInputRef}
            placeholder="Procurar..."
            className="h-9"
            onValueChange={onSearch}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading
                ? "Carregando..."
                : !value
                  ? "Digite o termo a procurar: Código Longo/Código Curto/Descrição"
                  : "Produto não cadastrado na lista de preço ou não disponível para seu canal de vendas."}
            </CommandEmpty>
            <CommandGroup className="p-0">
              {data.map((item) => (
                <ProductItem key={item.id} item={item} />
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
