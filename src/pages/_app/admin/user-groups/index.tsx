import { createFileRoute } from "@tanstack/react-router";
import { UserGroupsTable } from "./-components/user-groups-table";

export const Route = createFileRoute("/_app/admin/user-groups/")({
  component: UserGroupsPage,
});

function UserGroupsPage() {
  return (
    <div className="m-2 p-2 bg-white border shadow rounded w-full">
      <h1 className="font-semibold text-lg">Grupos de Usuários</h1>
      <UserGroupsTable />
    </div>
  );
}
