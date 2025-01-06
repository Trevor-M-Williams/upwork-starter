"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartDataWithDate } from "@/types";

export function CustomAreaChart({
  chartData,
  chartConfig,
  color,
}: {
  chartData: ChartDataWithDate;
  chartConfig: ChartConfig;
  color: string;
}) {
  return (
    <ChartContainer config={chartConfig} className="size-full">
      <AreaChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              indicator="dot"
              hideIndicator
              labelFormatter={(label) =>
                new Date(label).toLocaleDateString("en-US", {
                  month: "2-digit",
                  year: "2-digit",
                })
              }
            />
          }
        />
        <XAxis
          dataKey="date"
          ticks={[chartData[1].date, chartData[chartData.length - 1].date]}
          tickFormatter={(date) =>
            new Date(date).toLocaleDateString("en-US", {
              month: "2-digit",
              year: "2-digit",
            })
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
