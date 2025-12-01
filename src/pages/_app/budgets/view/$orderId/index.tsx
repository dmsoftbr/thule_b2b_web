import { AppPageHeader } from "@/components/layout/app-page-header";
import { OrderForm } from "@/pages/_app/orders/-components/order-form";
import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/budgets/view/$orderId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { orderId } = useParams({ from: "/_app/orders/view/$orderId/" });
  return (
    <AppPageHeader titleSlot={"Visualizar Simulação"}>
      <OrderForm orderId={orderId} action="VIEW" orderType="BUDGET" />
    </AppPageHeader>
  );
}
