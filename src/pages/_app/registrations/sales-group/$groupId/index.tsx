import { createFileRoute, useParams } from "@tanstack/react-router";
import { SalesGroupForm } from "../-components/sales-group-form";
import { SalesGroupsService } from "@/services/registrations/sales-group.service";
import { AppPageHeader } from "@/components/layout/app-page-header";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute(
  "/_app/registrations/sales-group/$groupId/"
)({
  component: SalesGroupIdPageComponent,
});

function SalesGroupIdPageComponent() {
  const { groupId } = useParams({
    from: "/_app/registrations/sales-group/$groupId/",
  });

  const { data } = useQuery({
    queryKey: ["sales-group-id", groupId],
    queryFn: async () => {
      return await SalesGroupsService.getById(groupId);
    },
    enabled: !!groupId,
  });

  if (!data) return null;

  return (
    <AppPageHeader titleSlot="Grupos de Venda">
      <div className="container ml-auto mr-auto max-w-lg my-4">
        <SalesGroupForm formAction="EDIT" initialData={data} />
      </div>
    </AppPageHeader>
  );
}
