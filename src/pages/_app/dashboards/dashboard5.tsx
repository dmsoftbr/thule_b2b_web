import { createFileRoute } from "@tanstack/react-router";
import { LoaderIcon } from "lucide-react";
import { useState } from "react";
import { DashboardsFilter, type DashboardFiltro } from "./-components/filter";
import { AppPageHeader } from "@/components/layout/app-page-header";
import { TabelaComissoesMeses } from "./-components/tab-partner";
import { toast } from "sonner";
import { api, handleError } from "@/lib/api";
import {
  agruparVendasPorMes,
  type RepresentanteComissao,
} from "./-components/agrupamento-partner";

export const Route = createFileRoute("/_app/dashboards/dashboard5")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [dadosAgrupados, setDadosAgrupados] = useState<RepresentanteComissao[]>(
    [],
  );

  const handleGetData = async (filtro: DashboardFiltro) => {
    setIsLoading(true);
    try {
      const { data } = await api.post(`/dashboards-thule/dashboard1`, filtro);
      const dadosAgrup = agruparVendasPorMes(data);
      setDadosAgrupados(dadosAgrup);
    } catch (error) {
      toast.error(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppPageHeader titleSlot="Dashboard Partner">
      <div className="p-2 bg-white w-full">
        {isLoading && (
          <div className="absolute inset-0 bg-neutral-900/30 z-40 flex items-center justify-center">
            <div className="w-[200px] h-20 rounded-lg bg-white z-50 flex items-center justify-center">
              <span>
                <LoaderIcon className="size-4 mr-2 animate-spin text-blue-600" />
              </span>{" "}
              Aguarde...
            </div>
          </div>
        )}
        <DashboardsFilter onAplicar={handleGetData} />
        <div className="w-full overflow-auto border rounded-lg">
          <TabelaComissoesMeses dados={dadosAgrupados} />
        </div>
      </div>
    </AppPageHeader>
  );
}
