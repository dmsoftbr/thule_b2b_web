import { AppPageHeader } from "@/components/layout/app-page-header";
import { UserGroupsService } from "@/services/admin/user-groups.service";
import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { UserGroupForm } from "../-components/user-group-form";

export const Route = createFileRoute("/_app/admin/user-groups/$groupId/")({
  component: UserGroupIdPageComponent,
});

function UserGroupIdPageComponent() {
  const navigate = useNavigate();
  const { groupId } = useParams({
    from: "/_app/admin/user-groups/$groupId/",
  });

  const { data } = useQuery({
    queryKey: ["user-group-id", groupId],
    queryFn: async () => {
      const data = await new UserGroupsService().getById(groupId);
      return data;
    },
    enabled: !!groupId,
  });

  if (!data) return;
  return (
    <AppPageHeader titleSlot={`Alterar Grupo de Usuário: ${groupId}`}>
      <div className="p-2 max-w-lg ml-auto mr-auto">
        <UserGroupForm
          initialData={data}
          isOpen={true}
          mode={"EDIT"}
          onClose={() => navigate({ to: "/admin/user-groups" })}
        />
      </div>
    </AppPageHeader>
  );
}
