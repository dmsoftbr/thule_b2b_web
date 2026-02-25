import { createFileRoute } from "@tanstack/react-router";
import { DashboardsFilter } from "./-components/filter";
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
  Label,
  LabelList,
  ResponsiveContainer,
  XAxis,
} from "recharts";
import { AppPageHeader } from "@/components/layout/app-page-header";

const chartConfig = {
  uf: {
    label: "Estado",
    color: "#59a33a",
  },
} satisfies ChartConfig;

export const Route = createFileRoute("/_app/dashboards/dashboard4")({
  component: RouteComponent,
});

function RouteComponent() {
  const chartData = [
    { uf: "SP", perc: 56 },
    { uf: "MG", perc: 8 },
    { uf: "RJ", perc: 5.4 },
    { uf: "RS", perc: 5.2 },
    { uf: "PR", perc: 4.28 },
    { uf: "SC", perc: 3.35 },
  ];

  return (
    <AppPageHeader titleSlot="Dashboard de Vendas por UF">
      <div className="p-2 bg-white flex flex-col w-full relative">
        <DashboardsFilter />
        <div className="h-[300px] relative">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{ top: 20 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="uf"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="perc" fill="#59a33a" radius={8}>
                  <LabelList
                    dataKey="perc"
                    position="top"
                    offset={8}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        <div className="grid grid-cols-2 gap-x-4">
          <table className="w-full table-auto mt-6">
            <thead>
              <tr className="bg-neutral-100">
                <th className="border font-semibold text-xs p-1">Cliente</th>
                <th className="border font-semibold text-xs p-1">
                  Total no Ano
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border text-xs p-1">Diogo Moreira</td>
                <td className="border text-xs p-1 text-right">
                  {formatNumber(3890584, 0)}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-neutral-100">
                <th className="border font-semibold text-xs p-1">Total</th>
                <th className="border font-semibold text-xs p-1 text-right">
                  0
                </th>
              </tr>
            </tfoot>
          </table>
          <table className="w-full table-auto mt-6">
            <thead>
              <tr className="bg-neutral-100">
                <th className="border font-semibold text-xs p-1">Produto</th>
                <th className="border font-semibold text-xs p-1">Qt no Ano</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border text-xs p-1">Free ride</td>
                <td className="border text-xs p-1 text-right">
                  {formatNumber(10, 0)}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-neutral-100">
                <th className="border font-semibold text-xs p-1">Total</th>
                <th className="border font-semibold text-xs p-1 text-right">
                  0
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </AppPageHeader>
  );
}
