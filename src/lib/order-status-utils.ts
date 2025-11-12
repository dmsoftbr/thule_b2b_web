import type { OrderModel } from "@/models/orders/order-model";

export function getOrderStatusName(order: OrderModel) {
  if (order.statusId == -3) {
    return "Excluído";
  }
  if (order.statusId == -2) {
    return "Reprovado";
  }
  if (order.statusId == -1) {
    return "Aprovação";
  }
  if (order.statusId == 1) {
    if (order.creditStatusId == 1 || order.creditStatusId == 4) {
      return "Aprov. Financeira";
    }

    return "Aprovado";
  }
  if (order.statusId == 2) return "Faturado Parcial";
  if (order.statusId == 3) return "Faturado Total";
  if (order.statusId == 4) return "Pendente";
  if (order.statusId == 5) return "Suspenso";
  if (order.statusId == 6) return "Cancelado";
  if (order.statusId == 7) return "Faturado Balcão";
  return "N/D";
}

export const getOrderStatusColor = (order: OrderModel) => {
  if (order.statusId == 1) {
    if (order.creditStatusId == 1 || order.creditStatusId == 4) {
      return "bg-orange-400 text-white";
    }
    return "bg-emerald-600 text-white";
  }
  if (order.statusId == 2) return "bg-neutral-400 text-white";
  if (order.statusId == 3) return "bg-neutral-800 text-white";
  if (order.statusId == 4) return "bg-blue-300 text-white";
  if (order.statusId == 5) return "bg-purple-400 text-white";
  if (order.statusId == 6) return "bg-red-400 text-white";
  if (order.statusId == 7) return "";
  return "";
};
