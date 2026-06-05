"use client";

import { MainNav } from "./main-nav";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/useSidebar";
import { useNavigationStore } from "@/hooks/use-navigation-store";
import { modules, ModuleKey, SidebarLink } from "@/config/navigation";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { UserProfileWidget } from "./user-profile-widget";

export function Sidebar() {
  const { isCollapsed } = useSidebar();
  const { activeModule, setActiveModule } = useNavigationStore();
  const pathname = usePathname();
  const { accountingRole } = useAuth();

  useEffect(() => {
    const currentModuleKey = Object.entries(modules).find(([key, module]) =>
      module.sidebarLinks.some((link) => pathname === link.href || pathname.startsWith(`${link.href}/`))
    )?.[0] as ModuleKey;

    if (currentModuleKey) {
      setActiveModule(currentModuleKey);
    }
  }, [pathname, setActiveModule]);

  const currentModuleData = modules[activeModule];

  const filteredLinks: SidebarLink[] = currentModuleData.sidebarLinks.filter((link) => {
    if (!link.allowedRoles) return true;
    if (!accountingRole) return false;
    return link.allowedRoles.includes(accountingRole);
  });

  const visibleModules = Object.entries(modules).filter(([, module]) => {
    if (!module.allowedRoles) return true;
    if (!accountingRole) return false;
    return module.allowedRoles.includes(accountingRole);
  });

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar flex transition-all duration-200 border-r border-sidebar-border",
        isCollapsed ? "w-[72px]" : "w-[280px]"
      )}
    >
      {/* Rail d'icônes — style Gmail */}
      <div className="w-[72px] flex-shrink-0 flex flex-col items-center py-3 border-r border-sidebar-border">
        <TooltipProvider delayDuration={0}>
          <div className="flex flex-col gap-1">
            {visibleModules.map(([key, module]) => {
              const Icon = module.icon;
              const isActive = activeModule === key;
              return (
                <Tooltip key={key}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-12 w-12 rounded-full transition-colors duration-150",
                        isActive
                          ? "bg-accent text-primary"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                      onClick={() => setActiveModule(key as ModuleKey)}
                    >
                      <Icon className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-normal text-sm">
                    <p>{module.name}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      </div>

      {!isCollapsed && (
        <div className="flex-1 flex flex-col bg-sidebar overflow-hidden">
          <div className="px-4 pt-5 pb-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide px-3 mb-1">
              {currentModuleData.name}
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto px-2 pb-2">
            <MainNav links={filteredLinks} />
          </div>
          <UserProfileWidget />
        </div>
      )}
    </aside>
  );
}
