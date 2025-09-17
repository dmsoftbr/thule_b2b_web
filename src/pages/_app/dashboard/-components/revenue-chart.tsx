import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "An interactive bar chart";

const chartData = [
  { date: "2024-04-01", thule: 222, caselogic: 150 },
  { date: "2024-04-02", thule: 97, caselogic: 180 },
  { date: "2024-04-03", thule: 167, caselogic: 120 },
  { date: "2024-04-04", thule: 242, caselogic: 260 },
  { date: "2024-04-05", thule: 373, caselogic: 290 },
  { date: "2024-04-06", thule: 301, caselogic: 340 },
  { date: "2024-04-07", thule: 245, caselogic: 180 },
  { date: "2024-04-08", thule: 409, caselogic: 320 },
  { date: "2024-04-09", thule: 59, caselogic: 110 },
  { date: "2024-04-10", thule: 261, caselogic: 190 },
  { date: "2024-04-11", thule: 327, caselogic: 350 },
  { date: "2024-04-12", thule: 292, caselogic: 210 },
  { date: "2024-04-13", thule: 342, caselogic: 380 },
  { date: "2024-04-14", thule: 137, caselogic: 220 },
  { date: "2024-04-15", thule: 120, caselogic: 170 },
  { date: "2024-04-16", thule: 138, caselogic: 190 },
  { date: "2024-04-17", thule: 446, caselogic: 360 },
  { date: "2024-04-18", thule: 364, caselogic: 410 },
  { date: "2024-04-19", thule: 243, caselogic: 180 },
  { date: "2024-04-20", thule: 89, caselogic: 150 },
  { date: "2024-04-21", thule: 137, caselogic: 200 },
  { date: "2024-04-22", thule: 224, caselogic: 170 },
  { date: "2024-04-23", thule: 138, caselogic: 230 },
  { date: "2024-04-24", thule: 387, caselogic: 290 },
  { date: "2024-04-25", thule: 215, caselogic: 250 },
  { date: "2024-04-26", thule: 75, caselogic: 130 },
  { date: "2024-04-27", thule: 383, caselogic: 420 },
  { date: "2024-04-28", thule: 122, caselogic: 180 },
  { date: "2024-04-29", thule: 315, caselogic: 240 },
  { date: "2024-04-30", thule: 454, caselogic: 380 },
  { date: "2024-05-01", thule: 165, caselogic: 220 },
  { date: "2024-05-02", thule: 293, caselogic: 310 },
  { date: "2024-05-03", thule: 247, caselogic: 190 },
  { date: "2024-05-04", thule: 385, caselogic: 420 },
  { date: "2024-05-05", thule: 481, caselogic: 390 },
  { date: "2024-05-06", thule: 498, caselogic: 520 },
  { date: "2024-05-07", thule: 388, caselogic: 300 },
  { date: "2024-05-08", thule: 149, caselogic: 210 },
  { date: "2024-05-09", thule: 227, caselogic: 180 },
  { date: "2024-05-10", thule: 293, caselogic: 330 },
  { date: "2024-05-11", thule: 335, caselogic: 270 },
  { date: "2024-05-12", thule: 197, caselogic: 240 },
  { date: "2024-05-13", thule: 197, caselogic: 160 },
  { date: "2024-05-14", thule: 448, caselogic: 490 },
  { date: "2024-05-15", thule: 473, caselogic: 380 },
  { date: "2024-05-16", thule: 338, caselogic: 400 },
  { date: "2024-05-17", thule: 499, caselogic: 420 },
  { date: "2024-05-18", thule: 315, caselogic: 350 },
  { date: "2024-05-19", thule: 235, caselogic: 180 },
  { date: "2024-05-20", thule: 177, caselogic: 230 },
  { date: "2024-05-21", thule: 82, caselogic: 140 },
  { date: "2024-05-22", thule: 81, caselogic: 120 },
  { date: "2024-05-23", thule: 252, caselogic: 290 },
  { date: "2024-05-24", thule: 294, caselogic: 220 },
  { date: "2024-05-25", thule: 201, caselogic: 250 },
  { date: "2024-05-26", thule: 213, caselogic: 170 },
  { date: "2024-05-27", thule: 420, caselogic: 460 },
  { date: "2024-05-28", thule: 233, caselogic: 190 },
  { date: "2024-05-29", thule: 78, caselogic: 130 },
  { date: "2024-05-30", thule: 340, caselogic: 280 },
  { date: "2024-05-31", thule: 178, caselogic: 230 },
  { date: "2024-06-01", thule: 178, caselogic: 200 },
  { date: "2024-06-02", thule: 470, caselogic: 410 },
  { date: "2024-06-03", thule: 103, caselogic: 160 },
  { date: "2024-06-04", thule: 439, caselogic: 380 },
  { date: "2024-06-05", thule: 88, caselogic: 140 },
  { date: "2024-06-06", thule: 294, caselogic: 250 },
  { date: "2024-06-07", thule: 323, caselogic: 370 },
  { date: "2024-06-08", thule: 385, caselogic: 320 },
  { date: "2024-06-09", thule: 438, caselogic: 480 },
  { date: "2024-06-10", thule: 155, caselogic: 200 },
  { date: "2024-06-11", thule: 92, caselogic: 150 },
  { date: "2024-06-12", thule: 492, caselogic: 420 },
  { date: "2024-06-13", thule: 81, caselogic: 130 },
  { date: "2024-06-14", thule: 426, caselogic: 380 },
  { date: "2024-06-15", thule: 307, caselogic: 350 },
  { date: "2024-06-16", thule: 371, caselogic: 310 },
  { date: "2024-06-17", thule: 475, caselogic: 520 },
  { date: "2024-06-18", thule: 107, caselogic: 170 },
  { date: "2024-06-19", thule: 341, caselogic: 290 },
  { date: "2024-06-20", thule: 408, caselogic: 450 },
  { date: "2024-06-21", thule: 169, caselogic: 210 },
  { date: "2024-06-22", thule: 317, caselogic: 270 },
  { date: "2024-06-23", thule: 480, caselogic: 530 },
  { date: "2024-06-24", thule: 132, caselogic: 180 },
  { date: "2024-06-25", thule: 141, caselogic: 190 },
  { date: "2024-06-26", thule: 434, caselogic: 380 },
  { date: "2024-06-27", thule: 448, caselogic: 490 },
  { date: "2024-06-28", thule: 149, caselogic: 200 },
  { date: "2024-06-29", thule: 103, caselogic: 160 },
  { date: "2024-06-30", thule: 446, caselogic: 400 },
];

const chartConfig = {
  views: {
    label: "Page Views",
  },
  thule: {
    label: "Thule",
    color: "hsl(var(--chart-1))",
  },
  caselogic: {
    label: "Case Logic",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function RevenueChart() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("thule");

  const total = React.useMemo(
    () => ({
      thule: chartData.reduce((acc, curr) => acc + curr.thule, 0),
      caselogic: chartData.reduce((acc, curr) => acc + curr.caselogic, 0),
    }),
    []
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Receita Total</CardTitle>
          <CardDescription>
            Exibindo as vendas dos últimos 3 meses
          </CardDescription>
        </div>
        <div className="flex">
          {["thule", "caselogic"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
