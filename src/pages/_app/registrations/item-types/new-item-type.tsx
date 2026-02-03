import { AppPageHeader } from "@/components/layout/app-page-header";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ItemTypeForm } from "./-components/item-type-form";

export const Route = createFileRoute(
  "/_app/registrations/item-types/new-item-type",
)({
  component: NewItemTypeComponent,
});

function NewItemTypeComponent() {
  const navigate = useNavigate();

  return (
    <AppPageHeader titleSlot={`Novo Tipo Item`}>
      <div className="p-2 max-w-lg ml-auto mr-auto">
        <ItemTypeForm
          initialData={null}
          isOpen={true}
          mode={"ADD"}
          onClose={() => navigate({ to: "/registrations/item-types" })}
        />
      </div>
    </AppPageHeader>
  );
}
