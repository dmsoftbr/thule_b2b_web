import { formatNumber } from "@/lib/number-utils";
import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { useState, type JSX } from "react";
import { DashboardsFilter } from "./-components/filter";
import { AppPageHeader } from "@/components/layout/app-page-header";

type HierarchyData = {
  pais?: string;
  familiaComercial?: string;
  familiaMaterial?: string;
  qtAnoAnterior?: string;
  vlAnoAnterior?: string;
  qtAnoAtual?: string;
  vlAnoAtual?: number;
  percQt?: number;
  percValor?: number;
  budget: number;
  percBudget: number;
  children?: HierarchyData[];
};

export const Route = createFileRoute("/_app/dashboards/dashboard9")({
  component: RouteComponent,
});

// const { data: hierarchyData } = useQuery({
//   queryKey: ["rep-goals"],
//   queryFn: async () => {
//     // const params = {
//     //   representativeId: selectedRepresentatives,
//     //   productCommercialFamilyId: selectedFamilies,
//     //   year: selectedYear,
//     //   month: selectedMonth,
//     // };

//     // const { data } = await api.post(
//     //   "/registrations/representative-goals/get",
//     //   {},
//     // );

//     setExpandedRows(new Set());
//     return [];
//   },
// });

function RouteComponent() {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const hierarchyData: any[] = [];

  const toggleRow = (path: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedRows(newExpanded);
  };

  const renderRows = (
    items: HierarchyData[],
    parentPath = "",
    level = 0,
  ): JSX.Element[] => {
    if (!items) return [];
    return items.flatMap((item, index) => {
      const currentPath = `${parentPath}-${level}-${index}`;
      const hasChildren = item.children && item.children.length > 0;
      const isExpanded = expandedRows.has(currentPath);
      const isLeaf = item.familiaComercial !== undefined;
      console.log(isLeaf);
      const rows: JSX.Element[] = [
        <tr key={currentPath} className="border-b hover:bg-gray-50">
          <td
            className={cn(
              "border-r px-4 py-2 text-sm",
              isExpanded && item.pais && "bg-neutral-100",
            )}
          >
            <div className="flex items-center">
              {item.pais && hasChildren && (
                <button
                  className="h-5 w-5 mr-1 p-0 hover:bg-gray-200 rounded flex items-center justify-center"
                  onClick={() => toggleRow(currentPath)}
                >
                  {isExpanded ? (
                    <ChevronDownIcon className="h-4 w-4" />
                  ) : (
                    <ChevronRightIcon className="h-4 w-4" />
                  )}
                </button>
              )}
              {item.pais || ""}
            </div>
          </td>
          <td
            className={cn(
              "border-r px-4 py-2 text-sm",
              isExpanded &&
                (item.familiaComercial || item.pais) &&
                "bg-neutral-100",
            )}
          >
            <div className="flex items-center">
              {item.familiaComercial && hasChildren && (
                <button
                  className="h-5 w-5 mr-1 p-0 hover:bg-gray-200 rounded flex items-center justify-center"
                  onClick={() => toggleRow(currentPath)}
                >
                  {isExpanded ? (
                    <ChevronDownIcon className="h-4 w-4" />
                  ) : (
                    <ChevronRightIcon className="h-4 w-4" />
                  )}
                </button>
              )}
              {item.familiaComercial || ""}
            </div>
          </td>
          <td
            className={cn(
              "border-r px-4 py-2 text-sm",
              isExpanded &&
                (item.familiaMaterial || item.pais || item.familiaComercial) &&
                "bg-neutral-100",
            )}
          >
            <div className="flex items-center">
              {item.familiaMaterial && hasChildren && (
                <button
                  className="h-5 w-5 mr-1 p-0 hover:bg-gray-200 rounded flex items-center justify-center"
                  onClick={() => toggleRow(currentPath)}
                >
                  {isExpanded ? (
                    <ChevronDownIcon className="h-4 w-4" />
                  ) : (
                    <ChevronRightIcon className="h-4 w-4" />
                  )}
                </button>
              )}
              {item.familiaMaterial || ""}
            </div>
          </td>
          <td className="border-r px-4 py-2 text-right text-sm">
            {formatNumber(item.qtAnoAnterior, 0)}
          </td>
          <td className="border-r px-4 py-2 text-right text-sm">
            {formatNumber(item.vlAnoAnterior, 2)}
          </td>
          <td className="border-r px-4 py-2 text-right text-sm">
            {formatNumber(item.qtAnoAtual, 0)}
          </td>
          <td className="border-r px-4 py-2 text-right text-sm">
            {formatNumber(item.vlAnoAtual, 2)}
          </td>
        </tr>,
      ];

      if (hasChildren && isExpanded) {
        rows.push(...renderRows(item.children!, currentPath, level + 1));
      }

      return rows;
    });
  };

  return (
    <AppPageHeader titleSlot="Dashboard Pais x Meta x Real">
      <div className="p-2 bg-white w-full">
        <DashboardsFilter
          onAplicar={(filtro) => {
            console.log(filtro);
          }}
        />
        <div className="w-full overflow-auto border rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th
                  rowSpan={2}
                  className="border-r border-gray-300 px-4 py-3 text-left text-xs font-semibold text-black"
                >
                  País
                </th>
                <th
                  rowSpan={2}
                  className="border-r border-gray-300 px-4 py-3 text-left text-xs font-semibold text-black"
                >
                  Tipo Item
                </th>
                <th
                  colSpan={2}
                  className="border-r border-b border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black"
                >
                  Jan
                </th>
                <th
                  colSpan={2}
                  className="border-r border-b border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black"
                >
                  Fev
                </th>
                <th
                  colSpan={2}
                  className="border-r border-b border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black"
                >
                  Mar
                </th>
                <th
                  colSpan={2}
                  className="border-r border-b border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black"
                >
                  Abr
                </th>
                <th
                  colSpan={2}
                  className="border-r border-b border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black"
                >
                  Mai
                </th>
                <th
                  colSpan={2}
                  className="border-r border-b border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black"
                >
                  Jun
                </th>
                <th
                  colSpan={2}
                  className="border-r border-b border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black"
                >
                  Jul
                </th>
                <th
                  colSpan={2}
                  className="border-r border-b border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black"
                >
                  Ago
                </th>
                <th
                  colSpan={2}
                  className="border-r border-b border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black"
                >
                  Set
                </th>
                <th
                  colSpan={2}
                  className="border-r border-b border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black"
                >
                  Out
                </th>
                <th
                  colSpan={2}
                  className="border-r border-b border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black"
                >
                  Nov
                </th>
                <th
                  colSpan={2}
                  className="border-r border-b border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black"
                >
                  Dez
                </th>
                <th
                  colSpan={2}
                  className="border-r border-b border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black"
                >
                  Total
                </th>
              </tr>
              <tr className="bg-gray-200">
                <th className="border-r border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black">
                  Qtd
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black">
                  Valor
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black">
                  Qtd
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black">
                  Valor
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black">
                  Qtd
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black">
                  Valor
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black">
                  Qtd
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black">
                  Valor
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black">
                  Qtd
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black">
                  Valor
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black">
                  Qtd
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black">
                  Valor
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black">
                  Qtd
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black">
                  Valor
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black">
                  Qtd
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black">
                  Valor
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black">
                  Qtd
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black">
                  Valor
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black">
                  Qtd
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black">
                  Valor
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black">
                  Qtd
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black">
                  Valor
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black">
                  Qtd
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black">
                  Valor
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black">
                  Qtd
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black">
                  Valor
                </th>
              </tr>
            </thead>
            <tbody>{renderRows(hierarchyData ?? [])}</tbody>
            <tfoot>
              <tr className="bg-slate-200 border-t border-t-slate-300">
                <th colSpan={2} className="border-r">
                  Total
                </th>
                <th className="border-r border-r-slate-300 text-sm font-semibold text-right"></th>
                <th className="border-r border-r-slate-300 text-sm font-semibold text-right"></th>
                <th className="border-r border-r-slate-300 text-sm font-semibold text-right"></th>
                <th className="border-r border-r-slate-300 text-sm font-semibold text-right"></th>
                <th className="border-r border-r-slate-300 text-sm font-semibold text-right"></th>
                <th className="border-r border-r-slate-300 text-sm font-semibold text-right"></th>
                <th className="border-r border-r-slate-300 text-sm font-semibold text-right"></th>
                <th className="border-r border-r-slate-300 text-sm font-semibold text-right"></th>
                <th className="border-r border-r-slate-300 text-sm font-semibold text-right"></th>
                <th className="border-r border-r-slate-300 text-sm font-semibold text-right"></th>
                <th className="border-r border-r-slate-300 text-sm font-semibold text-right"></th>
                <th className="border-r border-r-slate-300 text-sm font-semibold text-right"></th>
                <th className="border-r border-r-slate-300 text-sm font-semibold text-right"></th>
                <th className="border-r border-r-slate-300 text-sm font-semibold text-right"></th>
                <th className="border-r border-r-slate-300 text-sm font-semibold text-right"></th>
                <th className="border-r border-r-slate-300 text-sm font-semibold text-right"></th>
                <th className="border-r border-r-slate-300 text-sm font-semibold text-right"></th>
                <th className="border-r border-r-slate-300 text-sm font-semibold text-right"></th>
                <th className="border-r border-r-slate-300 text-sm font-semibold text-right"></th>
                <th className="border-r border-r-slate-300 text-sm font-semibold text-right"></th>
                <th className="border-r border-r-slate-300 text-sm font-semibold text-right"></th>
                <th className="border-r border-r-slate-300 text-sm font-semibold text-right"></th>
                <th className="border-r border-r-slate-300 text-sm font-semibold text-right"></th>
                <th className="border-r border-r-slate-300 text-sm font-semibold text-right"></th>
                <th className="border-r border-r-slate-300 text-sm font-semibold text-right"></th>
                <th className="border-r border-r-slate-300 text-sm font-semibold text-right"></th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </AppPageHeader>
  );
}
