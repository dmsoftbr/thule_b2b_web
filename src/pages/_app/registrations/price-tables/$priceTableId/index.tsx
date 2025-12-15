import { AppPageHeader } from "@/components/layout/app-page-header";
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { PriceTableForm } from "../-components/price-table-form";
import { useQuery } from "@tanstack/react-query";
import { PriceTablesService } from "@/services/registrations/price-tables.service";

export const Route = createFileRoute(
  "/_app/registrations/price-tables/$priceTableId/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { priceTableId } = useParams({
    from: "/_app/registrations/price-tables/$priceTableId/",
  });

  const { data } = useQuery({
    queryKey: ["price-table-id", priceTableId],
    queryFn: async () => {
      const data = await PriceTablesService.getById(priceTableId);
      return data;
    },
    enabled: !!priceTableId,
  });

  if (!data) return;
  return (
    <AppPageHeader titleSlot={`Alterar Tabela de Preço: ${priceTableId}`}>
      <div className="p-2 max-w-lg ml-auto mr-auto">
        <PriceTableForm
          initialData={data}
          isOpen={true}
          mode={"EDIT"}
          onClose={() => navigate({ to: "/registrations/price-tables" })}
        />
      </div>
    </AppPageHeader>
  );
}
