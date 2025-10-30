import { AppPageHeader } from "@/components/layout/app-page-header";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { ProductModel } from "@/models/product.model";
import {
  ServerTable,
  type ServerTableSearchField,
} from "@/components/server-table/server-table";
import { columns } from "./-components/columns";

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

  const handleDetails = async (data: ProductModel) => {
    console.log(data);
    navigate({ to: `/registrations/products/${data.id}` });
  };
  return (
    <AppPageHeader titleSlot="Produtos">
      <div className="p-2">
        <ServerTable<ProductModel>
          defaultSearchField="id"
          defaultSortFieldDataIndex="id"
          searchFields={searchFieldsList}
          columns={columns({
            fnDetails: handleDetails,
          })}
          showAddButton={false}
          dataUrl="/registrations/products/list-paged"
        />
      </div>
    </AppPageHeader>
  );
}
