import { AppTooltip } from "@/components/layout/app-tooltip";
import type { ServerTableColumn } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/datetime-utils";
import { formatNumber } from "@/lib/number-utils";
import {
  getOrderStatusColor,
  getOrderStatusName,
} from "@/lib/order-status-utils";
import { cn } from "@/lib/utils";
import type { OrderModel } from "@/models/orders/order-model";
import {
  CopyIcon,
  DollarSignIcon,
  EditIcon,
  ExternalLinkIcon,
  MenuIcon,
  SearchIcon,
  SettingsIcon,
  XSquareIcon,
} from "lucide-react";

interface Props {
  fnView: (order: OrderModel, anotherTab?: boolean) => void;
  fnEdit: (order: OrderModel) => void;
  fnCancel: (order: OrderModel) => void;
}

export const columns = ({
  fnEdit,
  fnView,
  fnCancel,
}: Props): ServerTableColumn[] => [
  {
    key: "orderId",
    dataIndex: "orderId",
    title: "Pedido",
    renderItem: (order: OrderModel) => (
      <span className="font-semibold text-blue-600 ">{order.orderId}</span>
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
    renderItem: (order: OrderModel) => <span>{order.orderRepId}</span>,
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
        <AppTooltip message="Alterar Pedido">
          <Button onClick={() => fnEdit(order)} variant="secondary" size="sm">
            <EditIcon className="size-4" />
          </Button>
        </AppTooltip>
        <AppTooltip message="Visualizar Pedido">
          <Button onClick={() => fnView(order)} variant="secondary" size="sm">
            <SearchIcon className="size-4" />
          </Button>
        </AppTooltip>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="secondary">
              <MenuIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="">
            <DropdownMenuItem onClick={() => fnView(order, true)}>
              <ExternalLinkIcon className="size-4" />
              Visualizar Pedido em Nova Aba
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <CopyIcon className="size-4" />
              Duplicar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => fnCancel(order)}>
              <XSquareIcon className="size-4 text-red-500" />
              Cancelar Pedido
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <DollarSignIcon className="size-4 text-emerald-600" />
              Ver Dados da Nota
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SettingsIcon className="size-4" />
              Reintegrar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
