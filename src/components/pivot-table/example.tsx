import { PivotTable } from "./PivotTable";
import type { PivotConfig, PivotField } from "./pivot.types";

type Sale = {
  pais: string;
  regiao: string;
  familia: string;
  produto: string;
  ano: number;
  trimestre: string;
  qtd: number;
  valor: number;
};

const data: Sale[] = [
  { pais: "Brasil", regiao: "Sul", familia: "Bagageiro", produto: "Roof Box", ano: 2025, trimestre: "Q1", qtd: 10, valor: 12000 },
  { pais: "Brasil", regiao: "Sul", familia: "Bagageiro", produto: "Rack", ano: 2025, trimestre: "Q1", qtd: 22, valor: 9800 },
  { pais: "Brasil", regiao: "Sudeste", familia: "Bagageiro", produto: "Roof Box", ano: 2025, trimestre: "Q1", qtd: 18, valor: 21500 },
  { pais: "Brasil", regiao: "Sudeste", familia: "Bike", produto: "Suporte Bike", ano: 2025, trimestre: "Q2", qtd: 30, valor: 18000 },
  { pais: "Brasil", regiao: "Nordeste", familia: "Bike", produto: "Suporte Bike", ano: 2025, trimestre: "Q2", qtd: 14, valor: 8200 },
  { pais: "Argentina", regiao: "Buenos Aires", familia: "Bagageiro", produto: "Rack", ano: 2025, trimestre: "Q1", qtd: 9, valor: 4100 },
  { pais: "Argentina", regiao: "Buenos Aires", familia: "Bike", produto: "Suporte Bike", ano: 2025, trimestre: "Q3", qtd: 12, valor: 7600 },
  { pais: "Chile", regiao: "Santiago", familia: "Bagageiro", produto: "Roof Box", ano: 2024, trimestre: "Q4", qtd: 7, valor: 8900 },
  { pais: "Chile", regiao: "Santiago", familia: "Bike", produto: "Suporte Bike", ano: 2025, trimestre: "Q2", qtd: 11, valor: 6300 },
  { pais: "Brasil", regiao: "Sul", familia: "Bike", produto: "Suporte Bike", ano: 2024, trimestre: "Q4", qtd: 25, valor: 15000 },
];

const fields: PivotField<Sale>[] = [
  { key: "pais", label: "País", type: "string" },
  { key: "regiao", label: "Região", type: "string" },
  { key: "familia", label: "Família", type: "string" },
  { key: "produto", label: "Produto", type: "string" },
  { key: "ano", label: "Ano", type: "number" },
  { key: "trimestre", label: "Trimestre", type: "string" },
  { key: "qtd", label: "Quantidade", type: "number" },
  { key: "valor", label: "Valor", type: "number" },
];

const initialConfig: PivotConfig = {
  rows: ["pais", "familia"],
  columns: ["trimestre"],
  values: [
    { field: "valor", aggregation: "sum" },
    { field: "qtd", aggregation: "sum" },
  ],
  filters: {},
};

export function PivotTableExample() {
  return (
    <div className="p-4">
      <PivotTable
        title="Vendas por País / Família × Trimestre"
        data={data}
        fields={fields}
        initialConfig={initialConfig}
      />
    </div>
  );
}
