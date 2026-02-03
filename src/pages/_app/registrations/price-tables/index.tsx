import { AppPageHeader } from "@/components/layout/app-page-header";
import {
  ServerTable,
  type ServerTableSearchField,
} from "@/components/server-table/server-table";
import type { PriceTableModel } from "@/models/registrations/price-table.model";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { columns } from "./-components/columns";

export const Route = createFileRoute("/_app/registrations/price-tables/")({
  component: PriceTablesPageComponent,
});

const searchFieldsList: ServerTableSearchField[] = [
  {
    id: "id",
    label: "Código",
  },
  {
    id: "name",
    label: "Descrição",
  },
];

function PriceTablesPageComponent() {
  const navigate = useNavigate();

  const handleEdit = (data: PriceTableModel) => {
    navigate({ to: `/registrations/price-tables/${data.id}` });
  };

  const handlePrices = (data: PriceTableModel) => {
    navigate({ to: `/registrations/price-tables/${data.id}/prices` });
  };

  const handleProductsException = (data: PriceTableModel) => {
    navigate({
      to: `/registrations/price-tables/${data.id}/products-exception`,
    });
  };

  const handleBranchesException = (data: PriceTableModel) => {
    navigate({
      to: `/registrations/price-tables/${data.id}/branches-exception`,
    });
  };

  return (
    <AppPageHeader titleSlot="Manutenção de Tabelas de Preço">
      <div className="p-2">
        <ServerTable<PriceTableModel>
          defaultSearchField="id"
          defaultSortFieldDataIndex="id"
          searchFields={searchFieldsList}
          columns={columns({
            fnEdit: handleEdit,
            fnShowPrices: handlePrices,
            fnShowProductsException: handleProductsException,
            fnShowBranchesException: handleBranchesException,
          })}
          showAddButton={false}
          dataUrl="/registrations/price-tables/list-paged"
        />
      </div>
    </AppPageHeader>
  );
}
