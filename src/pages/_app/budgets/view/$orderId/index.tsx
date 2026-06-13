import { AppPageHeader } from "@/components/layout/app-page-header";
import { api } from "@/lib/api";
import { OrderForm } from "@/pages/_app/orders/-components/order-form";
import { OrderProvider } from "@/pages/_app/orders/-context/order-context";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/budgets/view/$orderId/")({
  component: RouteComponent,
  // `from`: rota de retorno do botão Voltar. Opcional — ver useReturnTo.
  validateSearch: (search: Record<string, unknown>): { from?: string } =>
    typeof search.from === "string" ? { from: search.from } : {},
  loader: async ({ params }) => {
    const { orderId } = params;
    const { data } = await api.get(`/orders/${encodeURIComponent(orderId)}`);
    return data;
  },
});

function RouteComponent() {
  const order = Route.useLoaderData();
  return (
    <AppPageHeader titleSlot={`Visualizar Simulação: ${order.orderId}`}>
      <OrderProvider initialOrder={order} formMode="VIEW">
        <OrderForm />
      </OrderProvider>
    </AppPageHeader>
  );
}
