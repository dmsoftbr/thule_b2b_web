import { AppPageHeader } from "@/components/layout/app-page-header";
import { createFileRoute } from "@tanstack/react-router";
import { ProductsTable } from "./-components/products-table";

export const Route = createFileRoute("/_app/registrations/products/")({
  component: ProductsPageComponent,
});

function ProductsPageComponent() {
  return (
    <AppPageHeader titleSlot="Produtos">
      <ProductsTable />
    </AppPageHeader>
  );
}
