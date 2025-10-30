import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/orders/edit/$orderId/")({
  component: EditOrderPageComponent,
});

function EditOrderPageComponent() {
  return <div>Hello "/_app/orders/edit/$orderId/"!</div>;
}
