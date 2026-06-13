import { AppPageHeader } from "@/components/layout/app-page-header";
import { ServerTable } from "@/components/server-table/server-table";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { TableSkeleton } from "@/pages/_app/-components/route-skeleton";
import { columns } from "./-components/columns";

const searchFields = [
  { id: "ALL", label: "Cód. Longo/Cód. Curto/Descrição" },
  // { id: "P.ProductId", label: "Código Longo do Produto" },
  // { id: "PR.ReferenceCode", label: "Cód. Curto" },
  // { id: "PR.Description", label: "Descrição" },
];

export const Route = createFileRoute(
  "/_app/registrations/price-tables/$priceTableId/prices/",
)({
  component: PriceTablePricesComponent,
  pendingComponent: TableSkeleton,
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
          dataUrl={`/registrations/prices/list-paged/${encodeURIComponent(priceTableId)}`}
          defaultSearchField="ALL"
          searchFields={searchFields}
          additionalInfo={{ priceTableId }}
          showAddButton={false}
        />
      </div>
    </AppPageHeader>
  );
}
