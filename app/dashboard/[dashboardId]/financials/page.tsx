import Link from "next/link";
import { H1 } from "@/components/typography";
import { getCompanyByDashboardId } from "@/server/actions/companies";
import {
  getHistoricalData,
  getIncomeStatements,
  fetchFullQuote,
  fetchCompanyProfile,
  getSp500HistoricalData,
} from "@/server/actions/financials";
import {
  MetricCard,
  PeerCard,
  StockPerformanceCard,
} from "@/components/financials";
import { convertPricesToPercentChange } from "@/lib/utils";

export default async function FinancialsPage({
  params,
}: {
  params: { dashboardId: string };
}) {
  const data = await getCompanyByDashboardId(params.dashboardId);
  const company = data?.company;

  if (!company) {
    return <div>Company not found</div>;
  }

  const [incomeStatements, profile, quote] = await Promise.all([
    getIncomeStatements(company.ticker),
    fetchCompanyProfile(company.ticker),
    fetchFullQuote(company.ticker),
  ]);

  const revenueData = incomeStatements.slice(-16).map((statement) => ({
    date: statement.date,
    value1: statement.data.revenue,
    period: statement.data.period,
  }));

  const operatingMarginData = incomeStatements.slice(-16).map((statement) => ({
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

  const startDate = "2024-01-01";
  const companyData = await getHistoricalData(company.ticker, startDate);
  const sp500Data = await getSp500HistoricalData(startDate);

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

  return (
    <div className="space-y-6 @container">
      <H1>{company.name}</H1>

      <div className="grid grid-cols-1 gap-4 @sm:grid-cols-3">
        <MetricCard title="Revenue" data={revenueData} type="dollars" />
        <MetricCard
          title="Operating Margin"
          data={operatingMarginData}
          type="percentage"
        />

        <MetricCard title="Net Margin" data={netMarginData} type="percentage" />
        <div className="flex @sm:col-span-2">
          <StockPerformanceCard
            ticker={company.ticker}
            beta={beta}
            peRatio={peRatio}
            chartData={chartData}
          />
        </div>

        <Link href={`/dashboard/${params.dashboardId}/financials/metrics`}>
          <PeerCard />
        </Link>
      </div>
    </div>
  );
}
