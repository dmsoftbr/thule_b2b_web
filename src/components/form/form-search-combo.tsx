import type React from "react";
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
  labelProp?: string | ((item: any) => string);
  renderOption?: (item: SearchComboItem, selected: boolean) => React.ReactNode;
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
  renderOption,
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
              {...(queryStringName ? { queryStringName } : {})}
              multipleSelect={multipleSelect}
              searchPlaceholder={searchPlaceholder}
              disabled={disabled}
              onChange={(value) => field.onChange(value)}
              defaultValue={field.value != null ? String(field.value) : undefined}
              staticItems={items}
              placeholder={placeholder}
              valueProp={valueProp}
              labelProp={labelProp}
              renderOption={renderOption}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
