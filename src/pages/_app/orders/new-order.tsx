import { createFileRoute } from "@tanstack/react-router";
import { OrderForm } from "./-components/order-form";
import { v7 as uuidv7 } from "uuid";
import { AppPageHeader } from "@/components/layout/app-page-header";

export const Route = createFileRoute("/_app/orders/new-order")({
  component: NewOrderPage,
});

function NewOrderPage() {
  return (
    <AppPageHeader titleSlot="Novo Pedido de Venda">
      <OrderForm orderId={uuidv7()} action="NEW" orderType="ORDER" />
    </AppPageHeader>
  );
}
