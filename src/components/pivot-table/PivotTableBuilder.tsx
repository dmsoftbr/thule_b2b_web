import { PivotTableFieldList } from "./PivotTableFieldList";
import {
  PivotTableDropZoneSimple,
  PivotTableDropZoneValues,
} from "./PivotTableDropZone";
import type {
  AggregationType,
  PivotConfig,
  PivotField,
  PivotZone,
} from "./pivot.types";

type Props = {
  fields: PivotField[];
  config: PivotConfig;
  onChange: (config: PivotConfig) => void;
};

export function PivotTableBuilder({ fields, config, onChange }: Props) {
  const usedFields = new Set<string>([
    ...config.rows,
    ...config.columns,
    ...config.values.map((v) => v.field),
    ...Object.keys(config.filters),
  ]);

  const addField = (field: PivotField, zone: PivotZone) => {
    const key = String(field.key);
    if (usedFields.has(key)) return;
    const next: PivotConfig = {
      rows: [...config.rows],
      columns: [...config.columns],
      values: [...config.values],
      filters: { ...config.filters },
    };
    if (zone === "rows") next.rows.push(key);
    else if (zone === "columns") next.columns.push(key);
    else if (zone === "values")
      next.values.push({
        field: key,
        aggregation: field.type === "number" ? "sum" : "count",
      });
    else next.filters[key] = [];
    onChange(next);
  };

  const removeFromRows = (k: string) =>
    onChange({ ...config, rows: config.rows.filter((r) => r !== k) });
  const removeFromColumns = (k: string) =>
    onChange({ ...config, columns: config.columns.filter((r) => r !== k) });
  const removeFromValues = (k: string) =>
    onChange({ ...config, values: config.values.filter((v) => v.field !== k) });
  const removeFromFilters = (k: string) => {
    const filters = { ...config.filters };
    delete filters[k];
    onChange({ ...config, filters });
  };
  const changeAggregation = (k: string, agg: AggregationType) =>
    onChange({
      ...config,
      values: config.values.map((v) =>
        v.field === k ? { ...v, aggregation: agg } : v
      ),
    });

  return (
    <div className="flex flex-col gap-3">
      <PivotTableFieldList
        fields={fields}
        usedFields={usedFields}
        onAdd={addField}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <PivotTableDropZoneSimple
          title="Filtros"
          zone="filters"
          fields={fields}
          items={Object.keys(config.filters)}
          onRemove={removeFromFilters}
        />
        <PivotTableDropZoneSimple
          title="Colunas"
          zone="columns"
          fields={fields}
          items={config.columns}
          onRemove={removeFromColumns}
        />
        <PivotTableDropZoneSimple
          title="Linhas"
          zone="rows"
          fields={fields}
          items={config.rows}
          onRemove={removeFromRows}
        />
        <PivotTableDropZoneValues
          fields={fields}
          items={config.values}
          onRemove={removeFromValues}
          onChangeAggregation={changeAggregation}
        />
      </div>
    </div>
  );
}
