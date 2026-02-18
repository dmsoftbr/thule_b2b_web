import { AppPageHeader } from "@/components/layout/app-page-header";
import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { SkuMessageForm } from "../-components/sku-message-form";
import { SkuMessagesService } from "@/services/registrations/sku-messages.service";

export const Route = createFileRoute(
  "/_app/registrations/sku-messages/$productId/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { productId } = useParams({
    from: "/_app/registrations/sku-messages/$productId/",
  });

  const { data } = useQuery({
    queryKey: ["sku-message", productId],
    queryFn: async () => {
      const data = await SkuMessagesService.getById(productId);
      return data;
    },
    enabled: !!productId,
  });

  if (!data) return;
  return (
    <AppPageHeader titleSlot={`Alterar Mensagem de SKU: ${productId}`}>
      <div className="p-2 max-w-lg ml-auto mr-auto">
        <SkuMessageForm
          initialData={data}
          isOpen={true}
          mode={"EDIT"}
          onClose={() => navigate({ to: "/registrations/sku-messages" })}
        />
      </div>
    </AppPageHeader>
  );
}
