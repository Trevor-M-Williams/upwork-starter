import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { H1 } from "@/components/typography";
import { getCompany } from "@/server/actions/companies";
import { CustomAreaChart } from "@/components/charts";
import { ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { StockChart } from "@/components/charts/stock-chart";
import { ChartData, ChartDataWithDate } from "@/types";
import { CustomPieChart } from "@/components/charts/pie-chart";

export default async function CompanyPage({
  params,
}: {
  params: { id: string };
}) {
  const company = getMockCompanyData(params.id);

  return (
    <div className="space-y-6">
      <H1>{company.name}</H1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Revenue"
          data={company.revenueHistory}
          type="dollars"
        />
        <MetricCard
          title="Customer Retention Rate"
          data={company.retentionHistory}
          type="percentage"
        />
        <MetricCard
          title="Operating Margin"
          data={company.marginHistory}
          type="percentage"
        />

        <div className="order-4 lg:order-5">
          <MarketShareCard />
        </div>

        <div className="order-5 sm:col-span-2 lg:order-4">
          <StockPerformanceCard />
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  data,
  type,
}: {
  title: string;
  data: ChartData;
  type: "dollars" | "percentage";
}) {
  let value = data[data.length - 1].value1;
  let lastValue = data[data.length - 2].value1;

  if (type === "dollars") {
    value = Math.round(value / 1_000_000);
    lastValue = Math.round(lastValue / 1_000_000);
  }

  const percentageChange = ((value - lastValue) / lastValue) * 100;
  const color = percentageChange > 0 ? "#9f9" : "#f99";

  const chartConfig = {
    value: {
      label: title,
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-sm font-medium text-gray-500">
          {title}
        </CardTitle>
        <div className="flex items-baseline justify-between">
          <div className="text-5xl font-medium">
            {type === "dollars" && "$"}
            {value}
            {type === "percentage" && "%"}
            {type === "dollars" && "M"}
          </div>
          <div
            className={cn(
              percentageChange > 0 ? "text-green-500" : "text-red-500",
            )}
          >
            {percentageChange > 0 ? "↑" : "↓"} {percentageChange.toFixed(2)}%
          </div>
        </div>
        <div className="text-sm text-gray-500">
          from {lastValue} (last quarter)
        </div>
      </CardHeader>
      <CardContent>
        <CustomAreaChart
          chartData={data}
          chartConfig={chartConfig}
          color={color}
          formatValueInMillions={type === "dollars"}
        />
      </CardContent>
    </Card>
  );
}

function StockPerformanceCard() {
  const chartData = generateStockData(
    new Date("2024-04-01"),
    { min: 250, max: 500 },
    { min: 300, max: 550 },
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-56">
          <StockChart data={chartData} labels={["Tesla Inc.", "S&P 500"]} />
        </div>
        <div className="mt-4 grid grid-cols-4 place-items-center divide-x divide-gray-200">
          <StockMetric title="1Y Return" value="10%" />
          <StockMetric title="P/E" value="35" />
          <StockMetric title="Alpha" value="2.1%" />
          <StockMetric title="Beta" value="1.2" />
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

function MarketShareCard() {
  const data = [
    { name: "chrome", value: 275, fill: "hsl(200, 85%, 45%)" },
    { name: "safari", value: 200, fill: "hsl(190, 80%, 50%)" },
    { name: "firefox", value: 187, fill: "hsl(185, 75%, 55%)" },
    { name: "edge", value: 173, fill: "hsl(180, 70%, 60%)" },
    { name: "other", value: 90, fill: "hsl(175, 65%, 65%)" },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Market Share</CardTitle>
      </CardHeader>
      <CardContent>
        <CustomPieChart data={data} />
      </CardContent>
    </Card>
  );
}

function generateDummyData(length: number, min: number, max: number) {
  return Array.from({ length }, () => ({
    value1: Math.floor(Math.random() * (max - min + 1)) + min,
  }));
}

function getMockCompanyData(id: string) {
  return {
    id,
    name: "Tesla Inc.",
    revenue: 245,
    lastRevenue: 198,
    revenueHistory: generateDummyData(10, 150_000_000, 300_000_000),
    retentionRate: 65.8,
    lastRetentionRate: 70.5,
    retentionHistory: generateDummyData(10, 60, 80),
    operatingMargin: 30.4,
    lastOperatingMargin: 24.6,
    marginHistory: generateDummyData(10, 20, 40),
    marketShare: 28.82,
    lastMarketShare: 28.5,
    stockHistory: generateDummyData(10, 500, 800),
  };
}

function generateStockData(
  startDate: Date,
  value1Range: { min: number; max: number },
  value2Range: { min: number; max: number },
  days: number = 90,
) {
  const data = [];
  const date = new Date(startDate);

  for (let i = 0; i < days; i++) {
    data.push({
      date: date.toISOString().split("T")[0],
      value1:
        Math.floor(Math.random() * (value1Range.max - value1Range.min + 1)) +
        value1Range.min,
      value2:
        Math.floor(Math.random() * (value2Range.max - value2Range.min + 1)) +
        value2Range.min,
    });
    date.setDate(date.getDate() + 1);
  }

  return data;
}
