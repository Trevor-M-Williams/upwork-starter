"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Home, Settings2, BarChart } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { CompanySwitcher } from "@/components/company-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { UserCompany } from "@/types";

export function AppSidebar({
  companies,
  ...props
}: React.ComponentProps<typeof Sidebar> & { companies: UserCompany[] }) {
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
    {
      title: "Admin",
      url: `/dashboard/${dashboardId}/admin`,
      icon: Settings2,
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <CompanySwitcher companies={companies} />
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
