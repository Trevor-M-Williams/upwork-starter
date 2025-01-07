import { redirect } from "next/navigation";
import { getDashboards } from "@/server/actions/dashboards";

export default async function Page() {
  const dashboards = await getDashboards();
  const firstDashboard = dashboards[0];

  if (!firstDashboard) {
    return <div>No dashboards found</div>;
  }

  redirect(`/dashboard/${firstDashboard.id}`);
}
