import { AppPageHeader } from "@/components/layout/app-page-header";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { SearchCombo } from "@/components/ui/search-combo";
import { api, handleError } from "@/lib/api";
import { convertArrayToSearchComboItem } from "@/lib/search-combo-utils";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDownIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { columns } from "./-components/columns";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { type ComissaoReportModel } from "@/models/reports/comission.model";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { formatNumber } from "@/lib/number-utils";

export const Route = createFileRoute("/_app/reports/comissao/")({
  component: ComissionReportComponent,
});

function ComissionReportComponent() {
  const [selectedReps, setSelectedReps] = useState<number[]>([]);
  const [initDate, setInitDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState<ComissaoReportModel[]>([]);

  const { data: representativesData } = useQuery({
    queryKey: ["representatives"],
    queryFn: async () => {
      const { data } = await api.get("/registrations/representatives/all");
      return data;
    },
  });

  const handleGetPDF = async () => {
    setIsLoading(true);
    try {
      const response = await api.post(
        `/reports/comissao/pdf`,
        {
          representatives: selectedReps,
          initDate,
          endDate,
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
      link.download = "Comissao.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
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
        `/reports/comissao/xlsx`,
        {
          representatives: selectedReps,
          initDate,
          endDate,
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
      link.download = "Comissao.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const getData = async () => {
    setIsLoading(true);
    try {
      const params = {
        representatives: selectedReps,
        initDate,
        endDate,
      };
      const { data } = await api.post(`/reports/comissao`, params);
      setTableData(data);
    } catch (error) {
      toast.error(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const table = useReactTable({
    data: tableData,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  function getTotal(param: number) {
    if (param == 1) {
      return tableData
        .filter((f) => f.realizado.toLowerCase() == "realizado")
        .reduce((acc, b) => (acc += b.vlComissao), 0);
    } else {
      return tableData
        .filter((f) => f.realizado.toLowerCase() !== "realizado")
        .reduce((acc, b) => (acc += b.vlComissao), 0);
    }
  }

  return (
    <AppPageHeader titleSlot="Comissão">
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
        {/* Filtros */}
        <div className="p-2 flex gap-x-2">
          <div className="form-group flex-0">
            <Label>Período</Label>
            <DateRangePicker
              disabled={isLoading}
              showCompare={false}
              locale="pt-BR"
              onUpdate={(values) => {
                setInitDate(values.range.from);
                if (values.range.to) setEndDate(values.range.to);
              }}
            />
          </div>
          <div className="form-group flex-1 min-w-0">
            <Label>Selecione o(s) Representante(s)</Label>
            <SearchCombo
              disabled={isLoading}
              multipleSelect
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="mt-5" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2Icon className="size-4 mr-2 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    Gerar <ChevronDownIcon className="size-4" />
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

        {/* Tabela */}
        <div
          style={{ overflow: "auto", padding: "0 8px 8px 8px", minHeight: 0 }}
        >
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="border border-neutral-300 text-sm h-8 text-left font-semibold bg-neutral-200"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="even:bg-neutral-100 hover:bg-neutral-50 cursor-pointer"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="border">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Sem dados para exibir
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-center flex-col">
            <div className="w-64 text-right">
              Total Realizado: R$ {formatNumber(getTotal(1), 2)}
            </div>
            <div className="w-64 text-right">
              Total Não Realizado: R$ {formatNumber(getTotal(2), 2)}
            </div>
          </div>
        </div>

        {/* Paginação */}
        <div
          style={{
            padding: "16px 8px",
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "8px",
          }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Página Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próxima Página
          </Button>
        </div>
      </div>
    </AppPageHeader>
  );
}
