import { Badge } from "@/components/ui/badge";
import { XIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type {
  AggregationType,
  PivotField,
  PivotValueConfig,
} from "./pivot.types";
import { aggregationLabel } from "./pivot.utils";

const AGGREGATIONS: AggregationType[] = ["sum", "avg", "count", "min", "max"];

type SimpleProps = {
  title: string;
  zone: "rows" | "columns" | "filters";
  fields: PivotField[];
  items: string[];
  onRemove: (field: string) => void;
};

export function PivotTableDropZoneSimple({
  title,
  fields,
  items,
  onRemove,
}: SimpleProps) {
  const labelOf = (k: string) => fields.find((f) => f.key === k)?.label ?? k;
  return (
    <div className="flex flex-col gap-2 border rounded-lg p-3 bg-card min-h-[88px]">
      <div className="text-xs font-semibold text-muted-foreground uppercase">
        {title}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.length === 0 ? (
          <span className="text-xs text-muted-foreground italic">
            Nenhum campo
          </span>
        ) : (
          items.map((k) => (
            <Badge key={k} variant="secondary" className="gap-1 pr-1">
              {labelOf(k)}
              <button
                type="button"
                onClick={() => onRemove(k)}
                className="hover:bg-muted-foreground/20 rounded p-0.5"
              >
                <XIcon className="h-3 w-3" />
              </button>
            </Badge>
          ))
        )}
      </div>
    </div>
  );
}

type ValuesProps = {
  fields: PivotField[];
  items: PivotValueConfig[];
  onRemove: (field: string) => void;
  onChangeAggregation: (field: string, agg: AggregationType) => void;
};

export function PivotTableDropZoneValues({
  fields,
  items,
  onRemove,
  onChangeAggregation,
}: ValuesProps) {
  const labelOf = (k: string) => fields.find((f) => f.key === k)?.label ?? k;
  return (
    <div className="flex flex-col gap-2 border rounded-lg p-3 bg-card min-h-[88px]">
      <div className="text-xs font-semibold text-muted-foreground uppercase">
        Valores
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.length === 0 ? (
          <span className="text-xs text-muted-foreground italic">
            Nenhum campo
          </span>
        ) : (
          items.map((v) => (
            <Badge key={v.field} variant="secondary" className="gap-1 pr-1">
              <DropdownMenu>
                <DropdownMenuTrigger className="hover:underline">
                  {aggregationLabel(v.aggregation)}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {AGGREGATIONS.map((a) => (
                    <DropdownMenuItem
                      key={a}
                      onClick={() => onChangeAggregation(v.field, a)}
                    >
                      {aggregationLabel(a)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <span>de {labelOf(v.field)}</span>
              <button
                type="button"
                onClick={() => onRemove(v.field)}
                className="hover:bg-muted-foreground/20 rounded p-0.5"
              >
                <XIcon className="h-3 w-3" />
              </button>
            </Badge>
          ))
        )}
      </div>
    </div>
  );
}
