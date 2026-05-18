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
  useEffect,
  useState,
  useCallback,
  useMemo,
  memo,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Button } from "@/components/ui/button";
import { ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { formatCpfCnpj } from "@/lib/string-utils";
import { useDebounceCallback } from "usehooks-ts";
import type { CustomerModel } from "@/models/registrations/customer.model";
import { useAuth } from "@/hooks/use-auth";

interface Props {
  onSelect?: (customer: CustomerModel | undefined) => void;
  onPreSelect?: (
    newCustomer: CustomerModel,
    currentCustomer: CustomerModel | undefined,
    confirm: () => void,
    cancel: () => void,
  ) => void;
  defaultValue?: number;
  disabled?: boolean;
  closeOnSelect?: boolean;
}

// Componente memoizado para cada item da lista
const CustomerItem = memo(
  ({
    item,
    value,
    onSelect,
    closeOnSelect,
    setIsOpen,
  }: {
    item: CustomerModel;
    value: number | undefined;
    onSelect?: (customer: CustomerModel) => void;
    closeOnSelect: boolean;
    setIsOpen: (open: boolean) => void;
  }) => {
    // Memoiza as keywords para não recriar o array a cada render
    const keywords = useMemo(
      () => [
        item.id.toString(),
        item.abbreviation,
        ...item.name.trim().split(" "),
        item.documentNumber,
      ],
      [item.id, item.abbreviation, item.name, item.documentNumber],
    );

    const handleSelect = useCallback(() => {
      onSelect?.(item);
      if (closeOnSelect) setIsOpen(false);
    }, [item, onSelect, closeOnSelect, setIsOpen]);

    // Memoiza o CPF/CNPJ formatado
    const formattedDocument = useMemo(
      () => formatCpfCnpj(item.documentNumber),
      [item.documentNumber],
    );

    // Memoiza o nome em maiúsculas
    const upperName = useMemo(() => item.name.toUpperCase(), [item.name]);

    const isSelected = value === item.id;

    return (
      <CommandItem
        key={item.id}
        disabled={!item.isActive}
        value={item.id.toString()}
        onSelect={handleSelect}
        keywords={keywords}
        className={cn(
          "even:bg-neutral-50 border-t rounded-none cursor-pointer",
          // Item destacado via teclado (cmdk seta data-selected="true").
          "data-[selected=true]:!bg-neutral-200 data-[selected=true]:!text-neutral-900 data-[selected=true]:border-l-4 data-[selected=true]:border-l-neutral-500",
          isSelected && "!bg-blue-100",
        )}
      >
        <div className="flex flex-col w-full">
          <div className="w-full flex-1 flex justify-between items-center gap-2">
            <span className="font-bold text-blue-600">
              {item.id} - {item.abbreviation}
            </span>
            {(!item.isActive || String(item.creditStatus) === "4") && (
              <span className="text-[10px] font-semibold uppercase tracking-wide bg-red-100 text-red-700 border border-red-200 rounded px-1.5 py-0.5">
                Inativo
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {upperName} - CPF/CNPJ: {formattedDocument}
          </p>
        </div>
      </CommandItem>
    );
  },
);

CustomerItem.displayName = "CustomerItem";

// Handle imperativo — permite ao componente pai focar/abrir o combo
// programaticamente (ex.: foco automático ao entrar na tela de novo pedido).
export interface CustomersComboHandle {
  focus: () => void;
  openAndFocus: () => void;
}

export const CustomersCombo = forwardRef<CustomersComboHandle, Props>(({
  disabled,
  onSelect,
  onPreSelect,
  defaultValue,
  closeOnSelect = false,
}, forwardedRef) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);

  useImperativeHandle(
    forwardedRef,
    () => ({
      focus: () => triggerButtonRef.current?.focus(),
      openAndFocus: () => setIsOpen(true),
    }),
    [],
  );
  const [data, setData] = useState<CustomerModel[]>([]);
  const [value, setValue] = useState(defaultValue);
  const [selectedCustomer, setSelectedCustomer] = useState<
    CustomerModel | undefined
  >(undefined);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useAuth();

  // Usa ref para evitar chamadas duplicadas
  const abortControllerRef = useRef<AbortController | null>(null);
  const isInitialLoadRef = useRef(true);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // useCallback para evitar recriar a função a cada render
  const onSearch = useCallback(
    async (searchText: string) => {
      if (!session?.user.id) return;

      // Cancela requisição anterior se existir
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Cria novo AbortController
      abortControllerRef.current = new AbortController();

      try {
        setIsLoading(true);
        const { data } = await api.post(
          `/registrations/customers/search/${encodeURIComponent(session.user.id)}`,
          {
            search: searchText,
          },
          {
            signal: abortControllerRef.current.signal,
          },
        );
        setData(data);
      } catch (error: any) {
        // Ignora erros de cancelamento
        if (error.name !== "CanceledError" && error.name !== "AbortError") {
          console.error("Erro ao buscar clientes:", error);
          setData([]);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [session?.user.id],
  );

  // Debounce da busca com tempo reduzido
  const debouncedSearch = useDebounceCallback(onSearch, 300);

  // Memoiza o documento formatado do item selecionado
  const selectedFormattedDocument = useMemo(
    () => (selectedCustomer ? formatCpfCnpj(selectedCustomer.documentNumber) : ""),
    [selectedCustomer],
  );

  // Memoiza o conteúdo do botão
  const buttonContent = useMemo(() => {
    if (!selectedCustomer) return "Selecione o Cliente";

    return (
      <div>
        {`${selectedCustomer.id} - ${selectedCustomer.abbreviation}`} -{" "}
        <span className="text-xs text-muted-foreground">
          CPF/CNPJ: {selectedFormattedDocument}
        </span>
      </div>
    );
  }, [selectedCustomer, selectedFormattedDocument]);

  // Função para aplicar a seleção
  const applySelection = useCallback(
    (customer: CustomerModel) => {
      setValue(customer.id);
      setSelectedCustomer(customer);
      onSelect?.(customer);
    },
    [onSelect],
  );

  // Callback para o onSelect interno que atualiza o value
  const handleInternalSelect = useCallback(
    (customer: CustomerModel) => {
      // Se está tentando selecionar o mesmo cliente, não faz nada
      if (customer.id === value) {
        return;
      }

      // Se tem onPreSelect, delega a decisão para o componente pai
      if (onPreSelect) {
        const confirm = () => {
          applySelection(customer);
        };

        const cancel = () => {
          // Não faz nada, mantém a seleção atual
        };

        onPreSelect(customer, selectedCustomer, confirm, cancel);
        return;
      }

      // Se não tem onPreSelect, aplica diretamente
      applySelection(customer);
    },
    [value, onPreSelect, selectedCustomer, applySelection],
  );

  // Efeito para buscar quando o texto de busca muda
  useEffect(() => {
    debouncedSearch(searchText);
  }, [searchText, debouncedSearch]);

  // Efeito para carregar o valor padrão (executado apenas uma vez)
  useEffect(() => {
    if (defaultValue && isInitialLoadRef.current && session?.user.id) {
      isInitialLoadRef.current = false;
      setValue(defaultValue);

      // Busca específica para o valor padrão
      const fetchDefault = async () => {
        try {
          const { data } = await api.post(
            `/registrations/customers/search/${encodeURIComponent(session.user.id)}`,
            {
              search: defaultValue.toString(),
            },
          );
          
          if (Array.isArray(data)) {
            const found = data.find((d: CustomerModel) => d.id === defaultValue);
            if (found) {
              setSelectedCustomer(found);
            }
          }
        } catch (error) {
          console.error("Erro ao buscar cliente padrão:", error);
        }
      };
      
      fetchDefault();
    }
  }, [defaultValue, session?.user.id]);

  // Cleanup do AbortController
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Callback para abrir/fechar o popover
  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    // Limpa o texto de busca ao fechar
    if (!open) {
      setSearchText("");
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }
  }, []);

  // Foca o input ao abrir — garante que ↑/↓/Enter funcionem sem clicar antes.
  useEffect(() => {
    if (!isOpen) return;
    const raf = requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });
    return () => cancelAnimationFrame(raf);
  }, [isOpen]);

  // Atalhos extras (Home/End/PageUp/PageDown) que o cmdk não cobre — simula
  // setas dentro do input para o cmdk processar a navegação real.
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
        handleOpenChange(false);
        return;
      }
      if (data.length === 0) return;
      if (e.key === "Home") {
        e.preventDefault();
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
      <PopoverTrigger asChild>
        <Button
          ref={triggerButtonRef}
          disabled={disabled}
          useAnimation={false}
          variant="outline"
          role="combobox"
          className="w-full justify-between hover:not-disabled:!bg-white disabled:bg-neutral-200"
        >
          {buttonContent}
          <ChevronsUpDownIcon className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="p-0 w-popover"
        onKeyDown={handleKeyDown}
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
            onValueChange={setSearchText}
          />
          <CommandList>
            {isLoading ? (
              <CommandEmpty>Carregando...</CommandEmpty>
            ) : data.length === 0 ? (
              <CommandEmpty>Cliente não encontrado</CommandEmpty>
            ) : null}
            <CommandGroup className="p-0">
              {data.map((item) => (
                <CustomerItem
                  key={item.id}
                  item={item}
                  value={value}
                  onSelect={handleInternalSelect}
                  closeOnSelect={closeOnSelect}
                  setIsOpen={setIsOpen}
                />
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
});

CustomersCombo.displayName = "CustomersCombo";