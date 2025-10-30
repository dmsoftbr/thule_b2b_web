import { AppPageHeader } from "@/components/layout/app-page-header";
import { ServerTable } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { CustomerPriceTableModel } from "@/models/registrations/customer-price-table.model";
import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { columns } from "./-components/columns";
import { useState } from "react";
import { AddPriceTableModal } from "./-components/add-price-table-modal";
import type { CustomerModel } from "@/models/registrations/customer.model";

export const Route = createFileRoute(
  "/_app/registrations/customers/$customerId/price-tables/"
)({
  component: CustomerIdPageComponent,
});

function CustomerIdPageComponent() {
  const [tableToken, setTableToken] = useState(new Date().valueOf());
  const [showAddModal, setShowAddModal] = useState(false);
  const { customerId } = useParams({
    from: "/_app/registrations/customers/$customerId/price-tables/",
  });
  const navigate = useNavigate();

  const { data: customerData } = useQuery({
    queryKey: ["customer-id", customerId],
    queryFn: async () => {
      const { data } = await api.get<CustomerModel>(
        `/registrations/customers/id/${customerId}`
      );
      return data;
    },
    enabled: !!customerId,
  });

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const handleDelete = async (data: CustomerPriceTableModel) => {
    await api.delete(
      `/registrations/customer-price-tables/${data.customerId}/${data.priceTableId}`
    );

    setTableToken(new Date().valueOf());
  };

  return (
    <AppPageHeader
      titleSlot={`Tabelas de Preço do Cliente: ${customerId} - ${customerData?.abbreviation}`}
    >
      <div className="max-w-lg ml-auto mr-auto mt-2">
        <ServerTable<CustomerPriceTableModel>
          key={tableToken}
          onAdd={() => handleAdd()}
          columns={columns({ fnDelete: handleDelete })}
          defaultSearchField="priceTableId"
          searchFields={[{ id: "priceTableId", label: "Tabela de Preço" }]}
          dataUrl="/registrations/customer-price-tables/list-paged"
          additionalInfo={{ customerId }}
        />
      </div>
      <div className="my-4 max-w-lg ml-auto mr-auto">
        <Button onClick={() => navigate({ to: "/registrations/customers" })}>
          Voltar p/Lista de Clientes
        </Button>
      </div>
      {showAddModal && (
        <AddPriceTableModal
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
