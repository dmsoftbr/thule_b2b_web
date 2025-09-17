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
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import type { PaymentConditionModel } from "@/models/payment-condition.model";

interface Props {}

export const PaymentConditionsCombo = ({}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<PaymentConditionModel[]>([]);
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(0);

  useEffect(() => {
    getData();
  }, []);

  function getData() {
    startTransition(async () => {
      const { data } = await api.get("/registrations/payment-conditions/all");
      setData(data);
    });
  }

  function getSelectedItem() {
    const item = data.find((item) => item.id === value);

    if (item) {
      return `${item.id} - ${item.name}`;
    }

    return "";
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild disabled={isPending}>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between hover:not-disabled:!bg-white"
        >
          {value ? getSelectedItem() : "Selecione a Cond. Pagto"}
          <ChevronsUpDownIcon className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-popover">
        <Command>
          <CommandInput placeholder="Procurar..." className="h-9" />
          <CommandList>
            <CommandEmpty>Cond. Pagto não encontrada</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.id}
                  disabled={!item.isActive}
                  value={item.id.toString()}
                  onSelect={(currentValue) => {
                    setValue(parseInt(currentValue));
                    setIsOpen(false);
                  }}
                >
                  {item.id} - {item.name}
                  <CheckIcon
                    className={cn(
                      "ml-auto",
                      value === item.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
