import { AppPageHeader } from "@/components/layout/app-page-header";
import { createFileRoute } from "@tanstack/react-router";
import { OrderForm } from "../../-components/order-form";
import { OrderProvider } from "../../-context/order-context";
import { api } from "@/lib/api";
import { getOrderClassification } from "../../-utils/order-utils";
import type { OrderModel } from "@/models/orders/order-model";

export const Route = createFileRoute("/_app/orders/edit/$orderId/")({
  component: EditOrderPageComponent,
  loader: async ({ params }) => {
    const { orderId } = params;
    const { data } = await api.get(`/orders/${orderId}`);
    return data;
  },
});

function EditOrderPageComponent() {
  const order = Route.useLoaderData() as OrderModel | undefined;

  const orderType =
    getOrderClassification(order?.orderClassificationId ?? 1) || "Venda";

  return (
    <AppPageHeader
      titleSlot={`Alterar Pedido de Venda: ${order?.orderId} ${orderType != "Venda" ? " - " + orderType : ""}`}
    >
      <OrderProvider initialOrder={order} formMode="EDIT">
        <OrderForm />
      </OrderProvider>
    </AppPageHeader>
  );
}
