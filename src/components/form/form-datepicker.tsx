import type { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React, { useEffect, useState } from "react";
import { format, isValid, parse } from "date-fns";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";

interface Props<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  className?: string;
  autoFocus?: React.InputHTMLAttributes<HTMLInputElement>["autoFocus"];
}

export function FormDatePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  placeholder = "dd/mm/aaaa",
  disabled = false,
  readOnly = false,
  required = false,
  className = "space-y-0",
  autoFocus,
}: Props<TFieldValues, TName>) {
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <DatePickerInternal
          field={field}
          label={label}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          className={className}
          autoFocus={autoFocus}
          open={open}
          setOpen={setOpen}
          name={name}
        />
      )}
    />
  );
}

function DatePickerInternal({
  field,
  label,
  placeholder,
  disabled,
  readOnly,
  required,
  className,
  autoFocus,
  open,
  setOpen,
  name,
}: any) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (field.value) {
      const date =
        field.value instanceof Date ? field.value : new Date(field.value);
      if (isValid(date)) {
        setInputValue(format(date, "dd/MM/yyyy"));
      } else {
        setInputValue("");
      }
    } else {
      setInputValue("");
    }
  }, [field.value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    if (val.length === 10) {
      const parsed = parse(val, "dd/MM/yyyy", new Date());
      if (isValid(parsed)) {
        field.onChange(parsed);
      }
    } else if (val === "") {
      field.onChange(null);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    field.onChange(date);
    setOpen(false);
  };

  const dateValue =
    field.value instanceof Date
      ? field.value
      : field.value && typeof field.value === "string"
        ? new Date(field.value)
        : undefined;

  return (
    <FormItem className={className}>
      <FormLabel required={required}>{label}</FormLabel>
      <FormControl>
        <InputGroup>
          <InputGroupInput
            id={name}
            ref={field.ref}
            onBlur={field.onBlur}
            value={inputValue}
            disabled={disabled}
            readOnly={readOnly}
            autoFocus={autoFocus}
            placeholder={placeholder}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setOpen(true);
              }
            }}
          />
          <InputGroupAddon align="inline-end">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <InputGroupButton
                  id={`${name}-picker-btn`}
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Select date"
                  disabled={disabled || readOnly}
                >
                  <CalendarIcon />
                  <span className="sr-only">Select date</span>
                </InputGroupButton>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="end"
                alignOffset={-8}
                sideOffset={10}
              >
                <Calendar
                  mode="single"
                  selected={
                    dateValue && isValid(dateValue) ? dateValue : undefined
                  }
                  onSelect={handleDateSelect}
                  initialFocus
                  defaultMonth={
                    dateValue && isValid(dateValue) ? dateValue : new Date()
                  }
                />
              </PopoverContent>
            </Popover>
          </InputGroupAddon>
        </InputGroup>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}