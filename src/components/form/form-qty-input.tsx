import { ChevronDown, ChevronUp } from "lucide-react";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { NumericFormat, type NumericFormatProps } from "react-number-format";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props extends Omit<NumericFormatProps, "value" | "onValueChange"> {
  stepper?: number;
  thousandSeparator?: string;
  placeholder?: string;
  defaultValue?: number;
  min?: number;
  max?: number;
  value?: number; // Controlled value
  suffix?: string;
  prefix?: string;
  onValueChange?: (value: number | undefined) => void;
  fixedDecimalScale?: boolean;
  decimalScale?: number;
  plusSlot?: React.ReactElement;
  minusSlot?: React.ReactElement;
  disabled?: boolean;
}

export const FormInputQty = forwardRef<HTMLInputElement, Props>(
  (
    {
      stepper,
      thousandSeparator,
      placeholder,
      defaultValue = 0,
      min = -Infinity,
      max = Infinity,
      onValueChange,
      fixedDecimalScale = false,
      decimalScale = 0,
      suffix,
      prefix,
      value: controlledValue,
      minusSlot,
      plusSlot,
      disabled,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = useState<number | undefined>(
      controlledValue ?? defaultValue
    );

    const inputRef = useRef<HTMLInputElement>(null);

    const handleIncrement = useCallback(() => {
      if (disabled) return;
      setValue((prev) =>
        prev === undefined
          ? (stepper ?? 1)
          : Math.min(prev + (stepper ?? 1), max)
      );
    }, [stepper, max]);

    const handleDecrement = useCallback(() => {
      if (disabled) return;
      setValue((prev) =>
        prev === undefined
          ? -(stepper ?? 1)
          : Math.max(prev - (stepper ?? 1), min)
      );
    }, [stepper, min]);

    useEffect(() => {
      // const handleKeyDown = (e: KeyboardEvent) => {
      //   if (
      //     document.activeElement ===
      //     (ref as React.RefObject<HTMLInputElement>).current
      //   ) {
      //     if (e.key === "ArrowUp") {
      //       handleIncrement();
      //     } else if (e.key === "ArrowDown") {
      //       handleDecrement();
      //     }
      //   }
      // };

      //window.addEventListener("keydown", handleKeyDown);

      return () => {
        //window.removeEventListener("keydown", handleKeyDown);
      };
    }, [handleIncrement, handleDecrement, ref]);

    useEffect(() => {
      if (controlledValue !== undefined) {
        setValue(controlledValue);
      }
    }, [controlledValue]);

    const handleChange = (values: {
      value: string;
      floatValue: number | undefined;
    }) => {
      if (disabled) return;
      const newValue =
        values.floatValue === undefined ? undefined : values.floatValue;
      setValue(newValue);
      if (onValueChange) {
        onValueChange(newValue);
      }
    };

    const handleBlur = () => {
      if (value !== undefined && inputRef && inputRef.current) {
        if (value < min) {
          setValue(min);
          inputRef.current!.value = String(min);
        } else if (value > max) {
          setValue(max);
          inputRef.current!.value = String(max);
        }
      }
    };

    return (
      <div className="flex items-center">
        <Button
          aria-label="Diminuir Valor"
          className="px-2 h-9 rounded-r-none rounded-tr-none border-input border-r-0 focus-visible:relative"
          variant="outline"
          onClick={handleDecrement}
          disabled={disabled || value === min}
        >
          {minusSlot ? minusSlot : <ChevronDown size={15} />}
        </Button>
        <NumericFormat
          value={value}
          onValueChange={handleChange}
          thousandSeparator={thousandSeparator}
          decimalScale={decimalScale}
          fixedDecimalScale={fixedDecimalScale}
          allowNegative={min < 0}
          valueIsNumericString
          onBlur={handleBlur}
          max={max}
          min={min}
          suffix={suffix}
          prefix={prefix}
          customInput={Input}
          placeholder={placeholder}
          className="[appearance:textfield] min-w-[60px] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-center rounded-none relative"
          getInputRef={inputRef}
          disabled={disabled}
          {...props}
        />

        <div className="flex flex-col">
          <Button
            aria-label="Aumentar Valor"
            className="px-2 h-9 rounded-tl-none rounded-bl-none border-input border-l-0 border-b-[0.5px] focus-visible:relative"
            variant="outline"
            onClick={handleIncrement}
            disabled={disabled || value === max}
          >
            {plusSlot ? plusSlot : <ChevronUp size={15} />}
          </Button>
        </div>
      </div>
    );
  }
);
