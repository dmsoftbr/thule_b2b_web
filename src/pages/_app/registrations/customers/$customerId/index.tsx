import { AppPageHeader } from "@/components/layout/app-page-header";
import { Button } from "@/components/ui/button";
import { createFileRoute, useParams, useRouter } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { DetailsModal } from "../-components/details-modal";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { CustomerModel } from "@/models/registrations/customer.model";

export const Route = createFileRoute(
  "/_app/registrations/customers/$customerId/"
)({
  component: CustomerIdPageComponent,
});

function CustomerIdPageComponent() {
  const { customerId } = useParams({
    from: "/_app/registrations/customers/$customerId/",
  });

  const { history } = useRouter();
  const [showModal, setShowModal] = useState(false);

  const { data: customerData } = useQuery({
    queryKey: ["customer", customerId],
    queryFn: async () => {
      const { data } = await api.get<CustomerModel>(
        `/registrations/customers/id/${customerId}`
      );
      return data;
    },
    enabled: !!customerId,
  });

  return (
    <AppPageHeader
      titleSlot={
        <>
          <span>Informações Adicionais do Cliente: </span>
          <span className="font-semibold text-blue-600">
            {customerId} - {customerData?.abbreviation}
          </span>
        </>
      }
    >
      <div className="p-2">
        <h2 className="bg-neutral-100 border border-neutral-200 p-2 rounded-tl-md rounded-tr-md flex items-center justify-between">
          <p className="text-lg font-semibold">Contatos Adicionais</p>
          <Button
            size="sm"
            onClick={() => {
              setShowModal(true);
            }}
          >
            <PlusIcon className="size-3" />
            Novo Contato
          </Button>
        </h2>
        {/* <ServerTable
          data={[]}
          columns={[]}
          keyExtractor={(contact: any) => {
            return contact.id;
          }}
          totalItems={0}
        ></ServerTable> */}
      </div>
      <DetailsModal isOpen={showModal} onClose={() => setShowModal(false)} />
      <div className="mb-4 px-2">
        <Button type="button" onClick={() => history.go(-1)}>
          Voltar
        </Button>
      </div>
    </AppPageHeader>
  );
}
