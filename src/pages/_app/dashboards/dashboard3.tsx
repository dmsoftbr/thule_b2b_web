import { createFileRoute } from "@tanstack/react-router";
import { LoaderIcon } from "lucide-react";
import { useState } from "react";
import { DashboardsFilter, type DashboardFiltro } from "./-components/filter";
import { AppPageHeader } from "@/components/layout/app-page-header";
import { toast } from "sonner";
import { api, handleError } from "@/lib/api";
import { TabDashboard3 } from "./-components/tab-dashboard3";
import {
  agruparDados,
  type VendaRaw,
  type VendaAgrupada,
} from "./-components/agrupamento-dashboard3";

// type HierarchyData = {
//   pais?: string;
//   tipoItem?: string;
//   grupoEstoque?: string;
//   qtAnoAnterior?: number;
//   vlAnoAnterior?: number;
//   qtAnoAtual?: number;
//   vlAnoAtual?: number;
//   percQt?: number;
//   percValor?: number;
//   budget: number;
//   percBudget: number;
//   children?: HierarchyData[];
// };

export const Route = createFileRoute("/_app/dashboards/dashboard3")({
  component: RouteComponent,
});

function RouteComponent() {
  const [tableData, setTableData] = useState<VendaAgrupada[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  //const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // const toggleRow = (path: string) => {
  //   const newExpanded = new Set(expandedRows);
  //   if (newExpanded.has(path)) {
  //     newExpanded.delete(path);
  //   } else {
  //     newExpanded.add(path);
  //   }
  //   setExpandedRows(newExpanded);
  // };

  const handleGetData = async (filtro: DashboardFiltro) => {
    try {
      setIsLoading(true);
      const { data } = await api.post<VendaRaw[]>(
        `/dashboards-thule/dashboard2`,
        filtro,
      );
      const arvore = agruparDados(data);
      setTableData(arvore);
    } catch (error) {
      toast.error(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  // const renderRows = (
  //   items: HierarchyData[],
  //   parentPath = "",
  //   level = 0,
  // ): JSX.Element[] => {
  //   if (!items) return [];
  //   return items.flatMap((item, index) => {
  //     const currentPath = `${parentPath}-${level}-${index}`;
  //     const hasChildren = item.children && item.children.length > 0;
  //     const isExpanded = expandedRows.has(currentPath);
  //     //const isLeaf = item.familiaComercial !== undefined;

  //     const rows: JSX.Element[] = [
  //       <tr key={currentPath} className="border-b hover:bg-gray-50">
  //         <td
  //           className={cn(
  //             "border-r px-4 py-2 text-sm",
  //             isExpanded && item.pais && "bg-neutral-100",
  //           )}
  //         >
  //           <div className="flex items-center">
  //             {item.pais && hasChildren && (
  //               <button
  //                 className="h-5 w-5 mr-1 p-0 hover:bg-gray-200 rounded flex items-center justify-center"
  //                 onClick={() => toggleRow(currentPath)}
  //               >
  //                 {isExpanded ? (
  //                   <ChevronDownIcon className="h-4 w-4" />
  //                 ) : (
  //                   <ChevronRightIcon className="h-4 w-4" />
  //                 )}
  //               </button>
  //             )}
  //             {item.pais || ""}
  //           </div>
  //         </td>
  //         <td
  //           className={cn(
  //             "border-r px-4 py-2 text-sm",
  //             isExpanded && (item.tipoItem || item.pais) && "bg-neutral-100",
  //           )}
  //         >
  //           <div className="flex items-center">
  //             {item.tipoItem && hasChildren && (
  //               <button
  //                 className="h-5 w-5 mr-1 p-0 hover:bg-gray-200 rounded flex items-center justify-center"
  //                 onClick={() => toggleRow(currentPath)}
  //               >
  //                 {isExpanded ? (
  //                   <ChevronDownIcon className="h-4 w-4" />
  //                 ) : (
  //                   <ChevronRightIcon className="h-4 w-4" />
  //                 )}
  //               </button>
  //             )}
  //             {item.tipoItem || ""}
  //           </div>
  //         </td>
  //         <td
  //           className={cn(
  //             "border-r px-4 py-2 text-sm",
  //             isExpanded &&
  //               (item.familiaComercial || item.pais || item.tipoItem) &&
  //               "bg-neutral-100",
  //           )}
  //         >
  //           <div className="flex items-center">
  //             {item.familiaComercial && hasChildren && (
  //               <button
  //                 className="h-5 w-5 mr-1 p-0 hover:bg-gray-200 rounded flex items-center justify-center"
  //                 onClick={() => toggleRow(currentPath)}
  //               >
  //                 {isExpanded ? (
  //                   <ChevronDownIcon className="h-4 w-4" />
  //                 ) : (
  //                   <ChevronRightIcon className="h-4 w-4" />
  //                 )}
  //               </button>
  //             )}
  //             {item.familiaComercial || ""}
  //           </div>
  //         </td>
  //         <td className="border-r px-4 py-2 text-right text-sm">
  //           {formatNumber(item.qtAnoAnterior, 0)}
  //         </td>
  //         <td className="border-r px-4 py-2 text-right text-sm">
  //           {formatNumber(item.vlAnoAnterior, 2)}
  //         </td>
  //         <td className="border-r px-4 py-2 text-right text-sm">
  //           {formatNumber(item.qtAnoAtual, 0)}
  //         </td>
  //         <td className="border-r px-4 py-2 text-right text-sm">
  //           {formatNumber(item.vlAnoAtual, 2)}
  //         </td>
  //       </tr>,
  //     ];

  //     if (hasChildren && isExpanded) {
  //       rows.push(...renderRows(item.children!, currentPath, level + 1));
  //     }

  //     return rows;
  //   });
  // };

  return (
    <AppPageHeader titleSlot="Dashboard Comparativo Anual">
      <div className="p-2 bg-white w-full">
        {isLoading && (
          <div className="absolute inset-0 bg-neutral-900/30 z-40 flex items-center justify-center">
            <div className="w-[200px] h-20 rounded-lg bg-white z-50 flex items-center justify-center">
              <span>
                <LoaderIcon className="size-4 mr-2 animate-spin text-blue-600" />
              </span>{" "}
              Aguarde...
            </div>
          </div>
        )}
        <DashboardsFilter onAplicar={(filtro) => handleGetData(filtro)} />
        <div className="w-full overflow-auto border rounded-lg">
          {/* <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border-r border-gray-300 px-4 py-3 text-left text-xs font-semibold text-black">
                  País
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-left text-xs font-semibold text-black">
                  Tipo Item
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-left text-xs font-semibold text-black">
                  Família Comercial
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-left text-xs font-semibold text-black">
                  Qtde Ano Anterior
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-left text-xs font-semibold text-black">
                  R$ Ano Anterior
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-left text-xs font-semibold text-black">
                  Qtde Ano Atual
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-right text-xs font-semibold text-black">
                  R$ Ano Atual
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-right text-xs font-semibold text-black">
                  % Qtde
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-right text-xs font-semibold text-black">
                  % Vendas
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-right text-xs font-semibold text-black">
                  Budget
                </th>
                <th className="border-r border-gray-300 px-4 py-3 text-right text-xs font-semibold text-black">
                  % Vendas Atual x Budget
                </th>
              </tr>
            </thead>
            <tbody>{renderRows(tableData ?? [])}</tbody>
          </table> */}
          <TabDashboard3 dadosArvore={tableData} />
        </div>
      </div>
    </AppPageHeader>
  );
}
