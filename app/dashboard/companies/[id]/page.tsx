import { getCompany } from "@/server/actions/companies";

export default async function CompanyPage({
  params,
}: {
  params: { id: string };
}) {
  const company = await getCompany(params.id);
  if (!company) {
    return <div>Company not found</div>;
  }

  return (
    <div>
      <h1>
        {company.name} - {company.ticker}
      </h1>
    </div>
  );
}
