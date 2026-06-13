import { AppTooltip } from "@/components/layout/app-tooltip";
import type { ServerTableColumn } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/lib/datetime-utils";
import { formatNumber } from "@/lib/number-utils";
import {
  getOrderStatusColor,
  getOrderStatusName,
} from "@/lib/order-status-utils";
import { cn } from "@/lib/utils";
import type { OrderModel } from "@/models/orders/order-model";
import { SearchIcon } from "lucide-react";

interface Props {
  selectedIds: Set<string>;
  onToggle: (orderId: string, checked: boolean) => void;
  fnView: (order: OrderModel) => void;
  allSelected: boolean;
  someSelected: boolean;
  hasRows: boolean;
  onToggleAll: (checked: boolean) => void;
}

export const columns = ({
  selectedIds,
  onToggle,
  fnView,
  allSelected,
  someSelected,
  hasRows,
  onToggleAll,
}: Props): ServerTableColumn[] => [
  {
    key: "select",
    dataIndex: "id",
    className: "w-10",
    // Checkbox de "selecionar todos" (da página atual) no cabeçalho.
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
    renderItem: (order: OrderModel) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={selectedIds.has(order.id)}
          onCheckedChange={(v) => onToggle(order.id, v === true)}
          aria-label="Selecionar pedido"
        />
      </div>
    ),
  },
  {
    key: "id",
    dataIndex: "orderId",
    title: "Pedido",
    renderItem: (order: OrderModel) => (
      <span className="font-semibold text-blue-600 ">
        {order.orderId ?? order.id}
      </span>
    ),
    sortable: true,
  },
  {
    key: "customerId",
    dataIndex: "customerId",
    title: "Cliente",
    cellClassName: "text-xs",
    renderItem: (order: OrderModel) => (
      <span>
        {order.customerId} - {order.customer?.abbreviation}
      </span>
    ),
    sortable: true,
  },
  {
    key: "orderRepId",
    dataIndex: "orderRepId",
    title: "Ped. Distribuidor",
    cellClassName: "text-xs",
    renderItem: (order: OrderModel) => <span>{order.erpOrderId}</span>,
    sortable: true,
  },
  {
    key: "repName",
    dataIndex: "repName",
    title: "Representante",
    cellClassName: "text-xs",
    renderItem: (order: OrderModel) => (
      <span>
        {order.representativeId} - {order.representative?.abbreviation}
      </span>
    ),
    sortable: true,
  },
  {
    key: "createdAt",
    dataIndex: "createdAt",
    title: "Dt Implantação",
    cellClassName: "text-xs",
    renderItem: (order: OrderModel) => (
      <div className="text-center">{formatDate(order.createdAt)}</div>
    ),
    sortable: true,
  },
  {
    key: "totalOrderValue",
    dataIndex: "totalOrderValue",
    title: "Total do Pedido",
    cellClassName: "text-xs",
    renderItem: (order: OrderModel) => (
      <div className="text-right">{formatNumber(order.grossTotalValue, 2)}</div>
    ),
    sortable: true,
  },
  {
    key: "statusId",
    dataIndex: "statusId",
    title: "Situação",
    renderItem: (order: OrderModel) => (
      <div className="flex items-center justify-center">
        <span
          className={cn(
            "px-2 py-1 text-xs font-medium rounded-full",
            getOrderStatusColor(order)
          )}
        >
          {getOrderStatusName(order)}
        </span>
      </div>
    ),
    sortable: true,
  },
  {
    key: "actions",
    dataIndex: "id",
    title: "Ações",
    renderItem: (order: OrderModel) => (
      <div className="flex justify-end">
        <AppTooltip message="Visualizar Pedido">
          <Button onClick={() => fnView(order)} variant="secondary" size="sm">
            <SearchIcon className="size-4" />
          </Button>
        </AppTooltip>
      </div>
    ),
  },
];
