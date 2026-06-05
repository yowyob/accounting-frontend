/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SidebarLink } from "@/config/navigation";
import { useLoadingStore } from "@/hooks/use-loading-store";
import { useAuth } from "@/hooks/use-auth";

interface MainNavProps {
  links: SidebarLink[];
}

export function MainNav({ links }: MainNavProps) {
  const pathname = usePathname();
  const { startLoading } = useLoadingStore();
  const { accountingRole } = useAuth();

  const visibleLinks = links.filter((link) => {
    if (!link.allowedRoles || link.allowedRoles.length === 0) return true;
    if (!accountingRole) return false;
    return link.allowedRoles.includes(accountingRole);
  });

  return (
    <nav className="grid gap-0.5">
      {visibleLinks.map((link, index) => {
        const isActive =
          pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={index}
            href={link.href}
            onClick={() => {
              if (pathname !== link.href) {
                startLoading();
              }
            }}
            className={cn(
              "group flex items-center gap-3 rounded-r-full rounded-l-full px-4 py-2 text-sm font-normal transition-colors duration-150",
              isActive
                ? "bg-accent text-primary font-medium"
                : "text-foreground hover:bg-secondary"
            )}
          >
            <link.icon
              className={cn(
                "h-5 w-5 shrink-0",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )}
            />
            <span className="truncate">{link.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
