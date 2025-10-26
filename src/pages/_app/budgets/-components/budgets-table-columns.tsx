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
}: Props): ServerTableColumn[] => [
  {
    key: "id",
    dataIndex: "id",
    title: "Simulação",
    renderItem: (order) => (
      <span className="font-semibold text-blue-600 ">{order.id}</span>
    ),
    sortable: true,
  },
  {
    key: "customerId",
    dataIndex: "customerId",
    title: "Cliente",
    renderItem: (order) => <span>{order.customerId}</span>,
    sortable: true,
  },
  {
    key: "orderRepId",
    dataIndex: "orderRepId",
    title: "Ped. Cliente",
    renderItem: (order) => <span>{order.orderRepId}</span>,
    sortable: true,
  },
  {
    key: "repName",
    dataIndex: "repName",
    title: "Representante",
    renderItem: (order) => <span>{order.representativeId}</span>,
    sortable: true,
  },
  {
    key: "createdAt",
    dataIndex: "createdAt",
    title: "Dt Implantação",
    renderItem: (order) => (
      <div className="text-center">{formatDate(order.createdAt)}</div>
    ),
    sortable: true,
  },
  {
    key: "totalOrderValue",
    dataIndex: "totalOrderValue",
    title: "Total do Pedido",
    renderItem: (order) => (
      <div className="text-right">{formatNumber(order.totalOrderValue, 2)}</div>
    ),
    sortable: true,
  },
  {
    key: "statusId",
    dataIndex: "statusId",
    title: "Situação",
    renderItem: (order) => (
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
    key: "id",
    dataIndex: "id",
    title: "Ações",
    renderItem: (order) => (
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
