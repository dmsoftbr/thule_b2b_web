import { AppPageHeader } from "@/components/layout/app-page-header";
import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { OrderProvider } from "./-context/order-context";
import { OrderForm } from "./-components/order-form";
import type { OrderModel } from "@/models/orders/order-model";

export const Route = createFileRoute("/_app/orders/new-outlet-order")({
  component: RouteComponent,
});

function RouteComponent() {
  const stateData = useRouterState({
    select: (state) => {
      return state.location.state.routerData as OrderModel;
    },
  });

  if (!stateData) {
    return <div>Ocorreu um erro ao tentar gerar o pedido de outlet</div>;
  }

  return (
    <AppPageHeader titleSlot={`Novo Pedido de Venda - OUTLET`}>
      <OrderProvider formMode="NEW" initialOrder={stateData}>
        <OrderForm />
      </OrderProvider>
      <div></div>
    </AppPageHeader>
  );
}
