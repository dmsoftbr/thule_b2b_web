import { AppPageHeader } from "@/components/layout/app-page-header";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SkuMessageForm } from "./-components/sku-message-form";

export const Route = createFileRoute(
  "/_app/registrations/sku-messages/new-sku-message",
)({
  component: NewSkuMessageComponent,
});

function NewSkuMessageComponent() {
  const navigate = useNavigate();

  return (
    <AppPageHeader titleSlot={`Novo Tipo Item`}>
      <div className="p-2 max-w-lg ml-auto mr-auto">
        <SkuMessageForm
          initialData={null}
          isOpen={true}
          mode={"ADD"}
          onClose={() => navigate({ to: "/registrations/sku-messages" })}
        />
      </div>
    </AppPageHeader>
  );
}
