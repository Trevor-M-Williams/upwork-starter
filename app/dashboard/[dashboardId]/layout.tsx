import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { getDashboards } from "@/server/actions/dashboards";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dashboards = await getDashboards();

  return (
    <SidebarProvider>
      <AppSidebar dashboards={dashboards} />
      <SidebarInset className="flex h-full flex-col">
        <Header />
        <div className="flex grow flex-col p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
