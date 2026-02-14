import {
  Users,
  Truck,
  FileText,
  BarChart3,
  Settings,
  LayoutDashboard,
  BookOpen,
  PackagePlus,
  PackageSearch,
  FileClock,
  ShieldCheck,
  History,
  PenSquare,
  ArrowRightLeft,
  CreditCard,
  Receipt,
  Coins,
  Landmark,
  Globe,
  Building2,
  Notebook,
  Scale,
  ListChecks
} from "lucide-react";

export type SidebarLink = {
  title: string;
  label?: string;
  icon: React.ElementType;
  href: string;
};

export type Module = {
  name: string;
  icon: React.ElementType;
  composeActionLabel: string;
  sidebarLinks: SidebarLink[];
};

export const moduleKeys = [
  "dashboard",
  "clients",
  "fournisseurs",
  "analyse",
  "comptabilite",
  "configuration"
] as const;
export type ModuleKey = typeof moduleKeys[number];

export const modules: Record<ModuleKey, Module> = {
  dashboard: {
    name: "Tableau de bord",
    icon: LayoutDashboard,
    composeActionLabel: "",
    sidebarLinks: [
      { title: "Tableau de Bord", icon: LayoutDashboard, href: "/accounting/dashboard" },
    ],
  },
  clients: {
    name: "Clients",
    icon: Users,
    composeActionLabel: "",
    sidebarLinks: [
      { title: "Factures Clients", icon: Receipt, href: "/invoices" },
      { title: "Avoirs", icon: PenSquare, href: "/sales/new-order" },
      { title: "Paiements", icon: CreditCard, href: "/sales/order-journal" },
      { title: "Produits", icon: PackageSearch, href: "/products" },
      { title: "Clients", icon: Users, href: "/customers" },
      { title: "Fournisseurs", icon: Truck, href: "/suppliers" },
    ],
  },
  fournisseurs: {
    name: "Fournisseurs",
    icon: Truck,
    composeActionLabel: "",
    sidebarLinks: [
      { title: "Factures Fournisseurs", icon: Receipt, href: "/invoices" },
      { title: "Remboursements", icon: Coins, href: "/stock/entries" },
      { title: "Paiements", icon: ArrowRightLeft, href: "/stock/transfer" },
      { title: "Produits", icon: PackagePlus, href: "/stock/transformation" },
      { title: "Fournisseurs", icon: Building2, href: "/suppliers" },
    ],
  },
  analyse: {
    name: "Analyse",
    icon: BarChart3,
    composeActionLabel: "",
    sidebarLinks: [
      { title: "Bilan", icon: Scale, href: "/analyse/balance-sheet" },
      { title: "Compte de Résultat", icon: BookOpen, href: "/analyse/profit-and-loss" },
      { title: "Flux de Trésorerie", icon: ArrowRightLeft, href: "/analyse/cache-flow" },
      { title: "Résumé Général", icon: Notebook, href: "/analyse/executive-summary" },
      { title: "Rapports Financiers", icon: FileText, href: "/accounting/reports" },
      { title: "Grand Livre", icon: BookOpen, href: "/analyse/generale-ledger" },
      { title: "Balance Générale", icon: Landmark, href: "/analyse/generale-balance" },
      { title: "Journal Audit", icon: History, href: "/analyse/audits" },
    ],
  },
  comptabilite: {
    name: "Comptabilité",
    icon: BookOpen,
    composeActionLabel: "",
    sidebarLinks: [
      { title: "Plan Comptable", icon: BookOpen, href: "/accounting/chart-of-accounts" },
      { title: "Écritures Comptables", icon: FileClock, href: "/accounting/entries" },
      { title: "Brouillard", icon: PenSquare, href: "/accounting/draft" },
      { title: "Saisie Semi-Automatique", icon: ListChecks, href: "/accounting/semi-auto-entries" },
      { title: "Validation Écritures", icon: ShieldCheck, href: "/accounting/validation" },
      { title: "Paramétrage", icon: Settings, href: "/accounting/settings" },
    ],
  },
  configuration: {
    name: "Configuration",
    icon: Settings,
    composeActionLabel: "",
    sidebarLinks: [
      { title: "Plan Comptable", icon: BookOpen, href: "/accounting/chart-of-accounts" },
      { title: "Comptes Comptables", icon: Landmark, href: "/accounting/accounts" },
      { title: "Exercices Comptables", icon: FileClock, href: "/accounting/fiscal-years" },
      { title: "Périodes Comptables", icon: ListChecks, href: "/accounting/periods" },
      { title: "Journaux", icon: Notebook, href: "/accounting/journals" },
      { title: "Opérations Comptables", icon: FileClock, href: "/accounting/operations" },
      { title: "Taxes", icon: Coins, href: "/accounting/taxes" },
      { title: "Devises", icon: Globe, href: "/accounting/devises" },
    ],
  },
};
