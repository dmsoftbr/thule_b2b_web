import type { ServerTableColumn } from "@/components/server-table/server-table";
import { Checkbox } from "@/components/ui/checkbox";
import { formatNumber } from "@/lib/number-utils";
import { cn } from "@/lib/utils";
import type { OrderConfirmation } from "@/models/orders/order-confirmation-model";

interface Props {
  selectedIds: Set<string>;
  onToggle: (row: OrderConfirmation, checked: boolean) => void;
  allSelected: boolean;
  someSelected: boolean;
  hasRows: boolean;
  onToggleAll: (checked: boolean) => void;
}

export const columns = ({
  selectedIds,
  onToggle,
  allSelected,
  someSelected,
  hasRows,
  onToggleAll,
}: Props): ServerTableColumn[] => [
  {
    key: "select",
    dataIndex: "id",
    className: "w-10",
    title: (
      <div className="flex items-center justify-center">
        <Checkbox
          disabled={!hasRows}
          checked={allSelected ? true : someSelected ? "indeterminate" : false}
          onCheckedChange={(v) => onToggleAll(v === true)}
          aria-label="Selecionar todos"
        />
      </div>
    ),
    renderItem: (row: OrderConfirmation) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={selectedIds.has(row.id)}
          onCheckedChange={(v) => onToggle(row, v === true)}
          aria-label="Selecionar item"
        />
      </div>
    ),
  },
  {
    key: "representante",
    dataIndex: "representante",
    title: "Representante",
    className: "text-xs whitespace-nowrap",
    cellClassName: "text-xs",
    renderItem: (row: OrderConfirmation) => <span>{row.representante}</span>,
    sortable: true,
  },
  {
    key: "pedido",
    dataIndex: "pedido",
    title: "Pedido",
    className: "w-[110px] text-xs whitespace-nowrap",
    cellClassName: "w-[110px] text-xs",
    renderItem: (row: OrderConfirmation) => (
      <span className="font-semibold text-blue-600">{row.pedido}</span>
    ),
    sortable: true,
  },
  {
    key: "cliente",
    dataIndex: "clienteNome",
    title: "Cliente",
    className: "text-xs whitespace-nowrap",
    cellClassName: "text-xs",
    renderItem: (row: OrderConfirmation) => (
      <span>{row.clienteAbrev || row.clienteNome}</span>
    ),
    sortable: true,
  },
  {
    key: "seq",
    dataIndex: "sequencia",
    title: "Seq",
    className: "w-[70px] text-xs whitespace-nowrap",
    cellClassName: "text-xs",
    renderItem: (row: OrderConfirmation) => (
      <div className="text-center">{row.sequencia}</div>
    ),
    sortable: true,
  },
  {
    key: "item",
    dataIndex: "item",
    title: "Item",
    className: "w-[110px] text-xs whitespace-nowrap",
    cellClassName: "text-xs",
    renderItem: (row: OrderConfirmation) => <span>{row.item}</span>,
    sortable: true,
  },
  {
    key: "descricao",
    dataIndex: "descricao",
    title: "Descrição",
    className: "text-xs whitespace-nowrap",
    cellClassName: "text-xs",
    renderItem: (row: OrderConfirmation) => <span>{row.descricao}</span>,
    sortable: true,
  },
  {
    key: "saldoPedido",
    dataIndex: "saldoPedido",
    title: "Saldo Pedido",
    className: "w-[110px] text-xs whitespace-nowrap",
    cellClassName: "text-xs",
    renderItem: (row: OrderConfirmation) => (
      <div className="text-right tabular-nums">
        {formatNumber(row.saldoPedido, 2)}
      </div>
    ),
    sortable: true,
  },
  {
    key: "qtEstoque",
    dataIndex: "qtEstoque",
    title: "Qt Estoque",
    className: "w-[110px] text-xs whitespace-nowrap",
    cellClassName: "text-xs",
    renderItem: (row: OrderConfirmation) => (
      <div
        className={cn(
          "text-right tabular-nums",
          // destaca estoque insuficiente para o saldo do pedido
          row.qtEstoque < row.saldoPedido && "font-semibold text-red-600"
        )}
      >
        {formatNumber(row.qtEstoque, 2)}
      </div>
    ),
    sortable: true,
  },
];
