import { createFileRoute } from "@tanstack/react-router";
import { OrderForm } from "../orders/-components/order-form";

export const Route = createFileRoute("/_app/budgets/new-budget")({
  component: NewBudgetPage,
});

function NewBudgetPage() {
  return (
    <div className="m-2 bg-white border shadow rounded w-full relative">
      <h1 className="font-semibold text-lg px-2 bg-neutral-200">
        Nova Simulação
      </h1>
      <OrderForm orderId={""} action="NEW" orderType="BUDGET" />
    </div>
  );
}
