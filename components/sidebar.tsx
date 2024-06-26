"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

import { House, Settings } from "lucide-react";

function SidebarLink({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  const pathname = usePathname();
  const highlight = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "text-md flex h-10 w-full cursor-pointer justify-start gap-4 px-2 py-2",
        "items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        "hover:bg-accent hover:text-accent-foreground",
        highlight ? "bg-secondary" : "",
      )}
    >
      {children}
    </Link>
  );
}

export default function Sidebar() {
  const links = [
    {
      href: "/dashboard",
      Icon: House,
    },
  ];

  return (
    <div className="relative flex h-full shrink-0 flex-col items-center justify-between border-r bg-background px-2 py-6">
      <div className="flex w-full flex-col gap-2">
        {links.map(({ href, Icon }, index) => (
          <SidebarLink key={index} href={href}>
            {Icon && <Icon />}
          </SidebarLink>
        ))}
      </div>

      <div className="space-y-2 border-t pt-4">
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
    </div>
  );
}
