import { H1 } from "@/components/typography";
import { getCompanyById } from "@/server/actions/companies";
import { fetchCompanyProfile } from "@/server/actions/financials";
import { getDashboardByDashboardId } from "@/server/actions/dashboards";

export default async function CompanyPage({
  params,
}: {
  params: { dashboardId: string };
}) {
  const dashboard = await getDashboardByDashboardId(params.dashboardId);
  if (!dashboard) {
    return <div>Dashboard not found</div>;
  }

  const company = await getCompanyById(dashboard.companyId);
  if (!company) {
    return <div>Company not found</div>;
  }

  const companyProfile = await fetchCompanyProfile(company.ticker);
  if (!companyProfile) {
    return <div>Company not found</div>;
  }
  const description = companyProfile?.description;

  return (
    <div>
      <H1 className="mb-4">{companyProfile.companyName}</H1>
      <p>{description}</p>
    </div>
  );
}
