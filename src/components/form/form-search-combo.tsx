import type { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SearchCombo, type SearchComboItem } from "../ui/search-combo";

interface Props<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  items?: SearchComboItem[];
  apiEndpoint?: string;
  queryStringName?: string;
  multipleSelect?: boolean;
  valueProp?: string;
  labelProp?: string;
}

export function FormSearchCombo<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  placeholder = "",
  searchPlaceholder = "",
  multipleSelect = false,
  disabled = false,
  required = false,
  className = "space-y-0",
  items,
  apiEndpoint,
  queryStringName,
  valueProp,
  labelProp,
}: Props<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel required={required}>{label}</FormLabel>
          <FormControl>
            <SearchCombo
              apiEndpoint={apiEndpoint}
              queryStringName={queryStringName}
              multipleSelect={multipleSelect}
              searchPlaceholder={searchPlaceholder}
              disabled={disabled}
              onChange={(value) => field.onChange(value)}
              defaultValue={field.value}
              staticItems={items}
              placeholder={placeholder}
              valueProp={valueProp}
              labelProp={labelProp}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
