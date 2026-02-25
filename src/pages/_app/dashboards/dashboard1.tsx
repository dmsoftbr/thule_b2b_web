import { createFileRoute } from "@tanstack/react-router";
import { DashboardsFilter, type DashboardFiltro } from "./-components/filter";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { formatNumber } from "@/lib/number-utils";
import { AppPageHeader } from "@/components/layout/app-page-header";
import { api, handleError } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";
import { LoaderIcon } from "lucide-react";

const chartConfig = {
  ano: {
    label: "Ano",
    color: "#59a33a",
  },
} satisfies ChartConfig;

export const Route = createFileRoute("/_app/dashboards/dashboard1")({
  component: RouteComponent,
});

type TotalVendaAno = {
  Ano: string;
  TotalVendaSImp: number;
};

type TotalVendaGrupos = {
  Grupo: string;
  TotalVendaSImp: number;
};

type DadosTabela = {
  cliente: string;
  mes1: number;
  mes2: number;
  mes3: number;
  mes4: number;
  mes5: number;
  mes6: number;
  mes7: number;
  mes8: number;
  mes9: number;
  mes10: number;
  mes11: number;
  mes12: number;
  total: number;
};

type DadosRep = {
  representante: string;
  total: number;
};

function RouteComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [totalVendasData, setTotalVendasData] = useState<TotalVendaAno[]>([
    { Ano: `${new Date().getFullYear()}`, TotalVendaSImp: 0 },
  ]);
  const [totalVendasGrupoData, setTotalVendasGrupoData] = useState<
    TotalVendaGrupos[]
  >([{ Grupo: ``, TotalVendaSImp: 0 }]);
  const [dadosTabela, setDadosTabela] = useState<DadosTabela[]>([]);
  const [dadosRepres, setDadosRepres] = useState<DadosRep[]>([]);

  function formatMillions(value: number) {
    return `${value / 1_000_000} Mi`;
  }

  function formatMil(value: number) {
    return `${formatNumber(value / 1_000, 0)} Mil`;
  }

  const handleGetData = async (filtro: DashboardFiltro) => {
    setIsLoading(true);
    try {
      const { data } = await api.post(`/dashboards-thule/dashboard1`, filtro);

      //[{ Ano: "2025", TotalVendaSImp: 22675130 }]
      const newTotalVendasData: TotalVendaAno[] = [
        {
          Ano: `${filtro.ano}`,
          TotalVendaSImp: data.reduce(
            (acc: number, b: any) => acc + b.totalVendaSimp,
            0,
          ),
        },
      ];
      setTotalVendasData(newTotalVendasData);

      const newTotalVendasGrupoData = agrupaTipoItem(data).sort(
        (a, b) => b.TotalVendaSImp - a.TotalVendaSImp,
      );
      setTotalVendasGrupoData(newTotalVendasGrupoData);
      setDadosTabela(
        agruparPorClienteEMes(data).sort((a, b) => b.total - a.total),
      );
      setDadosRepres(
        agruparPorRepresentante(data).sort((a, b) => b.total - a.total),
      );
    } catch (error) {
      toast.error(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  function agrupaTipoItem(data: any[]) {
    const agrupado = data.reduce(
      (acc, item) => {
        let categoria = `${item.categoriaProduto} - ${item.descrCategoriaProduto}`;

        if (!acc[categoria]) {
          acc[categoria] = 0;
        }

        acc[categoria] += item.totalVendaSimp;
        console.log(acc);

        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(agrupado).map(([categoria, total]) => ({
      Grupo: categoria,
      TotalVendaSImp: Number(total),
    }));
  }

  function agruparPorClienteEMes(data: any[]): DadosTabela[] {
    const mapa: Record<string, DadosTabela> = {};

    data.forEach((item) => {
      const cliente = item.nomeAbrev;
      const mes = new Date(item.data).getMonth() + 1; // 1 a 12
      const valor = item.totalVendaSimp;

      if (!mapa[cliente]) {
        mapa[cliente] = {
          cliente,
          mes1: 0,
          mes2: 0,
          mes3: 0,
          mes4: 0,
          mes5: 0,
          mes6: 0,
          mes7: 0,
          mes8: 0,
          mes9: 0,
          mes10: 0,
          mes11: 0,
          mes12: 0,
          total: 0,
        };
      }

      (mapa[cliente][`mes${mes}` as keyof DadosTabela] as number) +=
        Number(valor);
      mapa[cliente].total += Number(valor);
    });

    return Object.values(mapa);
  }

  function agruparPorRepresentante(data: any[]): DadosRep[] {
    const mapa: Record<string, number> = {};

    data.forEach((item) => {
      const rep = item.representante;

      if (!mapa[rep]) {
        mapa[rep] = 0;
      }

      mapa[rep] += item.totalVendaSimp;
    });

    return Object.entries(mapa).map(([representante, total]) => ({
      representante,
      total,
    }));
  }

  return (
    <AppPageHeader titleSlot="Dashboard de Vendas no Período">
      <div className="flex flex-col w-full p-2 bg-white relative">
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
          <div className="w-full h-[300px] bg-white pt-4 pb-4">
            <p>Total Vendas</p>
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  accessibilityLayer
                  data={totalVendasData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeWidth={0.5} stroke="#444" />
                  <XAxis
                    dataKey="Ano"
                    stroke="#ccc"
                    tick={{ fill: "#ccc" }}
                    tickLine={false}
                    axisLine={false}
                    label={{
                      value: "Ano",
                      position: "insideBottom",
                      offset: -2,
                      fill: "#ccc",
                    }}
                  />
                  <YAxis
                    stroke="#ccc"
                    tick={{ fill: "#ccc" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => formatMillions(value)}
                    label={{
                      value: "TotalVendaSimp",
                      angle: -90,
                      offset: -5,
                      position: "insideLeft",
                      fill: "#ccc",
                      style: { textAnchor: "middle" },
                    }}
                  />

                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar
                    dataKey="TotalVendaSImp"
                    fill="#59a33a"
                    radius={8}
                    barSize={100}
                  >
                    <LabelList
                      dataKey="TotalVendaSImp"
                      position="inside"
                      angle={-90}
                      fill="#ffffff"
                      formatter={(value: number) => formatMil(value)}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Grafico de Vendas por Grupo */}
          <div className="w-full h-[300px] bg-white pt-4 pb-4 col-span-2">
            <p>Total Vendas por Grupo</p>
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  accessibilityLayer
                  data={totalVendasGrupoData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeWidth={0.5} stroke="#444" />
                  <XAxis
                    dataKey="Grupo"
                    stroke="#ccc"
                    tick={{ fill: "#ccc" }}
                    tickLine={false}
                    axisLine={false}
                    label={{
                      value: "Ano",
                      position: "insideBottom",
                      offset: -2,
                      fill: "#ccc",
                    }}
                  />
                  <YAxis
                    stroke="#ccc"
                    tick={{ fill: "#ccc" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => formatMillions(value)}
                    label={{
                      value: "TotalVendaSimp",
                      angle: -90,
                      offset: -5,
                      position: "insideLeft",
                      fill: "#ccc",
                      style: { textAnchor: "middle" },
                    }}
                  />

                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar
                    dataKey="TotalVendaSImp"
                    fill="#59a33a"
                    radius={8}
                    barSize={100}
                  >
                    <LabelList
                      dataKey="TotalVendaSImp"
                      position="top"
                      fill="#000"
                      formatter={(value: number) => formatMil(value)}
                      offset={0}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-x-4">
          <div className="col-span-3 w-full bg-white">
            <table className="w-full table-auto">
              <thead className="w-full">
                <tr className="bg-neutral-100 flex w-full">
                  <th className="flex-1 text-xs border font-semibold p-1">
                    Cliente
                  </th>
                  <th className="w-[65px] text-xs border font-semibold p-1">
                    Jan
                  </th>
                  <th className="w-[65px] text-xs border font-semibold p-1">
                    Fev
                  </th>
                  <th className="w-[65px] text-xs border font-semibold p-1">
                    Mar
                  </th>
                  <th className="w-[65px] text-xs border font-semibold p-1">
                    Abr
                  </th>
                  <th className="w-[65px] text-xs border font-semibold p-1">
                    Mai
                  </th>
                  <th className="w-[65px] text-xs border font-semibold p-1">
                    Jun
                  </th>
                  <th className="w-[65px] text-xs border font-semibold p-1">
                    Jul
                  </th>
                  <th className="w-[65px] text-xs border font-semibold p-1">
                    Ago
                  </th>
                  <th className="w-[65px] text-xs border font-semibold p-1">
                    Set
                  </th>
                  <th className="w-[65px] text-xs border font-semibold p-1">
                    Out
                  </th>
                  <th className="w-[65px] text-xs border font-semibold p-1">
                    Nov
                  </th>
                  <th className="w-[65px] text-xs border font-semibold p-1">
                    Dez
                  </th>
                  <th className="w-[65px] text-xs border font-semibold p-1">
                    Total
                  </th>
                  <th className="w-[11px]"></th>
                </tr>
              </thead>
              <tbody
                className="flex flex-col w-full overflow-y-auto"
                style={{ maxHeight: 200 }}
              >
                {dadosTabela.map((item) => (
                  <tr
                    key={`${item.cliente}`}
                    className="flex w-full border-b border-l"
                  >
                    <td className="flex-1 border-r p-1 text-xs font-normal">
                      {item.cliente}
                    </td>
                    <td className="w-[65px] border-r  p-1 text-xs font-normal text-right">
                      {formatNumber(item.mes1, 0)}
                    </td>
                    <td className="w-[65px] border-r  p-1 text-xs font-normal text-right">
                      {formatNumber(item.mes2, 0)}
                    </td>
                    <td className="w-[65px] border-r  p-1 text-xs font-normal text-right">
                      {formatNumber(item.mes3, 0)}
                    </td>
                    <td className="w-[65px] border-r  p-1 text-xs font-normal text-right">
                      {formatNumber(item.mes4, 0)}
                    </td>
                    <td className="w-[65px] border-r  p-1 text-xs font-normal text-right">
                      {formatNumber(item.mes5, 0)}
                    </td>
                    <td className="w-[65px] border-r  p-1 text-xs font-normal text-right">
                      {formatNumber(item.mes6, 0)}
                    </td>
                    <td className="w-[65px] border-r  p-1 text-xs font-normal text-right">
                      {formatNumber(item.mes7, 0)}
                    </td>
                    <td className="w-[65px] border-r  p-1 text-xs font-normal text-right">
                      {formatNumber(item.mes8, 0)}
                    </td>
                    <td className="w-[65px] border-r  p-1 text-xs font-normal text-right">
                      {formatNumber(item.mes9, 0)}
                    </td>
                    <td className="w-[65px] border-r  p-1 text-xs font-normal text-right">
                      {formatNumber(item.mes10, 0)}
                    </td>
                    <td className="w-[65px] border-r  p-1 text-xs font-normal text-right">
                      {formatNumber(item.mes11, 0)}
                    </td>
                    <td className="w-[65px] border-r  p-1 text-xs font-normal text-right">
                      {formatNumber(item.mes12, 0)}
                    </td>
                    <td className="w-[65px] border-r  p-1 text-xs font-normal text-right">
                      {formatNumber(item.total, 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-neutral-100 flex w-full border-b border-t">
                  <th className="flex-1 border-r text-xs font-semibold text-right p-1 ">
                    Total
                  </th>
                  <th className="w-[65px] border-r text-xs font-semibold text-right p-1">
                    {formatNumber(
                      dadosTabela.reduce((acc, b) => acc + b.mes1, 0),
                      0,
                    )}
                  </th>
                  <th className="w-[65px] border-r text-xs font-semibold text-right p-1">
                    {formatNumber(
                      dadosTabela.reduce((acc, b) => acc + b.mes2, 0),
                      0,
                    )}
                  </th>
                  <th className="w-[65px] border-r text-xs font-semibold text-right p-1">
                    {formatNumber(
                      dadosTabela.reduce((acc, b) => acc + b.mes3, 0),
                      0,
                    )}
                  </th>
                  <th className="w-[65px] border-r text-xs font-semibold text-right p-1">
                    {formatNumber(
                      dadosTabela.reduce((acc, b) => acc + b.mes4, 0),
                      0,
                    )}
                  </th>
                  <th className="w-[65px] border-r text-xs font-semibold text-right p-1">
                    {formatNumber(
                      dadosTabela.reduce((acc, b) => acc + b.mes5, 0),
                      0,
                    )}
                  </th>
                  <th className="w-[65px] border-r text-xs font-semibold text-right p-1">
                    {formatNumber(
                      dadosTabela.reduce((acc, b) => acc + b.mes6, 0),
                      0,
                    )}
                  </th>
                  <th className="w-[65px] border-r text-xs font-semibold text-right p-1">
                    {formatNumber(
                      dadosTabela.reduce((acc, b) => acc + b.mes7, 0),
                      0,
                    )}
                  </th>
                  <th className="w-[65px] border-r text-xs font-semibold text-right p-1">
                    {formatNumber(
                      dadosTabela.reduce((acc, b) => acc + b.mes8, 0),
                      0,
                    )}
                  </th>
                  <th className="w-[65px] border-r text-xs font-semibold text-right p-1">
                    {formatNumber(
                      dadosTabela.reduce((acc, b) => acc + b.mes9, 0),
                      0,
                    )}
                  </th>
                  <th className="w-[65px] border-r text-xs font-semibold text-right p-1">
                    {formatNumber(
                      dadosTabela.reduce((acc, b) => acc + b.mes10, 0),
                      0,
                    )}
                  </th>
                  <th className="w-[65px] border-r text-xs font-semibold text-right p-1">
                    {formatNumber(
                      dadosTabela.reduce((acc, b) => acc + b.mes11, 0),
                      0,
                    )}
                  </th>
                  <th className="w-[65px] border-r text-xs font-semibold text-right p-1">
                    {formatNumber(
                      dadosTabela.reduce((acc, b) => acc + b.mes12, 0),
                      0,
                    )}
                  </th>
                  <th className="w-[65px] border-r text-xs font-semibold text-right p-1">
                    {formatNumber(
                      dadosTabela.reduce((acc, b) => acc + b.total, 0),
                      0,
                    )}
                  </th>
                  <th className="w-[11px]"></th>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="max-w-[250px] ml-6">
            {/* Resumo por Rep */}
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-neutral-100 flex">
                  <th className="border font-semibold text-xs p-1 flex-1">
                    Representante
                  </th>
                  <th className="border font-semibold text-xs p-1 w-[100px]">
                    TotalVendaSImp
                  </th>
                  <th className="w-[11px]"></th>
                </tr>
              </thead>
              <tbody
                className="flex flex-col w-full overflow-y-auto"
                style={{ maxHeight: 200 }}
              >
                {dadosRepres.map((rep, index) => (
                  <tr
                    key={index}
                    className="flex w-full border-b last:border-b-0 border-l"
                  >
                    <td className="border-r text-xs p-1 flex-1">
                      {rep.representante}
                    </td>
                    <td className="text-xs p-1 text-right w-[100px]">
                      {formatNumber(rep.total, 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-neutral-100 flex w-full">
                  <th className="border font-semibold text-xs p-1 flex-1">
                    Total
                  </th>
                  <th className="border font-semibold text-xs p-1 text-right w-[100px]">
                    {formatNumber(
                      dadosRepres.reduce((acc, b) => acc + b.total, 0),
                      0,
                    )}
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
