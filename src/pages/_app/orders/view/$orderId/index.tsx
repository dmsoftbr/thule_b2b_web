import { AppPageHeader } from "@/components/layout/app-page-header";
import { createFileRoute } from "@tanstack/react-router";
import { OrderForm } from "../../-components/order-form";
import { OrderProvider } from "../../-context/order-context";
import { api } from "@/lib/api";

export const Route = createFileRoute("/_app/orders/view/$orderId/")({
  component: ViewOrderPageComponent,
  loader: async ({ params }) => {
    const { orderId } = params;
    const { data } = await api.get(`/orders/${orderId}`);
    return data;
  },
});

function ViewOrderPageComponent() {
  const order = Route.useLoaderData();

  return (
    <AppPageHeader titleSlot={`Visualizar Pedido de Venda: ${order.orderId}`}>
      <OrderProvider initialOrder={order} formMode="VIEW">
        <OrderForm />
      </OrderProvider>
    </AppPageHeader>
  );
}
