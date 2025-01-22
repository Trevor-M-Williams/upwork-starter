import { PeerTable } from "@/components/peer-table";
import { H1 } from "@/components/typography";
import { getCompanyByDashboardId } from "@/server/actions/companies";
import { fetchCompanyMetrics } from "@/server/actions/financials";

export default async function MetricsPage({
  params,
}: {
  params: { dashboardId: string };
}) {
  const data = await getCompanyByDashboardId(params.dashboardId);
  const company = data?.company;

  if (!company) {
    return <div>Company not found</div>;
  }
  const companyData = await fetchCompanyMetrics(company.ticker);

  const peerData = await Promise.all(
    company.peers.map(async (peer) => {
      const peerData = await fetchCompanyMetrics(peer);
      return { ticker: peer, data: peerData };
    }),
  );

  return (
    <div className="container">
      <H1>Peer Comparison</H1>
      <PeerTable companyData={companyData} peerData={peerData} />
    </div>
  );
}
