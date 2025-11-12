import { AppTooltip } from "@/components/layout/app-tooltip";
import type { ServerTableColumn } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
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
  fnView: (order: OrderModel) => void;
}

export const columns = ({ fnView }: Props): ServerTableColumn[] => [
  {
    key: "id",
    dataIndex: "id",
    title: "Pedido",
    renderItem: (order: OrderModel) => (
      <span className="font-semibold text-blue-600 ">{order.id}</span>
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
            getOrderStatusColor(order.statusId, order.creditStatusId ?? 0)
          )}
        >
          {getOrderStatusName(order.statusId, order.creditStatusId ?? 0)}
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
