import { AppPageHeader } from "@/components/layout/app-page-header";
import { ApprovalLevelsService } from "@/services/registrations/approval-levels.service";
import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { ApprovalLevelForm } from "../-components/approval-level-form";

export const Route = createFileRoute(
  "/_app/registrations/approval-levels/$levelId/"
)({
  component: ApprovalLevelIdComponent,
});

function ApprovalLevelIdComponent() {
  const navigate = useNavigate();
  const { levelId } = useParams({
    from: "/_app/registrations/approval-levels/$levelId/",
  });

  const { data } = useQuery({
    queryKey: ["approval-level-id", levelId],
    queryFn: async () => {
      const data = await ApprovalLevelsService.getById(levelId);
      return data;
    },
    enabled: !!levelId,
  });

  if (!data) return;
  return (
    <AppPageHeader titleSlot={`Alterar Alçada de Aprovação: ${levelId}`}>
      <div className="p-2 max-w-lg ml-auto mr-auto">
        <ApprovalLevelForm
          initialData={data}
          isOpen={true}
          mode={"EDIT"}
          onClose={() => navigate({ to: "/registrations/approval-levels" })}
        />
      </div>
    </AppPageHeader>
  );
}
