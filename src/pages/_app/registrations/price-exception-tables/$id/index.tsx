import { createFileRoute, useParams } from "@tanstack/react-router";
import { AppPageHeader } from "@/components/layout/app-page-header";
import { useQuery } from "@tanstack/react-query";
import { PriceExceptionTablesService } from "@/services/registrations/price-exception-tables.service";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExceptionTreeEditor } from "./-components/exception-tree-editor";

export const Route = createFileRoute(
  "/_app/registrations/price-exception-tables/$id/",
)({
  component: PriceExceptionTableIdPageComponent,
});

function PriceExceptionTableIdPageComponent() {
  const { id } = useParams({
    from: "/_app/registrations/price-exception-tables/$id/",
  });

  const { data } = useQuery({
    queryKey: ["price-exception-table-id", id],
    queryFn: async () => PriceExceptionTablesService.getById(id),
    enabled: !!id,
  });

  if (!data) return null;

  return (
    <AppPageHeader
      titleSlot={`Grupo de Desconto: ${data.id} - ${data.name ?? ""}`}
    >
      <div className="p-3 space-y-6">
        <div className="max-w-xs space-y-1">
          <Label>Grupo de Desconto</Label>
          <Input readOnly value={data.id} />
        </div>
        <ExceptionTreeEditor exceptionTableId={id} />
      </div>
    </AppPageHeader>
  );
}
