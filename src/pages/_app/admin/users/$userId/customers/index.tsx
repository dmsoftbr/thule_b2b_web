import { AppPageHeader } from "@/components/layout/app-page-header";
import { ServerTable } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import { api, handleError } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { TableSkeleton } from "@/pages/_app/-components/route-skeleton";
import { useState } from "react";
import { toast } from "sonner";
import type { UserModel } from "@/models/user.model";
import type { UserCustomerModel } from "@/models/admin/user-customer.model";
import { userCustomerColumns } from "./-components/customer-columns";
import { AddUserCustomerModal } from "./-components/add-user-customer-modal";

export const Route = createFileRoute("/_app/admin/users/$userId/customers/")({
  component: UserCustomersPageComponent,
  pendingComponent: TableSkeleton,
});

function UserCustomersPageComponent() {
  const [tableToken, setTableToken] = useState(new Date().valueOf());
  const [showAddModal, setShowAddModal] = useState(false);
  const { userId } = useParams({
    from: "/_app/admin/users/$userId/customers/",
  });
  const navigate = useNavigate();

  const { data: userData } = useQuery({
    queryKey: ["user-id", userId],
    queryFn: async () => {
      const { data } = await api.get<UserModel>(
        `/admin/users/${encodeURIComponent(userId)}`,
      );
      return data;
    },
    enabled: !!userId,
  });

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const handleDelete = async (data: UserCustomerModel) => {
    try {
      await api.delete(
        `/admin/user-customers/${encodeURIComponent(data.userId)}/${encodeURIComponent(data.customerId)}`,
      );
      setTableToken(new Date().valueOf());
    } catch (error) {
      toast.error(handleError(error));
    }
  };

  return (
    <AppPageHeader
      titleSlot={`Clientes Vinculados — Usuário: ${userId}${userData?.name ? ` - ${userData.name}` : ""}`}
    >
      <div className="max-w-2xl ml-auto mr-auto mt-2">
        <ServerTable<UserCustomerModel>
          key={tableToken}
          onAdd={() => handleAdd()}
          columns={userCustomerColumns({ fnDelete: handleDelete })}
          defaultSearchField="customerId"
          searchFields={[{ id: "customerId", label: "Código do Cliente" }]}
          dataUrl="/admin/user-customers/list-paged"
          additionalInfo={{ userId }}
        />
      </div>
      <div className="my-4 max-w-2xl ml-auto mr-auto">
        <Button onClick={() => navigate({ to: "/admin/users" })}>
          Voltar p/Lista de Usuários
        </Button>
      </div>
      {showAddModal && (
        <AddUserCustomerModal
          isOpen={showAddModal}
          userId={userId}
          onClose={(refresh) => {
            if (refresh) setTableToken(new Date().valueOf());
            setShowAddModal(false);
          }}
        />
      )}
    </AppPageHeader>
  );
}
