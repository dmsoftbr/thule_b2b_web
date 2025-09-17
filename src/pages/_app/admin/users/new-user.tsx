import { createFileRoute } from "@tanstack/react-router";
import { UserForm } from "./-components/user-form";

export const Route = createFileRoute("/_app/admin/users/new-user")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="m-2 bg-white border shadow rounded w-full relative">
      <h1 className="font-semibold text-lg px-2 bg-neutral-200">
        Novo Usuário
      </h1>
      <UserForm />
    </div>
  );
}
