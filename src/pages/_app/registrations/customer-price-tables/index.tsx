import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_app/registrations/customer-price-tables/"
)({
  component: CustomerPriceTablesPageComponent,
});

function CustomerPriceTablesPageComponent() {
  return <div>Hello "/_app/registrations/customer-price-tables/"!</div>;
}
