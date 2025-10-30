import { AppPageHeader } from "@/components/layout/app-page-header";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ApprovalLevelForm } from "./-components/approval-level-form";

export const Route = createFileRoute(
  "/_app/registrations/approval-levels/new-level"
)({
  component: NewLevelPageComponent,
});

function NewLevelPageComponent() {
  const navigate = useNavigate();

  return (
    <AppPageHeader titleSlot={`Nova Alçada de Aprovação`}>
      <div className="p-2 max-w-lg ml-auto mr-auto">
        <ApprovalLevelForm
          initialData={null}
          isOpen={true}
          mode={"ADD"}
          onClose={() => navigate({ to: "/registrations/approval-levels" })}
        />
      </div>
    </AppPageHeader>
  );
}
