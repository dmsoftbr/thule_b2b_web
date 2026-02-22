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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api, handleError } from "@/lib/api";
import { formatDate } from "@/lib/datetime-utils";
import { formatNumber } from "@/lib/number-utils";
import { convertArrayToSearchComboItem } from "@/lib/search-combo-utils";
import { cn } from "@/lib/utils";
import type {
  RptFaturamentoClienteModel,
  RptFaturamentoClienteNotaModel,
} from "@/models/reports/rptFaturamentoCliente.model";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDownIcon, Loader2Icon, LoaderIcon } from "lucide-react";
import { Fragment, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/reports/faturamento-cliente/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [dtInicio, setDtInicio] = useState(new Date());
  const [dtTermino, setDtTermino] = useState(new Date());
  const [itCodigoIni, setItCodigoIni] = useState("");
  const [itCodigoFim, setItCodigoFim] = useState("ZZZZZZZZZZZZZZZZ");
  const [famComercIni, setFamComercIni] = useState("");
  const [famComercFim, setFamComercFim] = useState("ZZZZZZZZ");
  const [nomeAbrevIni, setNomeAbrevIni] = useState("");
  const [nomeAbrevFim, setNomeAbrevFim] = useState("ZZZZZZZZZZZZ");
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState<RptFaturamentoClienteModel>();
  const [tipo, setTipo] = useState("resumido");
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
    setTableData(undefined);
    try {
      const { data } = await api.post(`/reports/faturamento-cliente`, {
        dtInicio,
        dtTermino,
        itCodigoIni,
        itCodigoFim,
        nomeAbrevIni,
        nomeAbrevFim,
        famComercIni,
        famComercFim,
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
        `/reports/faturamento-cliente/pdf`,
        {
          dtInicio,
          dtTermino,
          itCodigoIni,
          itCodigoFim,
          nomeAbrevIni,
          nomeAbrevFim,
          famComercIni,
          famComercFim,
          representantes: selectedReps,
          resumido: tipo == "resumido",
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
      link.download = "FaturamentoCliente.pdf"; // Suggest a filename for download
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
        `/reports/faturamento-cliente/xlsx`,
        {
          dtInicio,
          dtTermino,
          itCodigoIni,
          itCodigoFim,
          nomeAbrevIni,
          nomeAbrevFim,
          famComercIni,
          famComercFim,
          representantes: selectedReps,
          resumido: tipo == "resumido",
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
      link.download = "FaturamentoCliente.xlsx"; // Suggest a filename for download
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

  const getTotalMerc = (dados: RptFaturamentoClienteNotaModel[]) => {
    return dados.reduce((accum, b) => accum + b.vlMercad, 0);
  };
  const getTotalNotas = (dados: RptFaturamentoClienteNotaModel[]) => {
    return dados.reduce((accum, b) => accum + b.vlTotal, 0);
  };

  const renderItens = (nota: RptFaturamentoClienteNotaModel) => {
    const itensDataNota =
      tableData?.itens.filter(
        (f) =>
          f.codEstabel == nota.codEstabel &&
          f.serie == nota.serie &&
          f.nrNotaFis == nota.nrNotaFis,
      ) ?? [];
    const rowKey = `${nota.codEstabel}_${nota.serie}_${nota.nrNotaFis}`;

    return (
      <tr key={`SUB_${rowKey}`}>
        <td colSpan={8} className="pl-10 py-1 px-2">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-200">
                <th className="border border-neutral-300 text-xs font-semibold">
                  Pedido
                </th>
                <th className="border border-neutral-300 text-xs font-semibold">
                  Natureza
                </th>
                <th className="border border-neutral-300 text-xs font-semibold">
                  Item
                </th>
                <th className="border border-neutral-300 text-xs font-semibold">
                  Descrição
                </th>
                <th className="border border-neutral-300 text-xs font-semibold">
                  Quantidade
                </th>
                <th className="border border-neutral-300 text-xs font-semibold">
                  Vl Unit.
                </th>
                <th className="border border-neutral-300 text-xs font-semibold">
                  Vl ST
                </th>
                <th className="border border-neutral-300 text-xs font-semibold">
                  Valor Total
                </th>
              </tr>
            </thead>
            <tbody>
              {itensDataNota.map((item) => (
                <tr
                  key={`${item.sequencia}_${item.nrNotaFis}_${item.itCodigo}`}
                >
                  <td className="border text-xs p-1">{item.nrPedCli}</td>
                  <td className="border text-xs p-1">{item.natOoperacao}</td>
                  <td className="border text-xs p-1">{item.itCodigo}</td>
                  <td className="border text-xs p-1">{item.descItem}</td>
                  <td className="border text-xs text-right p-1">
                    {formatNumber(item.qtFatur, 0)}
                  </td>
                  <td className="border text-xs text-right p-1">
                    {formatNumber(item.vlUn, 2)}
                  </td>
                  <td className="border text-xs text-right p-1">
                    {formatNumber(item.vlST, 2)}
                  </td>
                  <td className="border text-xs text-right p-1">
                    {formatNumber(item.vlTotal, 2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </td>
      </tr>
    );
  };

  return (
    <AppPageHeader titleSlot="Faturamento Cliente">
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
                <Label>Item de</Label>
                <Input
                  value={itCodigoIni}
                  disabled={isLoading}
                  onChange={(e) => setItCodigoIni(e.target.value)}
                />
              </div>
              <div className="form-group">
                <Label>Item até</Label>
                <Input
                  value={itCodigoFim}
                  disabled={isLoading}
                  onChange={(e) => setItCodigoFim(e.target.value)}
                />
              </div>
              <div className="form-group">
                <Label>Fam. Comerc. de</Label>
                <Input
                  value={famComercIni}
                  disabled={isLoading}
                  onChange={(e) => setFamComercIni(e.target.value)}
                />
              </div>
              <div className="form-group">
                <Label>Fam. Comerc. até</Label>
                <Input
                  value={famComercFim}
                  disabled={isLoading}
                  onChange={(e) => setFamComercFim(e.target.value)}
                />
              </div>
              <div className="form-group">
                <Label>Tipo</Label>
                <Select
                  defaultValue="resumido"
                  onValueChange={(value) => setTipo(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="resumido">Resumido</SelectItem>
                    <SelectItem value="detalhado">Detalhado</SelectItem>
                  </SelectContent>
                </Select>
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
                  <th className="border border-neutral-300 bg-neutral-200 text-sm font-semibold">
                    Representante
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-sm font-semibold">
                    Cliente
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-sm font-semibold">
                    Nome
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-sm font-semibold">
                    Estab
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-sm font-semibold">
                    Série
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-sm font-semibold">
                    Nota Fiscal
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-sm font-semibold">
                    Emissão
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-sm font-semibold">
                    Vl. Mercad.
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-sm font-semibold">
                    Vl. Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData?.notas.length == 0 ? (
                  <tr>
                    <td colSpan={9} className="h-24 text-center">
                      Sem dados para exibir
                    </td>
                  </tr>
                ) : (
                  tableData?.notas.map((row, index) => (
                    <Fragment
                      key={`${row.codEstabel}_${row.serie}_${row.nrNotaFis}`}
                    >
                      <tr
                        key={index}
                        className={cn(
                          tipo == "detalhado"
                            ? "bg-blue-100"
                            : "odd:bg-neutral-100",
                        )}
                      >
                        <td className="border border-neutral-300 px-2 text-sm py-1">
                          {row.nomeAbRep}
                        </td>
                        <td className="border border-neutral-300 px-2 text-sm py-1">
                          {row.nomeAbrev}
                        </td>
                        <td className="border  border-neutral-300 px-2 text-sm py-1">
                          {row.nomeEmit}
                        </td>
                        <td className="border  border-neutral-300 px-2 text-sm py-1">
                          {row.codEstabel}
                        </td>
                        <td className="border  border-neutral-300 px-2 text-sm py-1">
                          {row.serie}
                        </td>
                        <td className="border  border-neutral-300 px-2 text-sm py-1">
                          {row.nrNotaFis}
                        </td>
                        <td className="border  border-neutral-300 px-2 text-sm py-1">
                          {formatDate(row.dtEmissao)}
                        </td>
                        <td className="border  border-neutral-300 px-2 text-sm py-1 text-right">
                          {formatNumber(row.vlMercad, 2)}
                        </td>
                        <td className="border  border-neutral-300 px-2 text-sm py-1 text-right">
                          {formatNumber(row.vlTotal, 2)}
                        </td>
                      </tr>
                      {tipo == "detalhado" && renderItens(row)}
                    </Fragment>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan={7} className="text-right text-sm px-2">
                    Total Mercadorias:
                  </th>
                  <th className="text-right text-sm px-2">
                    {formatNumber(getTotalMerc(tableData?.notas ?? []), 2)}
                  </th>
                </tr>
                <tr>
                  <th colSpan={7} className="text-right text-sm px-2">
                    Total Notas:
                  </th>
                  <th className="text-right text-sm px-2">
                    {formatNumber(getTotalNotas(tableData?.notas ?? []), 2)}
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </AppPageHeader>
  );
}
