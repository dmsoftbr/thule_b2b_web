import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { BillingChart } from "./billing-chart";
import { ConfirmOrdersList } from "./confim-orders-list";
import { OrdersList } from "./orders-list";
import { SimulationsList } from "./simulations-list";
import { TopCommercialFamilies } from "./top-commercial-families";
import { TopCustomers } from "./top-customers";
import { TopProducts } from "./top-products";

type Props = {};
export const DashboardRepresentative = ({}: Props) => {
  return (
    <div className="flex flex-col space-y-4 p-4 w-full h-full bg-neutral-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg shadow border flex flex-col justify-center  space-y-2 bg-white p-6">
          <p className="text-muted-foreground font-semibold">
            Faturamento{" "}
            <span className="text-xs text-muted-foreground">(Valor Bruto)</span>
          </p>
          <p className="text-3xl font-bold">R$ 2.54M</p>
          <p className="flex items-center text-xs text-emerald-600 font-semibold">
            <ArrowUpIcon className="size-3 mr-1.5 stroke-[4px]" />
            12,5%
          </p>
        </div>

        <div className="rounded-lg shadow border flex flex-col justify-center  space-y-2 bg-white p-6">
          <p className="text-muted-foreground font-semibold">
            Quantidade de Pedidos
          </p>
          <p className="text-3xl font-bold">2.540</p>
          <p className="flex items-center text-xs text-emerald-600 font-semibold">
            <ArrowUpIcon className="size-3 mr-1.5 stroke-[4px]" />
            5,5%
          </p>
        </div>

        <div className="rounded-lg shadow border flex flex-col justify-center space-y-2 bg-white p-6">
          <p className="text-muted-foreground font-semibold">Ticket Médio</p>
          <p className="text-3xl font-bold">R$ 2.000,00</p>
          <p className="flex items-center text-xs text-red-500">
            <ArrowDownIcon className="size-3 text-red-500 mr-1.5 stroke-[4px]" />
            -5,5%
          </p>
        </div>

        <div className="rounded-lg shadow border flex flex-col justify-center  space-y-2 bg-white p-6">
          <p className="text-muted-foreground font-semibold">
            Faturamento Anual{" "}
            <span className="text-xs text-muted-foreground">(Valor Bruto)</span>
          </p>
          <p className="text-3xl font-bold">R$ 12.54M</p>
          <p className="flex items-center text-xs text-emerald-600 font-semibold">
            <ArrowUpIcon className="size-3 mr-1.5 stroke-[4px]" />
            12,5%
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg shadow bg-white flex-1 p-6 border">
          <BillingChart />
        </div>
        <div className="flex flex-col gap-4">
          <div className="rounded-lg shadow bg-white flex-1 p-6 border">
            <p className="text-muted-foreground font-semibold">
              Top Grupos de Clientes
            </p>
            <TopCustomers />
          </div>

          <div className="rounded-lg shadow bg-white flex-1 p-6 border">
            <p className="text-muted-foreground font-semibold">
              Top Famílias Comerciais
            </p>
            <TopCommercialFamilies />
          </div>
        </div>
      </div>
      <div className="flex gap-4 w-full">
        <OrdersList />
        <SimulationsList />
        <ConfirmOrdersList />
      </div>
    </div>
  );
};
