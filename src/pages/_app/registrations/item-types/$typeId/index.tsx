import { AppPageHeader } from "@/components/layout/app-page-header";
import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { ItemTypeForm } from "../-components/item-type-form";
import { ItemTypesService } from "@/services/registrations/item-types.service";

export const Route = createFileRoute("/_app/registrations/item-types/$typeId/")(
  {
    component: RouteComponent,
  },
);

function RouteComponent() {
  const navigate = useNavigate();
  const { typeId } = useParams({
    from: "/_app/registrations/item-types/$typeId/",
  });

  const { data } = useQuery({
    queryKey: ["mobile-communication-id", typeId],
    queryFn: async () => {
      const data = await ItemTypesService.getById(typeId);
      return data;
    },
    enabled: !!typeId,
  });

  if (!data) return;
  return (
    <AppPageHeader titleSlot={`Alterar Noticação: ${typeId}`}>
      <div className="p-2 max-w-lg ml-auto mr-auto">
        <ItemTypeForm
          initialData={data}
          isOpen={true}
          mode={"EDIT"}
          onClose={() => navigate({ to: "/registrations/item-types" })}
        />
      </div>
    </AppPageHeader>
  );
}
