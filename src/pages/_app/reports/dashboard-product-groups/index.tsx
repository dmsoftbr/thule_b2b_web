import { AppPageHeader } from "@/components/layout/app-page-header";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/reports/dashboard-product-groups/")(
  {
    component: RouteComponent,
  }
);

function RouteComponent() {
  return (
    <AppPageHeader titleSlot={"Dashboard de Vendas por Grupos de Produtos"}>
      <div></div>
    </AppPageHeader>
  );
}
