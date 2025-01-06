"use client";

import { LabelList, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChartData } from "@/types";

const generateChartConfig = (data: PieChartData): ChartConfig => {
  return data.reduce(
    (config, item) => ({
      ...config,
      [item.name]: {
        label: item.name.charAt(0).toUpperCase() + item.name.slice(1),
      },
    }),
    {} as ChartConfig,
  );
};

export function CustomPieChart({ data }: { data: PieChartData }) {
  const chartConfig = generateChartConfig(data);
  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square size-full max-w-sm px-0"
    >
      <PieChart>
        <ChartTooltip
          content={<ChartTooltipContent nameKey="value" hideLabel />}
        />
        <Pie
          data={data}
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
                {Math.round((payload.value / total) * 100)}%
              </text>
            );
          }}
          nameKey="name"
        >
          <LabelList
            dataKey="name"
            className="fill-background"
            stroke="none"
            fontSize={12}
            formatter={(value: keyof typeof chartConfig) =>
              chartConfig[value]?.label
            }
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
