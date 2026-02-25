import { createFileRoute } from "@tanstack/react-router";
import { DashboardsFilter, type DashboardFiltro } from "./-components/filter";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { formatNumber } from "@/lib/number-utils";
import { AppPageHeader } from "@/components/layout/app-page-header";
import { useState } from "react";
import { api, handleError } from "@/lib/api";
import { toast } from "sonner";
import { LoaderIcon } from "lucide-react";

const chartConfig = {
  AnoAtual: {
    label: "Ano Atual",
  },

  AnoAnterior: {
    label: "Ano Anterior",
  },
} satisfies ChartConfig;

type TipoItemAno = { Grupo: string; AnoAtual: number; AnoAnterior: number };

export const Route = createFileRoute("/_app/dashboards/dashboard2")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState<TipoItemAno[]>([]);
  const [dadosGrupoCliente, setDadosGrupoCliente] = useState<TipoItemAno[]>([]);
  const [dadosCliente, setDadosCliente] = useState<TipoItemAno[]>([]);
  const [dadosRep, setDadosRep] = useState<TipoItemAno[]>([]);

  const handleGetData = async (filtro: DashboardFiltro) => {
    setIsLoading(true);
    try {
      const { data } = await api.post(`/dashboards-thule/dashboard2`, filtro);
      setChartData(agruparCategoriaAno(filtro.ano, data));
      setDadosGrupoCliente(
        agruparGrupoClienteAno(filtro.ano, data).sort(
          (a, b) => b.AnoAtual - a.AnoAtual,
        ),
      );
      setDadosCliente(
        agruparClienteAno(filtro.ano, data).sort(
          (a, b) => b.AnoAtual - a.AnoAtual,
        ),
      );

      setDadosRep(
        agruparRepAno(filtro.ano, data).sort((a, b) => b.AnoAtual - a.AnoAtual),
      );
    } catch (error) {
      toast.error(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  function agruparCategoriaAno(anoAtual: number, data: any[]): TipoItemAno[] {
    const anoAnterior = anoAtual - 1;

    const mapa: Record<string, TipoItemAno> = {};

    data.forEach((item) => {
      const categoria = item.descrCategoriaProduto;
      const anoItem = new Date(item.data).getFullYear();
      const valor = item.totalVendaSimp;

      if (!mapa[categoria]) {
        mapa[categoria] = {
          Grupo: categoria,
          AnoAtual: 0,
          AnoAnterior: 0,
        };
      }

      if (anoItem === anoAtual) {
        mapa[categoria].AnoAtual += valor;
      }

      if (anoItem === anoAnterior) {
        mapa[categoria].AnoAnterior += valor;
      }
    });

    return Object.values(mapa);
  }

  function agruparClienteAno(anoAtual: number, data: any[]): TipoItemAno[] {
    const anoAnterior = anoAtual - 1;

    const mapa: Record<string, TipoItemAno> = {};

    data.forEach((item) => {
      const categoria = item.nomeAbrev;
      const anoItem = new Date(item.data).getFullYear();
      const valor = item.totalVendaSimp;

      if (!mapa[categoria]) {
        mapa[categoria] = {
          Grupo: categoria,
          AnoAtual: 0,
          AnoAnterior: 0,
        };
      }

      if (anoItem === anoAtual) {
        mapa[categoria].AnoAtual += valor;
      }

      if (anoItem === anoAnterior) {
        mapa[categoria].AnoAnterior += valor;
      }
    });

    return Object.values(mapa);
  }

  function agruparRepAno(anoAtual: number, data: any[]): TipoItemAno[] {
    const anoAnterior = anoAtual - 1;

    const mapa: Record<string, TipoItemAno> = {};

    data.forEach((item) => {
      const categoria = item.representante;
      const anoItem = new Date(item.data).getFullYear();
      const valor = item.totalVendaSimp;

      if (!mapa[categoria]) {
        mapa[categoria] = {
          Grupo: categoria,
          AnoAtual: 0,
          AnoAnterior: 0,
        };
      }

      if (anoItem === anoAtual) {
        mapa[categoria].AnoAtual += valor;
      }

      if (anoItem === anoAnterior) {
        mapa[categoria].AnoAnterior += valor;
      }
    });

    return Object.values(mapa);
  }

  function agruparGrupoClienteAno(
    anoAtual: number,
    data: any[],
  ): TipoItemAno[] {
    const anoAnterior = anoAtual - 1;

    const mapa: Record<string, TipoItemAno> = {};

    data.forEach((item) => {
      const categoria = item.descGrupoCliente;
      const anoItem = new Date(item.data).getFullYear();
      const valor = item.totalVendaSimp;

      if (!mapa[categoria]) {
        mapa[categoria] = {
          Grupo: categoria,
          AnoAtual: 0,
          AnoAnterior: 0,
        };
      }

      if (anoItem === anoAtual) {
        mapa[categoria].AnoAtual += valor;
      }

      if (anoItem === anoAnterior) {
        mapa[categoria].AnoAnterior += valor;
      }
    });

    return Object.values(mapa);
  }

  function calcVariacao(anoAtual: number, anoAnterior: number) {
    if (anoAnterior <= 0 && anoAtual > 0) return 100;
    return ((anoAtual - anoAnterior) / (anoAnterior || 1)) * 100;
  }

  return (
    <AppPageHeader titleSlot="Dashboard de Vendas por Família">
      <div className="flex flex-col w-full p-2 bg-white">
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
        <DashboardsFilter onAplicar={(filtro) => handleGetData(filtro)} />
        <div className="grid grid-cols-3 gap-x-4 w-full">
          {/* Grafico de Vendas Total */}
          <div
            className="w-full bg-white border-r"
            style={{ height: "calc(100vh - 110px)" }}
          >
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart accessibilityLayer data={chartData}>
                  <XAxis
                    dataKey="Grupo"
                    stroke="#ccc"
                    tick={{ fill: "#ccc" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#ccc"
                    axisLine={false}
                    tickLine={false}
                    tick={false}
                    width={0}
                  />

                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="AnoAtual" fill="#2906A9" radius={8} />
                  <Bar dataKey="AnoAnterior" fill="#59a33a" radius={8} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          {/*  ************* TABELA ********** */}
          <div className="w-full bg-white">
            <table className="w-full table-auto">
              <thead className="w-full">
                <tr className="bg-neutral-100 flex w-full">
                  <th className="flex-1 text-xs border font-semibold p-1">
                    Grupo de Cliente
                  </th>
                  <th className="w-[65px] text-xs border font-semibold p-1">
                    Ano Anterior
                  </th>
                  <th className="w-[65px] text-xs border font-semibold p-1">
                    Ano Atual
                  </th>
                  <th className="w-[65px] text-xs border font-semibold p-1">
                    % Vendas
                  </th>
                  <th className="w-[11px]"></th>
                </tr>
              </thead>
              <tbody
                className="flex flex-col w-full overflow-y-auto"
                style={{ maxHeight: "calc(100vh - 110px)" }}
              >
                {dadosGrupoCliente.map((item) => (
                  <tr
                    key={`${item.Grupo}`}
                    className="flex w-full border-b border-l"
                  >
                    <td className="flex-1 border-r p-1 text-xs font-normal">
                      {item.Grupo}
                    </td>
                    <td className="w-[65px] border-r  p-1 text-xs font-normal text-right">
                      {formatNumber(item.AnoAnterior, 0)}
                    </td>
                    <td className="w-[65px] border-r  p-1 text-xs font-normal text-right">
                      {formatNumber(item.AnoAtual, 0)}
                    </td>
                    <td className="w-[65px] border-r  p-1 text-xs font-normal text-right">
                      {formatNumber(
                        calcVariacao(item.AnoAtual, item.AnoAnterior),
                        0,
                      )}
                      %
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-neutral-100 flex w-full border-b border-t">
                  <th className="flex-1 border-r text-xs font-semibold text-right p-1">
                    Total
                  </th>
                  <th className="w-[65px] border-r text-xs font-semibold text-right p-1">
                    {formatNumber(
                      dadosGrupoCliente.reduce(
                        (acc, b) => acc + b.AnoAnterior,
                        0,
                      ),
                      0,
                    )}
                  </th>
                  <th className="w-[65px] border-r text-xs font-semibold text-right p-1">
                    {formatNumber(
                      dadosCliente.reduce((acc, b) => acc + b.AnoAtual, 0),
                      0,
                    )}
                  </th>
                  <th className="w-[65px] border-r text-xs font-semibold text-right p-1">
                    {formatNumber(
                      calcVariacao(
                        dadosCliente.reduce((acc, b) => acc + b.AnoAtual, 0),
                        dadosCliente.reduce((acc, b) => acc + b.AnoAnterior, 0),
                      ),
                      0,
                    )}
                    %
                  </th>
                  <th className="w-[11px]"></th>
                </tr>
              </tfoot>
            </table>
          </div>
          {/*  ************* REPRES ********** */}
          <div className="flex flex-col">
            {/* Resumo por Rep */}
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-neutral-100 flex w-full">
                  <th className="flex-1 border font-semibold text-xs p-1">
                    Representante
                  </th>
                  <th className="w-[80px] border font-semibold text-xs p-1">
                    Ano Anterior
                  </th>
                  <th className="w-[80px] border font-semibold text-xs p-1">
                    Ano Atual
                  </th>
                  <th className="w-[80px] border font-semibold text-xs p-1">
                    % Vendas
                  </th>
                  <th className="w-[11px]"></th>
                </tr>
              </thead>
              <tbody
                className="flex flex-col w-full overflow-y-auto"
                style={{ maxHeight: "calc((100vh - 320px) / 2)" }}
              >
                {dadosRep.map((rep, index) => (
                  <tr
                    key={index}
                    className="flex w-full border-l border-b last:border-b-0"
                  >
                    <td className="flex-1 border-r text-xs p-1">{rep.Grupo}</td>
                    <td className="w-[80px] border-r text-xs p-1 text-right">
                      {formatNumber(rep.AnoAnterior, 0)}
                    </td>
                    <td className="w-[80px] border-r text-xs p-1 text-right">
                      {formatNumber(rep.AnoAtual, 0)}
                    </td>
                    <td className="w-[80px] border-r text-xs p-1 text-right">
                      {formatNumber(
                        calcVariacao(rep.AnoAtual, rep.AnoAnterior),
                        0,
                      )}
                      %
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-neutral-100 flex border">
                  <th className="flex-1 border-r font-semibold text-xs p-1">
                    Total
                  </th>
                  <th className="w-[80px] border-r font-semibold text-xs p-1 text-right">
                    {formatNumber(
                      dadosRep.reduce((acc, b) => acc + b.AnoAnterior, 0),
                      0,
                    )}
                  </th>
                  <th className="w-[80px] border-r font-semibold text-xs p-1 text-right">
                    {formatNumber(
                      dadosRep.reduce((acc, b) => acc + b.AnoAnterior, 0),
                      0,
                    )}
                  </th>
                  <th className="w-[80px] border-r font-semibold text-xs p-1 text-right">
                    {formatNumber(
                      calcVariacao(
                        dadosRep.reduce((acc, b) => acc + b.AnoAtual, 0),
                        dadosRep.reduce((acc, b) => acc + b.AnoAnterior, 0),
                      ),
                      0,
                    )}
                    %
                  </th>
                  <th className="w-[11px]"></th>
                </tr>
              </tfoot>
            </table>

            {/* Resumo por Cliente */}
            <table className="w-full table-auto mt-6">
              <thead>
                <tr className="bg-neutral-100 flex w-full border">
                  <th className="flex-1 border-r font-semibold text-xs p-1">
                    Cliente
                  </th>
                  <th className="w-[80px] border-r font-semibold text-xs p-1">
                    Ano Ant.
                  </th>
                  <th className="w-[80px] border-r font-semibold text-xs p-1">
                    Ano Atual
                  </th>
                  <th className="w-[80px] border-r font-semibold text-xs p-1">
                    % Vendas
                  </th>
                  <th className="w-[11px]"></th>
                </tr>
              </thead>
              <tbody
                className="flex flex-col w-full overflow-y-auto"
                style={{ maxHeight: "calc((100vh - 320px) / 2)" }}
              >
                {dadosCliente.map((cliente, index) => (
                  <tr
                    key={index}
                    className="flex w-full border-b last:border-b-0 border-l"
                  >
                    <td className="flex-1 border-r text-xs p-1">
                      {cliente.Grupo}
                    </td>
                    <td className="w-[80px] border-r text-xs p-1 text-right">
                      {formatNumber(cliente.AnoAnterior, 0)}
                    </td>
                    <td className="w-[80px] border-r text-xs p-1 text-right">
                      {formatNumber(cliente.AnoAtual, 0)}
                    </td>
                    <td className="w-[80px] border-r text-xs p-1 text-right">
                      {formatNumber(
                        calcVariacao(cliente.AnoAtual, cliente.AnoAnterior),
                        0,
                      )}
                      %
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-neutral-100 flex w-full border">
                  <th className="flex-1 border-r font-semibold text-xs p-1">
                    Total
                  </th>
                  <th className="w-[80px] border-r font-semibold text-xs p-1 text-right">
                    {formatNumber(
                      dadosCliente.reduce((acc, b) => acc + b.AnoAnterior, 0),
                      0,
                    )}
                  </th>
                  <th className="w-[80px] border-r font-semibold text-xs p-1 text-right">
                    {formatNumber(
                      dadosCliente.reduce((acc, b) => acc + b.AnoAtual, 0),
                      0,
                    )}
                  </th>
                  <th className="w-[80px] border-r font-semibold text-xs p-1 text-right">
                    {formatNumber(
                      calcVariacao(
                        dadosCliente.reduce((acc, b) => acc + b.AnoAtual, 0),
                        dadosCliente.reduce((acc, b) => acc + b.AnoAnterior, 0),
                      ),
                      0,
                    )}
                    %
                  </th>
                  <th className="w-[11px]"></th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </AppPageHeader>
  );
}
