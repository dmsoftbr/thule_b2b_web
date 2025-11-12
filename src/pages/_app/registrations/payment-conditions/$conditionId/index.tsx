import { AppPageHeader } from "@/components/layout/app-page-header";
import { PaymentConditionsService } from "@/services/registrations/payment-conditions.service";
import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { PaymentConditionForm } from "../-components/payment-condition-form";

export const Route = createFileRoute(
  "/_app/registrations/payment-conditions/$conditionId/"
)({
  component: ConditionIdPageComponent,
});

function ConditionIdPageComponent() {
  const navigate = useNavigate();
  const { conditionId } = useParams({
    from: "/_app/registrations/payment-conditions/$conditionId/",
  });

  const { data } = useQuery({
    queryKey: ["payment-condition-id", conditionId],
    queryFn: async () => {
      const data = await PaymentConditionsService.getById(Number(conditionId));
      return data;
    },
    enabled: !!conditionId,
  });

  if (!data) return;
  return (
    <AppPageHeader titleSlot={`Alterar Condição de Pagamento: ${conditionId}`}>
      <div className="p-2 max-w-lg ml-auto mr-auto">
        <PaymentConditionForm
          initialData={data}
          isOpen={true}
          mode={"EDIT"}
          onClose={() => navigate({ to: "/registrations/payment-conditions" })}
        />
      </div>
    </AppPageHeader>
  );
}
