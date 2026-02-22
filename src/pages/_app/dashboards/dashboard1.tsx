import { createFileRoute } from "@tanstack/react-router";
import { DashboardsFilter } from "./-components/filter";
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

const chartConfig = {
  ano: {
    label: "Ano",
    color: "#59a33a",
  },
} satisfies ChartConfig;

export const Route = createFileRoute("/_app/dashboards/dashboard1")({
  component: RouteComponent,
});

function RouteComponent() {
  const totalVendasData = [{ Ano: "2025", TotalVendaSImp: 22675130 }];
  const totalVendasGrupos = [
    { Grupo: "Sport & Cargo", TotalVendaSImp: 17609001 },
    { Grupo: "Packs, Bags", TotalVendaSImp: 4163001 },
    { Grupo: "Active With Kids", TotalVendaSImp: 794001 },
    { Grupo: "RV", TotalVendaSImp: 9001 },
    { Grupo: "Outros", TotalVendaSImp: 0 },
  ];

  const dadosTabela = [
    {
      Cliente: "Thule Aclima",
      Mes1: 19123,
      Mes2: 19123,
      Mes3: 12238,
      Mes4: 0,
      Mes5: 0,
      Mes6: 0,
      Mes7: 0,
      Mes8: 0,
      Mes9: 0,
      Mes10: 0,
      Mes11: 0,
      Mes12: 0,
      Total: 0,
    },
    {
      Cliente: "Thule Aclima",
      Mes1: 19123,
      Mes2: 19123,
      Mes3: 12238,
      Mes4: 0,
      Mes5: 0,
      Mes6: 0,
      Mes7: 0,
      Mes8: 0,
      Mes9: 0,
      Mes10: 0,
      Mes11: 0,
      Mes12: 0,
      Total: 0,
    },
    {
      Cliente: "Thule Aclima",
      Mes1: 19123,
      Mes2: 19123,
      Mes3: 12238,
      Mes4: 0,
      Mes5: 0,
      Mes6: 0,
      Mes7: 0,
      Mes8: 0,
      Mes9: 0,
      Mes10: 0,
      Mes11: 0,
      Mes12: 0,
      Total: 0,
    },
    {
      Cliente: "Thule Aclima",
      Mes1: 19123,
      Mes2: 19123,
      Mes3: 12238,
      Mes4: 0,
      Mes5: 0,
      Mes6: 0,
      Mes7: 0,
      Mes8: 0,
      Mes9: 0,
      Mes10: 0,
      Mes11: 0,
      Mes12: 0,
      Total: 0,
    },
    {
      Cliente: "Thule Aclima",
      Mes1: 19123,
      Mes2: 19123,
      Mes3: 12238,
      Mes4: 0,
      Mes5: 0,
      Mes6: 0,
      Mes7: 0,
      Mes8: 0,
      Mes9: 0,
      Mes10: 0,
      Mes11: 0,
      Mes12: 0,
      Total: 0,
    },
    {
      Cliente: "Thule Aclima",
      Mes1: 19123,
      Mes2: 19123,
      Mes3: 12238,
      Mes4: 0,
      Mes5: 0,
      Mes6: 0,
      Mes7: 0,
      Mes8: 0,
      Mes9: 0,
      Mes10: 0,
      Mes11: 0,
      Mes12: 0,
      Total: 0,
    },
    {
      Cliente: "Thule Aclima",
      Mes1: 19123,
      Mes2: 19123,
      Mes3: 12238,
      Mes4: 0,
      Mes5: 0,
      Mes6: 0,
      Mes7: 0,
      Mes8: 0,
      Mes9: 0,
      Mes10: 0,
      Mes11: 0,
      Mes12: 0,
      Total: 0,
    },
    {
      Cliente: "Thule Aclima",
      Mes1: 19123,
      Mes2: 19123,
      Mes3: 12238,
      Mes4: 0,
      Mes5: 0,
      Mes6: 0,
      Mes7: 0,
      Mes8: 0,
      Mes9: 0,
      Mes10: 0,
      Mes11: 0,
      Mes12: 0,
      Total: 0,
    },
    {
      Cliente: "Thule Aclima",
      Mes1: 19123,
      Mes2: 19123,
      Mes3: 12238,
      Mes4: 0,
      Mes5: 0,
      Mes6: 0,
      Mes7: 0,
      Mes8: 0,
      Mes9: 0,
      Mes10: 0,
      Mes11: 0,
      Mes12: 0,
      Total: 0,
    },
    {
      Cliente: "Thule Aclima",
      Mes1: 19123,
      Mes2: 19123,
      Mes3: 12238,
      Mes4: 0,
      Mes5: 0,
      Mes6: 0,
      Mes7: 0,
      Mes8: 0,
      Mes9: 0,
      Mes10: 0,
      Mes11: 0,
      Mes12: 0,
      Total: 0,
    },
    {
      Cliente: "Thule Aclima",
      Mes1: 19123,
      Mes2: 19123,
      Mes3: 12238,
      Mes4: 0,
      Mes5: 0,
      Mes6: 0,
      Mes7: 0,
      Mes8: 0,
      Mes9: 0,
      Mes10: 0,
      Mes11: 0,
      Mes12: 0,
      Total: 0,
    },
    {
      Cliente: "Thule Aclima",
      Mes1: 19123,
      Mes2: 19123,
      Mes3: 12238,
      Mes4: 0,
      Mes5: 0,
      Mes6: 0,
      Mes7: 0,
      Mes8: 0,
      Mes9: 0,
      Mes10: 0,
      Mes11: 0,
      Mes12: 0,
      Total: 0,
    },
    {
      Cliente: "Thule Aclima",
      Mes1: 19123,
      Mes2: 19123,
      Mes3: 12238,
      Mes4: 0,
      Mes5: 0,
      Mes6: 0,
      Mes7: 0,
      Mes8: 0,
      Mes9: 0,
      Mes10: 0,
      Mes11: 0,
      Mes12: 0,
      Total: 0,
    },
  ];

  function formatMillions(value: number) {
    return `${value / 1_000_000} Mi`;
  }

  function formatMil(value: number) {
    return `${formatNumber(value / 1_000, 0)} Mil`;
  }

  return (
    <div className="flex flex-col w-full p-2 bg-white">
      <DashboardsFilter />
      <div className="grid grid-cols-2 gap-x-4 w-full">
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
        <div className="w-full h-[300px] bg-white pt-4 pb-4">
          <p>Total Vendas por Grupo</p>
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                accessibilityLayer
                data={totalVendasGrupos}
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
                  key={`${item.Cliente}`}
                  className="flex w-full border-b border-l"
                >
                  <td className="flex-1 border-r p-1 text-xs font-normal">
                    {item.Cliente}
                  </td>
                  <td className="w-[65px] border-r  p-1 text-xs font-normal text-right">
                    {item.Mes1}
                  </td>
                  <td className="w-[65px] border-r  p-1 text-xs font-normal text-right">
                    {item.Mes2}
                  </td>
                  <td className="w-[65px] border-r  p-1 text-xs font-normal text-right">
                    {item.Mes3}
                  </td>
                  <td className="w-[65px] border-r  p-1 text-xs font-normal text-right">
                    {item.Mes4}
                  </td>
                  <td className="w-[65px] border-r  p-1 text-xs font-normal text-right">
                    {item.Mes5}
                  </td>
                  <td className="w-[65px] border-r  p-1 text-xs font-normal text-right">
                    {item.Mes6}
                  </td>
                  <td className="w-[65px] border-r  p-1 text-xs font-normal text-right">
                    {item.Mes7}
                  </td>
                  <td className="w-[65px] border-r  p-1 text-xs font-normal text-right">
                    {item.Mes8}
                  </td>
                  <td className="w-[65px] border-r  p-1 text-xs font-normal text-right">
                    {item.Mes9}
                  </td>
                  <td className="w-[65px] border-r  p-1 text-xs font-normal text-right">
                    {item.Mes10}
                  </td>
                  <td className="w-[65px] border-r  p-1 text-xs font-normal text-right">
                    {item.Mes11}
                  </td>
                  <td className="w-[65px] border-r  p-1 text-xs font-normal text-right">
                    {item.Mes12}
                  </td>
                  <td className="w-[65px] border-r  p-1 text-xs font-normal text-right">
                    {item.Total}
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
                  0,00
                </th>
                <th className="w-[65px] border-r text-xs font-semibold text-right p-1">
                  0,00
                </th>
                <th className="w-[65px] border-r text-xs font-semibold text-right p-1">
                  0,00
                </th>
                <th className="w-[65px] border-r text-xs font-semibold text-right p-1">
                  0,00
                </th>
                <th className="w-[65px] border-r text-xs font-semibold text-right p-1">
                  0,00
                </th>
                <th className="w-[65px] border-r text-xs font-semibold text-right p-1">
                  0,00
                </th>
                <th className="w-[65px] border-r text-xs font-semibold text-right p-1">
                  0,00
                </th>
                <th className="w-[65px] border-r text-xs font-semibold text-right p-1">
                  0,00
                </th>
                <th className="w-[65px] border-r text-xs font-semibold text-right p-1">
                  0,00
                </th>
                <th className="w-[65px] border-r text-xs font-semibold text-right p-1">
                  0,00
                </th>
                <th className="w-[65px] border-r text-xs font-semibold text-right p-1">
                  0,00
                </th>
                <th className="w-[65px] border-r text-xs font-semibold text-right p-1">
                  0,00
                </th>
                <th className="w-[65px] border-r text-xs font-semibold text-right p-1">
                  0,00
                </th>
                <th className="w-[11px]"></th>
              </tr>
            </tfoot>
          </table>
        </div>
        <div>
          {/* Resumo por Rep */}
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-neutral-100">
                <th className="border font-semibold text-xs p-1">
                  Representante
                </th>
                <th className="border font-semibold text-xs p-1">
                  TotalVendaSImp
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border text-xs p-1">MORELATTO</td>
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
        </div>
      </div>
    </div>
  );
}
