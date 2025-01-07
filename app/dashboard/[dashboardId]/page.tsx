import { H1 } from "@/components/typography";
import Link from "next/link";

export default async function DashboardPage({
  params,
}: {
  params: { dashboardId: string };
}) {
  return (
    <div>
      <H1>Dashboard</H1>
    </div>
  );
}
