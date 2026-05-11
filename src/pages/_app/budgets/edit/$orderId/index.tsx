import { AppPageHeader } from "@/components/layout/app-page-header";
import { api } from "@/lib/api";
import { OrderForm } from "@/pages/_app/orders/-components/order-form";
import { OrderProvider } from "@/pages/_app/orders/-context/order-context";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/budgets/edit/$orderId/")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { orderId } = params;
    const { data } = await api.get(`/orders/${encodeURIComponent(orderId)}`);
    return data;
  },
});

function RouteComponent() {
  const order = Route.useLoaderData();
  // Simulação que já gerou pedido vira imutável — força modo VIEW e indica
  // o pedido associado no título. Backend também bloqueia o PATCH como
  // defesa em profundidade.
  const hasGeneratedOrder = !!order.generatedOrderId;
  const formMode = hasGeneratedOrder ? "VIEW" : "EDIT";
  const titleSlot = hasGeneratedOrder ? (
    <>
      Simulação: {order.orderId} (Pedido gerado:{" "}
      <Link
        to="/orders/view/$orderId"
        params={{ orderId: order.generatedOrderInternalId ?? "" }}
        className="text-blue-600 hover:underline"
      >
        {order.generatedOrderId}
      </Link>
      )
    </>
  ) : (
    `Alterar Simulação: ${order.orderId}`
  );
  return (
    <AppPageHeader titleSlot={titleSlot}>
      <OrderProvider initialOrder={order} formMode={formMode}>
        <OrderForm />
      </OrderProvider>
    </AppPageHeader>
  );
}
