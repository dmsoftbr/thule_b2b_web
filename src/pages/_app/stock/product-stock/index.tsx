import { createFileRoute } from "@tanstack/react-router";
import { ProductStockForm } from "./-components/product-stock-form";

export const Route = createFileRoute("/_app/stock/product-stock/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="m-2 p-2 bg-white border shadow rounded">
      <h1 className="font-semibold text-lg mb-2">Estoque Disponível</h1>
      <ProductStockForm />
    </div>
  );
}
