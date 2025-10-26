import { createFileRoute } from "@tanstack/react-router";
import { BudgetsTable } from "./-components/budgets-table";

export const Route = createFileRoute("/_app/budgets/")({
  component: BudgetsPage,
});

function BudgetsPage() {
  return (
    <div className="m-2 p-2 bg-white border shadow rounded w-full">
      <h1 className="font-semibold text-lg">Simulações</h1>
      <BudgetsTable />
    </div>
  );
}
