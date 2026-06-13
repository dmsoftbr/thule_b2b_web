import { AppPageHeader } from "@/components/layout/app-page-header";
import { useAppDialog } from "@/components/app-dialog/use-app-dialog";
import { ServerTable } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { PriceTableProductExceptionModel } from "@/models/registrations/price-table-product-exception.model";
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { TableSkeleton } from "@/pages/_app/-components/route-skeleton";
import { useState } from "react";
import { ProductExceptionModal } from "./-components/product-exception-modal";
import { exceptionTableColumns } from "./-components/exception-table-columns";

export const Route = createFileRoute(
  "/_app/registrations/price-tables/$priceTableId/products-exception/",
)({
  component: PriceTableProductsExceptionComponent,
  pendingComponent: TableSkeleton,
});

function PriceTableProductsExceptionComponent() {
  const [tableToken, setTableToken] = useState(new Date().valueOf());
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();
  const { showAppDialog } = useAppDialog();
  const { priceTableId } = useParams({
    from: "/_app/registrations/price-tables/$priceTableId/products-exception/",
  });

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const handleDelete = async (data: PriceTableProductExceptionModel) => {
    const continueDelete = await showAppDialog({
      title: "Atenção",
      message: "Excluir este registro?",
      type: "confirm",
    });

    if (!continueDelete) return;

    await api.delete(
      `/registrations/price-table-products-exception/${encodeURIComponent(data.priceTableId)}/${encodeURIComponent(data.productId)}/${encodeURIComponent(data.branchId)}`,
    );
    setTableToken(new Date().valueOf());
  };

  return (
    <AppPageHeader
      titleSlot={`Excessão de Produtos da Tabela de Preço: ${priceTableId}`}
    >
      <div className="w-full px-4 mt-2">
        <ServerTable<PriceTableProductExceptionModel>
          key={tableToken}
          onAdd={() => handleAdd()}
          columns={exceptionTableColumns({ fnDelete: handleDelete })}
          defaultSearchField="productId"
          searchFields={[{ id: "productId", label: "Código Longo do Produto" }]}
          dataUrl={`/registrations/price-table-products-exception/list-paged/${encodeURIComponent(priceTableId)}`}
          additionalInfo={{ priceTableId }}
        />
      </div>
      <div className="my-4 w-full px-4">
        <Button onClick={() => navigate({ to: "/registrations/price-tables" })}>
          Voltar p/Lista de Tabelas de Preço
        </Button>
      </div>
      {showAddModal && (
        <ProductExceptionModal
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
