import { createFileRoute } from "@tanstack/react-router";
import { DashboardsFilter, type DashboardFiltro } from "./-components/filter";
import { formatNumber } from "@/lib/number-utils";
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
  ResponsiveContainer,
  XAxis,
} from "recharts";
import { AppPageHeader } from "@/components/layout/app-page-header";
import { toast } from "sonner";
import { api, handleError } from "@/lib/api";
import { useState } from "react";
import { LoaderIcon } from "lucide-react";

const chartConfig = {
  estado: {
    label: "Estado",
    color: "#59a33a",
  },
} satisfies ChartConfig;

type ChartDataType = {
  estado: string;
  percentual: number;
};

type VendaAgrupada = {
  grupo: string;
  total: number;
};

export const Route = createFileRoute("/_app/dashboards/dashboard4")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState<ChartDataType[]>([]);
  const [tabCliData, setTabCliData] = useState<VendaAgrupada[]>();
  const [tabProdData, setTabProdData] = useState<VendaAgrupada[]>([]);

  const handleGetData = async (filtro: DashboardFiltro) => {
    setIsLoading(true);
    try {
      const { data } = await api.post(`/dashboards-thule/dashboard1`, filtro);
      setChartData(agruparPorUF(data));
      setTabCliData(agruparPorCliente(data));
      setTabProdData(agruparPorProduto(data));
    } catch (error) {
      toast.error(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  function agruparPorUF(data: any) {
    const mapa: Record<string, number> = {};

    // 1️⃣ Total geral
    const totalGeral = data.reduce(
      (acc: number, item: any) => acc + item.totalVendaSimp,
      0,
    );

    if (!totalGeral) return [];

    // 2️⃣ Soma por estado
    data.forEach((item: any) => {
      const uf = item.estado?.trim() || "SEM_ESTADO";
      mapa[uf] = (mapa[uf] || 0) + item.totalVendaSimp;
    });

    // 3️⃣ Converte para percentual
    return Object.entries(mapa)
      .map(([estado, total]) => ({
        estado,
        percentual: (total / totalGeral) * 100,
      }))
      .sort((a, b) => b.percentual - a.percentual);
  }

  function agruparPorCliente(data: any[]): VendaAgrupada[] {
    const mapa: Record<string, number> = {};

    data.forEach((item) => {
      const cli = item.nomeAbrev;

      if (!mapa[cli]) {
        mapa[cli] = 0;
      }

      mapa[cli] += item.totalVendaSimp;
    });

    const groupedData = Object.entries(mapa).map(([grupo, total]) => ({
      grupo,
      total,
    }));

    return groupedData.sort((a, b) => b.total - a.total);
  }

  function agruparPorProduto(data: any[]): VendaAgrupada[] {
    const mapa: Record<string, number> = {};

    data.forEach((item) => {
      const prod = `${item.itemCod} - ${item.descricao}`;

      if (!mapa[prod]) {
        mapa[prod] = 0;
      }

      mapa[prod] += item.qtd;
    });

    const groupedData = Object.entries(mapa).map(([grupo, total]) => ({
      grupo,
      total,
    }));

    return groupedData.sort((a, b) => b.total - a.total);
  }

  return (
    <AppPageHeader titleSlot="Dashboard de Vendas por UF">
      <div className="p-2 bg-white flex flex-col w-full relative">
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
        <div className="h-[280px] relative">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{ top: 20 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="estado"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="percentual" fill="#59a33a" radius={8}>
                  <LabelList
                    dataKey="percentual"
                    position="top"
                    offset={8}
                    className="fill-foreground"
                    fontSize={12}
                    formatter={(value: number) => formatNumber(value, 1)}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        <div className="grid grid-cols-2 gap-x-4">
          <div>
            <table className="w-full table-auto mt-6">
              <thead>
                <tr className="bg-neutral-100 flex w-full">
                  <th className="flex-1 border font-semibold text-xs p-1">
                    Cliente
                  </th>
                  <th className="w-[140px] border font-semibold text-xs p-1">
                    Total no Ano
                  </th>
                  <th className="w-[11px]"></th>
                </tr>
              </thead>
              <tbody
                className="flex flex-col w-full overflow-y-auto"
                style={{ maxHeight: 200 }}
              >
                {tabCliData?.map((item) => (
                  <tr
                    key={`${item.grupo}`}
                    className="odd:bg-neutral-100 flex w-full"
                  >
                    <td className="flex-1 border text-xs p-1">{item.grupo}</td>
                    <td className="w-[140px] border text-xs p-1 text-right">
                      {formatNumber(item.total, 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-neutral-100 flex w-full">
                  <th className="flex-1 border font-semibold text-xs p-1 text-left">
                    Total
                  </th>
                  <th className="w-[140px] border font-semibold text-xs p-1 text-right">
                    {formatNumber(
                      tabCliData?.reduce((acc, b) => acc + b.total, 0),
                      0,
                    )}
                  </th>
                  <th className="w-[11px]"></th>
                </tr>
              </tfoot>
            </table>
          </div>
          <div>
            <table className="w-full table-auto mt-6">
              <thead>
                <tr className="bg-neutral-100 flex w-full">
                  <th className="flex-1 border font-semibold text-xs p-1">
                    Produto
                  </th>
                  <th className="w-[140px] border font-semibold text-xs p-1">
                    Qt no Ano
                  </th>
                  <th className="w-[11px]"></th>
                </tr>
              </thead>
              <tbody
                className="flex flex-col w-full overflow-y-auto"
                style={{ maxHeight: 200 }}
              >
                {tabProdData.map((item) => (
                  <tr
                    key={item.grupo}
                    className="odd:bg-neutral-100 flex w-full"
                  >
                    <td className="flex-1 border text-xs p-1">{item.grupo}</td>
                    <td className="w-[140px] border text-xs p-1 text-right">
                      {formatNumber(item.total, 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-neutral-100 flex w-full">
                  <th className="flex-1 border font-semibold text-xs p-1 text-left">
                    Total
                  </th>
                  <th className="w-[140px] border font-semibold text-xs p-1 text-right">
                    {formatNumber(
                      tabProdData.reduce((acc, b) => acc + b.total, 0),
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
