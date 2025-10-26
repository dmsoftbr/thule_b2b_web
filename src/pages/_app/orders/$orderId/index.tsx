import { createFileRoute, useParams } from "@tanstack/react-router";
import { OrderForm } from "../-components/order-form";

export const Route = createFileRoute("/_app/orders/$orderId/")({
  component: OrderIdPage,
});

function OrderIdPage() {
  const { orderId } = useParams({
    from: "/_app/orders/$orderId/",
  });
  return (
    <div className="m-2 bg-white border shadow rounded h-full">
      <h1 className="font-semibold text-lg px-2 bg-neutral-200">
        Pedido de Venda: {orderId}
      </h1>
      <OrderForm orderId="" action="VIEW" orderType="ORDER" />
    </div>
  );
}
