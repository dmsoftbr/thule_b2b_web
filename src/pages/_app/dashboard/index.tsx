import { createFileRoute } from "@tanstack/react-router";
import { RevenueChart } from "./-components/revenue-chart";
import { OrdersList } from "./-components/orders-list";
import { SimulationsList } from "./-components/simulations-list";

export const Route = createFileRoute("/_app/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col space-y-4 p-4 w-full">
      <RevenueChart />
      <div className="grid grid-cols-2 gap-x-2">
        <OrdersList />
        <SimulationsList />
      </div>
    </div>
  );
}
