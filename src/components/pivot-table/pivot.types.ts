export type AggregationType = "sum" | "avg" | "count" | "min" | "max";

export type PivotFieldType = "string" | "number" | "date" | "boolean";

export type PivotField<T = any> = {
  key: keyof T | string;
  label: string;
  type: PivotFieldType;
};

export type PivotValueConfig = {
  field: string;
  aggregation: AggregationType;
  label?: string;
};

export type PivotConfig = {
  rows: string[];
  columns: string[];
  values: PivotValueConfig[];
  filters: Record<string, any[]>;
};

export type PivotZone = "rows" | "columns" | "values" | "filters";

export type PivotMatrix = {
  rowHeaders: string[][];
  columnHeaders: string[][];
  valueLabels: string[];
  cells: (number | null)[][][];
  rowTotals: (number | null)[][];
  columnTotals: (number | null)[][];
  grandTotals: (number | null)[];
};
