import { AppPageHeader } from "@/components/layout/app-page-header";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { ProductModel } from "@/models/product.model";
import {
  ServerTable,
  type ServerTableSearchField,
} from "@/components/server-table/server-table";
import { columns } from "./-components/columns";
import { useState } from "react";
import { ProductOrderMessageModal } from "./-components/order-message-modal";

const searchFieldsList: ServerTableSearchField[] = [
  {
    id: "id",
    label: "Código",
  },
  {
    id: "description",
    label: "Descrição",
  },
];

export const Route = createFileRoute("/_app/registrations/products/")({
  component: ProductsPageComponent,
});

function ProductsPageComponent() {
  const navigate = useNavigate();
  const [showMsg, setShowMsg] = useState(false);
  const [productData, setProductData] = useState<ProductModel | null>(null);
  const [tableToken, setTableToken] = useState(new Date().valueOf());
  const handlePhotos = async (data: ProductModel) => {
    navigate({ to: `/registrations/products/${data.id}` });
  };

  const handleMessage = async (data: ProductModel) => {
    setProductData(data);
    setShowMsg(true);
  };

  return (
    <AppPageHeader titleSlot="Produtos">
      <div className="p-2">
        <ServerTable<ProductModel>
          defaultSearchField="id"
          key={tableToken}
          defaultSortFieldDataIndex="id"
          searchFields={searchFieldsList}
          columns={columns({
            fnDetails: handlePhotos,
            fnMessage: handleMessage,
          })}
          showAddButton={false}
          dataUrl="/registrations/products/list-paged"
        />
      </div>
      {showMsg && productData && (
        <ProductOrderMessageModal
          isOpen={showMsg}
          initialData={productData}
          onClose={(refresh) => {
            setShowMsg(false);
            setProductData(null);
            if (refresh) setTableToken(new Date().valueOf());
          }}
        />
      )}
    </AppPageHeader>
  );
}
