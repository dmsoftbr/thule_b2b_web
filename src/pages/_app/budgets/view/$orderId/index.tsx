import { AppPageHeader } from "@/components/layout/app-page-header";
import { OrderForm } from "@/pages/_app/orders/-components/order-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/budgets/view/$orderId/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppPageHeader titleSlot={"Visualizar Simulação"}>
      <OrderForm action="VIEW" orderType="BUDGET" />
    </AppPageHeader>
  );
}
