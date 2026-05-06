import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PivotTableBuilder } from "./PivotTableBuilder";
import { PivotTableGrid } from "./PivotTableGrid";
import { computePivotMatrix, getDistinctValues } from "./pivot.utils";
import type { PivotConfig, PivotField } from "./pivot.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props<T> = {
  data: T[];
  fields: PivotField<T>[];
  initialConfig?: PivotConfig;
  onConfigChange?: (config: PivotConfig) => void;
  title?: string;
};

const EMPTY_CONFIG: PivotConfig = {
  rows: [],
  columns: [],
  values: [],
  filters: {},
};

export function PivotTable<T>({
  data,
  fields,
  initialConfig,
  onConfigChange,
  title = "Tabela Dinâmica",
}: Props<T>) {
  const [config, setConfig] = useState<PivotConfig>(
    initialConfig ?? EMPTY_CONFIG
  );

  useEffect(() => {
    onConfigChange?.(config);
  }, [config, onConfigChange]);

  const rowFields = useMemo(
    () =>
      config.rows
        .map((k) => fields.find((f) => f.key === k))
        .filter(Boolean) as PivotField[],
    [config.rows, fields]
  );
  const columnFields = useMemo(
    () =>
      config.columns
        .map((k) => fields.find((f) => f.key === k))
        .filter(Boolean) as PivotField[],
    [config.columns, fields]
  );

  const matrix = useMemo(
    () => computePivotMatrix(data as any[], config),
    [data, config]
  );

  const filterKeys = Object.keys(config.filters);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
          <PivotTableBuilder
            fields={fields as PivotField[]}
            config={config}
            onChange={setConfig}
          />
          <div className="flex flex-col gap-3 min-w-0">
            {filterKeys.length > 0 && (
              <div className="flex flex-wrap gap-3 p-3 border rounded-lg bg-muted/20">
                {filterKeys.map((fk) => {
                  const field = fields.find((f) => f.key === fk);
                  const distinct = getDistinctValues(data as any[], fk);
                  const current = config.filters[fk] ?? [];
                  return (
                    <div key={fk} className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {field?.label ?? fk}:
                      </span>
                      <Select
                        value={current[0] != null ? String(current[0]) : "__all__"}
                        onValueChange={(v) => {
                          const next = { ...config.filters };
                          next[fk] = v === "__all__" ? [] : [parseMaybe(v)];
                          setConfig({ ...config, filters: next });
                        }}
                      >
                        <SelectTrigger className="h-8 min-w-[160px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__all__">(Todos)</SelectItem>
                          {distinct.map((v) => (
                            <SelectItem
                              key={String(v)}
                              value={String(v)}
                            >
                              {String(v)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                })}
              </div>
            )}
            <PivotTableGrid
              matrix={matrix}
              rowFields={rowFields}
              columnFields={columnFields}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function parseMaybe(v: string): any {
  if (v === "true") return true;
  if (v === "false") return false;
  const n = Number(v);
  if (!Number.isNaN(n) && v.trim() !== "") return n;
  return v;
}
