"use client";

import { UserNav } from "./user-nav";
import { Button } from "../ui/button";
import { Menu, HelpCircle, BookOpen, FileText, ShieldCheck, BarChart3, FileClock, Layers } from "lucide-react";
import { useSidebar } from "@/hooks/useSidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";
import { NotificationBell } from "../notifications/notification-bell";
import { useAuth } from "@/hooks/use-auth";

// ─── Contenu du centre d'aide par rôle ───────────────────────────────────────

const HELP_CONTENT = {
  AIDE_COMPTABLE: {
    label: "Aide — Aide-comptable",
    sections: [
      {
        title: "Mes tâches principales",
        items: [
          { icon: FileClock, label: "Créer une écriture brouillon", href: "/accounting/entries" },
          { icon: Layers, label: "Imputer une ligne analytique", href: "/accounting/analytics" },
          { icon: BookOpen, label: "Consulter le plan comptable", href: "/accounting/chart-of-accounts" },
          { icon: BarChart3, label: "Suivre les budgets", href: "/accounting/budgets" },
        ],
      },
      {
        title: "Rappels importants",
        items: [
          { icon: ShieldCheck, label: "Je ne peux pas valider les écritures", href: null },
          { icon: ShieldCheck, label: "Je ne peux pas modifier le plan comptable", href: null },
          { icon: ShieldCheck, label: "Je ne peux pas accéder aux paramètres", href: null },
        ],
      },
    ],
  },
  COMPTABLE: {
    label: "Aide — Comptable",
    sections: [
      {
        title: "Mes tâches principales",
        items: [
          { icon: FileClock, label: "Valider les écritures brouillon", href: "/accounting/validation" },
          { icon: BookOpen, label: "Gérer le plan comptable", href: "/accounting/chart-of-accounts" },
          { icon: FileText, label: "Consulter les rapports", href: "/accounting/reports" },
          { icon: BarChart3, label: "Gérer les budgets", href: "/accounting/budgets" },
          { icon: Layers, label: "Axes analytiques", href: "/accounting/analytics" },
        ],
      },
      {
        title: "Rappels importants",
        items: [
          { icon: ShieldCheck, label: "Je ne peux pas installer les packs fiscaux", href: null },
          { icon: ShieldCheck, label: "Je ne peux pas attribuer des rôles", href: null },
        ],
      },
    ],
  },
  RESPONSABLE_COMPTABLE: {
    label: "Aide — Responsable comptable",
    sections: [
      {
        title: "Administration",
        items: [
          { icon: ShieldCheck, label: "Attribuer les rôles comptables", href: "/accounting/role-assignment" },
          { icon: BookOpen, label: "Installer un pack de localisation", href: "/accounting/ohada-pack" },
          { icon: FileClock, label: "Verrouiller une période", href: "/accounting/periods" },
          { icon: BarChart3, label: "Paramètres comptables", href: "/accounting/settings" },
        ],
      },
      {
        title: "Supervision",
        items: [
          { icon: FileText, label: "Rapports financiers", href: "/accounting/reports" },
          { icon: Layers, label: "Journal d'audit", href: "/analyse/audits" },
          { icon: BarChart3, label: "Budgets & Réalisé", href: "/accounting/budgets" },
        ],
      },
    ],
  },
} as const;

// ─── Composant Header ─────────────────────────────────────────────────────────

export function Header() {
  const { toggle } = useSidebar();
  const { accountingRole } = useAuth();

  const helpContent = accountingRole
    ? HELP_CONTENT[accountingRole as keyof typeof HELP_CONTENT]
    : null;

  return (
    <header className="flex-shrink-0 h-16 flex items-center px-4 md:px-6 bg-card border-b border-border">
      <Button variant="ghost" size="icon" className="mr-1 rounded-full hover:bg-secondary" onClick={toggle}>
        <Menu className="h-5 w-5 text-muted-foreground" />
      </Button>
      <div className="flex items-center gap-2 mr-6">
        <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-[#4285f4] via-[#34a853] to-[#ea4335] flex items-center justify-center text-white text-sm font-medium">
          K
        </div>
        <span className="text-[22px] font-normal text-muted-foreground tracking-normal">
          KSM <span className="text-foreground font-normal">Pro</span>
        </span>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        {/* Centre d'aide spécifique au rôle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary" title="Centre d'aide">
              <HelpCircle className="h-5 w-5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 rounded-lg border-border shadow-md">
            {helpContent ? (
              <>
                <DropdownMenuLabel className="text-xs font-medium text-primary uppercase tracking-wide">
                  {helpContent.label}
                </DropdownMenuLabel>
                {helpContent.sections.map((section, si) => (
                  <div key={si}>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuLabel className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide px-2 py-1">
                      {section.title}
                    </DropdownMenuLabel>
                    {section.items.map((item, ii) => (
                      item.href ? (
                        <DropdownMenuItem key={ii} asChild className="cursor-pointer gap-2 rounded-sm">
                          <Link href={item.href} className="flex items-center gap-2">
                            <item.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="text-sm">{item.label}</span>
                          </Link>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem key={ii} disabled className="gap-2 opacity-60 rounded-sm">
                          <item.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-sm">{item.label}</span>
                        </DropdownMenuItem>
                      )
                    ))}
                  </div>
                ))}
              </>
            ) : (
              <>
                <DropdownMenuLabel>Centre d&apos;aide</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Connectez-vous pour accéder à l&apos;aide personnalisée</DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <NotificationBell />
        <UserNav />
      </div>
    </header>
  );
}
