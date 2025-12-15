import type { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { forwardRef, useEffect, useRef, type ElementRef } from "react";
import IMask from "imask";
import { mergeRefs } from "@/lib/other-utils";
import { parse } from "date-fns";

interface FormInputMaskProps<
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
  autoComplete?: React.InputHTMLAttributes<HTMLInputElement>["autoComplete"];
  autoFocus?: React.InputHTMLAttributes<HTMLInputElement>["autoFocus"];
  mask: string;
  defaultValue?: string;
  outputType?: "date" | "number" | "text";
}

export const FormInputMask = forwardRef<
  HTMLInputElement,
  FormInputMaskProps<any, any>
>(function FormInputMask<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  {
    control,
    name,
    label,
    placeholder = "",
    maxLength,
    disabled = false,
    readOnly = false,
    required = false,
    className = "space-y-0",
    autoComplete = "off",
    autoFocus,
    mask,
    defaultValue = "",
    outputType = "text",
  }: FormInputMaskProps<TFieldValues, TName>,
  ref: unknown
) {
  const localRef = useRef<ElementRef<"input">>(null);
  useEffect(() => {
    if (localRef.current) {
      const maskInstance = IMask(localRef.current, {
        mask,
      });
      return () => {
        maskInstance.destroy();
      };
    }
  }, [ref, mask]);

  useEffect(() => {
    if (localRef.current) localRef.current.value = defaultValue;
  }, [defaultValue]);

  const handleOutputType = (value: string) => {
    if (outputType == "date") return parse(value, "dd/MM/yyyy", new Date());
    if (outputType == "number") return Number(value);

    return value;
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className={className}>
            <FormLabel required={required}>{label}</FormLabel>

            <FormControl>
              <Input
                value={field.value}
                onBlur={(event) => {
                  const convertedOutput = handleOutputType(event.target.value);
                  console.log("CVT", convertedOutput);
                  field.onChange(convertedOutput);
                }}
                ref={mergeRefs(localRef, ref)}
                type="text"
                disabled={disabled}
                readOnly={readOnly}
                placeholder={placeholder}
                maxLength={maxLength}
                autoComplete={autoComplete}
                autoFocus={autoFocus}
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
});
