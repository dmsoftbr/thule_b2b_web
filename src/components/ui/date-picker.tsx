import * as React from "react";
import { Calendar1Icon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Props {
  disabled?: boolean;
  defaultValue?: Date | undefined;
  onValueChange?: (date: Date | undefined) => void;
  placeholder?: string;
}

export function DatePicker({
  defaultValue = undefined,
  disabled,
  placeholder = "Selecione uma data",
  onValueChange,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(defaultValue);

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <Button
            variant="outline"
            id="date"
            className={cn(
              "w-48 justify-between font-normal",
              date ? "" : "text-muted-foreground"
            )}
          >
            {date ? date.toLocaleDateString() : placeholder}
            <Calendar1Icon />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto overflow-hidden p-0 pb-2 flex flex-col items-center justify-center"
          align="start"
        >
          <Calendar
            startMonth={new Date(2000, 0, 1)}
            endMonth={new Date(9999, 11, 31)}
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date);
              setOpen(false);
              onValueChange?.(date);
            }}
          />
          {date && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setDate(undefined);
                setOpen(false);
              }}
              className="text-xs"
            >
              <XIcon className="size-3 text-red-500" />
              Limpar
            </Button>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
