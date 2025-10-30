import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import type { Control, FieldValues, Path } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import * as SelectPrimitive from "@radix-ui/react-select";

interface Props<T extends FieldValues> {
  control: Control<T>;
  name?: Path<T>;
  label?: string;
  items: any | any[];
  placeholder?: string;
  className?: string;
  onValueChange?: (value: string) => void;
}

export function FormSelect<T extends FieldValues>({
  control,
  name = "" as Path<T>,
  label = "",
  placeholder = "Selecione uma opção",
  className,
  items,
  onValueChange,
}: Props<T> & React.ComponentProps<typeof SelectPrimitive.Root>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={(e) => {
              field.onChange(e);
              onValueChange?.(e);
            }}
            value={field.value.toString()}
          >
            <FormControl>
              <SelectTrigger className={className}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>{items}</SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
