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
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { formatCpfCnpj } from "@/lib/string-utils";
import { useDebounceCallback } from "usehooks-ts";
import type { CustomerModel } from "@/models/registrations/customer.model";

interface Props {
  onSelect?: (customer: CustomerModel | undefined) => void;
  defaultValue?: number;
  disabled?: boolean;
}

export const CustomersCombo = ({ disabled, onSelect, defaultValue }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<CustomerModel[]>([]);
  const [value, setValue] = useState(defaultValue);
  const [searchText, setSearchText] = useState("");

  const debouncedValue = useDebounceCallback(setSearchText, 200);

  function getSelectedItem() {
    const item = data.find((item) => item.id === value);

    if (item) {
      return (
        <div>
          {`${item.id} - ${item.abbreviation}`} -{" "}
          <span className="text-xs text-muted-foreground">
            CPF/CNPJ: {`${formatCpfCnpj(item.documentNumber)}`}
          </span>
        </div>
      );
    }

    return "";
  }

  async function onSearch(searchText: string) {
    const { data } = await api.post("/registrations/customers/search", {
      search: searchText,
    });
    setData(data);
  }

  useEffect(() => {
    onSearch(searchText);
  }, [searchText]);

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
          {value ? getSelectedItem() : "Selecione o Cliente"}
          <ChevronsUpDownIcon className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-popover">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Procurar..."
            className="h-9"
            onValueChange={(value) => debouncedValue(value)}
          />
          <CommandList>
            <CommandEmpty>Cliente não encontrado</CommandEmpty>
            <CommandGroup className="p-0">
              {data &&
                data?.map((item) => (
                  <CommandItem
                    key={item.id}
                    disabled={!item.isActive}
                    value={item.id.toString()}
                    onSelect={(currentValue) => {
                      setValue(parseInt(currentValue));
                      onSelect?.(item);
                      setIsOpen(false);
                    }}
                    keywords={[
                      item.id.toString(),
                      item.abbreviation,
                      item.name,
                      item.documentNumber,
                    ]}
                    className={cn(
                      "even:bg-neutral-50 border-t rounded-none",
                      value === item.id && "!bg-blue-100"
                    )}
                  >
                    <div className={cn("flex flex-col w-full")}>
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
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
