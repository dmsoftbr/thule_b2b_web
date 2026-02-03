import { AppPageHeader } from "@/components/layout/app-page-header";
import { ServerTable } from "@/components/server-table/server-table";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { columns } from "./-components/columns";

export const Route = createFileRoute(
  "/_app/registrations/price-tables/$priceTableId/prices/",
)({
  component: PriceTablePricesComponent,
});

function PriceTablePricesComponent() {
  const { priceTableId } = useParams({
    from: "/_app/registrations/price-tables/$priceTableId/prices/",
  });

  return (
    <AppPageHeader
      titleSlot={`Preços Cadastrados para a Tabela: ${priceTableId}`}
    >
      <div className="p-2 w-full">
        <ServerTable
          columns={columns()}
          dataUrl={""}
          searchFields={[]}
          showAddButton={false}
        />
      </div>
    </AppPageHeader>
  );
}
