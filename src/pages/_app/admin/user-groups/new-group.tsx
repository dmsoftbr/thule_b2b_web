import { createFileRoute } from "@tanstack/react-router";
import { UserGroupForm } from "./-components/user-group-form";

export const Route = createFileRoute("/_app/admin/user-groups/new-group")({
  component: NewUserGroupPage,
});

function NewUserGroupPage() {
  return (
    <div className="m-2 bg-white border shadow rounded w-full relative">
      <h1 className="font-semibold text-lg px-2 bg-neutral-200">
        Novo Grupo de Usuário
      </h1>
      <UserGroupForm action="ADD" />
    </div>
  );
}
