import { AppPageHeader } from "@/components/layout/app-page-header";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { OrderForm } from "../../-components/order-form";

export const Route = createFileRoute("/_app/orders/edit/$orderId/")({
  component: EditOrderPageComponent,
});

function EditOrderPageComponent() {
  const { orderId } = useParams({ from: "/_app/orders/edit/$orderId/" });
  return (
    <AppPageHeader titleSlot={"Alterar Pedido de Venda"}>
      <OrderForm orderId={orderId} action="EDIT" orderType="ORDER" />
    </AppPageHeader>
  );
}
