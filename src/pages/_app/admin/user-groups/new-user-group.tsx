import { AppPageHeader } from "@/components/layout/app-page-header";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { UserGroupForm } from "./-components/user-group-form";

export const Route = createFileRoute("/_app/admin/user-groups/new-user-group")({
  component: NewUserGroupPageComponent,
});

function NewUserGroupPageComponent() {
  const navigate = useNavigate();

  return (
    <AppPageHeader titleSlot={`Novo Grupo de Usuários`}>
      <div className="p-2 max-w-lg ml-auto mr-auto">
        <UserGroupForm
          initialData={null}
          isOpen={true}
          mode={"ADD"}
          onClose={() => navigate({ to: "/admin/user-groups" })}
        />
      </div>
    </AppPageHeader>
  );
}
