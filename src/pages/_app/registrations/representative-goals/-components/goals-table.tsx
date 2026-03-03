import { useEffect, useState, type JSX } from "react";
import {
  ChevronDown,
  ChevronRight,
  DollarSignIcon,
  DownloadIcon,
  FilterIcon,
  Settings2Icon,
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
import { GenerateModal } from "./generate-modal";
import { formatNumber } from "@/lib/number-utils";

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

type FlatRow = {
  ano: string;
  mes: string;
  gerenteComercial: string;
  representante: string;
  grupoCliente: string;
  grupoEstoque: string;
  familiaComercial: string;
  quantidade: number;
  valor: number;
};

const mesesMap: Record<string, string> = {
  jan: "01",
  fev: "02",
  mar: "03",
  abr: "04",
  mai: "05",
  jun: "06",
  jul: "07",
  ago: "08",
  set: "09",
  out: "10",
  nov: "11",
  dez: "12",
};

function parseMesAno(mesAno?: string) {
  if (!mesAno) return { ano: "", mes: "" };

  // exemplo esperado: "jan./26"
  const [mesStr, anoStr] = mesAno.replace(".", "").split("/");

  const mesNumero = mesesMap[mesStr?.toLowerCase()] ?? "";
  const anoCompleto = anoStr ? `20${anoStr}` : "";

  return {
    ano: anoCompleto,
    mes: mesNumero,
  };
}

export function GoalsTable() {
  const [representativesData, setRepresentativesData] = useState<
    SearchComboItem[]
  >([]);
  const [productCommercialFamiliesData, setProductCommercialFamiliesData] =
    useState<SearchComboItem[]>([]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showReadjustmentModal, setShowReadjustmentModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [currentRow, setCurrentRow] = useState("");
  const [selectedRepresentatives, setSelectedRepresentatives] = useState<
    number[]
  >([]);
  const [selectedFamilies, setSelectedFamilies] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth(),
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
    refetchOnWindowFocus: false,
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
        params,
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
      //const isLeaf = item.familiaComercial !== undefined;
      const rows: JSX.Element[] = [
        <tr
          key={currentPath}
          className={cn(
            "border-b hover:bg-gray-50",
            currentPath == currentRow && "bg-sky-100",
          )}
          onClick={() => setCurrentRow(currentPath)}
        >
          <td
            className={cn(
              "border-r px-4 py-2 text-xs uppercase",
              isExpanded && item.mesAno && "bg-neutral-100",
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
              "border-r px-4 py-2 text-xs",
              isExpanded &&
                (item.gerenteComercial || item.mesAno) &&
                "bg-neutral-100",
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
              "border-r px-4 py-2 text-xs",
              isExpanded &&
                (item.representante || item.mesAno || item.gerenteComercial) &&
                "bg-neutral-100",
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
              "border-r px-4 py-2 text-xs",
              isExpanded && item.grupoCliente && "bg-neutral-100",
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
              "border-r px-4 py-2 text-xs",
              isExpanded && item.grupoEstoque && "bg-neutral-100",
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
          <td className="border-r px-4 py-2 text-xs">
            {item.familiaComercial || ""}
          </td>
          <td className="border-r px-4 py-2 text-right text-xs">
            {formatNumber(item.quantidade)}
          </td>
          <td className="border-r px-4 py-2 text-right text-xs">
            {formatNumber(item.valor)}
          </td>
          <td className="px-4 py-2 text-center"></td>
        </tr>,
      ];

      if (hasChildren && isExpanded) {
        rows.push(...renderRows(item.children!, currentPath, level + 1));
      }

      return rows;
    });
  };

  const handleExport = () => {
    exportHierarchyToCSV(hierarchyData);
  };

  function exportHierarchyToCSV(data: HierarchyData[], fileName = "dados.csv") {
    const rows: FlatRow[] = [];

    const traverse = (item: HierarchyData, parent: Partial<FlatRow> = {}) => {
      const { ano, mes } = parseMesAno(item.mesAno ?? undefined);

      const current: FlatRow = {
        ano: ano || parent.ano || "",
        mes: mes || parent.mes || "",
        gerenteComercial:
          item.gerenteComercial ?? parent.gerenteComercial ?? "",
        representante: item.representante ?? parent.representante ?? "",
        grupoCliente: item.grupoCliente ?? parent.grupoCliente ?? "",
        grupoEstoque: item.grupoEstoque ?? parent.grupoEstoque ?? "",
        familiaComercial:
          item.familiaComercial ?? parent.familiaComercial ?? "",
        quantidade: item.quantidade ?? parent.quantidade ?? 0,
        valor: item.valor ?? parent.valor ?? 0,
      };

      if (!item.children || item.children.length === 0) {
        rows.push(current);
      }

      item.children?.forEach((child) => traverse(child, current));
    };

    data.forEach((item) => traverse(item));

    const headers: (keyof FlatRow)[] = [
      "ano",
      "mes",
      "gerenteComercial",
      "representante",
      "grupoCliente",
      "grupoEstoque",
      "familiaComercial",
      "quantidade",
      "valor",
    ];

    const toPascalCase = (text: string) =>
      text.charAt(0).toUpperCase() + text.slice(1);

    const escape = (v: any) => {
      if (v === null || v === undefined) return "";
      const s = String(v).replace(/"/g, '""');
      return /[;"\n]/.test(s) ? `"${s}"` : s;
    };

    const csv = [
      headers.map((h) => toPascalCase(h)).join(";"),
      ...rows.map((r) =>
        headers
          .map((h) => {
            if (h === "quantidade" || h === "valor") {
              return formatNumber(r[h] as number, 2);
            }
            return escape(r[h]);
          })
          .join(";"),
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(link.href);
  }

  return (
    <div>
      <div className="mb-2 flex gap-x-4 flex-wrap">
        <div className="flex flex-col space-y-1 flex-1">
          <Label>Representante:</Label>
          <SearchCombo
            multipleSelect
            showSelectButtons
            staticItems={representativesData}
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
            staticItems={productCommercialFamiliesData}
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
              <SelectItem value="-1">Todos os Meses</SelectItem>
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
            onClick={() => setShowGenerateModal(true)}
          >
            <Settings2Icon className="size-4" />
            Gerar do Profitability
          </Button>
          <Button
            className="mt-4"
            variant="blue"
            type="button"
            onClick={() => setShowGenerateModal(true)}
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
          <Button
            className="mt-4"
            variant="secondary"
            onClick={() => handleExport()}
          >
            <DownloadIcon className="size-4" />
            Exportar
          </Button>
        </div>
      </div>
      <div className="w-full overflow-auto border rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border-r border-gray-300 px-4 py-3 text-left text-xs font-semibold text-black uppercase">
                MÊS/ANO
              </th>
              <th className="border-r border-gray-300 px-4 py-3 text-left text-xs font-semibold text-black uppercase">
                GERENTE COMERCIAL
              </th>
              <th className="border-r border-gray-300 px-4 py-3 text-left text-xs font-semibold text-black uppercase">
                REPRESENTANTE
              </th>
              <th className="border-r border-gray-300 px-4 py-3 text-left text-xs font-semibold text-black uppercase">
                GRUPO CLIENTE
              </th>
              <th className="border-r border-gray-300 px-4 py-3 text-left text-xs font-semibold text-black uppercase">
                GRUPO DE ESTOQUE
              </th>
              <th className="border-r border-gray-300 px-4 py-3 text-left text-xs font-semibold text-black uppercase">
                FAMILIA COMERCIAL
              </th>
              <th className="border-r border-gray-300 px-4 py-3 text-right text-xs font-semibold text-black uppercase">
                QUANTIDADE
              </th>
              <th className="border-r border-gray-300 px-4 py-3 text-right text-xs font-semibold text-black uppercase">
                VALOR
              </th>
              <th className="border-gray-300 px-4 py-3 text-center text-xs font-semibold text-black uppercase">
                AÇÕES
              </th>
            </tr>
          </thead>
          <tbody>{renderRows(hierarchyData)}</tbody>
          <tfoot>
            <tr className="text-xs">
              <th
                colSpan={6}
                className=" text-right p-1 border bg-slate-200 border-slate-300"
              >
                Total
              </th>
              <th className="border bg-slate-200 border-slate-300 p-1 text-right">
                {formatNumber(
                  hierarchyData.reduce(
                    (acc: number, b: HierarchyData) =>
                      acc + (b.quantidade ?? 0),
                    0,
                  ),
                )}
              </th>
              <th className="border bg-slate-200 border-slate-300 p-1 text-right">
                {formatNumber(
                  hierarchyData.reduce(
                    (acc: number, b: HierarchyData) => acc + (b.valor ?? 0),
                    0,
                  ),
                )}
              </th>
              <th className="border bg-slate-200 border-slate-300 p-1"></th>
            </tr>
          </tfoot>
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

      {showGenerateModal && (
        <GenerateModal
          isOpen={showGenerateModal}
          onClose={(refresh) => {
            if (refresh)
              queryClient.invalidateQueries({ queryKey: ["rep-goals"] });
            setShowGenerateModal(false);
          }}
        />
      )}
    </div>
  );
}
