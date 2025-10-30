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
  FileIcon,
  MenuIcon,
  SearchIcon,
  SettingsIcon,
  XSquareIcon,
} from "lucide-react";

interface Props {
  fnView: (order: OrderModel) => void;
  fnEdit: (order: OrderModel) => void;
  fnCancel: (order: OrderModel) => void;
}

export const columns = ({
  fnEdit,
  fnView,
  fnCancel,
}: Props): ServerTableColumn[] => [
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
    renderItem: (order: OrderModel) => <span>{order.erpOrderId}</span>,
    sortable: true,
  },
  {
    key: "repName",
    dataIndex: "repName",
    title: "Representante",
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
    renderItem: (order: OrderModel) => (
      <div className="text-center">{formatDate(order.createdAt)}</div>
    ),
    sortable: true,
  },
  {
    key: "totalOrderValue",
    dataIndex: "totalOrderValue",
    title: "Total do Pedido",
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
          {order.statusId} {order.creditStatusId}
        </span>
        {order.statusId == 4 && (
          <button>
            <FileIcon className="size-4" />
          </button>
        )}
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
            <DropdownMenuItem>
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
              Ver Faturamento
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
