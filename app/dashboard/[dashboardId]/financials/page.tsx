import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { H1 } from "@/components/typography";
import { ChartConfig } from "@/components/ui/chart";
import { CustomAreaChart } from "@/components/charts/area-chart";
import { CustomLineChart } from "@/components/charts/line-chart";
import { CustomPieChart } from "@/components/charts/pie-chart";
import { cn, convertPricesToPercentChange, formatValue } from "@/lib/utils";
import { getCompany } from "@/server/actions/companies";
import {
  getHistoricalData,
  getIncomeStatements,
  fetchFullQuote,
} from "@/server/actions/financials";
import { fetchCompanyProfile } from "@/server/actions/companies";
import { getDashboardByDashboardId } from "@/server/actions/dashboards";

export default async function FinancialsPage({
  params,
}: {
  params: { dashboardId: string };
}) {
  const dashboard = await getDashboardByDashboardId(params.dashboardId);
  const companyId = dashboard?.companyId;

  if (!companyId) {
    return <div>Company not found</div>;
  }

  const company = await getCompany(companyId);

  if (!company) {
    return <div>Company not found</div>;
  }

  const [incomeStatements, profile, quote] = await Promise.all([
    getIncomeStatements(companyId),
    fetchCompanyProfile(company.ticker),
    fetchFullQuote(company.ticker),
  ]);

  const revenueData = incomeStatements.slice(-16).map((statement) => ({
    date: statement.date,
    value1: statement.data.revenue,
    period: statement.data.period,
  }));

  const grossMarginData = incomeStatements.slice(-16).map((statement) => ({
    date: statement.date,
    value1: statement.data.operatingIncomeRatio * 100,
    period: statement.data.period,
  }));

  const netMarginData = incomeStatements.slice(-16).map((statement) => ({
    date: statement.date,
    value1: statement.data.netIncomeRatio * 100,
    period: statement.data.period,
  }));

  const beta = profile.beta;
  const peRatio = quote.pe;

  return (
    <div className="space-y-6 @container">
      <H1>{company.name}</H1>

      <div className="grid grid-cols-1 gap-4 @sm:grid-cols-3">
        <MetricCard title="Revenue" data={revenueData} type="dollars" />
        <MetricCard
          title="Gross Margin"
          data={grossMarginData}
          type="percentage"
        />

        <MetricCard title="Net Margin" data={netMarginData} type="percentage" />
        <div className="flex @sm:col-span-2">
          <StockPerformanceCard
            ticker={company.ticker}
            beta={beta}
            peRatio={peRatio}
          />
        </div>

        <MarketShareCard />
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

async function StockPerformanceCard({
  ticker,
  beta,
  peRatio,
}: {
  ticker: string;
  beta: number;
  peRatio: number;
}) {
  const companyData = await getHistoricalData(ticker, "2024-01-01");
  const sp500Data = await getHistoricalData("SPY", "2024-01-01");

  const companyPercentChange = convertPricesToPercentChange(
    companyData.map((item: any) => item.price),
  );
  const sp500PercentChange = convertPricesToPercentChange(
    sp500Data.map((item: any) => item.price),
  );

  const chartData = companyData.map((item: any, index: any) => ({
    date: item.date,
    value1: companyPercentChange[index],
    value2: sp500PercentChange[index],
  }));

  const yearReturn = Math.round(chartData[chartData.length - 1].value1);
  const alpha = Math.round(yearReturn - chartData[chartData.length - 1].value2);
  const formattedBeta = formatValue(beta);
  const formattedPeRatio = formatValue(peRatio);

  return (
    <Card className="flex size-full flex-col">
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

function MarketShareCard() {
  const data = [
    { name: "Tesla", value: 275, fill: "hsl(200, 85%, 45%)" },
    { name: "GM", value: 200, fill: "hsl(190, 80%, 50%)" },
    { name: "Ford", value: 187, fill: "hsl(185, 75%, 55%)" },
    { name: "Toyota", value: 173, fill: "hsl(180, 70%, 60%)" },
    { name: "other", value: 90, fill: "hsl(175, 65%, 65%)" },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Market Share</CardTitle>
      </CardHeader>
      <CardContent className="overflow-visible">
        <CustomPieChart data={data} />
      </CardContent>
    </Card>
  );
}
