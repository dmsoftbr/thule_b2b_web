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
import { useState } from "react";
import { toast } from "sonner";
import type { CustomerModel } from "@/models/registrations/customer.model";
import type { CustomerPriceExceptionTableModel } from "@/models/registrations/customer-price-exception-table.model";
import { exceptionTableColumns } from "./-components/exception-table-columns";
import { AddExceptionTableModal } from "./-components/add-exception-table-modal";

export const Route = createFileRoute(
  "/_app/registrations/customers/$customerId/price-exception-tables/",
)({
  component: CustomerIdPriceExceptionTablesPageComponent,
});

function CustomerIdPriceExceptionTablesPageComponent() {
  const [tableToken, setTableToken] = useState(new Date().valueOf());
  const [showAddModal, setShowAddModal] = useState(false);
  const { customerId } = useParams({
    from: "/_app/registrations/customers/$customerId/price-exception-tables/",
  });
  const navigate = useNavigate();

  const { data: customerData } = useQuery({
    queryKey: ["customer-id", customerId],
    queryFn: async () => {
      const { data } = await api.get<CustomerModel>(
        `/registrations/customers/id/${encodeURIComponent(customerId)}`,
      );
      return data;
    },
    enabled: !!customerId,
  });

  const handleDelete = async (data: CustomerPriceExceptionTableModel) => {
    try {
      await api.delete(
        `/registrations/customer-price-exception-table/${encodeURIComponent(data.customerId)}/${encodeURIComponent(data.exceptionTableId)}`,
      );
      setTableToken(new Date().valueOf());
    } catch (error) {
      toast.error(handleError(error));
    }
  };

  return (
    <AppPageHeader
      titleSlot={`Grupos de Desconto do Cliente: ${customerId} - ${customerData?.abbreviation ?? ""}`}
    >
      <div className="max-w-xl ml-auto mr-auto mt-2">
        <ServerTable<CustomerPriceExceptionTableModel>
          key={tableToken}
          onAdd={() => setShowAddModal(true)}
          columns={exceptionTableColumns({ fnDelete: handleDelete })}
          defaultSearchField="exceptionTableId"
          searchFields={[
            { id: "exceptionTableId", label: "Grupo de Desconto" },
          ]}
          dataUrl="/registrations/customer-price-exception-table/list-paged"
          additionalInfo={{ customerId }}
        />
      </div>
      <div className="my-4 max-w-xl ml-auto mr-auto">
        <Button onClick={() => navigate({ to: "/registrations/customers" })}>
          Voltar p/Lista de Clientes
        </Button>
      </div>
      {showAddModal && (
        <AddExceptionTableModal
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
