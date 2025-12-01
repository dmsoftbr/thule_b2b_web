import { AppPageHeader } from "@/components/layout/app-page-header";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { OrderForm } from "../../-components/order-form";

export const Route = createFileRoute("/_app/orders/view/$orderId/")({
  component: ViewOrderPageComponent,
});

function ViewOrderPageComponent() {
  const { orderId } = useParams({ from: "/_app/orders/view/$orderId/" });
  return (
    <AppPageHeader titleSlot={"Visualizar Pedido de Venda"}>
      <OrderForm orderId={orderId} action="VIEW" orderType="ORDER" />
    </AppPageHeader>
  );
}
