import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
<<<<<<< HEAD
=======
import { Header } from "@/components/header";
>>>>>>> template/main

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
<<<<<<< HEAD
      <SidebarInset>{children}</SidebarInset>
=======
      <SidebarInset>
        <Header />
        <div className="px-6">{children}</div>
      </SidebarInset>
>>>>>>> template/main
    </SidebarProvider>
  );
}
