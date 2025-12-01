import { AppPageHeader } from "@/components/layout/app-page-header";
import { OrderForm } from "@/pages/_app/orders/-components/order-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/budgets/edit/$orderId/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppPageHeader titleSlot={"Alterar Simulação"}>
      <OrderForm action="EDIT" orderType="BUDGET" />
    </AppPageHeader>
  );
}
