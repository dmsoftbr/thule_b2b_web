import { createFileRoute } from "@tanstack/react-router";
import { OrderForm } from "./-components/order-form";
import { AppPageHeader } from "@/components/layout/app-page-header";
import { OrderProvider } from "./-context/order-context";

export const Route = createFileRoute("/_app/orders/new-order")({
  component: NewOrderPage,
});

function NewOrderPage() {
  return (
    <AppPageHeader titleSlot="Novo Pedido de Venda">
      <OrderProvider formMode="NEW">
        <OrderForm />
      </OrderProvider>
    </AppPageHeader>
  );
}
