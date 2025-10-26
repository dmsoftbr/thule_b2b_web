import { createFileRoute } from "@tanstack/react-router";
import { Esli011Form } from "./-componentes/esli011-form";

export const Route = createFileRoute("/_app/stock/esli011/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="m-2 bg-white border shadow rounded w-full relative">
      <h1 className="font-semibold text-lg px-2 bg-neutral-200">ESLI011</h1>
      <div className="max-w-2xl ml-auto mr-auto pt-4 pb-6">
        <Esli011Form />
      </div>
    </div>
  );
}
