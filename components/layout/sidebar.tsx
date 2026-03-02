"use client";

import { MainNav } from "./main-nav";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/useSidebar";
import { useNavigationStore } from "@/hooks/use-navigation-store";
import { modules, ModuleKey } from "@/config/navigation";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function Sidebar() {
  const { isCollapsed } = useSidebar();
  const { activeModule, setActiveModule } = useNavigationStore();
  const pathname = usePathname();

  useEffect(() => {
    const currentModuleKey = Object.entries(modules).find(([key, module]) =>
      module.sidebarLinks.some((link) => pathname === link.href || pathname.startsWith(`${link.href}/`))
    )?.[0] as ModuleKey;

    if (currentModuleKey) {
      setActiveModule(currentModuleKey);
    }
  }, [pathname, setActiveModule]);

  const currentModuleData = modules[activeModule];

  // The handleCompose function and related logic are removed as forms are no longer opened from the sidebar.

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar flex transition-all duration-300 border-r border-sidebar-border shadow-sm",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      <div className="w-16 flex-shrink-0 flex flex-col items-center py-6 border-r border-sidebar-border bg-card/50 backdrop-blur-sm">
        <TooltipProvider delayDuration={0}>
          <div className="flex flex-col gap-3">
            {Object.entries(modules).map(([key, module]) => {
              const Icon = module.icon;
              const isActive = activeModule === key;
              return (
                <Tooltip key={key}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-10 w-10 rounded-xl transition-all duration-200",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md scale-105"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                      onClick={() => setActiveModule(key as any)}
                    >
                      <Icon className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    <p>{module.name}</p>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        </TooltipProvider>
      </div>

      {!isCollapsed && (
        <div className="flex-1 flex flex-col pt-6 bg-gradient-to-b from-sidebar to-background">
          <div className="px-6 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <currentModuleData.icon className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-bold text-foreground tracking-tight">
                {currentModuleData.name}
              </h2>
            </div>
            <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-transparent rounded-full opacity-50" />
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <MainNav links={currentModuleData.sidebarLinks} />
          </div>
        </div>
      )}
    </aside>
  );
}