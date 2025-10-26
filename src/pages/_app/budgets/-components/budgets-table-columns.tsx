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
import type { OrderModel } from "@/models/order-model";
import {
  CopyIcon,
  DollarSignIcon,
  ExternalLinkIcon,
  FileIcon,
  MenuIcon,
  SearchIcon,
  XSquareIcon,
} from "lucide-react";

interface Props {
  fnView: (order: OrderModel) => void;
}

export const createBudgetsTableColumns = ({
  fnView,
}: Props): ServerTableColumn<OrderModel>[] => [
  {
    id: "id",
    dataKey: "id",
    header: "Simulação",
    render: (order) => (
      <span className="font-semibold text-blue-600 ">{order.id}</span>
    ),
    sortable: true,
  },
  {
    id: "customerId",
    dataKey: "customerId",
    header: "Cliente",
    render: (order) => <span>{order.customerId}</span>,
    sortable: true,
  },
  {
    id: "orderRepId",
    dataKey: "orderRepId",
    header: "Ped. Cliente",
    render: (order) => <span>{order.orderRepId}</span>,
    sortable: true,
  },
  {
    id: "repName",
    dataKey: "repName",
    header: "Representante",
    render: (order) => <span>{order.representativeId}</span>,
    sortable: true,
  },
  {
    id: "createdAt",
    dataKey: "createdAt",
    header: "Dt Implantação",
    render: (order) => (
      <div className="text-center">{formatDate(order.createdAt)}</div>
    ),
    sortable: true,
  },
  {
    id: "totalOrderValue",
    dataKey: "totalOrderValue",
    header: "Total do Pedido",
    render: (order) => (
      <div className="text-right">{formatNumber(order.totalOrderValue, 2)}</div>
    ),
    sortable: true,
  },
  {
    id: "statusId",
    dataKey: "statusId",
    header: "Situação",
    render: (order) => (
      <div className="flex items-center justify-center">
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            order.statusId === "Aberto"
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {order.statusId}
        </span>
        <button>
          <FileIcon className="size-4" />
        </button>
      </div>
    ),
    sortable: true,
  },
  {
    id: "id",
    dataKey: "id",
    header: "Ações",
    render: (order) => (
      <div className="flex justify-end">
        <Button onClick={() => fnView(order)} variant="secondary" size="sm">
          <SearchIcon className="size-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="secondary">
              <MenuIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="">
            <DropdownMenuItem>
              <ExternalLinkIcon className="size-4" />
              Abrir Simulação em Nova Aba
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <CopyIcon className="size-4" />
              Duplicar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <XSquareIcon className="size-4 text-red-500" />
              Cancelar Simulação
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <DollarSignIcon className="size-4 text-emerald-600" />
              Ver Pedido
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
