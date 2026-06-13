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
  getOrderCreditStatus,
  getOrderStatusColor,
  getOrderStatusName,
} from "@/lib/order-status-utils";
import {
  isOrderIntegrationPending,
  orderDisplayNumber,
} from "@/lib/order-number";
import { cn } from "@/lib/utils";
import type { OrderModel } from "@/models/orders/order-model";
import {
  CopyIcon,
  DollarSignIcon,
  EditIcon,
  ExternalLinkIcon,
  MenuIcon,
  PackagePlusIcon,
  SearchIcon,
  SettingsIcon,
  XSquareIcon,
} from "lucide-react";
import {
  getOrderClassification,
  getOrderClassificationCss,
} from "../-utils/order-utils";

interface Props {
  fnView: (order: OrderModel, anotherTab?: boolean) => void;
  fnEdit: (order: OrderModel) => void;
  fnCancel: (order: OrderModel) => void;
  fnCopy: (order: OrderModel) => void;
  // Abre a modal de Faturamento (notas fiscais / DANFE / XML / Boleto).
  fnViewNota?: (order: OrderModel) => void;
  // Gera um Pedido a partir da Simulação (somente quando isBudget).
  fnGenerateOrder?: (order: OrderModel) => void;
  // Reintegra o pedido no Datasul (somente Pedidos ainda não integrados).
  fnReintegrate?: (order: OrderModel) => void;
  isBudget?: boolean;
}

export const columns = ({
  fnEdit,
  fnView,
  fnCancel,
  fnCopy,
  fnViewNota,
  fnGenerateOrder,
  fnReintegrate,
  isBudget = false,
}: Props): ServerTableColumn[] => {
  const label = isBudget ? "Simulação" : "Pedido";
  return [
  {
    key: "integrationStatus",
    dataIndex: "integratedAt",
    title: "",
    // Coluna estreita: bolinha indicando o estado de integração ao Datasul.
    cellClassName: "w-[28px] text-center",
    className: "w-[28px]",
    renderItem: (order: OrderModel) => {
      // Simulações não integram — sem indicador.
      if (order.isBudget) return null;
      const isReproved = order.statusId === -2;
      const isIntegrated = !!order.integratedAt;
      const color = isReproved
        ? "bg-red-500"
        : isIntegrated
          ? "bg-emerald-500"
          : "bg-blue-500";
      const message = isReproved
        ? "Reprovado"
        : isIntegrated
          ? "Integrado"
          : "Não integrado";
      return (
        <div className="flex items-center justify-center">
          <AppTooltip message={message}>
            <span
              className={cn("inline-block size-2.5 rounded-full", color)}
            />
          </AppTooltip>
        </div>
      );
    },
  },
  {
    key: "orderId",
    dataIndex: "orderId",
    title: label,
    // Coluna "Pedido" agora também carrega o badge de Tipo (coluna "Tipo"
    // fundida aqui), liberando largura para Cliente/Representante.
    cellClassName: "w-[120px] text-xs",
    className: "w-[120px] text-xs",
    renderItem: (order: OrderModel) => (
      <div className="flex flex-col items-start gap-1">
        <span className="font-semibold text-blue-600">
          {orderDisplayNumber(order)}
        </span>
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-medium leading-4 text-white whitespace-nowrap",
            getOrderClassificationCss(order.orderClassificationId),
          )}
        >
          {getOrderClassification(order.orderClassificationId)}
        </span>
      </div>
    ),
    sortable: true,
  },

  {
    key: "customerId",
    dataIndex: "customerId",
    title: "Cliente",
    className: "text-xs",
    // min/max realistas + truncamento (a <td> do shared aplica break-words;
    // o truncate no wrapper interno vence).
    cellClassName: "text-xs min-w-[160px] max-w-[260px]",
    renderItem: (order: OrderModel) => {
      const text = `${order.customerId} - ${order.customer?.abbreviation ?? ""}`;
      return (
        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
          {text}
        </div>
      );
    },
    sortable: true,
  },
  {
    key: "orderRepId",
    dataIndex: "orderRepId",
    title: "Ped. Distribuidor",
    cellClassName: "text-xs w-[130px]",
    className: "text-xs w-[130px]",
    renderItem: (order: OrderModel) => (
      <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
        {order.orderRepId}
      </span>
    ),
    sortable: true,
  },
  {
    key: "repName",
    dataIndex: "repName",
    title: "Representante",
    className: "text-xs",
    cellClassName: "text-xs min-w-[160px] max-w-[240px]",
    renderItem: (order: OrderModel) => {
      const text = `${order.representativeId} - ${order.representative?.abbreviation ?? ""}`;
      return (
        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
          {text}
        </div>
      );
    },
    sortable: true,
  },
  {
    key: "createdAt",
    dataIndex: "createdAt",
    title: "Dt Implantação",
    cellClassName: "w-[120px] text-center text-xs tabular-nums whitespace-nowrap",
    className: "w-[120px] text-xs",
    renderItem: (order: OrderModel) => (
      <div className="text-center">{formatDate(order.createdAt)}</div>
    ),
    sortable: true,
  },
  {
    key: "totalOrderValue",
    dataIndex: "totalOrderValue",
    title: `Total ${isBudget ? "da Simulação" : "do Pedido"}`,
    cellClassName: "w-[140px] text-right text-xs tabular-nums whitespace-nowrap",
    className: "w-[140px] text-xs",
    renderItem: (order: OrderModel) => (
      <div className="text-right font-medium">
        {formatNumber(order.grossTotalValue, 2)}
      </div>
    ),
    sortable: true,
  },
  {
    key: "statusId",
    dataIndex: "statusId",
    title: "Situação",
    cellClassName: "text-center w-[150px]",
    className: "w-[150px] text-xs",
    renderItem: (order: OrderModel) => {
      const credit = getOrderCreditStatus(order);
      return (
        <div className="flex flex-col items-center justify-center gap-1">
          {order.generatedOrderId ? (
            <span className="inline-flex max-w-full items-center justify-center rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-medium leading-5 text-white whitespace-nowrap">
              Pedido Gerado
            </span>
          ) : (
            <span
              className={cn(
                "inline-flex max-w-full items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium leading-5 whitespace-nowrap",
                getOrderStatusColor(order),
              )}
            >
              {getOrderStatusName(order)}
            </span>
          )}
          {/* Crédito (Datasul, pós-integração) — indicador à parte da Situação. */}
          {credit && (
            <span
              className={cn(
                "inline-flex max-w-full items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-medium leading-4 whitespace-nowrap",
                credit.color,
              )}
            >
              {credit.label}
            </span>
          )}
        </div>
      );
    },
    sortable: true,
  },
  {
    key: "actions",
    dataIndex: "id",
    title: "Ações",
    cellClassName: "w-[130px] text-xs",
    className: "w-[130px] text-xs",
    renderItem: (order: OrderModel) => (
      <div className="flex items-center justify-end gap-1">
        {order.statusId != 6 && (
          <Button
            onClick={() => fnEdit(order)}
            variant="secondary"
            size="sm"
            disabled={!!order.generatedOrderId}
          >
            <EditIcon className="size-4" />
          </Button>
        )}
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
            {/* Gerar Pedido — exclusivo de Simulações */}
            {isBudget && (
              <>
                <DropdownMenuItem
                  onClick={() => fnGenerateOrder?.(order)}
                  disabled={order.statusId == 6 || !!order.generatedOrderId}
                >
                  <PackagePlusIcon className="size-4 text-emerald-600" />
                  Gerar Pedido
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={() => fnView(order, true)}>
              <ExternalLinkIcon className="size-4" />
              Visualizar {label} em Nova Aba
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                fnCopy(order);
              }}
            >
              <CopyIcon className="size-4" />
              Duplicar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => fnCancel(order)}
              disabled={order.statusId == 6 || !!order.generatedOrderId}
            >
              <XSquareIcon className="size-4 text-red-500" />
              Cancelar {label}
            </DropdownMenuItem>
            {/* Ver Dados da Nota e Reintegrar — exclusivos de Pedidos */}
            {!isBudget && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={order.statusId < 2 || order.statusId > 3}
                  onClick={() => fnViewNota?.(order)}
                >
                  <DollarSignIcon className="size-4 text-emerald-600" />
                  Ver Dados da Nota
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  // Habilitado só para pedidos ainda não integrados ao Datasul.
                  disabled={!isOrderIntegrationPending(order)}
                  onClick={() => fnReintegrate?.(order)}
                >
                  <SettingsIcon className="size-4" />
                  Reintegrar
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
};
