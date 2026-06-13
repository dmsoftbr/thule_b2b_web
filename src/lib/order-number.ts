import type { OrderModel } from "@/models/orders/order-model";

type OrderNumberFields = Pick<
  OrderModel,
  "id" | "orderId" | "integratedAt" | "isBudget"
>;

// Precedência de exibição do número do pedido (numeração deferida):
// 1. orderId ("P0071074") quando o Datasul já forneceu o número;
// 2. código provisório do GUID ("RAS-XXXXXXXX") quando ainda não há número
//    (pedido criado offline / sem comunicação com o ERP).
export function orderDisplayNumber(o: Pick<OrderModel, "id" | "orderId">): string {
  if (o.orderId && o.orderId.trim().length > 0) return o.orderId;
  if (o.id) return `RAS-${o.id.slice(0, 8).toUpperCase()}`;
  return "—";
}

// Pedido (não simulação) ainda não confirmado pelo ERP — exibe estado "aguardando".
export function isOrderIntegrationPending(o: OrderNumberFields): boolean {
  return !o.isBudget && !o.integratedAt;
}
