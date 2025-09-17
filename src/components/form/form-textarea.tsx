import type { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "../ui/textarea";

interface FormTextareaProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  className?: string;
  inputClassName?: string;
  autoComplete?: React.InputHTMLAttributes<HTMLInputElement>["autoComplete"];
  autoFocus?: React.InputHTMLAttributes<HTMLInputElement>["autoFocus"];
  rows?: React.TextareaHTMLAttributes<HTMLTextAreaElement>["rows"];
}

export function FormTextarea<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  placeholder = "",
  maxLength,
  disabled = false,
  readOnly = false,
  required = false,
  className = "space-y-0",
  inputClassName = "",
  autoComplete = "off",
  autoFocus,
  rows = 3,
}: FormTextareaProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel required={required}>{label}</FormLabel>
          <FormControl>
            <Textarea
              {...field}
              rows={rows}
              disabled={disabled}
              readOnly={readOnly}
              placeholder={placeholder}
              maxLength={maxLength}
              autoComplete={autoComplete}
              autoFocus={autoFocus}
              className={inputClassName}
            ></Textarea>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
