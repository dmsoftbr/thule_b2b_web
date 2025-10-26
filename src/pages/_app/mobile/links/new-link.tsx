import { AppPageHeader } from "@/components/layout/app-page-header";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MobileLinkForm } from "./-components/link-form";

export const Route = createFileRoute("/_app/mobile/links/new-link")({
  component: MobileLinkNewPageComponent,
});

function MobileLinkNewPageComponent() {
  const navigate = useNavigate();

  return (
    <AppPageHeader titleSlot={`Novo Link para o App Mobile`}>
      <div className="p-2 max-w-lg ml-auto mr-auto">
        <MobileLinkForm
          initialData={null}
          isOpen={true}
          mode={"ADD"}
          onClose={() => navigate({ to: "/mobile/links" })}
        />
      </div>
    </AppPageHeader>
  );
}
