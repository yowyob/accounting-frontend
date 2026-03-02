"use client";

import { UserNav } from "./user-nav";
import { Button } from "../ui/button";
import { Menu, Search, Settings, HelpCircle } from "lucide-react";
import { Input } from "../ui/input";
import { useSidebar } from "@/hooks/useSidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import Link from "next/link";
import { NotificationBell } from "../notifications/notification-bell";

export function Header() {
  const { toggle } = useSidebar();

  return (
    <header className="flex-shrink-0 h-16 flex items-center px-4 md:px-6 bg-transparent">
      <Button variant="ghost" size="icon" className="mr-2" onClick={toggle}>
        <Menu className="h-5 w-5 text-gray-600" />
      </Button>
      <div className="font-semibold text-lg tracking-tight text-gray-700 mr-6">
        KSM
      </div>



      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-5 w-5 text-gray-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Centre d&#39;aide</DropdownMenuItem>
            <DropdownMenuItem>Formation</DropdownMenuItem>
            <DropdownMenuItem>Nouveautés</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Envoyer des commentaires</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5 text-gray-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Paramètres rapides</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href="/settings/company">Voir tous les paramètres</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Densité</DropdownMenuItem>
            <DropdownMenuItem>Thème</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <NotificationBell />
        <UserNav />
      </div>
    </header>
  );
}