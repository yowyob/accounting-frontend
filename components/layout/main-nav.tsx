/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SidebarLink } from "@/config/navigation";

interface MainNavProps {
  links: SidebarLink[];
}

export function MainNav({ links }: MainNavProps) {
  const pathname = usePathname();

  return (
    <nav className="grid gap-1.5">
      {links.map((link, index) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={index}
            href={link.href}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <link.icon
              className={cn(
                "h-4 w-4 transition-colors duration-200",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )}
            />
            {link.title}
            {isActive && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}