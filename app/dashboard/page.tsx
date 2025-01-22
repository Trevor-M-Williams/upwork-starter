import Link from "next/link";
import { getDashboards } from "@/server/actions/dashboards";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddCompanyCard } from "@/components/add-company-card";

export default async function DashboardPage() {
  const dashboards = await getDashboards();

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Companies</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {dashboards.map((dashboard) => (
          <Link key={dashboard.id} href={`/dashboard/${dashboard.id}`}>
            <Card className="cursor-pointer transition-colors hover:bg-muted/50">
              <CardHeader>
                <CardTitle className="mt-2 text-2xl">
                  {dashboard.company.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className="bg-emerald-500/15 text-emerald-500">
                  Technology
                </Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
        <AddCompanyCard />
      </div>
    </div>
  );
}
