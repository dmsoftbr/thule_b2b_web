import { AppPageHeader } from "@/components/layout/app-page-header";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { UserForm } from "./-components/user-form";

export const Route = createFileRoute("/_app/admin/users/new-user")({
  component: NewUserPageComponent,
});

function NewUserPageComponent() {
  const navigate = useNavigate();

  return (
    <AppPageHeader titleSlot={`Novo Usuário`}>
      <div className="p-2 max-w-lg ml-auto mr-auto">
        <UserForm
          initialData={null}
          isOpen={true}
          mode={"ADD"}
          onClose={() => navigate({ to: "/admin/users" })}
        />
      </div>
    </AppPageHeader>
  );
}
