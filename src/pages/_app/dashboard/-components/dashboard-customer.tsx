import { ConfirmOrdersList } from "./confim-orders-list";
import { OrdersList } from "./orders-list";
import { SimulationsList } from "./simulations-list";

type Props = {};
export const DashboardCustomer = ({}: Props) => {
  return (
    <div className="flex flex-col space-y-4 p-4 w-full h-full bg-white">
      <div className="flex gap-4 w-full">
        <OrdersList />
        <SimulationsList />
        <ConfirmOrdersList />
      </div>
    </div>
  );
};
