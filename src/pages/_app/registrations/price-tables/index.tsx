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

  return (
    <AppPageHeader titleSlot="Manutenção de Tabelas de Preço">
      <div className="p-2">
        <ServerTable<PriceTableModel>
          defaultSearchField="id"
          defaultSortFieldDataIndex="id"
          searchFields={searchFieldsList}
          columns={columns({
            fnEdit: handleEdit,
          })}
          showAddButton={false}
          dataUrl="/registrations/price-tables/list-paged"
        />
      </div>
    </AppPageHeader>
  );
}
