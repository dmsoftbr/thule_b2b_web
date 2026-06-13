import { AppPageHeader } from "@/components/layout/app-page-header";
import { createFileRoute } from "@tanstack/react-router";
import { OrderForm } from "../../-components/order-form";
import { OrderProvider } from "../../-context/order-context";
import { api } from "@/lib/api";
import { orderDisplayNumber } from "@/lib/order-number";

export const Route = createFileRoute("/_app/orders/view/$orderId/")({
  component: ViewOrderPageComponent,
  // `from`: rota de retorno do botão Voltar (ex.: /approvals). Opcional — quando
  // ausente, useReturnTo usa o fallback. Ver useReturnTo.
  validateSearch: (search: Record<string, unknown>): { from?: string } =>
    typeof search.from === "string" ? { from: search.from } : {},
  loader: async ({ params }) => {
    const { orderId } = params;
    const { data } = await api.get(`/orders/${encodeURIComponent(orderId)}`);
    return data;
  },
});

function ViewOrderPageComponent() {
  const order = Route.useLoaderData();

  return (
    <AppPageHeader
      titleSlot={`Visualizar Pedido de Venda: ${orderDisplayNumber(order)}`}
    >
      <OrderProvider initialOrder={order} formMode="VIEW">
        <OrderForm />
      </OrderProvider>
    </AppPageHeader>
  );
}
