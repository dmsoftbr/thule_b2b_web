import { AppPageHeader } from "@/components/layout/app-page-header";
import { createFileRoute } from "@tanstack/react-router";
import { ExceptionTableForm } from "./-components/exception-table-form";

export const Route = createFileRoute(
  "/_app/registrations/price-exception-tables/new-table",
)({
  component: NewPriceExceptionTableComponent,
});

function NewPriceExceptionTableComponent() {
  return (
    <AppPageHeader titleSlot="Grupos de Desconto">
      <div className="container ml-auto mr-auto max-w-lg my-4">
        <ExceptionTableForm formAction="ADD" />
      </div>
    </AppPageHeader>
  );
}
