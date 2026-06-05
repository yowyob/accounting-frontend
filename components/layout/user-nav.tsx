"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Shield } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { getRoleLabel } from "@/src/lib/auth/roles";
import { OpenAPI as CoreOpenAPI } from "@/src/lib";
import { OpenAPI as AccountingOpenAPI } from "@/src/lib2";

export function UserNav() {
  const router = useRouter();
  const { user, accountingRole, clear } = useAuth();

  const handleLogout = () => {
    // Vider le store Zustand
    clear();
    // Supprimer les données de session du localStorage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    localStorage.removeItem("organization_id");
    // Réinitialiser le token OpenAPI
    CoreOpenAPI.TOKEN = undefined;
    AccountingOpenAPI.TOKEN = undefined;
    // Rediriger vers la page de connexion
    router.push("/");
  };

  // Initiales pour l'avatar
  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "?"
    : "?";

  const displayName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Utilisateur"
    : "Utilisateur";

  const displayEmail = user?.email ?? "";

  const roleLabel = getRoleLabel(accountingRole);

  // Couleur du badge de rôle
  const roleBadgeClass =
    accountingRole === "RESPONSABLE_COMPTABLE"
      ? "bg-violet-100 text-violet-700"
      : accountingRole === "COMPTABLE"
      ? "bg-blue-100 text-blue-700"
      : "bg-slate-100 text-slate-600";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-full ring-2 ring-transparent hover:ring-indigo-200 transition-all"
        >
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64" align="end" forceMount>
        {/* Infos utilisateur */}
        <DropdownMenuLabel className="font-normal p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{displayEmail}</p>
              {accountingRole && (
                <span className={`mt-1 inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full w-fit ${roleBadgeClass}`}>
                  <Shield className="h-2.5 w-2.5" />
                  {roleLabel}
                </span>
              )}
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer gap-2">
            <User className="h-4 w-4 text-gray-500" />
            Profil
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Bouton de déconnexion */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
