import { AppPageHeader } from "@/components/layout/app-page-header";
import { ServerTable } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import type { PriceTableBranchExceptionModel } from "@/models/registrations/price-table-branch-exception.model";
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { useState } from "react";
import { exceptionTableColumns } from "./-components/exception-table-columns";
import { BranchExceptionModal } from "./-components/branch-exception-modal";
import { api } from "@/lib/api";
export const Route = createFileRoute(
  "/_app/registrations/price-tables/$priceTableId/branches-exception/",
)({
  component: PriceTableBranchesExceptionComponent,
});

function PriceTableBranchesExceptionComponent() {
  const [tableToken, setTableToken] = useState(new Date().valueOf());
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();
  const { priceTableId } = useParams({
    from: "/_app/registrations/price-tables/$priceTableId/branches-exception/",
  });

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const handleDelete = async (data: PriceTableBranchExceptionModel) => {
    await api.delete(
      `/registrations/price-table-branches-exception/${priceTableId}/${data.branchId}`,
    );
    setTableToken(new Date().valueOf());
  };

  return (
    <AppPageHeader
      titleSlot={`Excessão de Estabelecimentos da Tabela de Preço: ${priceTableId}`}
    >
      <div className="w-full px-4 mt-2">
        <ServerTable<PriceTableBranchExceptionModel>
          key={tableToken}
          onAdd={() => handleAdd()}
          columns={exceptionTableColumns({ fnDelete: handleDelete })}
          defaultSearchField="branchId"
          searchFields={[
            { id: "branchId", label: "Código do Estabelecimento" },
          ]}
          dataUrl={`/registrations/price-table-branches-exception/list-paged/${priceTableId}`}
          additionalInfo={{ priceTableId }}
        />
      </div>
      <div className="my-4 w-full px-4">
        <Button onClick={() => navigate({ to: "/registrations/price-tables" })}>
          Voltar p/Lista de Tabelas de Preço
        </Button>
      </div>
      {showAddModal && (
        <BranchExceptionModal
          isOpen={showAddModal}
          onClose={(refresh) => {
            if (refresh) setTableToken(new Date().valueOf());
            setShowAddModal(false);
          }}
          priceTableId={priceTableId}
        />
      )}
    </AppPageHeader>
  );
}
