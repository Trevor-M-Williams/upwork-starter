"use client";

import * as React from "react";
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
import { Company } from "@/types";

const data = {
  user: {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Financials",
      url: "/dashboard/financials",
      icon: BarChart,
    },
    {
      title: "Admin",
      url: "/dashboard/admin",
      icon: Settings2,
    },
  ],
};

export function AppSidebar({
  companies,
  ...props
}: React.ComponentProps<typeof Sidebar> & { companies: Company[] }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <CompanySwitcher companies={companies} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
