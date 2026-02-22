import { AppPageHeader } from "@/components/layout/app-page-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { api, handleError } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronDownIcon, Loader2Icon, LoaderIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import type { RptTituloFinanceiroResponseDto } from "@/models/reports/rptTituloFinanceiro.model";
import { formatDate } from "@/lib/datetime-utils";
import { formatNumber } from "@/lib/number-utils";
import { useQuery } from "@tanstack/react-query";
import { SearchCombo } from "@/components/ui/search-combo";
import { convertArrayToSearchComboItem } from "@/lib/search-combo-utils";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/_app/reports/titulos-financeiros/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [dtEmissaoIni, setDtEmissaoIni] = useState<Date>(new Date());
  const [dtEmissaoFim, setDtEmissaoFim] = useState<Date>(new Date());
  const [dtVenctoIni, setDtVenctoIni] = useState<Date>(new Date());
  const [dtVenctoFim, setDtVenctoFim] = useState<Date>(new Date());
  const [inadimplentes, setInadimplentes] = useState(false);
  const [nomeAbrevIni, setNomeAbrevIni] = useState("");
  const [nomeAbrevFim, setNomeAbrevFim] = useState("ZZZZZZZZZZZZ");

  const [tableData, setTableData] = useState<RptTituloFinanceiroResponseDto[]>(
    [],
  );
  const [selectedReps, setSelectedReps] = useState<number[]>([]);

  const { data: representativesData } = useQuery({
    queryKey: ["representatives"],
    queryFn: async () => {
      const { data } = await api.get("/registrations/representatives/all");
      const allReps = data.map((rep: any) => rep.id);
      setSelectedReps(allReps);
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const handleGetPDF = async () => {
    setIsLoading(true);
    try {
      const response = await api.post(
        `/reports/titulos-financeiros/pdf`,
        {
          dtEmissaoIni,
          dtEmissaoFim,
          dtVenctoIni,
          dtVenctoFim,
          representantes: selectedReps,
          inadimplentes,
          nomeAbrevIni,
          nomeAbrevFim,
        },
        {
          responseType: "blob",
        },
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.download = "TitulosFinanceiros.pdf"; // Suggest a filename for download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // Clean up the object URL
    } catch (error) {
      toast.error(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetExcel = async () => {
    setIsLoading(true);
    try {
      const response = await api.post(
        `/reports/titulos-financeiros/xlsx`,
        {
          dtEmissaoIni,
          dtEmissaoFim,
          dtVenctoIni,
          dtVenctoFim,
          representantes: selectedReps,
          inadimplentes,
          nomeAbrevIni,
          nomeAbrevFim,
        },
        {
          responseType: "blob",
        },
      );
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.download = "TitulosFinanceiros.xlsx"; // Suggest a filename for download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // Clean up the object URL
    } catch (error) {
      toast.error(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const getData = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.post(`/reports/titulos-financeiros`, {
        dtEmissaoIni,
        dtEmissaoFim,
        dtVenctoIni,
        dtVenctoFim,
        representantes: selectedReps,
        inadimplentes,
        nomeAbrevIni,
        nomeAbrevFim,
      });
      setTableData(data);
    } catch (error) {
      console.log(error);
      toast.error(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const getSelectedRepsAsSearchComboItem = () => {
    if (!representativesData) return [];

    const reps = representativesData.filter((f: any) =>
      selectedReps.includes(f.id),
    );

    const options = convertArrayToSearchComboItem(
      reps ?? [],
      "id",
      "abbreviation",
    );
    return options;
  };

  return (
    <AppPageHeader titleSlot="Títulos Financeiros">
      <div
        style={{
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
          height: "100%",
          maxWidth: "100%",
          overflow: "hidden",
          paddingBottom: "24px",
        }}
      >
        <div className="p-2 flex gap-x-2">
          <div className="flex flex-col w-full gap-y-2">
            <div className="flex w-full gap-x-2">
              {/* coluna 1 */}
              <div className="form-group">
                <Label>Data de Emissão</Label>
                <DateRangePicker
                  disabled={isLoading}
                  showCompare={false}
                  locale="pt-BR"
                  onUpdate={(values) => {
                    setDtEmissaoIni(values.range.from);
                    if (values.range.to) setDtEmissaoFim(values.range.to);
                  }}
                />
              </div>

              <div className="form-group">
                <Label>Data de Vencto</Label>
                <DateRangePicker
                  disabled={isLoading}
                  showCompare={false}
                  locale="pt-BR"
                  onUpdate={(values) => {
                    setDtVenctoIni(values.range.from);
                    if (values.range.to) setDtVenctoFim(values.range.to);
                  }}
                />
              </div>

              <div className="form-group flex-1">
                <Label>Representante</Label>
                <SearchCombo
                  disabled={isLoading}
                  multipleSelect
                  defaultValue={getSelectedRepsAsSearchComboItem()}
                  onChange={() => {}}
                  onSelectOption={(values) =>
                    setSelectedReps(values.map((item) => Number(item.value)))
                  }
                  staticItems={convertArrayToSearchComboItem(
                    representativesData ?? [],
                    "id",
                    "abbreviation",
                  )}
                  showSelectButtons
                />
              </div>
              <div className="form-group">
                <Label>Cliente de</Label>
                <Input
                  value={nomeAbrevIni}
                  disabled={isLoading}
                  onChange={(e) => setNomeAbrevIni(e.target.value)}
                />
              </div>
              <div className="form-group">
                <Label>Cliente até</Label>
                <Input
                  value={nomeAbrevFim}
                  disabled={isLoading}
                  onChange={(e) => setNomeAbrevFim(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div className="form-group">
                <Label>
                  <Checkbox
                    defaultChecked={inadimplentes}
                    onCheckedChange={(value) => setInadimplentes(!!value)}
                  />
                  Somente Inadimplentes
                </Label>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="mt-5" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span>
                      <Loader2Icon className="size-4 mr-2 animate-spin" />
                    </span>
                    Gerando...
                  </>
                ) : (
                  <>
                    Gerar{" "}
                    <span>
                      <ChevronDownIcon className="size-4" />
                    </span>
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => getData()}>
                Em Tela
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleGetPDF()}>
                Em PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleGetExcel()}>
                Em Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div
          style={{ overflow: "auto", padding: "0 8px 8px 8px", minHeight: 0 }}
        >
          <div className="border rounded-md relative">
            {isLoading && (
              <div className="absolute inset-0 bg-neutral-800/35 z-40 flex items-center justify-center">
                <div className="flex items-center justify-center rounded-lg border bg-white w-[200px] h-20">
                  <span>
                    <LoaderIcon className="animate-spin size-4 mr-2 text-blue-600" />
                  </span>
                  Aguarde...
                </div>
              </div>
            )}
            <table className="border w-full table-auto">
              <thead>
                <tr>
                  <th className="border border-neutral-300 bg-neutral-200 text-xs font-semibold">
                    Representante
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-xs font-semibold">
                    Estab Estoq
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-xs font-semibold">
                    Documento
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-xs font-semibold">
                    Esp
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-xs font-semibold">
                    Série
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-xs font-semibold">
                    Parcela
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-xs font-semibold">
                    Cliente
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-xs font-semibold">
                    Pedido
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-xs font-semibold">
                    Emissão
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-xs font-semibold">
                    Vencto
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-xs font-semibold">
                    Vl Total
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-xs font-semibold">
                    Vl Líquido
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-xs font-semibold">
                    Vl ST
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-xs font-semibold">
                    Vl Abat
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-xs font-semibold">
                    Vl Desc
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-xs font-semibold">
                    Saldo
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-xs font-semibold">
                    Liquidação
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.length == 0 ? (
                  <tr>
                    <td colSpan={17} className="h-24 text-center">
                      Sem dados para exibir
                    </td>
                  </tr>
                ) : (
                  tableData.map((row, idx) => (
                    <tr key={`ROW_${idx}`} className="odd:bg-neutral-100">
                      <td className="border px-2 text-xs py-1">
                        {row.nomeAbRep}
                      </td>
                      <td className="border px-2 text-xs py-1">
                        {row.codEstab}
                      </td>
                      <td className="border px-2 text-xs py-1">
                        {row.codTitAcr}
                      </td>
                      <td className="border px-2 text-xs py-1">
                        {row.codEspecDoc}
                      </td>
                      <td className="border px-2 text-xs py-1">
                        {row.codSerDocto}
                      </td>
                      <td className="border px-2 text-xs py-1">
                        {row.codParcela}
                      </td>
                      <td className="border px-2 text-xs py-1">
                        {row.nomeAbrev}
                      </td>
                      <td className="border px-2 text-xs py-1">
                        {row.nrPedcli}
                      </td>
                      <td className="border px-2 text-xs py-1">
                        {formatDate(row.datEmisDocto)}
                      </td>
                      <td className="border px-2 text-xs py-1">
                        {formatDate(row.datVenctoTitAcr)}
                      </td>
                      <td className="border px-2 text-xs py-1">
                        {formatNumber(row.valTotTitAcr, 2)}
                      </td>
                      <td className="border px-2 text-xs py-1">
                        {formatNumber(row.valLiqTitAcr, 2)}
                      </td>
                      <td className="border px-2 text-xs py-1">
                        {formatNumber(row.valST, 2)}
                      </td>
                      <td className="border px-2 text-xs py-1">
                        {formatNumber(row.valAbatTitAcr, 2)}
                      </td>
                      <td className="border px-2 text-xs py-1">
                        {formatNumber(row.valDescTitAcr, 2)}
                      </td>
                      <td className="border px-2 text-xs py-1">
                        {formatNumber(row.valSdoTitAcr, 2)}
                      </td>
                      <td className="border px-2 text-xs py-1">
                        {formatDate(row.datLiqTitAcr)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppPageHeader>
  );
}
