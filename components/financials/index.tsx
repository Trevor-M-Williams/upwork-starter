import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatValue } from "@/lib/utils";
import { CustomLineChart } from "@/components/charts/line-chart";
import { CustomAreaChart } from "@/components/charts/area-chart";
import { ChartConfig } from "@/components/ui/chart";

export function MetricCard({
  title,
  data,
  type,
}: {
  title: string;
  data: {
    date: string;
    value1: number;
    period: string;
  }[];
  type: "dollars" | "percentage";
}) {
  const value = data[data.length - 1].value1;
  const lastValue = data[data.length - 2].value1;
  const lastPeriod = data[data.length - 2].period;

  const valueString = formatValue(value);

  const percentageChange = ((value - lastValue) / lastValue) * 100;

  const chartConfig = {
    value1: {
      label: title,
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-sm font-medium text-gray-500">
          {title}
        </CardTitle>
        <div className="flex-colitems-baseline flex justify-between">
          <div className="text-5xl font-medium">
            {type === "dollars" && "$"}
            {valueString}
            {type === "percentage" && "%"}
          </div>
          <div className="">
            <div
              className={cn(
                percentageChange > 0 ? "text-green-500" : "text-red-500",
              )}
            >
              {percentageChange > 0 ? "↑" : "↓"}{" "}
              {Math.abs(percentageChange).toFixed(2)}%
            </div>
            <div className="text-sm text-gray-500">from {lastPeriod}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-32 pb-0">
        <CustomAreaChart
          chartData={data}
          chartConfig={chartConfig}
          color={"#6df"}
        />
      </CardContent>
    </Card>
  );
}

export function PeerCard() {
  const data = [
    {
      name: "Tesla",
      grossMargin: 20,
      operatingMargin: 15,
      netMargin: 10,
    },
    {
      name: "GM",
      grossMargin: 18,
      operatingMargin: 14,
      netMargin: 10,
    },
    {
      name: "Ford",
      grossMargin: 16,
      operatingMargin: 12,
      netMargin: 8,
    },
    {
      name: "Toyota",
      grossMargin: 17,
      operatingMargin: 13,
      netMargin: 9,
    },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Peer Comparison</CardTitle>
      </CardHeader>
      <CardContent className="overflow-visible">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead className="text-right">Gross (%)</TableHead>
              <TableHead className="text-right">Op (%)</TableHead>
              <TableHead className="text-right">Net (%)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((company) => (
              <TableRow key={company.name}>
                <TableCell>{company.name}</TableCell>
                <TableCell className="text-right">
                  {company.grossMargin.toFixed(1)}
                </TableCell>
                <TableCell className="text-right">
                  {company.operatingMargin.toFixed(1)}
                </TableCell>
                <TableCell className="text-right">
                  {company.netMargin.toFixed(1)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export async function StockPerformanceCard({
  ticker,
  beta,
  peRatio,
  chartData,
}: {
  ticker: string;
  beta: number;
  peRatio: number;
  chartData: any;
}) {
  const yearReturn = Math.round(chartData[chartData.length - 1].value1);
  const alpha = Math.round(yearReturn - chartData[chartData.length - 1].value2);
  const formattedBeta = formatValue(beta);
  const formattedPeRatio = formatValue(peRatio);

  return (
    <Card className="flex size-full min-h-96 flex-col">
      <CardHeader>
        <CardTitle>Stock Performance</CardTitle>
      </CardHeader>
      <CardContent className="flex grow flex-col">
        <div className="w-full grow">
          <CustomLineChart data={chartData} labels={[ticker, "S&P 500"]} />
        </div>
        <div className="mt-4 grid grid-cols-4 place-items-center divide-x divide-gray-200">
          <StockMetric title="1Y Return" value={`${yearReturn}%`} />
          <StockMetric title="Alpha" value={`${alpha}%`} />
          <StockMetric title="Beta" value={formattedBeta} />
          <StockMetric title="P/E" value={formattedPeRatio} />
        </div>
      </CardContent>
    </Card>
  );
}

function StockMetric({ title, value }: { title: string; value: string }) {
  return (
    <div className="w-full space-y-1 p-2 text-center">
      <div className="text-sm">{title}</div>
      <div className="text-5xl">{value}</div>
    </div>
  );
}
