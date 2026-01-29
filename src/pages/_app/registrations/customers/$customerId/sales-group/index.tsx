import { AppPageHeader } from "@/components/layout/app-page-header";
import { ServerTable } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { useState } from "react";
import type { CustomerModel } from "@/models/registrations/customer.model";
import type { CustomerSalesGroupModel } from "@/models/registrations/customer-sales-group-model";
import { salesGroupColumns } from "./-components/sales-group-columns";
import { AddSalesGroupModal } from "./-components/add-sales-group-modal";

export const Route = createFileRoute(
  "/_app/registrations/customers/$customerId/sales-group/",
)({
  component: CustomerIdSalesGroupPageComponent,
});

function CustomerIdSalesGroupPageComponent() {
  const [tableToken, setTableToken] = useState(new Date().valueOf());
  const [showAddModal, setShowAddModal] = useState(false);
  const { customerId } = useParams({
    from: "/_app/registrations/customers/$customerId/sales-group/",
  });
  const navigate = useNavigate();

  const { data: customerData } = useQuery({
    queryKey: ["customer-id", customerId],
    queryFn: async () => {
      const { data } = await api.get<CustomerModel>(
        `/registrations/customers/id/${customerId}`,
      );
      return data;
    },
    enabled: !!customerId,
  });

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const handleDelete = async (data: CustomerSalesGroupModel) => {
    await api.delete(
      `/registrations/customer-sales-group/${data.customerId}/${data.groupId}`,
    );

    setTableToken(new Date().valueOf());
  };

  return (
    <AppPageHeader
      titleSlot={`Grupos de Venda do Cliente: ${customerId} - ${customerData?.abbreviation}`}
    >
      <div className="max-w-lg ml-auto mr-auto mt-2">
        <ServerTable<CustomerSalesGroupModel>
          key={tableToken}
          onAdd={() => handleAdd()}
          columns={salesGroupColumns({ fnDelete: handleDelete })}
          defaultSearchField="groupId"
          searchFields={[{ id: "groupId", label: "Grupo de Venda" }]}
          dataUrl="/registrations/customer-sales-group/list-paged"
          additionalInfo={{ customerId }}
        />
      </div>
      <div className="my-4 max-w-lg ml-auto mr-auto">
        <Button onClick={() => navigate({ to: "/registrations/customers" })}>
          Voltar p/Lista de Clientes
        </Button>
      </div>
      {showAddModal && (
        <AddSalesGroupModal
          isOpen={showAddModal}
          onClose={(refresh) => {
            if (refresh) setTableToken(new Date().valueOf());
            setShowAddModal(false);
          }}
          customerId={customerData?.id ?? -1}
        />
      )}
    </AppPageHeader>
  );
}
