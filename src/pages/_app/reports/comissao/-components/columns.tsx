import { formatNumber } from "@/lib/number-utils";
import type { ComissaoReportModel } from "@/models/reports/comission.model";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const columns: ColumnDef<ComissaoReportModel>[] = [
  {
    accessorKey: "codEstabel",
    header: "Estab",
  },
  {
    accessorKey: "serie",
    header: "Série",
  },
  {
    accessorKey: "titulo",
    header: "Título",
  },
  {
    accessorKey: "parcela",
    header: "/P",
  },
  {
    accessorKey: "nomeAbrev",
    header: "Nome Abrev",
  },
  {
    accessorKey: "codGrCli",
    header: "Gr Cli",
  },
  {
    accessorKey: "descrGrCli",
    header: "Desc.Grupo",
  },
  {
    accessorKey: "descrCondPag",
    header: "Cond. Pagto.",
  },
  {
    accessorKey: "dtEmissao",
    header: "Dt Emissão",
    cell: ({ row }) => (
      <span>{format(row.original.dtEmissao, "dd/MM/yyyy")}</span>
    ),
  },
  {
    accessorKey: "dtVencto",
    header: "Dt Vencto",
    cell: ({ row }) => (
      <span>{format(row.original.dtVencto, "dd/MM/yyyy")}</span>
    ),
  },
  {
    accessorKey: "dtLiquid",
    header: "Dt Liquid",
    cell: ({ row }) => (
      <span>{format(row.original.dtLiquid, "dd/MM/yyyy")}</span>
    ),
  },
  {
    accessorKey: "vlLiqParcela",
    header: "Vl Parc Liq",
    cell: ({ row }) => (
      <span>{formatNumber(row.original.vlLiqParcela, 2)}</span>
    ),
  },
  {
    accessorKey: "vlST",
    header: "Vl ST",
    cell: ({ row }) => <span>{formatNumber(row.original.vlST, 2)}</span>,
  },
  {
    accessorKey: "vlAbatimento",
    header: "Vl Abat",
    cell: ({ row }) => (
      <span>{formatNumber(row.original.vlAbatimento, 2)}</span>
    ),
  },
  {
    accessorKey: "vlDesconto",
    header: "Vl Desc",
    cell: ({ row }) => <span>{formatNumber(row.original.vlDesconto, 2)}</span>,
  },
  {
    accessorKey: "percDescPedido",
    header: "% Desc Ped",
    cell: ({ row }) => (
      <span>{formatNumber(row.original.percDescPedido, 2)}</span>
    ),
  },
  {
    accessorKey: "baseCalculo",
    header: "Base Cálculo",
    cell: ({ row }) => <span>{formatNumber(row.original.baseCalculo, 2)}</span>,
  },
  {
    accessorKey: "percComissao",
    header: "%",
    cell: ({ row }) => (
      <span>{formatNumber(row.original.percComissao, 2)}</span>
    ),
  },
  {
    accessorKey: "vlComissao",
    header: "Vl Comis",
    cell: ({ row }) => <span>{formatNumber(row.original.vlComissao, 2)}</span>,
    // footer: (data: ComissaoReportModel[]) => {
    //   const totalRealizado = data
    //     .filter((f) => f.realizado == "Realizado")
    //     .reduce((sum, row) => sum + row.vlComissao, 0);
    //   const totalNRealizado = data
    //     .filter((f) => f.realizado !== "Realizado")
    //     .reduce((sum, row) => sum + row.vlComissao, 0);
    //   return (
    //     <div className="flex flex-col items-end justify-center">
    //       <span>
    //         Total Realizado:{" "}
    //         <span className="font-bold">{formatNumber(totalRealizado, 2)}</span>
    //       </span>
    //       <span>
    //         Total Não Realizado:{" "}
    //         <span className="font-bold">
    //           {formatNumber(totalNRealizado, 2)}
    //         </span>
    //       </span>
    //     </div>
    //   );
    // },
  },
  {
    accessorKey: "dbCr",
    header: "DB/CR",
  },
  {
    accessorKey: "especie",
    header: "Espécie",
  },
  {
    accessorKey: "moeda",
    header: "Moeda",
  },
  {
    accessorKey: "realizado",
    header: "Realizado",
  },
];
