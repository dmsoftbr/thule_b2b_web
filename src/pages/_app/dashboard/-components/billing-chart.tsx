import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { exponentialSmoothingForecast } from "@/lib/math";

export const description = "Gráfico de Vendas";

export function BillingChart() {
  const salesData = [
    { month: "Jan", real: 143, goal: 140 },
    { month: "Fev", real: 240, goal: 200 },
    { month: "Mar", real: 201, goal: 210 },
    { month: "Abr", real: 102, goal: 180 },
    { month: "Mai", real: 165, goal: 180 },
    { month: "Jun", real: 178, goal: 180 },
    { month: "Jul", real: 183, goal: 180 },
    { month: "Ago", real: 150, goal: 180 },
    { month: "Set", real: 200, goal: 180 },
    { month: "Out", real: 0, goal: 180 },
    { month: "Nov", real: 0, goal: 200 },
    { month: "Dez", real: 0, goal: 200 },
  ];

  const salesDataWithForescastLinear = exponentialSmoothingForecast(
    salesData.map((item) => item.real),
    0.1
  );

  const chartData = salesData.map((item, index) => {
    return {
      month: item.month,
      real: item.real,
      predicted: salesDataWithForescastLinear[index],
      goal: item.goal,
    };
  });

  return (
    <div className="flex flex-col flex-wrap gap-4">
      <div>
        <h2 className="font-semibold text-muted-foreground">Venda Total</h2>
        <h3 className="text-sm text-muted-foreground">
          Exibindo as vendas do ano
        </h3>
        <div className="p-2 h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickMargin={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis />
              <Tooltip />
              <Legend />

              {/* Barras para valores reais */}
              <Bar
                dataKey="real"
                type="natural"
                name="Vendas Realizadas"
                fill={"hsl(var(--chart-1))"}
                barSize={50}
                radius={4}
              />
              {/* Linha da meta */}

              <Line
                dataKey="goal"
                type="natural"
                name="Meta"
                fill={"#339F2EFF"}
                stroke="#339F2EFF"
                strokeWidth={3}
              />

              {/* Linha da tendência */}
              <Line
                type="natural"
                dataKey="predicted"
                name="Tendência"
                strokeWidth={3}
                stroke={"hsl(var(--chart-3))"}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
