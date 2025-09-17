import { createFileRoute } from "@tanstack/react-router";
import { SalesGroupTable } from "./-components/sales-group-table";

export const Route = createFileRoute("/_app/registrations/sales-group/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="m-2 p-2 bg-white border shadow rounded w-full">
      <h1 className="font-semibold text-lg">Grupos de Venda</h1>
      <SalesGroupTable />
    </div>
  );
}
