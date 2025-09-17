import { createFileRoute } from "@tanstack/react-router";
import { OrdersTable } from "./-components/orders-table";

export const Route = createFileRoute("/_app/orders/")({
  component: ListOrdersPage,
});

function ListOrdersPage() {
  return (
    <div className="m-2 p-2 bg-white border shadow rounded w-full">
      <h1 className="font-semibold text-lg">Pedidos de Venda</h1>
      <OrdersTable />
    </div>
  );
}
