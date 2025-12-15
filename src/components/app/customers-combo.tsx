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
import { useEffect, useState, useCallback, useMemo, memo } from "react";
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
    cancel: () => void
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
      [item.id, item.abbreviation, item.name, item.documentNumber]
    );

    const handleSelect = useCallback(() => {
      onSelect?.(item);
      if (closeOnSelect) setIsOpen(false);
    }, [item, onSelect, closeOnSelect, setIsOpen]);

    return (
      <CommandItem
        key={item.id}
        disabled={!item.isActive}
        value={item.id.toString()}
        onSelect={handleSelect}
        keywords={keywords}
        className={cn(
          "even:bg-neutral-50 border-t rounded-none cursor-pointer",
          value === item.id && "!bg-blue-100"
        )}
      >
        <div className="flex flex-col w-full">
          <div className="w-full flex-1 flex justify-between items-center">
            <span className="font-bold text-blue-600">
              {item.id} - {item.abbreviation}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {item.name.toUpperCase()} - CPF/CNPJ:{" "}
            {formatCpfCnpj(item.documentNumber)}
          </p>
        </div>
      </CommandItem>
    );
  }
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
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useAuth();

  // useCallback para evitar recriar a função a cada render
  const onSearch = useCallback(
    async (searchText: string) => {
      if (!session?.user.id) return;

      try {
        setIsLoading(true);
        const { data } = await api.post(
          `/registrations/customers/search/${session.user.id}`,
          {
            search: searchText,
          }
        );
        setData(data);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    },
    [session?.user.id]
  );

  // Debounce da busca
  const debouncedSearch = useDebounceCallback(onSearch, 500);

  // Memoiza o item selecionado
  const selectedItem = useMemo(() => {
    return data.find((item) => item.id === value);
  }, [data, value]);

  // Memoiza o conteúdo do botão
  const buttonContent = useMemo(() => {
    if (!selectedItem) return "Selecione o Cliente";

    return (
      <div>
        {`${selectedItem.id} - ${selectedItem.abbreviation}`} -{" "}
        <span className="text-xs text-muted-foreground">
          CPF/CNPJ: {formatCpfCnpj(selectedItem.documentNumber)}
        </span>
      </div>
    );
  }, [selectedItem]);

  // Função para aplicar a seleção
  const applySelection = useCallback(
    (customer: CustomerModel) => {
      setValue(customer.id);
      onSelect?.(customer);
    },
    [onSelect]
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

        onPreSelect(customer, selectedItem, confirm, cancel);
        return;
      }

      // Se não tem onPreSelect, aplica diretamente
      applySelection(customer);
    },
    [value, onPreSelect, selectedItem, applySelection]
  );

  // Efeito para buscar quando o texto de busca muda
  useEffect(() => {
    debouncedSearch(searchText);
  }, [searchText, debouncedSearch]);

  // Efeito para carregar o valor padrão
  useEffect(() => {
    if (defaultValue && defaultValue !== value) {
      setValue(defaultValue);
      onSearch(defaultValue.toString());
    }
  }, [defaultValue]); // Removido onSearch e value das dependências para evitar loop

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
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
