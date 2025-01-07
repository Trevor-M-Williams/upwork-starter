import { redirect } from "next/navigation";
import { getUserCompanies } from "@/server/actions/user-companies";

export default async function Page() {
  const userCompanies = await getUserCompanies();
  const firstUserCompany = userCompanies[0];

  redirect(`/dashboard/${firstUserCompany.id}`);
}
