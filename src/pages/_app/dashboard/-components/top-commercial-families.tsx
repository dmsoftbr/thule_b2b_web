import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Label, LabelList, Pie, PieChart, Sector } from "recharts";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";

export const TopCommercialFamilies = () => {
  const chartData = [
    {
      commercialFamilyId: "AWK",
      percent: 50,
      fill: "#93c5fd", // blue-300
    },
    {
      commercialFamilyId: "AWK1",
      percent: 10,
      fill: "#60a5fa", // blue-400
    },
    {
      commercialFamilyId: "AWK2",
      percent: 15,
      fill: "#3b82f6", // blue-500
    },
    {
      commercialFamilyId: "AWK3",
      percent: 20,
      fill: "#2563eb", // blue-600
    },
    {
      commercialFamilyId: "Outras",
      percent: 10,
      fill: "#1d4ed8", // blue-700
    },
  ];

  const chartConfig = {
    commercialFamilyId: {
      label: "Família",
    },
    percent: {
      label: "Percentual",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-1 justify-center pb-0">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square w-full max-w-[300px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="percent"
            nameKey="commercialFamilyId"
            innerRadius={60}
            strokeWidth={5}
            activeIndex={0}
            activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
              <g>
                <Sector {...props} outerRadius={outerRadius + 10} />
                <Sector
                  {...props}
                  outerRadius={outerRadius + 25}
                  innerRadius={outerRadius + 12}
                />
              </g>
            )}
          >
            <LabelList
              dataKey="commercialFamilyId"
              className="fill-background"
              stroke="none"
              fontSize={12}
              formatter={(value: keyof typeof chartConfig) => {
                console.log(value);
                return value;
              }}
            />

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
                      {/* <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {chartData[0].commercialFamilyId.toLocaleString()}
                      </tspan> */}
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy || 0}
                        className="fill-foreground font-medium text-sm"
                      >
                        Top Famílias
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
};
