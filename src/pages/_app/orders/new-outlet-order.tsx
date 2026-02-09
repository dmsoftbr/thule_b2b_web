import { AppPageHeader } from "@/components/layout/app-page-header";
import { createFileRoute } from "@tanstack/react-router";
import { OrderProvider } from "./-context/order-context";
import { OrderForm } from "./-components/order-form";
import { generateOrderFromOutlet } from "./-utils/order-utils";

export const Route = createFileRoute("/_app/orders/new-outlet-order")({
  component: RouteComponent,
  loader: async () => {
    const data = await generateOrderFromOutlet();
    console.log(data);
    return { orderData: data };
  },
});

function RouteComponent() {
  const { orderData } = Route.useLoaderData();
  return (
    <AppPageHeader titleSlot={`Novo Pedido de Venda - OUTLET`}>
      <OrderProvider formMode="NEW" initialOrder={orderData}>
        <OrderForm />
      </OrderProvider>
    </AppPageHeader>
  );
}
