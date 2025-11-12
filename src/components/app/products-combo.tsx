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
import { useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import type { ProductModel } from "@/models/product.model";
import { useMemo } from "react";
import { ProductImage } from "./product-image";

interface Props {
  onSelect?: (product: ProductModel | undefined) => void;
  className?: string;
  disabled?: boolean;
  customerId: number;
  priceTableId: string;
}

export const ProductsCombo = ({
  customerId,
  priceTableId,
  className,
  disabled,
  onSelect,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<ProductModel[]>([]);
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const getSelectedItem = useMemo(() => {
    const item = data.find((item) => item.id === value);

    if (item) {
      return `${item.id} - ${item.description}`;
    }

    return "";
  }, [value, data]);

  async function onSearch(searchText: string) {
    startTransition(async () => {
      const { data } = await api.post("/registrations/products/search", {
        search: searchText,
        customerId,
        priceTableId,
      });
      setData(data);
    });
  }

  const renderItems = useMemo(() => {
    return data.map((item) => (
      <CommandItem
        key={item.id}
        disabled={!item.isActive}
        value={item.id.toString()}
        onSelect={() => {
          setValue(item.id.toString());

          onSelect?.(item);
          //setIsOpen(false);
          if (searchInputRef.current) {
            searchInputRef.current.select();
            searchInputRef.current.focus();
            //setData([]);
          }
        }}
        keywords={[item.id, item.referenceCode, item.description]}
        className={cn(
          "even:bg-neutral-50 border-t rounded-none",
          className,
          value === item.id.toString() && "!bg-blue-100"
        )}
      >
        <div className={cn("grid grid-cols-[128px_1fr]")}>
          <div className="w-[128px] h-[128px] max-w-[128px] max-h-[128px] relative bg-transparent">
            <ProductImage productId={`${item.id}`} alt={"Foto do Produto"} />
          </div>
          <div className="flex flex-col ml-2">
            <div className="w-full flex-1 flex justify-between items-center">
              <span className="font-bold text-blue-600">
                {item.id} - {item.description}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Classificação: {item.productGroup?.name}
            </p>
          </div>
        </div>
      </CommandItem>
    ));
  }, [data, value, onSelect, setIsOpen, setValue]);

  // Usage: {renderItems}

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <Button
          useAnimation={false}
          variant="outline"
          role="combobox"
          className="w-full flex-1 justify-between hover:not-disabled:!bg-white"
        >
          {value
            ? getSelectedItem
            : isPending
              ? "Procurando..."
              : "Selecione o Produto"}
          <ChevronsUpDownIcon className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-popover">
        <Command shouldFilter={false}>
          <CommandInput
            ref={searchInputRef}
            placeholder="Procurar..."
            className="h-9"
            onValueChange={(value) => onSearch(value)}
          />
          <CommandList>
            <CommandEmpty>
              {!value
                ? "Digite o termo a procurar: Código Longo/Código Curto/Descrição"
                : "Produto não cadastrado na lista de preço ou não disponível para seu canal de vendas."}
            </CommandEmpty>
            <CommandGroup className="p-0">{renderItems}</CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
