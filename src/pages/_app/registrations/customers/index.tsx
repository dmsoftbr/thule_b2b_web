import { AppPageHeader } from "@/components/layout/app-page-header";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import {
  ServerTable,
  type ServerTableSearchField,
} from "@/components/server-table/server-table";
import type { CustomerModel } from "@/models/registrations/customer.model";
import { columns } from "./-components/columns";

export const Route = createFileRoute("/_app/registrations/customers/")({
  component: CustomersPageComponent,
});

const searchFieldsList: ServerTableSearchField[] = [
  {
    id: "id",
    label: "Código",
  },
  {
    id: "abbreviation",
    label: "Nome Abreviado",
  },
  {
    id: "documentNumber",
    label: "CPF/CNPJ",
  },
];

function CustomersPageComponent() {
  const navigate = useNavigate();
  const handlePriceTables = async (data: CustomerModel) => {
    navigate({ to: `/registrations/customers/${data.id}/price-tables` });
  };

  const handleSalesGroup = async (data: CustomerModel) => {
    navigate({ to: `/registrations/customers/${data.id}/sales-group` });
  };

  return (
    <AppPageHeader titleSlot="Clientes">
      <div className="p-2">
        <ServerTable<CustomerModel>
          defaultSearchField="abbreviation"
          defaultSortFieldDataIndex="abbreviation"
          searchFields={searchFieldsList}
          columns={columns({
            fnPriceTables: handlePriceTables,
            fnSalesGroup: handleSalesGroup,
          })}
          showAddButton={false}
          dataUrl="/registrations/customers/list-paged"
        />
      </div>
    </AppPageHeader>
  );
}
