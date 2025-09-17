import { AppPageHeader } from "@/components/layout/app-page-header";
import { createFileRoute } from "@tanstack/react-router";
import { SalesGroupForm } from "./-components/sales-group-form";

export const Route = createFileRoute(
  "/_app/registrations/sales-group/new-group"
)({
  component: NewSalesGroupComponent,
});

function NewSalesGroupComponent() {
  return (
    <AppPageHeader titleSlot="Grupos de Venda">
      <div className="container ml-auto mr-auto max-w-lg my-4">
        <SalesGroupForm formAction="ADD" />
      </div>
    </AppPageHeader>
  );
}
