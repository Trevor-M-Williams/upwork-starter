"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Home, BarChart } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { DashboardSwitcher } from "@/components/dashboard-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Dashboard } from "@/types";

export function AppSidebar({
  dashboards,
  ...props
}: React.ComponentProps<typeof Sidebar> & { dashboards: Dashboard[] }) {
  const pathname = usePathname();
  const dashboardId = pathname.split("/")[2];

  const links = [
    {
      title: "Home",
      url: `/dashboard/${dashboardId}`,
      icon: Home,
    },
    {
      title: "Financials",
      url: `/dashboard/${dashboardId}/financials`,
      icon: BarChart,
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <DashboardSwitcher dashboards={dashboards} dashboardId={dashboardId} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain links={links} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
