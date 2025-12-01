import { useEffect, useRef } from "react";
import IMask from "imask";
import { Input } from "./input";

interface Props {
  placeholder?: string;
  value?: string;
  onChange?: (value: string | undefined) => void;
  mask: string;
  disabled?: boolean;
  readOnly?: boolean;
}

export const InputMask = ({
  value,
  onChange,
  placeholder,
  mask,
  disabled,
  readOnly,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const maskRef = useRef<any>(null);

  useEffect(() => {
    // Initialize mask
    if (inputRef.current) {
      maskRef.current = IMask(inputRef.current, {
        mask: mask,
      });

      // Listen for value changes
      maskRef.current.on("accept", () => {
        onChange?.(maskRef.current.value);
      });
    }

    // Cleanup on unmount
    return () => {
      if (maskRef.current) {
        maskRef.current.destroy();
      }
    };
  }, [onChange]);

  // Keep mask in sync when value changes externally
  useEffect(() => {
    if (maskRef.current && value !== maskRef.current.value) {
      maskRef.current.value = value || "";
    }
  }, [value]);

  return (
    <Input
      readOnly={readOnly}
      disabled={disabled}
      ref={inputRef}
      defaultValue={value}
      placeholder={placeholder}
    />
  );
};
