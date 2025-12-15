import { createFileRoute } from "@tanstack/react-router";
import { OrderForm } from "../-components/order-form";
import { api } from "@/lib/api";
import { OrderProvider } from "../-context/order-context";

export const Route = createFileRoute("/_app/orders/$orderId/")({
  component: OrderIdPage,
  loader: async ({ params }) => {
    const { orderId } = params;
    const { data } = await api.get(`/orders/${orderId}`);
    return data;
  },
});

function OrderIdPage() {
  const order = Route.useLoaderData();

  return (
    <div className="m-2 bg-white border shadow rounded h-full">
      <h1 className="font-semibold text-lg px-2 bg-neutral-200">
        Pedido de Venda: {order.orderId}
      </h1>
      <OrderProvider initialOrder={order} formMode="VIEW">
        <OrderForm />
      </OrderProvider>
    </div>
  );
}
