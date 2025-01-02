"use client";

import { Fragment } from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumbs />
      </div>
    </header>
  );
}

function Breadcrumbs() {
  const pathname = usePathname();
  const breadcrumbs = pathname.split("/").filter((path) => path !== "");

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const title = breadcrumb
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
          const href = `/${breadcrumbs.slice(0, index + 1).join("/")}`;

          return (
            <Fragment key={index}>
              {isLast ? (
                <BreadcrumbItem key={index}>
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                <>
                  <BreadcrumbItem key={index}>
                    <BreadcrumbLink href={href}>{title}</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                </>
              )}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
