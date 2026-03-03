import { AppPageHeader } from "@/components/layout/app-page-header";
import { createFileRoute } from "@tanstack/react-router";
import { DashboardsFilter, type DashboardFiltro } from "./-components/filter";
import { useState } from "react";
import { api, handleError } from "@/lib/api";
import { toast } from "sonner";
import { LoaderIcon } from "lucide-react";
import { formatNumber } from "@/lib/number-utils";

type TipoItemAno = {
  RepId: number;
  Rep: string;
  QtdAnoAtual: number;
  VlAnoAtual: number;
  QtdAnoAnterior: number;
  VlAnoAnterior: number;
  MetaAnoAtual: number;
};

export const Route = createFileRoute("/_app/dashboards/dashboard8")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [dadosTabela, setDadosTabela] = useState<TipoItemAno[]>([]);

  const handleGetData = async (filtro: DashboardFiltro) => {
    setIsLoading(true);
    try {
      const { data: dadosReal } = await api.post(
        `/dashboards-thule/dashboard2`,
        filtro,
      );
      const { data: dadosMeta } = await api.post(
        `/registrations/representative-goals/get-by-year`,
        {
          month: 0,
          year: filtro.ano,
          RepresentativeId: filtro.representantes,
          ProductCommercialFamilyId: filtro.famComerciais,
        },
      );
      setDadosTabela(agruparRepAno(filtro.ano, dadosReal, dadosMeta));
      console.log(dadosMeta);
    } catch (error) {
      toast.error(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  function agruparRepAno(
    anoAtual: number,
    data: any[],
    dadosMeta: any[],
  ): TipoItemAno[] {
    const anoAnterior = anoAtual - 1;

    const mapa: Record<string, TipoItemAno> = {};

    data.forEach((item) => {
      const rep = `${item.codRep} - ${item.representante.toUpperCase()}`;
      const anoItem = new Date(item.data).getFullYear();
      const valor = item.totalVendaSimp;
      const qtd = item.qtd;

      if (!mapa[rep]) {
        mapa[rep] = {
          RepId: item.codRep,
          Rep: rep,
          QtdAnoAtual: 0,
          VlAnoAtual: 0,
          QtdAnoAnterior: 0,
          VlAnoAnterior: 0,
          MetaAnoAtual: 0,
        };
      }

      if (anoItem === anoAtual) {
        mapa[rep].QtdAnoAtual += qtd;
        mapa[rep].VlAnoAtual += valor;
      }

      if (anoItem === anoAnterior) {
        mapa[rep].QtdAnoAnterior += qtd;
        mapa[rep].VlAnoAnterior += valor;
      }
      const regMeta = dadosMeta.filter(
        (f) => f.representativeId == mapa[rep].RepId,
      );
      const vlMeta = regMeta.reduce((acc, b) => acc + b.goalValue, 0) ?? 0;
      mapa[rep].MetaAnoAtual = vlMeta;
    });

    return Object.values(mapa);
  }

  function calcVariacao(anoAtual: number, anoAnterior: number) {
    if (anoAnterior <= 0 && anoAtual > 0) return 100;
    return ((anoAtual - anoAnterior) / (anoAnterior || 1)) * 100;
  }

  return (
    <AppPageHeader titleSlot="Dashboard Metas x Realizado">
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
        <table className="w-full table-auto mt-2">
          <thead>
            <tr className="text-xs bg-neutral-200 border border-neutral-300 flex w-full">
              <th className="flex-1 font-semibold border-r border-r-neutral-300 p-1">
                Representante
              </th>
              <th className="w-[130px] font-semibold border-r border-r-neutral-300 p-1">
                Qtde Ano Anterior
              </th>
              <th className="w-[130px] font-semibold border-r border-r-neutral-300 p-1">
                R$ Ano Anterior
              </th>
              <th className="w-[130px] font-semibold border-r border-r-neutral-300 p-1">
                Qtde Ano Atual
              </th>
              <th className="w-[130px] font-semibold border-r border-r-neutral-300 p-1">
                R$ Ano Atual
              </th>
              <th className="w-[130px] font-semibold border-r border-r-neutral-300 p-1">
                % Qtde
              </th>
              <th className="w-[130px] font-semibold border-r border-r-neutral-300 p-1">
                % Valor
              </th>
              <th className="w-[130px] font-semibold border-r border-r-neutral-300 p-1">
                Meta
              </th>
              <th className="w-[130px] font-semibold p-1 border-r border-r-neutral-300">
                % Meta
              </th>
              <th className="w-[11px]"></th>
            </tr>
          </thead>
          <tbody
            className="flex flex-col overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 260px)" }}
          >
            {dadosTabela.length == 0 && (
              <tr className="text-center border flex w-full">
                <td colSpan={9} className="p-8 flex-1">
                  Sem dados para exibir
                </td>
              </tr>
            )}
            {dadosTabela.map((row) => (
              <tr key={`${row.Rep}`} className="odd:bg-neutral-100 flex w-full">
                <td className="text-xs p-1 border flex-1">{row.Rep}</td>
                <td className="w-[130px] text-xs p-1 border text-right">
                  {formatNumber(row.QtdAnoAnterior, 0)}
                </td>
                <td className="w-[130px] text-xs p-1 border text-right">
                  {formatNumber(row.VlAnoAnterior, 2)}
                </td>
                <td className="w-[130px] text-xs p-1 border text-right">
                  {formatNumber(row.QtdAnoAtual, 0)}
                </td>
                <td className="w-[130px] text-xs p-1 border text-right">
                  {formatNumber(row.VlAnoAtual, 2)}
                </td>

                <td className="w-[130px] text-xs p-1 border text-right">
                  {formatNumber(
                    calcVariacao(row.QtdAnoAtual, row.QtdAnoAnterior),
                    0,
                  )}
                </td>
                <td className="w-[130px] text-xs p-1 border text-right">
                  {formatNumber(
                    calcVariacao(row.VlAnoAtual, row.VlAnoAnterior),
                    2,
                  )}
                </td>
                <td className="w-[130px] text-xs p-1 border text-right">
                  {formatNumber(row.MetaAnoAtual, 2)}
                </td>
                <td className="w-[130px] text-xs p-1 border text-right">
                  {formatNumber(
                    calcVariacao(row.VlAnoAtual, row.MetaAnoAtual),
                    2,
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border border-neutral-300 bg-neutral-200 text-xs flex w-full">
              <th className="flex-1 border-r border-neutral-300 p-1 text-right">
                Total
              </th>
              <th className="w-[130px] border-r border-neutral-300 p-1 text-right">
                0,00
              </th>
              <th className="w-[130px] border-r border-neutral-300 p-1 text-right">
                0,00
              </th>
              <th className="w-[130px] border-r border-neutral-300 p-1 text-right">
                0,00
              </th>
              <th className="w-[130px] border-r border-neutral-300 p-1 text-right">
                0,00
              </th>
              <th className="w-[130px] border-r border-neutral-300 p-1 text-right">
                0,00
              </th>
              <th className="w-[130px] border-r border-neutral-300 p-1 text-right">
                0,00
              </th>
              <th className="w-[130px] border-r border-neutral-300 p-1 text-right">
                0,00
              </th>
              <th className="w-[130px] border-r border-neutral-300 p-1 text-right">
                0,00
              </th>
              <th className="w-[11px]"></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </AppPageHeader>
  );
}
