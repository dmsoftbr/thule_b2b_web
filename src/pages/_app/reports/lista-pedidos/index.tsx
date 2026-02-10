import { AppPageHeader } from "@/components/layout/app-page-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { api, handleError } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { columns } from "./-components/columns";
import { toast } from "sonner";
import { ChevronDownIcon, Loader2Icon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type rptListaPedidosResponseDto } from "@/models/reports/rptListaPedidos.model";

export const Route = createFileRoute("/_app/reports/lista-pedidos/")({
  component: ListaPedidosComponent,
});

function ListaPedidosComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [dtInicio, setDtInicio] = useState<Date>(new Date());
  const [dtTermino, setDtTermino] = useState<Date>(new Date());
  const [situacao, setSituacao] = useState(1);
  const [tableData, setTableData] = useState<rptListaPedidosResponseDto[]>([]);

  const handleGetPDF = async () => {
    setIsLoading(true);
    try {
      const response = await api.post(
        `/reports/orders-list/pdf`,
        {
          dtInicio,
          dtTermino,
          situacao,
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
      link.download = "ListaDePedidos.pdf"; // Suggest a filename for download
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
        `/reports/orders-list/xlsx`,
        {
          dtInicio,
          dtTermino,
          situacao,
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
      link.download = "ListaDePedidos.xlsx"; // Suggest a filename for download
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
      const { data } = await api.post(`/reports/orders-list`, {
        dtInicio,
        dtTermino,
        situacao,
      });
      setTableData(data);
    } catch (error) {
      console.log(error);
      toast.error(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppPageHeader titleSlot="Lista de Pedidos">
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
          <div className="form-group flex-0">
            <Label>Tipo do Relatório</Label>
            <RadioGroup
              defaultValue={situacao.toString()}
              value={situacao.toString()}
              onValueChange={(value) => setSituacao(Number(value))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="rptCarteira" />
                Carteira
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="rptTodosPedidos" />
                Todos os Pedidos
              </div>
            </RadioGroup>
          </div>
          <div className="form-group flex-1 min-w-0">
            <Label>Período</Label>
            <DateRangePicker
              initialDateFrom={dtInicio}
              initialCompareTo={dtTermino}
              onUpdate={(values) => {
                setDtInicio(values.range.from);
                setDtTermino(values.range.to ?? new Date());
              }}
            />
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
          <div className="border rounded-md">
            <Table className="border">
              <TableHeader>
                <TableRow>
                  {columns().map((col) => (
                    <TableHead
                      key={col.key}
                      className="border border-neutral-300 bg-neutral-200"
                    >
                      {col.title}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.length == 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Sem dados para exibir
                    </TableCell>
                  </TableRow>
                ) : (
                  tableData.map((row, idx) => (
                    <TableRow key={`ROW_${idx}`}>
                      {columns().map((col, index) => (
                        <TableCell
                          className="border"
                          key={`CELL_${col.key}_${index}`}
                        >
                          {col.renderItem?.(row) ??
                            (() => {
                              const value =
                                row[
                                  col.dataIndex as keyof rptListaPedidosResponseDto
                                ];
                              return value instanceof Date
                                ? value.toLocaleDateString()
                                : value;
                            })()}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AppPageHeader>
  );
}
