import { AppTooltip } from "@/components/layout/app-tooltip";
import type { ServerTableColumn } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import type { OrderItemModel } from "@/models/orders/order-item-model";
import type { OrderModel } from "@/models/orders/order-model";
import { CheckIcon, SearchIcon, XIcon } from "lucide-react";

interface Props {
  fnView: (order: OrderItemModel, anotherTab?: boolean) => void;
  fnConfirm: (order: OrderItemModel) => void;
  fnReject: (order: OrderItemModel) => void;
}

export const columns = ({
  fnConfirm,
  fnView,
  fnReject,
}: Props): ServerTableColumn[] => [
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
    key: "actions",
    dataIndex: "id",
    title: "Ações",
    renderItem: (item: OrderItemModel) => (
      <div className="flex justify-end">
        <AppTooltip message="Confirmar">
          <Button onClick={() => fnConfirm(item)} variant="secondary" size="sm">
            <CheckIcon className="size-4" />
          </Button>
        </AppTooltip>
        <AppTooltip message="Rejeitar">
          <Button onClick={() => fnReject(item)} variant="secondary" size="sm">
            <XIcon className="size-4" />
          </Button>
        </AppTooltip>
        <AppTooltip message="Visualizar Pedido">
          <Button onClick={() => fnView(item)} variant="secondary" size="sm">
            <SearchIcon className="size-4" />
          </Button>
        </AppTooltip>
      </div>
    ),
  },
];
