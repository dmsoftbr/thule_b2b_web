import type { VirtualTableColumn } from "@/components/ui/virtual-table";
import { formatNumber } from "@/lib/number-utils";
import type { ComissaoReportModel } from "@/models/reports/comission.model";
import { format } from "date-fns";

export const columns: VirtualTableColumn<ComissaoReportModel>[] = [
  {
    key: "codEstabel",
    accessor: (row: ComissaoReportModel) => row.codEstabel,
    header: "Estab",
    footer: () => <span>Total:</span>,
    width: "80px",
  },
  {
    key: "serie",
    accessor: (row: ComissaoReportModel) => row.serie,
    header: "Série",
    width: "80px",
  },
  {
    key: "titulo",
    accessor: (row: ComissaoReportModel) => row.titulo,
    header: "Título",
    width: "140px",
  },
  {
    key: "parcela",
    accessor: (row: ComissaoReportModel) => row.parcela,
    header: "/P",
    width: "80px",
  },
  {
    key: "codGrCli",
    accessor: (row: ComissaoReportModel) => row.codGrCli,
    header: "Gr Cli",
    width: "80px",
  },
  {
    key: "descrGrCli",
    accessor: (row: ComissaoReportModel) => row.descrGrCli,
    header: "Desc.Grupo",
    width: "160px",
  },
  {
    key: "descrCondPag",
    accessor: (row: ComissaoReportModel) => row.descrCondPag,
    header: "Cond. Pagto.",
    width: "160px",
  },
  {
    key: "dtEmissao",
    accessor: (row: ComissaoReportModel) => row.dtEmissao,
    header: "Dt Emissão",
    render: (data: ComissaoReportModel) => (
      <span>{format(data.dtEmissao, "dd/MM/yyyy")}</span>
    ),
    width: "130px",
  },
  {
    key: "dtVencto",
    accessor: (row: ComissaoReportModel) => row.dtVencto,
    header: "Dt Vencto",
    render: (data: ComissaoReportModel) => (
      <span>{format(data.dtVencto, "dd/MM/yyyy")}</span>
    ),
    width: "130px",
  },
  {
    key: "dtLiquid",
    accessor: (row: ComissaoReportModel) => row.dtLiquid,
    header: "Dt Liquid",
    render: (data: ComissaoReportModel) => (
      <span>{format(data.dtLiquid, "dd/MM/yyyy")}</span>
    ),
    width: "130px",
  },
  {
    key: "vlLiqParcela",
    accessor: (row: ComissaoReportModel) => row.vlLiqParcela,
    header: "Vl Parc Liq",
    render: (data: ComissaoReportModel) => (
      <span>{formatNumber(data.vlLiqParcela, 2)}</span>
    ),
    width: "130px",
  },
  {
    key: "vlST",
    accessor: (row: ComissaoReportModel) => row.vlST,
    header: "Vl ST",
    render: (data: ComissaoReportModel) => (
      <span>{formatNumber(data.vlST, 2)}</span>
    ),
    width: "130px",
  },
  {
    key: "vlAbatimento",
    accessor: (row: ComissaoReportModel) => row.vlAbatimento,
    header: "Vl Abat",
    render: (data: ComissaoReportModel) => (
      <span>{formatNumber(data.vlAbatimento, 2)}</span>
    ),
    width: "130px",
  },
  {
    key: "vlDesconto",
    accessor: (row: ComissaoReportModel) => row.vlDesconto,
    header: "Vl Desc",
    render: (data: ComissaoReportModel) => (
      <span>{formatNumber(data.vlDesconto, 2)}</span>
    ),
  },
  {
    key: "percDescPedido",
    accessor: (row: ComissaoReportModel) => row.percDescPedido,
    header: "% Desc Ped",
    render: (data: ComissaoReportModel) => (
      <span>{formatNumber(data.percDescPedido, 2)}</span>
    ),
    width: "100px",
  },
  {
    key: "baseCalculo",
    accessor: (row: ComissaoReportModel) => row.baseCalculo,
    header: "Base Cálculo",
    render: (data: ComissaoReportModel) => (
      <span>{formatNumber(data.baseCalculo, 2)}</span>
    ),
    width: "130px",
  },
  {
    key: "percComissao",
    accessor: (row: ComissaoReportModel) => row.percComissao,
    header: "%",
    render: (data: ComissaoReportModel) => (
      <span>{formatNumber(data.percComissao, 2)}</span>
    ),
    width: "100px",
  },
  {
    key: "vlComissao",
    accessor: (row: ComissaoReportModel) => row.vlComissao,
    header: "Vl Comis",
    render: (data: ComissaoReportModel) => (
      <span>{formatNumber(data.vlComissao, 2)}</span>
    ),
    width: "130px",
    footer: (data: ComissaoReportModel[]) => {
      const totalRealizado = data
        .filter((f) => f.realizado == "Realizado")
        .reduce((sum, row) => sum + row.vlComissao, 0);
      const totalNRealizado = data
        .filter((f) => f.realizado !== "Realizado")
        .reduce((sum, row) => sum + row.vlComissao, 0);
      return (
        <div className="flex flex-col items-end justify-center">
          <span>
            Total Realizado:{" "}
            <span className="font-bold">{formatNumber(totalRealizado, 2)}</span>
          </span>
          <span>
            Total Não Realizado:{" "}
            <span className="font-bold">
              {formatNumber(totalNRealizado, 2)}
            </span>
          </span>
        </div>
      );
    },
  },
  {
    key: "dbCr",
    accessor: (row: ComissaoReportModel) => row.dbCr,
    header: "DB/CR",
    width: "100px",
  },
  {
    key: "especie",
    accessor: (row: ComissaoReportModel) => row.especie,
    header: "Espécie",
    width: "100px",
  },
  {
    key: "moeda",
    accessor: (row: ComissaoReportModel) => row.moeda,
    header: "Moeda",
    width: "100px",
  },
  {
    key: "realizado",
    accessor: (row: ComissaoReportModel) => row.realizado,
    header: "Realizado",
    width: "120px",
  },
];
