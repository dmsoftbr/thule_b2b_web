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
import { useEffect, useState } from "react";
import { formatNumber } from "@/lib/number-utils";

export const description = "Gráfico de Vendas";

export type Sales = {
  month: string;
  real: number;
  goal: number;
};

interface Props {
  salesData: Sales[];
}

type ChartDataType = {
  real: number;
  goal: number;
  predicted: number;
  month: string;
};

export function BillingChart({ salesData }: Props) {
  const [chartData, setChartData] = useState<ChartDataType[]>([]);

  useEffect(() => {
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
    setChartData(chartData);
  }, [salesData]);

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
              <Tooltip
                formatter={(value) =>
                  `${formatNumber(Number(value), 0)}${Number(value) > 1000 ? "M" : "K"}`
                }
              />
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
