"use client";

import { Home } from "lucide-react";
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

export function AppSidebar() {
  const links = [
    {
      title: "Home",
      url: `/dashboard`,
      icon: Home,
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <DashboardSwitcher />
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
