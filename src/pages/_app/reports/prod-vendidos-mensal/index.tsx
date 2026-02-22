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
import { Label } from "@/components/ui/label";
import type { rptProdutosVendidosModel } from "@/models/reports/rptProdutosVendidos.model";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDownIcon, Loader2Icon, LoaderIcon } from "lucide-react";
import { useState } from "react";
import { api, handleError } from "@/lib/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { SearchCombo } from "@/components/ui/search-combo";
import { useQuery } from "@tanstack/react-query";
import { convertArrayToSearchComboItem } from "@/lib/search-combo-utils";
import { formatNumber } from "@/lib/number-utils";

export const Route = createFileRoute("/_app/reports/prod-vendidos-mensal/")({
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
  const [tableData, setTableData] = useState<rptProdutosVendidosModel[]>([]);
  const [selectedReps, setSelectedReps] = useState<number[]>([]);

  const { data: representativesData } = useQuery({
    queryKey: ["representatives"],
    queryFn: async () => {
      const { data } = await api.get("/registrations/representatives/all");
      const allReps = data.map((rep: any) => rep.id);
      setSelectedReps(allReps);
      return data;
    },
  });

  const getData = async () => {
    setIsLoading(true);
    setTableData([]);
    try {
      const { data } = await api.post(`/reports/prod-vendidos-mensal`, {
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
        `/reports/prod-vendidos-mensal/pdf`,
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
      link.download = "ProdutosVendidosMensal.pdf"; // Suggest a filename for download
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
        `/reports/prod-vendidos-mensal/xlsx`,
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
      link.download = "ProdutosVendidosMensal.xlsx"; // Suggest a filename for download
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
    <AppPageHeader titleSlot="Produtos Vendidos Mensal">
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
                    Item
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-sm font-semibold">
                    Descrição
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-sm font-semibold">
                    UN
                  </th>
                  <th className="border border-neutral-300 bg-neutral-200 text-sm font-semibold">
                    [Mês]
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.length == 0 ? (
                  <tr>
                    <td colSpan={12} className="h-24 text-center">
                      Sem dados para exibir
                    </td>
                  </tr>
                ) : (
                  tableData.map((row, index) => (
                    <tr key={index} className="odd:bg-neutral-100">
                      <td className="border px-2 text-sm py-1">
                        {row.itCodigo}
                      </td>
                      <td className="border px-2 text-sm py-1">
                        {row.descItem}
                      </td>
                      <td className="border px-2 text-sm py-1">{row.un}</td>
                      <td className="border px-2 text-sm py-1 text-right">
                        {formatNumber(row.qtFatur1, 0)}
                      </td>
                      <td className="border px-2 text-sm py-1 text-right">
                        {formatNumber(row.vlMerc1, 2)}
                      </td>

                      <td className="border px-2 text-sm py-1 text-right">
                        {formatNumber(row.qtFatur2, 0)}
                      </td>
                      <td className="border px-2 text-sm py-1 text-right">
                        {formatNumber(row.vlMerc2, 2)}
                      </td>

                      <td className="border px-2 text-sm py-1 text-right">
                        {formatNumber(row.qtFatur3, 0)}
                      </td>
                      <td className="border px-2 text-sm py-1 text-right">
                        {formatNumber(row.vlMerc3, 2)}
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
