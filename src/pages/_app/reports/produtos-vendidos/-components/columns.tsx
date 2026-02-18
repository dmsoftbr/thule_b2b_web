import type { ServerTableColumn } from "@/components/server-table/server-table";
import { formatDate } from "@/lib/datetime-utils";
import { formatNumber } from "@/lib/number-utils";
import { formatCpfCnpj } from "@/lib/string-utils";
import type { rptProdutosVendidosModel } from "@/models/reports/rptProdutosVendidos.model";

export const columns = (): ServerTableColumn[] => [
  {
    key: "itCodigo",
    dataIndex: "itCodigo",
    title: "Item",
    cellClassName: "text-xs",
    className: "text-xs",
    renderItem: (data: rptProdutosVendidosModel) => (
      <span className="font-semibold text-blue-600 ">{data.itCodigo}</span>
    ),
    sortable: true,
  },
  {
    key: "descItem",
    dataIndex: "descItem",
    title: "Descrição",
    cellClassName: "text-xs",
    className: "text-xs",
    renderItem: (data: rptProdutosVendidosModel) => (
      <span className="font-semibold text-blue-600 ">{data.descItem}</span>
    ),
    sortable: true,
  },
  {
    key: "un",
    dataIndex: "un",
    title: "UN",
    cellClassName: "text-xs",
    className: "text-xs",
    renderItem: (data: rptProdutosVendidosModel) => <span>{data.un}</span>,
    sortable: true,
  },
  {
    key: "qtFatur1",
    dataIndex: "qtFatur1",
    title: "Qt Faturada",
    cellClassName: "text-xs",
    className: "text-xs",
    renderItem: (data: rptProdutosVendidosModel) => (
      <span>{formatNumber(data.qtFatur1, 3)}</span>
    ),
    sortable: true,
  },
  {
    key: "vlMerc1",
    dataIndex: "vlMerc1",
    title: "Valor Merc.",
    cellClassName: "text-xs",
    className: "text-xs",
    renderItem: (data: rptProdutosVendidosModel) => (
      <span>{formatNumber(data.vlMerc1, 3)}</span>
    ),
    sortable: true,
  },
  {
    key: "vlUnMed1",
    dataIndex: "vlUnMed1",
    title: "Unitário",
    cellClassName: "text-xs !min-w-[200px]",
    className: "text-xs !min-w-[200px]",
    renderItem: (data: rptProdutosVendidosModel) => (
      <span>{formatNumber(data.vlUnMed1, 3)}</span>
    ),
    sortable: true,
  },
];
