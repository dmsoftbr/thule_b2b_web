import { useEffect, useState, type JSX } from "react";
import {
  ChevronDown,
  ChevronRight,
  DollarSignIcon,
  FilterIcon,
  PlusIcon,
  UploadIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SearchCombo,
  type SearchComboItem,
} from "@/components/ui/search-combo";
import { RepresentativesService } from "@/services/registrations/representatives.service";
import { ProductCommercialFamiliesService } from "@/services/registrations/product-commercial-families.service";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadModal } from "./upload-modal";
import { ReadjustmentModal } from "./readjustment-modal";

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

// const hierarchyData: HierarchyData[] = [
//   {
//     mesAno: "jan/25",
//     valor: 43000,
//     children: [
//       {
//         gerenteComercial: "FABIO",
//         valor: 43000,
//         children: [
//           {
//             representante: "NOIA",
//             valor: 43000,
//             children: [
//               {
//                 grupoCliente: "CONCESSIONARIAS",
//                 valor: 21500,
//                 children: [
//                   {
//                     grupoEstoque: "BIKES",
//                     quantidade: 15,
//                     valor: 1500,
//                     children: [
//                       {
//                         familiaComercial: "BIKE CARRIER",
//                         quantidade: 10,
//                         valor: 1000,
//                       },
//                       {
//                         familiaComercial: "OUTRAS BIKES",
//                         quantidade: 5,
//                         valor: 500,
//                       },
//                     ],
//                   },
//                   {
//                     grupoEstoque: "BAGS",
//                     quantidade: 15,
//                     valor: 20000,
//                     children: [
//                       {
//                         familiaComercial: "MOCHILAS SYSTEM",
//                         quantidade: 5,
//                         valor: 10000,
//                       },
//                       {
//                         familiaComercial: "CASE LOGIC",
//                         quantidade: 10,
//                         valor: 10000,
//                       },
//                     ],
//                   },
//                 ],
//               },
//               {
//                 grupoCliente: "THULE STORE",
//                 valor: 21500,
//                 children: [
//                   {
//                     grupoEstoque: "BIKES",
//                     quantidade: 15,
//                     valor: 1500,
//                     children: [
//                       {
//                         familiaComercial: "BIKE CARRIER",
//                         quantidade: 10,
//                         valor: 1000,
//                       },
//                       {
//                         familiaComercial: "OUTRAS BIKES",
//                         quantidade: 5,
//                         valor: 500,
//                       },
//                     ],
//                   },
//                   {
//                     grupoEstoque: "BAGS",
//                     quantidade: 15,
//                     valor: 20000,
//                     children: [
//                       {
//                         familiaComercial: "MOCHILAS SYSTEM",
//                         quantidade: 5,
//                         valor: 10000,
//                       },
//                       {
//                         familiaComercial: "CASE LOGIC",
//                         quantidade: 10,
//                         valor: 10000,
//                       },
//                     ],
//                   },
//                 ],
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
// ];

export function GoalsTable() {
  const [representativesData, setRepresentativesData] = useState<
    SearchComboItem[]
  >([]);
  const [productCommercialFamiliesData, setProductCommercialFamiliesData] =
    useState<SearchComboItem[]>([]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showReadjustmentModal, setShowReadjustmentModal] = useState(false);
  const [selectedRepresentatives, setSelectedRepresentatives] = useState<
    number[]
  >([]);
  const [selectedFamilies, setSelectedFamilies] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );

  const queryClient = useQueryClient();

  async function getRepresentatives() {
    const data = await new RepresentativesService().getAll();
    const newData: SearchComboItem[] = data.map((rep) => {
      return {
        value: rep.id.toString(),
        label: `${rep.abbreviation}`,
        extra: rep,
        keyworks: [rep.id.toString(), rep.abbreviation, rep.name],
      };
    });
    setRepresentativesData(newData);
  }

  async function getProductCommercialFamilies() {
    const data = await ProductCommercialFamiliesService.getAll();
    const newData: SearchComboItem[] = data.map((rep) => {
      return {
        value: rep.id.toString(),
        label: `${rep.name}`,
        extra: rep,
        keyworks: [rep.id.toString(), rep.name],
      };
    });
    setProductCommercialFamiliesData(newData);
  }

  useEffect(() => {
    getRepresentatives();
    getProductCommercialFamilies();
  }, []);

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const { data: hierarchyData } = useQuery({
    queryKey: ["rep-goals"],
    queryFn: async () => {
      const params = {
        representativeId: selectedRepresentatives,
        productCommercialFamilyId: selectedFamilies,
        year: selectedYear,
        month: selectedMonth,
      };

      const { data } = await api.post(
        "/registrations/representative-goals/get",
        params
      );
      setExpandedRows(new Set());
      return data;
    },
  });

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

  // const handleEdit = (item: HierarchyData) => {
  //   console.log(item);
  // };

  const renderRows = (
    items: HierarchyData[],
    parentPath = "",
    level = 0
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
            {/* {isLeaf && (
              <button
                type="button"
                onClick={() => handleEdit(item)}
                className="h-7 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center mx-auto"
              >
                <Edit className="h-3 w-3" />
              </button>
            )} */}
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
    <div>
      <div className="mb-2 flex gap-x-4">
        <div className="flex flex-col space-y-1 flex-1">
          <Label>Representante:</Label>
          <SearchCombo
            multipleSelect
            showSelectButtons
            items={representativesData}
            showValueInSelectedItem
            onChange={() => {}}
            onSelectOption={(value) => {
              const newValues = value.map((item) => {
                return Number(item.value);
              });
              setSelectedRepresentatives(newValues);
            }}
            placeholder="Selecione os Representantes"
            key={representativesData.length}
          />
        </div>
        <div className="flex flex-col space-y-1 flex-1">
          <Label>Família Comercial:</Label>
          <SearchCombo
            multipleSelect
            showSelectButtons
            items={productCommercialFamiliesData}
            showValueInSelectedItem
            onChange={() => {}}
            onSelectOption={(value) => {
              const newValues = value.map((item) => {
                return item.value;
              });
              setSelectedFamilies(newValues);
            }}
            placeholder="Selecione as Famílias"
            key={productCommercialFamiliesData.length}
          />
        </div>
        <div className="flex flex-col space-y-1 ">
          <Label>Ano:</Label>
          <Input
            type="number"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            step={1}
            min={2020}
            max={2072}
          />
        </div>
        <div className="flex flex-col space-y-1 ">
          <Label>Mês:</Label>
          <Select
            value={selectedMonth.toString()}
            onValueChange={(value) => {
              setSelectedMonth(Number(value));
            }}
          >
            <SelectTrigger className="min-w-[200px]">
              <SelectValue placeholder="Mês" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Janeiro</SelectItem>
              <SelectItem value="1">Fevereiro</SelectItem>
              <SelectItem value="2">Março</SelectItem>
              <SelectItem value="3">Abril</SelectItem>
              <SelectItem value="4">Maio</SelectItem>
              <SelectItem value="5">Junho</SelectItem>
              <SelectItem value="6">Julho</SelectItem>
              <SelectItem value="7">Agosto</SelectItem>
              <SelectItem value="8">Setembro</SelectItem>
              <SelectItem value="9">Outubro</SelectItem>
              <SelectItem value="10">Novembro</SelectItem>
              <SelectItem value="11">Dezembro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-x-2">
          <Button
            className="mt-4"
            type="button"
            onClick={() =>
              queryClient.invalidateQueries({
                queryKey: ["rep-goals"],
              })
            }
          >
            <FilterIcon className="size-4" />
          </Button>
          <Button
            className="mt-4"
            variant="blue"
            type="button"
            onClick={() => setShowUploadModal(true)}
          >
            <PlusIcon className="size-4" />
            Novo
          </Button>
          <Button
            className="mt-4"
            variant="blue"
            type="button"
            onClick={() => setShowReadjustmentModal(true)}
          >
            <DollarSignIcon className="size-4" />
            Aplicar Reajuste
          </Button>
          <Button
            className="mt-4"
            variant="green"
            onClick={() => setShowUploadModal(true)}
          >
            <UploadIcon className="size-4" />
            Importar
          </Button>
        </div>
      </div>
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
      {showUploadModal && (
        <UploadModal
          isOpen={showUploadModal}
          onClose={(refresh) => {
            if (refresh)
              queryClient.invalidateQueries({ queryKey: ["rep-goals"] });
            setShowUploadModal(false);
          }}
        />
      )}

      {showReadjustmentModal && (
        <ReadjustmentModal
          isOpen={showReadjustmentModal}
          onClose={(refresh) => {
            if (refresh)
              queryClient.invalidateQueries({ queryKey: ["rep-goals"] });
            setShowReadjustmentModal(false);
          }}
        />
      )}
    </div>
  );
}
