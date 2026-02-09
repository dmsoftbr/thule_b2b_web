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
import { useEffect, useState, useCallback, useMemo, memo, useRef } from "react";
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
          isSelected && "!bg-blue-100",
        )}
      >
        <div className="flex flex-col w-full">
          <div className="w-full flex-1 flex justify-between items-center">
            <span className="font-bold text-blue-600">
              {item.id} - {item.abbreviation}
            </span>
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

export const CustomersCombo = ({
  disabled,
  onSelect,
  onPreSelect,
  defaultValue,
  closeOnSelect = false,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
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
          `/registrations/customers/search/${session.user.id}`,
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
            `/registrations/customers/search/${session.user.id}`,
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
    }
  }, []);

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
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

      <PopoverContent className="p-0 w-popover">
        <Command shouldFilter={false}>
          <CommandInput
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
};