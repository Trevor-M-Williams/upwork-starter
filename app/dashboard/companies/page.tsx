import { getCompanies } from "@/server/actions/companies";
import { CompaniesDialog } from "./components/companies-dialog";
import { CompaniesTable } from "./components/companies-table";

export default async function CompaniesPage() {
  const companies = await getCompanies();

  return (
    <div className="container mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Company Analysis</h1>
        <CompaniesDialog />
      </div>

      <CompaniesTable companies={companies} />
    </div>
  );
}
