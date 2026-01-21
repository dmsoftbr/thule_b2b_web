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
import { VirtualTable } from "@/components/ui/virtual-table";

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
        `/reports/comission/pdf`,
        {
          representatives: selectedReps,
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
      link.download = "Comissao.pdf"; // Suggest a filename for download
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
        `/reports/comission/xlsx`,
        {
          representatives: selectedReps,
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
      link.download = "Comissao.xlsx"; // Suggest a filename for download
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

  return (
    <AppPageHeader titleSlot="Comissão">
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
        <div className="form-group flex-1">
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
            <DropdownMenuItem
              onClick={() => {
                getData();
              }}
            >
              Em Tela
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled onClick={() => handleGetPDF()}>
              Em PDF
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled onClick={() => handleGetExcel()}>
              Em Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div
        className="px-2 pb-2 relative overflow-x-auto"
        style={{ maxWidth: "calc(100% - 260px)" }}
      >
        <VirtualTable<ComissaoReportModel>
          data={tableData}
          columns={columns}
          pageSize={50}
          searchable={true}
          sortable={true}
          paginated={false}
          virtualized={true}
          rowHeight={40}
          showFooter={true}
          loading={isLoading}
          borderStyle={"both"}
          cellClassName="text-xs"
          containerHeight={400}
        />
      </div>
    </AppPageHeader>
  );
}
