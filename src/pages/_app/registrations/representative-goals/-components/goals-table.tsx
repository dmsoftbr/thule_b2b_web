import { useState, type JSX } from "react";
import { ChevronDown, ChevronRight, Edit } from "lucide-react";
import { cn } from "@/lib/utils";

type HierarchyData = {
  mesAno?: string;
  gerenteComercial?: string;
  representante?: string;
  grupoCliente?: string;
  grupoEstoque?: string;
  familiaComercial?: string;
  quantidade?: number;
  valor?: number;
  children?: HierarchyData[];
};

const hierarchyData: HierarchyData[] = [
  {
    mesAno: "jan/25",
    valor: 43000,
    children: [
      {
        gerenteComercial: "FABIO",
        valor: 43000,
        children: [
          {
            representante: "NOIA",
            valor: 43000,
            children: [
              {
                grupoCliente: "CONCESSIONARIAS",
                valor: 21500,
                children: [
                  {
                    grupoEstoque: "BIKES",
                    quantidade: 15,
                    valor: 1500,
                    children: [
                      {
                        familiaComercial: "BIKE CARRIER",
                        quantidade: 10,
                        valor: 1000,
                      },
                      {
                        familiaComercial: "OUTRAS BIKES",
                        quantidade: 5,
                        valor: 500,
                      },
                    ],
                  },
                  {
                    grupoEstoque: "BAGS",
                    quantidade: 15,
                    valor: 20000,
                    children: [
                      {
                        familiaComercial: "MOCHILAS SYSTEM",
                        quantidade: 5,
                        valor: 10000,
                      },
                      {
                        familiaComercial: "CASE LOGIC",
                        quantidade: 10,
                        valor: 10000,
                      },
                    ],
                  },
                ],
              },
              {
                grupoCliente: "THULE STORE",
                valor: 21500,
                children: [
                  {
                    grupoEstoque: "BIKES",
                    quantidade: 15,
                    valor: 1500,
                    children: [
                      {
                        familiaComercial: "BIKE CARRIER",
                        quantidade: 10,
                        valor: 1000,
                      },
                      {
                        familiaComercial: "OUTRAS BIKES",
                        quantidade: 5,
                        valor: 500,
                      },
                    ],
                  },
                  {
                    grupoEstoque: "BAGS",
                    quantidade: 15,
                    valor: 20000,
                    children: [
                      {
                        familiaComercial: "MOCHILAS SYSTEM",
                        quantidade: 5,
                        valor: 10000,
                      },
                      {
                        familiaComercial: "CASE LOGIC",
                        quantidade: 10,
                        valor: 10000,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

export function GoalsTable() {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (path: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedRows(newExpanded);
  };

  const formatNumber = (num?: number) => {
    if (num === undefined) return "";
    return num.toLocaleString("pt-BR");
  };

  const renderRows = (
    items: HierarchyData[],
    parentPath = "",
    level = 0
  ): JSX.Element[] => {
    return items.flatMap((item, index) => {
      const currentPath = `${parentPath}-${level}-${index}`;
      const hasChildren = item.children && item.children.length > 0;
      const isExpanded = expandedRows.has(currentPath);
      const isLeaf = item.familiaComercial !== undefined;

      const rows: JSX.Element[] = [
        <tr key={currentPath} className="border-b hover:bg-gray-50">
          <td
            className={cn(
              "border-r px-4 py-2 text-sm",
              isExpanded && item.mesAno && "bg-neutral-100"
            )}
          >
            <div className="flex items-center">
              {item.mesAno && hasChildren && (
                <button
                  className="h-5 w-5 mr-1 p-0 hover:bg-gray-200 rounded flex items-center justify-center"
                  onClick={() => toggleRow(currentPath)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              )}
              {item.mesAno || ""}
            </div>
          </td>
          <td
            className={cn(
              "border-r px-4 py-2 text-sm",
              isExpanded &&
                (item.gerenteComercial || item.mesAno) &&
                "bg-neutral-100"
            )}
          >
            <div className="flex items-center">
              {item.gerenteComercial && hasChildren && (
                <button
                  className="h-5 w-5 mr-1 p-0 hover:bg-gray-200 rounded flex items-center justify-center"
                  onClick={() => toggleRow(currentPath)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              )}
              {item.gerenteComercial || ""}
            </div>
          </td>
          <td
            className={cn(
              "border-r px-4 py-2 text-sm",
              isExpanded &&
                (item.representante || item.mesAno || item.gerenteComercial) &&
                "bg-neutral-100"
            )}
          >
            <div className="flex items-center">
              {item.representante && hasChildren && (
                <button
                  className="h-5 w-5 mr-1 p-0 hover:bg-gray-200 rounded flex items-center justify-center"
                  onClick={() => toggleRow(currentPath)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              )}
              {item.representante || ""}
            </div>
          </td>
          <td
            className={cn(
              "border-r px-4 py-2 text-sm",
              isExpanded && item.grupoCliente && "bg-neutral-100"
            )}
          >
            <div className="flex items-center">
              {item.grupoCliente && hasChildren && (
                <button
                  className="h-5 w-5 mr-1 p-0 hover:bg-gray-200 rounded flex items-center justify-center"
                  onClick={() => toggleRow(currentPath)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              )}
              {item.grupoCliente || ""}
            </div>
          </td>
          <td
            className={cn(
              "border-r px-4 py-2 text-sm",
              isExpanded && item.grupoEstoque && "bg-neutral-100"
            )}
          >
            <div className="flex items-center">
              {item.grupoEstoque && hasChildren && (
                <button
                  className="h-5 w-5 mr-1 p-0 hover:bg-gray-200 rounded flex items-center justify-center"
                  onClick={() => toggleRow(currentPath)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              )}
              {item.grupoEstoque || ""}
            </div>
          </td>
          <td className="border-r px-4 py-2 text-sm">
            {item.familiaComercial || ""}
          </td>
          <td className="border-r px-4 py-2 text-right text-sm">
            {formatNumber(item.quantidade)}
          </td>
          <td className="border-r px-4 py-2 text-right text-sm">
            {formatNumber(item.valor)}
          </td>
          <td className="px-4 py-2 text-center">
            {isLeaf && (
              <button className="h-7 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center mx-auto">
                <Edit className="h-3 w-3" />
              </button>
            )}
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
    <div className="w-full overflow-auto border rounded-lg">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border-r border-gray-300 px-4 py-3 text-left text-xs font-bold text-black uppercase">
              MÊS/ANO
            </th>
            <th className="border-r border-gray-300 px-4 py-3 text-left text-xs font-bold text-black uppercase">
              GERENTE COMERCIAL
            </th>
            <th className="border-r border-gray-300 px-4 py-3 text-left text-xs font-bold text-black uppercase">
              REPRESENTANTE
            </th>
            <th className="border-r border-gray-300 px-4 py-3 text-left text-xs font-bold text-black uppercase">
              GRUPO CLIENTE
            </th>
            <th className="border-r border-gray-300 px-4 py-3 text-left text-xs font-bold text-black uppercase">
              GRUPO DE ESTOQUE
            </th>
            <th className="border-r border-gray-300 px-4 py-3 text-left text-xs font-bold text-black uppercase">
              FAMILIA COMERCIAL
            </th>
            <th className="border-r border-gray-300 px-4 py-3 text-right text-xs font-bold text-black uppercase">
              QUANTIDADE
            </th>
            <th className="border-r border-gray-300 px-4 py-3 text-right text-xs font-bold text-black uppercase">
              VALOR
            </th>
            <th className="border-gray-300 px-4 py-3 text-center text-xs font-bold text-black uppercase">
              AÇÕES
            </th>
          </tr>
        </thead>
        <tbody>{renderRows(hierarchyData)}</tbody>
      </table>
    </div>
  );
}
