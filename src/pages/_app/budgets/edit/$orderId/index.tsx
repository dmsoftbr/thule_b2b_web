import { AppPageHeader } from "@/components/layout/app-page-header";
import { api } from "@/lib/api";
import { OrderForm } from "@/pages/_app/orders/-components/order-form";
import { OrderProvider } from "@/pages/_app/orders/-context/order-context";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/budgets/edit/$orderId/")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { orderId } = params;
    const { data } = await api.get(`/orders/${orderId}`);
    return data;
  },
});

function RouteComponent() {
  const order = Route.useLoaderData();
  return (
    <AppPageHeader titleSlot={`Alterar Simulação: ${order.orderId}`}>
      <OrderProvider initialOrder={order} formMode="EDIT">
        <OrderForm />
      </OrderProvider>
    </AppPageHeader>
  );
}
