"use client";

import { Area, AreaChart, CartesianGrid } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartData } from "@/types";

export function CustomAreaChart({
  chartData,
  chartConfig,
  color,
  formatValueInMillions,
}: {
  chartData: ChartData;
  chartConfig: ChartConfig;
  color: string;
  formatValueInMillions?: boolean;
}) {
  return (
    <ChartContainer config={chartConfig} className="h-16 w-full">
      <AreaChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              indicator="dot"
              formatValueInMillions={formatValueInMillions}
              hideIndicator
              hideLabel
            />
          }
        />
        <Area
          dataKey="value1"
          type="natural"
          fill={color}
          fillOpacity={0.4}
          stroke={color}
        />
      </AreaChart>
    </ChartContainer>
  );
}
