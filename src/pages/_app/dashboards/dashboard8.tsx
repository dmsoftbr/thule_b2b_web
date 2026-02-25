import { AppPageHeader } from "@/components/layout/app-page-header";
import { createFileRoute } from "@tanstack/react-router";
import { DashboardsFilter } from "./-components/filter";

export const Route = createFileRoute("/_app/dashboards/dashboard8")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppPageHeader titleSlot="Dashboard Metas x Realizado">
      <div className="p-2 bg-white w-full">
        <DashboardsFilter />
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th>Representante</th>
              <th>Qtde Ano Anterior</th>
              <th>R$ Ano Anterior</th>
              <th>Qtde Ano Atual</th>
              <th>R$ Ano Atual</th>
              <th>% Qtde</th>
              <th>% Valor</th>
              <th>Meta</th>
              <th>% Meta</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Representante</td>
              <td>Qtde Ano Anterior</td>
              <td>R$ Ano Anterior</td>
              <td>Qtde Ano Atual</td>
              <td>R$ Ano Atual</td>
              <td>% Qtde</td>
              <td>% Valor</td>
              <td>Meta</td>
              <td>% Meta</td>
            </tr>
          </tbody>
        </table>
      </div>
    </AppPageHeader>
  );
}
