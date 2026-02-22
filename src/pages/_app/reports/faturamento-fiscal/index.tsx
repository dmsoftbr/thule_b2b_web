import { AppPageHeader } from "@/components/layout/app-page-header";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchCombo } from "@/components/ui/search-combo";
import { api, handleError } from "@/lib/api";
import { formatDate } from "@/lib/datetime-utils";
import { formatNumber } from "@/lib/number-utils";
import { convertArrayToSearchComboItem } from "@/lib/search-combo-utils";
import type { RptFaturamentoFiscalModel } from "@/models/reports/rptFaturamentoFiscalModel";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDownIcon, Loader2Icon, LoaderIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/reports/faturamento-fiscal/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [dtInicio, setDtInicio] = useState(new Date());
  const [dtTermino, setDtTermino] = useState(new Date());
  const [natOperacaoIni, setNatOperacaoIni] = useState("");
  const [natOperacaoFim, setNatOperacaoFim] = useState("ZZZZZZZZZZZZZZZZ");
  const [canalIni, setCanalIni] = useState(0);
  const [canalFim, setCanalFim] = useState(9999);
  const [nomeAbrevIni, setNomeAbrevIni] = useState("");
  const [nomeAbrevFim, setNomeAbrevFim] = useState("ZZZZZZZZZZZZ");
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState<RptFaturamentoFiscalModel[]>([]);
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

  const getData = async () => {
    setIsLoading(true);
    setTableData([]);
    try {
      const { data } = await api.post(`/reports/faturamento-fiscal`, {
        dtInicio,
        dtTermino,
        natOperacaoIni,
        natOperacaoFim,
        nomeAbrevIni,
        nomeAbrevFim,
        canalIni,
        canalFim,
        representantes: selectedReps,
      });
      setTableData(data);
    } catch (error) {
      console.log(error);
      toast.error(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetPDF = async () => {
    setIsLoading(true);
    try {
      const response = await api.post(
        `/reports/faturamento-fiscal/pdf`,
        {
          dtInicio,
          dtTermino,
          natOperacaoIni,
          natOperacaoFim,
          nomeAbrevIni,
          nomeAbrevFim,
          canalIni,
          canalFim,
          representantes: selectedReps,
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
      link.download = "FaturamentoFiscal.pdf"; // Suggest a filename for download
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
        `/reports/faturamento-fiscal/xlsx`,
        {
          dtInicio,
          dtTermino,
          natOperacaoIni,
          natOperacaoFim,
          nomeAbrevIni,
          nomeAbrevFim,
          canalIni,
          canalFim,
          representantes: selectedReps,
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
      link.download = "FaturamentoFiscal.xlsx"; // Suggest a filename for download
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
    <AppPageHeader titleSlot="Faturamento Fiscal">
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
                <Label>Período</Label>
                <DateRangePicker
                  disabled={isLoading}
                  showCompare={false}
                  locale="pt-BR"
                  onUpdate={(values) => {
                    setDtInicio(values.range.from);
                    if (values.range.to) setDtTermino(values.range.to);
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

            <div className="flex gap-x-2 w-full">
              {" "}
              {/* coluna 2 */}
              <div className="form-group">
                <Label>Nat. Operação de</Label>
                <Input
                  value={natOperacaoIni}
                  disabled={isLoading}
                  onChange={(e) => setNatOperacaoIni(e.target.value)}
                />
              </div>
              <div className="form-group">
                <Label>Nat. Operação até</Label>
                <Input
                  value={natOperacaoFim}
                  disabled={isLoading}
                  onChange={(e) => setNatOperacaoFim(e.target.value)}
                />
              </div>
              <div className="form-group">
                <Label>Canal de Venda de</Label>
                <Input
                  value={canalIni}
                  disabled={isLoading}
                  onChange={(e) => setCanalIni(Number(e.target.value))}
                  type="number"
                />
              </div>
              <div className="form-group">
                <Label>Canal de Venda até</Label>
                <Input
                  value={canalFim}
                  disabled={isLoading}
                  onChange={(e) => setCanalFim(Number(e.target.value))}
                  type="number"
                />
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
                    Estab
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-xs font-semibold">
                    Cliente
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-xs font-semibold">
                    Nome
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-xs font-semibold">
                    Série
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-xs font-semibold">
                    Nota Fiscal
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-xs font-semibold">
                    Nat. Operação
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-xs font-semibold">
                    Tp Compra
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-xs font-semibold">
                    Seq
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-xs font-semibold">
                    Item
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-xs font-semibold">
                    Canal Venda
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-xs font-semibold">
                    Emissão
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-xs font-semibold">
                    Transação
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-xs font-semibold">
                    CFOP
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-xs font-semibold">
                    NCM
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-xs font-semibold">
                    Qt Faturada
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-xs font-semibold">
                    Vl Mercadoria
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-xs font-semibold">
                    Total
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-xs font-semibold">
                    Vl ICMS
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-xs font-semibold">
                    Vl ST
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-xs font-semibold">
                    Vl IPI
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-xs font-semibold">
                    Vl PIS
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-xs font-semibold">
                    Vl COFINS
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-xs font-semibold">
                    Total S/Imp
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData?.length == 0 ? (
                  <tr>
                    <td colSpan={23} className="h-24 text-center">
                      Sem dados para exibir
                    </td>
                  </tr>
                ) : (
                  tableData?.map((row) => (
                    <tr
                      key={`${row.codEstabel}_${row.serie}_${row.nrNotaFis}`}
                      className="odd:bg-neutral-100"
                    >
                      <td className="border border-neutral-300 px-2 text-xs py-1">
                        {row.codEstabel}
                      </td>
                      <td className="border border-neutral-300 px-2 text-xs py-1">
                        {row.codEmitente}
                      </td>
                      <td className="border  border-neutral-300 px-2 text-xs py-1">
                        {row.nomeAbrev}
                      </td>
                      <td className="border  border-neutral-300 px-2 text-xs py-1">
                        {row.serie}
                      </td>
                      <td className="border  border-neutral-300 px-2 text-xs py-1">
                        {row.nrNotaFis}
                      </td>
                      <td className="border  border-neutral-300 px-2 text-xs py-1">
                        {row.natOperacao}
                      </td>
                      <td className="border  border-neutral-300 px-2 text-xs py-1">
                        {row.tipoCompra}
                      </td>
                      <td className="border  border-neutral-300 px-2 text-xs py-1 text-right">
                        {row.nrSequencia}
                      </td>
                      <td className="border  border-neutral-300 px-2 text-xs py-1 text-right">
                        {row.itCodigo}
                      </td>
                      <td className="border  border-neutral-300 px-2 text-xs py-1 text-right">
                        {row.codCanalVenda}
                      </td>
                      <td className="border  border-neutral-300 px-2 text-xs py-1 text-right">
                        {formatDate(row.dtEmissao)}
                      </td>
                      <td className="border  border-neutral-300 px-2 text-xs py-1 text-right">
                        {formatDate(row.dtDocto)}
                      </td>
                      <td className="border  border-neutral-300 px-2 text-xs py-1 text-right">
                        {row.cfop}
                      </td>
                      <td className="border  border-neutral-300 px-2 text-xs py-1 text-right">
                        {row.ncm}
                      </td>
                      <td className="border  border-neutral-300 px-2 text-xs py-1 text-right">
                        {formatNumber(row.qtFaturada, 0)}
                      </td>
                      <td className="border  border-neutral-300 px-2 text-xs py-1 text-right">
                        {formatNumber(row.vlMercLiq, 2)}
                      </td>
                      <td className="border  border-neutral-300 px-2 text-xs py-1 text-right">
                        {formatNumber(row.vlTotItem, 2)}
                      </td>
                      <td className="border  border-neutral-300 px-2 text-xs py-1 text-right">
                        {formatNumber(row.VlIcmsItem, 2)}
                      </td>
                      <td className="border  border-neutral-300 px-2 text-xs py-1 text-right">
                        {formatNumber(row.vlSTItem, 2)}
                      </td>
                      <td className="border  border-neutral-300 px-2 text-xs py-1 text-right">
                        {formatNumber(row.vlIPIItem, 2)}
                      </td>
                      <td className="border  border-neutral-300 px-2 text-xs py-1 text-right">
                        {formatNumber(row.vlPISItem, 2)}
                      </td>
                      <td className="border  border-neutral-300 px-2 text-xs py-1 text-right">
                        {formatNumber(row.vlCOFINSItem, 2)}
                      </td>
                      <td className="border  border-neutral-300 px-2 text-xs py-1 text-right">
                        {formatNumber(
                          row.vlTotItem -
                            row.VlIcmsItem -
                            row.vlSTItem -
                            row.vlIPIItem -
                            row.vlPISItem -
                            row.vlCOFINSItem,
                          2,
                        )}
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
