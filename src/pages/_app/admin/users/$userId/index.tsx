import { AppPageHeader } from "@/components/layout/app-page-header";
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { UserForm } from "../-components/user-form";
import { useQuery } from "@tanstack/react-query";
import { UsersService } from "@/services/admin/users.service";

export const Route = createFileRoute("/_app/admin/users/$userId/")({
  component: UserIdPageComponent,
});

function UserIdPageComponent() {
  const navigate = useNavigate();
  const { userId } = useParams({
    from: "/_app/admin/users/$userId/",
  });

  const { data } = useQuery({
    queryKey: ["user-id", userId],
    queryFn: async () => {
      const data = await new UsersService().getById(userId, false);
      return data;
    },
    enabled: !!userId,
  });

  if (!data) return;
  return (
    <AppPageHeader titleSlot={`Alterar Usuário: ${userId}`}>
      <div className="p-2 max-w-lg ml-auto mr-auto">
        <UserForm
          initialData={data}
          isOpen={true}
          mode={"EDIT"}
          onClose={() => navigate({ to: "/admin/users" })}
        />
      </div>
    </AppPageHeader>
  );
}
