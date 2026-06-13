import type { OrderModel } from "@/models/orders/order-model";

// Situação do pedido — derivada exclusivamente do statusId. NÃO embute mais a
// aprovação de crédito: o financeiro é aprovado no DATASUL (pós-integração) e é
// exibido à parte (ver getOrderCreditStatus). A aprovação que o B2B controla é a
// do PORTAL (gate de desconto/tipo, antes de integrar): -1/-2/1.
export function getOrderStatusName(order: OrderModel) {
  if (order.statusId == -3) {
    return "Excluído";
  }
  if (order.statusId == -2) {
    return "Reprovado";
  }
  if (order.statusId == -1) {
    return "Aguardando Aprovação";
  }
  if (order.statusId == 1) return "Aprovado";
  if (order.statusId == 2) return "Faturado Parcial";
  if (order.statusId == 3) return "Faturado Total";
  if (order.statusId == 4) return "Pendente";
  if (order.statusId == 5) return "Suspenso";
  if (order.statusId == 6) return "Cancelado";
  if (order.statusId == 7) return "Faturado Balcão";
  return "Aberto";
}

export const getOrderStatusColor = (order: OrderModel) => {
  // Fase portal (aprovação de desconto/tipo).
  if (order.statusId == -3) return "bg-neutral-500 text-white";
  if (order.statusId == -2) return "bg-red-600 text-white";
  if (order.statusId == -1) return "bg-amber-500 text-white";
  if (order.statusId == 1) return "bg-emerald-600 text-white";
  // Fase ERP (espelho Datasul).
  if (order.statusId == 2) return "bg-neutral-400 text-white";
  if (order.statusId == 3) return "bg-neutral-800 text-white";
  if (order.statusId == 4) return "bg-blue-300 text-white";
  if (order.statusId == 5) return "bg-purple-400 text-white";
  if (order.statusId == 6) return "bg-red-400 text-white";
  if (order.statusId == 7) return "";
  return "";
};

// Aprovação de crédito/financeira — responsabilidade do DATASUL, só faz sentido
// depois de integrado. Desacoplada da Situação. creditStatusId 1/4 = em análise
// (convenção legada que antes virava o label "Aprov. Financeira"). Retorna null
// quando não há nada a sinalizar (sem badge).
export function getOrderCreditStatus(
  order: OrderModel,
): { label: string; color: string } | null {
  if (!order.integratedAt) return null;
  if (order.creditStatusId == 1 || order.creditStatusId == 4) {
    return { label: "Crédito em análise", color: "bg-orange-400 text-white" };
  }
  return null;
}
