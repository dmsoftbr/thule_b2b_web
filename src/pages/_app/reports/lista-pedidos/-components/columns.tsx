import type { ServerTableColumn } from "@/components/server-table/server-table";
import { formatDate } from "@/lib/datetime-utils";
import { formatNumber } from "@/lib/number-utils";
import { formatCpfCnpj } from "@/lib/string-utils";
import type { rptListaPedidosResponseDto } from "@/models/reports/rptListaPedidos.model";

export const columns = (): ServerTableColumn[] => [
  {
    key: "nrPedCli",
    dataIndex: "nrPedCli",
    title: "Pedido",
    cellClassName: "text-xs",
    className: "text-xs",
    renderItem: (data: rptListaPedidosResponseDto) => (
      <span className="font-semibold text-blue-600 ">{data.nrPedCli}</span>
    ),
    sortable: true,
  },
  {
    key: "nomeAbrev",
    dataIndex: "nomeAbrev",
    title: "Cliente",
    cellClassName: "text-xs",
    className: "text-xs",
    renderItem: (data: rptListaPedidosResponseDto) => (
      <span className="font-semibold text-blue-600 ">{data.nomeAbrev}</span>
    ),
    sortable: true,
  },
  {
    key: "noAbRepPri",
    dataIndex: "noAbRepPri",
    title: "Representante",
    cellClassName: "text-xs",
    className: "text-xs",
    renderItem: (data: rptListaPedidosResponseDto) => (
      <span>{data.noAbRepPri}</span>
    ),
    sortable: true,
  },
  {
    key: "nrSequencia",
    dataIndex: "nrSequencia",
    title: "Seq",
    cellClassName: "text-xs",
    className: "text-xs",
    renderItem: (data: rptListaPedidosResponseDto) => (
      <span>{data.nrSequencia}</span>
    ),
    sortable: true,
  },
  {
    key: "itCodigo",
    dataIndex: "itCodigo",
    title: "Item",
    cellClassName: "text-xs",
    className: "text-xs",
    renderItem: (data: rptListaPedidosResponseDto) => (
      <span>{data.itCodigo}</span>
    ),
    sortable: true,
  },
  {
    key: "descItem",
    dataIndex: "descItem",
    title: "Descrição",
    cellClassName: "text-xs !min-w-[200px]",
    className: "text-xs !min-w-[200px]",
    renderItem: (data: rptListaPedidosResponseDto) => (
      <span>{data.descItem}</span>
    ),
    sortable: true,
  },
  {
    key: "codFamilia",
    dataIndex: "codFamilia",
    title: "Família",
    cellClassName: "text-xs",
    className: "text-xs",
    renderItem: (data: rptListaPedidosResponseDto) => (
      <span>{data.codFamilia}</span>
    ),
    sortable: true,
  },
  {
    key: "codModelo",
    dataIndex: "codModelo",
    title: "Modelo",
    cellClassName: "text-xs",
    className: "text-xs",
    renderItem: (data: rptListaPedidosResponseDto) => (
      <span>{formatCpfCnpj(data.codModelo)}</span>
    ),
    sortable: true,
  },
  {
    key: "qtPedida",
    dataIndex: "qtPedida",
    title: "Qt.Pedida",
    cellClassName: "text-xs",
    className: "text-xs",
    renderItem: (data: rptListaPedidosResponseDto) => (
      <span>{formatNumber(data.qtPedida, 0)}</span>
    ),
    sortable: true,
  },
  {
    key: "qtAtendida",
    dataIndex: "qtAtendida",
    title: "Qt.Atendida",
    cellClassName: "text-xs",
    className: "text-xs",
    renderItem: (data: rptListaPedidosResponseDto) => (
      <span>{formatNumber(data.qtAtendida, 0)}</span>
    ),
    sortable: true,
  },
  {
    key: "vlPreuni",
    dataIndex: "vlPreuni",
    title: "Preço Unit.",
    cellClassName: "text-xs",
    className: "text-xs",
    renderItem: (data: rptListaPedidosResponseDto) => (
      <span>{formatNumber(data.vlPreuni, 2)}</span>
    ),
    sortable: true,
  },
  {
    key: "dtEntregaOrig",
    dataIndex: "dtEntregaOrig",
    title: "Dt. Requerida",
    cellClassName: "text-xs",
    className: "text-xs",
    renderItem: (data: rptListaPedidosResponseDto) => (
      <span>{formatDate(data.dtEntregaOrig)}</span>
    ),
    sortable: true,
  },
  {
    key: "dtEntrega",
    dataIndex: "dtEntrega",
    title: "Dt. Entrega",
    cellClassName: "text-xs",
    className: "text-xs",
    renderItem: (data: rptListaPedidosResponseDto) => (
      <span>{formatDate(data.dtEntrega)}</span>
    ),
    sortable: true,
  },
  {
    key: "prioridade",
    dataIndex: "prioridade",
    title: "Prioridade",
    cellClassName: "text-xs",
    className: "text-xs",
    renderItem: (data: rptListaPedidosResponseDto) => (
      <span>{data.prioridade}</span>
    ),
    sortable: true,
  },
  {
    key: "situacao",
    dataIndex: "situacao",
    title: "Situação",
    cellClassName: "text-xs",
    className: "text-xs",
    renderItem: (data: rptListaPedidosResponseDto) => (
      <span>{data.situacao}</span>
    ),
    sortable: true,
  },
  {
    key: "aliquotaIcm",
    dataIndex: "aliquotaIcm",
    title: "% ICMS",
    cellClassName: "text-xs",
    className: "text-xs",
    renderItem: (data: rptListaPedidosResponseDto) => (
      <span>{formatNumber(data.aliquotaIcm, 2)}</span>
    ),
    sortable: true,
  },
  {
    key: "aliqPiscof",
    dataIndex: "aliquotaliqPiscofaIcm",
    title: "% PIS/COFINS",
    cellClassName: "text-xs",
    className: "text-xs",
    renderItem: (data: rptListaPedidosResponseDto) => (
      <span>{formatNumber(data.aliqPiscof, 2)}</span>
    ),
    sortable: true,
  },
  {
    key: "aliqIpi",
    dataIndex: "aliqIpi",
    title: "% IPI",
    cellClassName: "text-xs",
    className: "text-xs",
    renderItem: (data: rptListaPedidosResponseDto) => (
      <span>{formatNumber(data.aliqIpi, 2)}</span>
    ),
    sortable: true,
  },
  {
    key: "totLiquido",
    dataIndex: "totLiquido",
    title: "Total Líquido",
    cellClassName: "text-xs",
    className: "text-xs",
    renderItem: (data: rptListaPedidosResponseDto) => (
      <span>{formatNumber(data.totLiquido, 2)}</span>
    ),
    sortable: true,
  },
  {
    key: "totBruto",
    dataIndex: "totBruto",
    title: "Total Bruto",
    cellClassName: "text-xs",
    className: "text-xs",
    renderItem: (data: rptListaPedidosResponseDto) => (
      <span>{formatNumber(data.totBruto, 2)}</span>
    ),
    sortable: true,
  },
  {
    key: "observacao",
    dataIndex: "observacao",
    title: "Observações",
    cellClassName: "text-xs",
    className: "text-xs",
    renderItem: (data: rptListaPedidosResponseDto) => (
      <span>{data.observacao}</span>
    ),
    sortable: true,
  },
];
