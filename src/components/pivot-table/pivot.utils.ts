import type {
  AggregationType,
  PivotConfig,
  PivotMatrix,
  PivotValueConfig,
} from "./pivot.types";

const KEY_SEP = "";

function getValue(row: any, key: string): any {
  return row?.[key];
}

function aggregate(values: any[], type: AggregationType): number | null {
  if (type === "count") return values.length;
  const nums = values
    .map((v) => (typeof v === "number" ? v : Number(v)))
    .filter((v) => !Number.isNaN(v));
  if (nums.length === 0) return null;
  switch (type) {
    case "sum":
      return nums.reduce((a, b) => a + b, 0);
    case "avg":
      return nums.reduce((a, b) => a + b, 0) / nums.length;
    case "min":
      return Math.min(...nums);
    case "max":
      return Math.max(...nums);
  }
}

function applyFilters<T>(data: T[], filters: Record<string, any[]>): T[] {
  const entries = Object.entries(filters).filter(
    ([, vals]) => Array.isArray(vals) && vals.length > 0
  );
  if (entries.length === 0) return data;
  return data.filter((row) =>
    entries.every(([key, vals]) => vals.includes(getValue(row, key)))
  );
}

function uniqueSortedKeys(keys: string[][]): string[][] {
  const seen = new Set<string>();
  const out: string[][] = [];
  for (const k of keys) {
    const id = k.join(KEY_SEP);
    if (!seen.has(id)) {
      seen.add(id);
      out.push(k);
    }
  }
  out.sort((a, b) => {
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      const av = a[i] ?? "";
      const bv = b[i] ?? "";
      if (av < bv) return -1;
      if (av > bv) return 1;
    }
    return 0;
  });
  return out;
}

export function computePivotMatrix<T>(
  data: T[],
  config: PivotConfig
): PivotMatrix {
  const filtered = applyFilters(data, config.filters);
  const { rows, columns, values } = config;

  const valueLabels =
    values.length === 0
      ? ["Contagem"]
      : values.map(
          (v) => v.label ?? `${aggregationLabel(v.aggregation)}(${v.field})`
        );

  const effectiveValues: PivotValueConfig[] =
    values.length === 0
      ? [{ field: "__count__", aggregation: "count" }]
      : values;

  // Group rows by row+col keys
  const rowKeys: string[][] = [];
  const colKeys: string[][] = [];
  const groups = new Map<string, T[]>(); // key: rowKey|colKey

  for (const row of filtered) {
    const rKey = rows.map((f) => String(getValue(row, f) ?? ""));
    const cKey = columns.map((f) => String(getValue(row, f) ?? ""));
    rowKeys.push(rKey);
    colKeys.push(cKey);
    const id = rKey.join(KEY_SEP) + "||" + cKey.join(KEY_SEP);
    const arr = groups.get(id);
    if (arr) arr.push(row);
    else groups.set(id, [row]);
  }

  const uniqueRows = uniqueSortedKeys(rowKeys);
  const uniqueCols = uniqueSortedKeys(colKeys);

  // cells[rowIdx][colIdx][valueIdx]
  const cells: (number | null)[][][] = uniqueRows.map(() =>
    uniqueCols.map(() => effectiveValues.map(() => null))
  );

  // For totals, we group separately to compute on the original (filtered) rows.
  const rowTotals: (number | null)[][] = uniqueRows.map(() =>
    effectiveValues.map(() => null)
  );
  const columnTotals: (number | null)[][] = uniqueCols.map(() =>
    effectiveValues.map(() => null)
  );
  const grandTotals: (number | null)[] = effectiveValues.map(() => null);

  // Index lookup
  const rowIndex = new Map<string, number>();
  uniqueRows.forEach((k, i) => rowIndex.set(k.join(KEY_SEP), i));
  const colIndex = new Map<string, number>();
  uniqueCols.forEach((k, i) => colIndex.set(k.join(KEY_SEP), i));

  // Cells aggregations
  for (const [id, rowsInGroup] of groups) {
    const [rId, cId] = id.split("||");
    const ri = rowIndex.get(rId)!;
    const ci = colIndex.get(cId)!;
    effectiveValues.forEach((v, vi) => {
      const vals =
        v.field === "__count__"
          ? rowsInGroup
          : rowsInGroup.map((r) => getValue(r, v.field));
      cells[ri][ci][vi] = aggregate(vals, v.aggregation);
    });
  }

  // Row totals
  uniqueRows.forEach((rk, ri) => {
    const id = rk.join(KEY_SEP);
    const rowsForR = filtered.filter(
      (r) => rows.map((f) => String(getValue(r, f) ?? "")).join(KEY_SEP) === id
    );
    effectiveValues.forEach((v, vi) => {
      const vals =
        v.field === "__count__"
          ? rowsForR
          : rowsForR.map((r) => getValue(r, v.field));
      rowTotals[ri][vi] = aggregate(vals, v.aggregation);
    });
  });

  // Column totals
  uniqueCols.forEach((ck, ci) => {
    const id = ck.join(KEY_SEP);
    const rowsForC = filtered.filter(
      (r) =>
        columns.map((f) => String(getValue(r, f) ?? "")).join(KEY_SEP) === id
    );
    effectiveValues.forEach((v, vi) => {
      const vals =
        v.field === "__count__"
          ? rowsForC
          : rowsForC.map((r) => getValue(r, v.field));
      columnTotals[ci][vi] = aggregate(vals, v.aggregation);
    });
  });

  // Grand totals
  effectiveValues.forEach((v, vi) => {
    const vals =
      v.field === "__count__"
        ? filtered
        : filtered.map((r) => getValue(r, v.field));
    grandTotals[vi] = aggregate(vals, v.aggregation);
  });

  return {
    rowHeaders: uniqueRows,
    columnHeaders: uniqueCols,
    valueLabels,
    cells,
    rowTotals,
    columnTotals,
    grandTotals,
  };
}

export function aggregationLabel(t: AggregationType): string {
  switch (t) {
    case "sum":
      return "Soma";
    case "avg":
      return "Média";
    case "count":
      return "Contagem";
    case "min":
      return "Mín";
    case "max":
      return "Máx";
  }
}

export function getDistinctValues<T>(data: T[], key: string): any[] {
  const set = new Set<any>();
  for (const row of data) set.add(getValue(row, key));
  return Array.from(set).sort((a, b) => {
    if (a == null) return -1;
    if (b == null) return 1;
    if (typeof a === "number" && typeof b === "number") return a - b;
    return String(a).localeCompare(String(b));
  });
}
