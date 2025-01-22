import { CustomAreaChart } from "@/components/charts/area-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";

export function StockCard({
  ticker,
  price,
  currency,
}: {
  ticker: string;
  price: number;
  currency: string;
}) {
  const chartData = Array.from({ length: 10 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (9 - i));
    const randomFluctuation = (Math.random() - 0.5) * (price * 0.2); // +/- 5% fluctuation
    return {
      date: date.toISOString(),
      value1: price + randomFluctuation,
    };
  });

  const chartConfig = {
    value1: {
      label: ticker,
    },
  } satisfies ChartConfig;

  const color = "#6df";
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{ticker}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          {price} {currency}
        </p>
        <CustomAreaChart
          chartData={chartData}
          chartConfig={chartConfig}
          color={color}
        />
      </CardContent>
    </Card>
  );
}
