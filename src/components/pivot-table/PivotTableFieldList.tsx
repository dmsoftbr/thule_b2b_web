import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { PivotField, PivotZone } from "./pivot.types";

type Props = {
  fields: PivotField[];
  usedFields: Set<string>;
  onAdd: (field: PivotField, zone: PivotZone) => void;
};

export function PivotTableFieldList({ fields, usedFields, onAdd }: Props) {
  return (
    <div className="flex flex-col gap-2 border rounded-lg p-3 bg-card">
      <div className="text-sm font-semibold">Campos disponíveis</div>
      <ScrollArea className="h-64">
        <div className="flex flex-col gap-1 pr-2">
          {fields.map((f) => {
            const used = usedFields.has(String(f.key));
            return (
              <div
                key={String(f.key)}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-md border px-2 py-1.5 text-sm",
                  used && "opacity-60"
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Badge variant="secondary" className="shrink-0">
                    {f.type}
                  </Badge>
                  <span className="truncate">{f.label}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ZoneButton onClick={() => onAdd(f, "rows")} label="L" title="Adicionar a Linhas" />
                  <ZoneButton onClick={() => onAdd(f, "columns")} label="C" title="Adicionar a Colunas" />
                  {f.type === "number" && (
                    <ZoneButton onClick={() => onAdd(f, "values")} label="V" title="Adicionar a Valores" />
                  )}
                  <ZoneButton onClick={() => onAdd(f, "filters")} label="F" title="Adicionar a Filtros" />
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

function ZoneButton({
  onClick,
  label,
  title,
}: {
  onClick: () => void;
  label: string;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="h-6 w-6 rounded border text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
    >
      {label}
    </button>
  );
}
