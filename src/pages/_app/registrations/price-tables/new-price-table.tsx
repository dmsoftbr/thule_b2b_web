import { AppPageHeader } from "@/components/layout/app-page-header";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PriceTableForm } from "./-components/price-table-form";

export const Route = createFileRoute(
  "/_app/registrations/price-tables/new-price-table"
)({
  component: NewPriceTablePageComponent,
});

function NewPriceTablePageComponent() {
  const navigate = useNavigate();

  return (
    <AppPageHeader titleSlot={`Nova Tabela de Preço`}>
      <div className="p-2 max-w-lg ml-auto mr-auto">
        <PriceTableForm
          initialData={null}
          isOpen={true}
          mode={"ADD"}
          onClose={() => navigate({ to: "/registrations/price-tables" })}
        />
      </div>
    </AppPageHeader>
  );
}
