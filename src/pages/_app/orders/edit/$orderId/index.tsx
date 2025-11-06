import { AppPageHeader } from "@/components/layout/app-page-header";
import { createFileRoute } from "@tanstack/react-router";
import { OrderForm } from "../../-components/order-form";

export const Route = createFileRoute("/_app/orders/edit/$orderId/")({
  component: EditOrderPageComponent,
});

function EditOrderPageComponent() {
  return (
    <AppPageHeader titleSlot={"Alterar Pedido de Venda"}>
      <OrderForm orderId="" action="EDIT" orderType="ORDER" />
    </AppPageHeader>
  );
}
