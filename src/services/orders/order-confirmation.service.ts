import { api } from "@/lib/api";
import type { OrderConfirmation } from "@/models/orders/order-confirmation-model";

export type OrderConfirmationActionResult = {
  success: boolean;
  total: number;
  sucessos: number;
  erros: string[];
};

// Itens enviados ao Datasul (chave: pedido + cliente + sequência + item).
function toItems(rows: OrderConfirmation[]) {
  return rows.map((r) => ({
    pedido: r.pedido,
    clienteAbrev: r.clienteAbrev,
    sequencia: r.sequencia,
    item: r.item,
  }));
}

export class OrderConfirmationService {
  private static basePath: string = "order-confirmation";

  static async confirm(
    rows: OrderConfirmation[],
    reason: string
  ): Promise<OrderConfirmationActionResult> {
    const { data } = await api.post<OrderConfirmationActionResult>(
      `/${this.basePath}/confirm`,
      { items: toItems(rows), reason }
    );
    return data;
  }

  static async reject(
    rows: OrderConfirmation[],
    reason: string
  ): Promise<OrderConfirmationActionResult> {
    const { data } = await api.post<OrderConfirmationActionResult>(
      `/${this.basePath}/reject`,
      { items: toItems(rows), reason }
    );
    return data;
  }
}
