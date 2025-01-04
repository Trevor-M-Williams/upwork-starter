"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { ChartDataWithDate } from "@/types";

export function StockChart({
  data,
  labels,
}: {
  data: ChartDataWithDate;
  labels: string[];
}) {
  const chartConfig = {
    views: {
      label: "Page Views",
    },
    ...Object.fromEntries(
      Array.from({ length: labels.length }, (_, i) => [
        `value${i + 1}`,
        {
          label: labels[i],
          color: `hsl(var(--chart-${i + 1}))`,
        },
      ]),
    ),
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="aspect-auto size-full">
      <LineChart
        accessibilityLayer
        data={data}
        margin={{
          left: -24,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
        <XAxis
          dataKey="date"
          tickMargin={8}
          minTickGap={32}
          stroke="hsl(var(--border))"
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }}
        />
        <YAxis dataKey="value1" stroke="hsl(var(--border))" />
        <ChartTooltip
          content={
            <ChartTooltipContent
              className="w-[150px]"
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
        <ChartLegend
          content={<ChartLegendContent />}
          verticalAlign="top"
          className="relative -top-3 ml-7 flex justify-start"
        />

        <Line
          dataKey="value1"
          type="monotone"
          stroke={`var(--color-value1)`}
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="value2"
          type="monotone"
          stroke={`var(--color-value2)`}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
