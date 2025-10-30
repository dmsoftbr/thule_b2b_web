import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppPageHeader } from "@/components/layout/app-page-header";
import {
  ServerTable,
  type ServerTableSearchField,
} from "@/components/server-table/server-table";
import type { SalesGroupModel } from "@/models/registrations/sales-group.model";
import { columns } from "./-components/columns";
import { useState } from "react";
import { DetailsModal } from "./-components/details-modal";

export const Route = createFileRoute("/_app/registrations/sales-group/")({
  component: SalesGroupPageComponent,
});

const searchFieldsList: ServerTableSearchField[] = [
  {
    id: "id",
    label: "Código",
  },
  {
    id: "name",
    label: "Nome",
  },
];

function SalesGroupPageComponent() {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentData, setCurrentData] = useState<SalesGroupModel | null>(null);
  const navigate = useNavigate();

  const handleAdd = () => {
    navigate({ to: "/registrations/sales-group/new-group" });
  };

  const handleEdit = async (data: SalesGroupModel) => {
    navigate({ to: `/registrations/sales-group/${data.id}` });
  };

  const handleDelete = async (data: SalesGroupModel) => {
    console.log(data);
  };

  const handleDetails = async (data: SalesGroupModel) => {
    setCurrentData(data);
    setShowDetailsModal(true);
  };

  return (
    <AppPageHeader titleSlot="Grupos de Venda">
      <div className="p-2">
        <ServerTable<SalesGroupModel>
          onAdd={() => handleAdd()}
          defaultSearchField="name"
          defaultSortFieldDataIndex="name"
          searchFields={searchFieldsList}
          columns={columns({
            fnDelete: handleDelete,
            fnEdit: handleEdit,
            fnDetails: handleDetails,
          })}
          dataUrl="/registrations/sales-groups/list-paged"
        />
      </div>
      {showDetailsModal && currentData && (
        <DetailsModal
          groupData={currentData}
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setCurrentData(null);
          }}
        />
      )}
    </AppPageHeader>
  );
}
