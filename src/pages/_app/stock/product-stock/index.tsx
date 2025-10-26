import { createFileRoute } from "@tanstack/react-router";
import { ProductStockForm } from "./-components/product-stock-form";

export const Route = createFileRoute("/_app/stock/product-stock/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="m-2 bg-white border shadow rounded w-full relative">
      <h1 className="font-semibold text-lg px-2 bg-neutral-200">
        Estoque Disponível
      </h1>
      <div className="max-w-lg ml-auto mr-auto pt-4 pb-6">
        <ProductStockForm />
      </div>
    </div>
  );
}
