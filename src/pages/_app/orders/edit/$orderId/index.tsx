import { AppPageHeader } from "@/components/layout/app-page-header";
import { createFileRoute } from "@tanstack/react-router";
import { OrderForm } from "../../-components/order-form";
import { OrderProvider } from "../../-context/order-context";
import { api } from "@/lib/api";

export const Route = createFileRoute("/_app/orders/edit/$orderId/")({
  component: EditOrderPageComponent,
  loader: async ({ params }) => {
    const { orderId } = params;
    const { data } = await api.get(`/orders/${orderId}`);
    return data;
  },
});

function EditOrderPageComponent() {
  const order = Route.useLoaderData();

  return (
    <AppPageHeader titleSlot={`Alterar Pedido de Venda: ${order.orderId}`}>
      <OrderProvider initialOrder={order} formMode="EDIT">
        <OrderForm />
      </OrderProvider>
    </AppPageHeader>
  );
}
