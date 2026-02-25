import { AppPageHeader } from "@/components/layout/app-page-header";
import { createFileRoute } from "@tanstack/react-router";
import { DashboardsFilter } from "./-components/filter";

export const Route = createFileRoute("/_app/dashboards/dashboard7")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppPageHeader titleSlot="Dashboard Ranking de Produtos">
      <div className="p-2 bg-white flex flex-col">
        <DashboardsFilter />
        <div>
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-neutral-200">
                <th className="text-sm font-semibold border border-neutral-300">
                  Item
                </th>
                <th className="text-sm font-semibold border border-neutral-300">
                  Descrição
                </th>
                <th className="text-sm font-semibold border border-neutral-300">
                  Qtde
                </th>
                <th className="text-sm font-semibold border border-neutral-300">
                  TotalVendaSImp
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="odd:bg-neutral-100">
                <td className="border p-1 text-sm">532002</td>
                <td className="border p-1 text-sm">Free Ride</td>
                <td className="border p-1 text-sm">10</td>
                <td className="border p-1 text-sm">1000.00</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-neutral-200">
                <th
                  colSpan={2}
                  className="text-sm font-semibold border border-neutral-300"
                >
                  Total
                </th>
                <th className="text-sm font-semibold border border-neutral-300">
                  0
                </th>
                <th className="text-sm font-semibold border border-neutral-300">
                  0
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </AppPageHeader>
  );
}
