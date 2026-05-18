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
import {
  useRef,
  useState,
  useCallback,
  useMemo,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Loader2Icon, PackageSearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import type { ProductModel } from "@/models/product.model";
import { ProductImage } from "./product-image";
import { formatNumber } from "@/lib/number-utils";

interface Props {
  onSelect?: (product: ProductModel | undefined) => void;
  className?: string;
  disabled?: boolean;
  customerId: number;
  priceTableId: string;
  closeOnSelect?: boolean;
}

// Handle imperativo exposto via ref — permite ao componente pai recolocar o
// foco no combo após uma seleção (ex.: após adicionar um item ao pedido,
// voltar o cursor para o trigger para o usuário continuar adicionando).
export interface ProductsComboHandle {
  focus: () => void;
  openAndFocus: () => void;
}

export const ProductsCombo = forwardRef<ProductsComboHandle, Props>(({
  customerId,
  priceTableId,
  className,
  disabled,
  onSelect,
  closeOnSelect = false,
}, forwardedRef) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<ProductModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState("");
  const [searchText, setSearchText] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const debounceTimerRef = useRef<number | undefined>(undefined);
  const abortControllerRef = useRef<AbortController | null>(null);

  useImperativeHandle(
    forwardedRef,
    () => ({
      focus: () => triggerButtonRef.current?.focus(),
      openAndFocus: () => {
        setIsOpen(true);
        // O foco no input é aplicado pelo useEffect/onOpenAutoFocus quando
        // isOpen vira true.
      },
    }),
    [],
  );

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
          },
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
    [customerId, priceTableId],
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
    [performSearch],
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

      setSearchText("");
      setData([]); // Limpa os resultados
    },
    [onSelect, closeOnSelect],
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
          // Item destacado via teclado (cmdk seta data-selected="true").
          // Cinza claro + borda à esquerda para destacar sobre o zebra striping.
          "data-[selected=true]:!bg-neutral-200 data-[selected=true]:!text-neutral-900 data-[selected=true]:border-l-4 data-[selected=true]:border-l-neutral-500",
          className,
          value === item.id.toString() && "!bg-blue-100",
        )}
      >
        <div className="grid grid-cols-[128px_1fr] gap-2 w-full">
          <div className="w-[128px] h-[128px] relative bg-transparent flex-shrink-0">
            <ProductImage productId={`${item.id}`} alt="Foto do Produto" />
          </div>
          <div className="flex flex-col justify-center min-w-0 w-full">
            <span className="font-bold text-blue-600 truncate">
              {item.id} - {item.description}
            </span>
            <p className="text-xs text-muted-foreground truncate">
              Classificação: {item.productGroup?.name}
            </p>
            <div className="mt-1 grid grid-cols-[130px_1fr]">
              Preço Sugerido:{" "}
              <span className="font-semibold">
                R$ {formatNumber(item.suggestUnitPrice, 2)}
              </span>
              Preço c/Desconto:{" "}
              <span className="font-semibold text-emerald-700">
                R$ {formatNumber(item.unitPriceInTable, 2)}
              </span>
            </div>
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

  // Foca o input de busca assim que o popover abre — garante que setas
  // ↑/↓ e Enter já funcionem sem precisar clicar primeiro no campo.
  useEffect(() => {
    if (!isOpen) return;
    // requestAnimationFrame para esperar o Radix montar o PopoverContent.
    const raf = requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });
    return () => cancelAnimationFrame(raf);
  }, [isOpen]);

  // Navegação por teclado:
  //  • Esc fecha; Tab também fecha (não fica preso no popover).
  //  • Setas ↑/↓ e Enter são tratadas nativamente pelo cmdk.
  //  • Home/End → primeiro/último item da lista.
  //  • PageUp/PageDown → salto de 5 em 5 itens.
  // Para os atalhos que o cmdk não cobre, simulamos teclas de seta dentro do
  // próprio CommandInput, deixando o cmdk processar a movimentação real.
  const dispatchArrowKey = useCallback(
    (key: "ArrowDown" | "ArrowUp", times: number) => {
      const input = searchInputRef.current;
      if (!input) return;
      for (let i = 0; i < times; i++) {
        const evt = new KeyboardEvent("keydown", {
          key,
          code: key,
          bubbles: true,
          cancelable: true,
        });
        input.dispatchEvent(evt);
      }
    },
    [],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        handleOpenChange(false);
        return;
      }
      if (e.key === "Tab") {
        // Fecha ao tabular para fora — evita foco preso.
        handleOpenChange(false);
        return;
      }
      if (data.length === 0) return;

      if (e.key === "Home") {
        e.preventDefault();
        // Anda "para cima" várias vezes para garantir que chega no primeiro.
        dispatchArrowKey("ArrowUp", data.length);
        return;
      }
      if (e.key === "End") {
        e.preventDefault();
        dispatchArrowKey("ArrowDown", data.length);
        return;
      }
      if (e.key === "PageDown") {
        e.preventDefault();
        dispatchArrowKey("ArrowDown", Math.min(5, data.length));
        return;
      }
      if (e.key === "PageUp") {
        e.preventDefault();
        dispatchArrowKey("ArrowUp", Math.min(5, data.length));
        return;
      }
    },
    [handleOpenChange, data.length, dispatchArrowKey],
  );

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild disabled={disabled}>
        <Button
          ref={triggerButtonRef}
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

      <PopoverContent
        className="p-0 w-popover"
        onKeyDown={handleKeyDown}
        // Por padrão o Radix devolve foco ao trigger ao fechar; mantemos esse
        // comportamento, mas evitamos que o autoFocus inicial roube foco do
        // input dentro do Command.
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          searchInputRef.current?.focus();
        }}
      >
        <Command shouldFilter={false}>
          <CommandInput
            ref={searchInputRef}
            placeholder="Procurar..."
            className="h-9"
            onValueChange={(v) => {
              setSearchText(v);
              onSearch(v);
            }}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? (
                <div className="flex items-center justify-center gap-2 py-6 px-4 text-blue-600">
                  <Loader2Icon className="size-4 animate-spin" />
                  <span className="text-sm font-medium">Procurando...</span>
                </div>
              ) : !searchText.trim() ? (
                "Digite o termo a procurar: Código Longo/Código Curto/Descrição"
              ) : (
                <div className="flex flex-col items-center gap-2 py-6 px-4 text-orange-600">
                  <div className="rounded-full bg-orange-100 p-3 ring-4 ring-orange-50">
                    <PackageSearchIcon className="size-6" />
                  </div>
                  <span className="text-sm font-semibold text-center">
                    Não encontramos um produto com os critérios de busca
                    informados
                  </span>
                </div>
              )}
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
});

ProductsCombo.displayName = "ProductsCombo";
