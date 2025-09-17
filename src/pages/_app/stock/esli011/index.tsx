import { createFileRoute } from "@tanstack/react-router";
import { Esli011Form } from "./-componentes/esli011-form";

export const Route = createFileRoute("/_app/stock/esli011/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="m-2 p-2 bg-white border shadow rounded">
      <h1 className="font-semibold text-lg mb-2">ESLI011</h1>
      <Esli011Form />
    </div>
  );
}
