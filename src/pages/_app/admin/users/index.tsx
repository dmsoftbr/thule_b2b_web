import { createFileRoute } from "@tanstack/react-router";
import { UsersTable } from "./-components/users-table";

export const Route = createFileRoute("/_app/admin/users/")({
  component: UsersPage,
  head: () => ({
    meta: [
      {
        title: "Usuários | THULE B2B",
      },
    ],
  }),
});

function UsersPage() {
  return (
    <div className="m-2 p-2 bg-white border shadow rounded w-full">
      <h1 className="font-semibold text-lg">Usuários</h1>
      <UsersTable />
    </div>
  );
}
