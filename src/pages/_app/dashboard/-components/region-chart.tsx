import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Label, Pie, PieChart, Sector } from "recharts";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";

export const RegionChart = () => {
  const chartData = [
    { region: "sudeste", totalSales: 275, fill: "hsl(var(--chart-1))" },
    { region: "nordeste", totalSales: 200, fill: "hsl(var(--chart-2))" },
    { region: "sul", totalSales: 287, fill: "hsl(var(--chart-3))" },
    { region: "centro_oeste", totalSales: 173, fill: "hsl(var(--chart-4))" },
    { region: "outras", totalSales: 190, fill: "hsl(var(--chart-5))" },
  ];
  const chartConfig = {
    totalSales: {
      label: "Venda Total",
    },
    sudeste: {
      label: "Sudeste",
      color: "var(--chart-1)",
    },
    nordeste: {
      label: "Nordeste",
      color: "var(--chart-2)",
    },
    sul: {
      label: "Sul",
      color: "var(--chart-3)",
    },
    centro_oest: {
      label: "Centro-Oeste",
      color: "var(--chart-4)",
    },
    outras: {
      label: "Outras",
      color: "var(--chart-5)",
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer
      config={chartConfig}
      className="p-0 max-h-[150px] aspect-square"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="totalSales"
          nameKey="region"
          innerRadius={30}
          strokeWidth={5}
          activeIndex={0}
          activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
            <Sector {...props} outerRadius={outerRadius + 10} />
          )}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-xl font-bold"
                    >
                      {"45%"}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
};
