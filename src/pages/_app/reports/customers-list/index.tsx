import { AppPageHeader } from "@/components/layout/app-page-header";
import { ServerTable } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SearchCombo } from "@/components/ui/search-combo";
import { api, handleError } from "@/lib/api";
import { convertArrayToSearchComboItem } from "@/lib/search-combo-utils";
import { useQuery } from "@tanstack/react-query";
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

export const Route = createFileRoute("/_app/reports/customers-list/")({
  component: CustomersListComponent,
});

function CustomersListComponent() {
  const [selectedReps, setSelectedReps] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tableToken, setTableToken] = useState(new Date().valueOf());
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
        `/reports/customers-list/pdf`,
        {
          representatives: selectedReps,
        },
        {
          responseType: "blob",
        }
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.download = "ListaDeClientes.pdf"; // Suggest a filename for download
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
        `/reports/customers-list/xlsx`,
        {
          representatives: selectedReps,
        },
        {
          responseType: "blob",
        }
      );
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.download = "ListaDeClientes.xlsx"; // Suggest a filename for download
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

  return (
    <AppPageHeader titleSlot="Lista de Clientes">
      <div className="p-2 flex gap-x-2">
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
              "abbreviation"
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
              onClick={() => setTableToken(new Date().valueOf())}
            >
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
      <div className="px-2 pb-2 relative">
        <ServerTable
          key={tableToken}
          isPending={isLoading}
          hideToolbar
          additionalInfo={{ representatives: selectedReps }}
          columns={columns()}
          dataUrl={"/registrations/customers/list-paged-by-reps"}
          searchFields={[
            {
              id: "id",
              label: "Código",
            },
          ]}
        />
      </div>
    </AppPageHeader>
  );
}
