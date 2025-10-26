import { AppPageHeader } from "@/components/layout/app-page-header";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MobileCommunicationForm } from "./-components/communication-form";

export const Route = createFileRoute(
  "/_app/mobile/communications/new-communicate"
)({
  component: NewCommunicateComponent,
});

function NewCommunicateComponent() {
  const navigate = useNavigate();

  return (
    <AppPageHeader titleSlot={`Novo Comunicado para o App Mobile`}>
      <div className="p-2 max-w-lg ml-auto mr-auto">
        <MobileCommunicationForm
          initialData={null}
          isOpen={true}
          mode={"ADD"}
          onClose={() => navigate({ to: "/mobile/communications" })}
        />
      </div>
    </AppPageHeader>
  );
}
