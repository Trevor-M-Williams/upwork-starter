"use client";

import { Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChartData } from "@/types";

const chartData = [
  { name: "chrome", value: 40, fill: "hsl(200, 85%, 45%)" },
  { name: "safari", value: 30, fill: "hsl(190, 80%, 50%)" },
  { name: "firefox", value: 15, fill: "hsl(185, 75%, 55%)" },
  { name: "edge", value: 10, fill: "hsl(180, 70%, 60%)" },
  { name: "other", value: 5, fill: "hsl(175, 65%, 65%)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(200, 85%, 45%)",
  },
  safari: {
    label: "Safari",
    color: "hsl(190, 80%, 50%)",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(185, 75%, 55%)",
  },
  edge: {
    label: "Edge",
    color: "hsl(180, 70%, 60%)",
  },
  other: {
    label: "Other",
    color: "hsl(175, 65%, 65%)",
  },
} satisfies ChartConfig;

export function CustomPieChart({ data }: { data: PieChartData }) {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square size-full px-0"
    >
      <PieChart>
        <ChartTooltip
          content={<ChartTooltipContent nameKey="value" hideLabel />}
        />
        <ChartLegend
          content={<ChartLegendContent nameKey="name" />}
          className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
        />
        <Pie
          data={chartData}
          dataKey="value"
          labelLine={false}
          label={({ payload, ...props }) => {
            return (
              <text
                cx={props.cx}
                cy={props.cy}
                x={props.x}
                y={props.y}
                textAnchor={props.textAnchor}
                dominantBaseline={props.dominantBaseline}
                fill="hsla(var(--foreground))"
              >
                {payload.value}%
              </text>
            );
          }}
          nameKey="name"
        />
      </PieChart>
    </ChartContainer>
  );
}
