import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { getUserCompanies } from "@/server/actions/user-companies";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const companies = await getUserCompanies();

  return (
    <SidebarProvider>
      <AppSidebar companies={companies} />
      <SidebarInset className="flex h-full flex-col">
        <Header />
        <div className="flex grow flex-col p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
