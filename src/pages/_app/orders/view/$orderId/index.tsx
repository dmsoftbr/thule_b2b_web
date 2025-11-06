import { AppPageHeader } from "@/components/layout/app-page-header";
import { createFileRoute } from "@tanstack/react-router";
import { OrderForm } from "../../-components/order-form";

export const Route = createFileRoute("/_app/orders/view/$orderId/")({
  component: ViewOrderPageComponent,
});

function ViewOrderPageComponent() {
  return (
    <AppPageHeader titleSlot={"Visualizar Pedido de Venda"}>
      <OrderForm orderId="" action="VIEW" orderType="ORDER" />
    </AppPageHeader>
  );
}
