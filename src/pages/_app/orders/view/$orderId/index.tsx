import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/orders/view/$orderId/")({
  component: ViewOrderPageComponent,
});

function ViewOrderPageComponent() {
  return <div>Hello "/_app/orders/view/$orderId/"!</div>;
}
