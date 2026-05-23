import Link from 'next/link';
import { cn } from '@/lib/utils';
import { User, Shield, ExternalLink } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { getRoleLabel } from '@/src/lib/auth/roles';

export function UserProfileWidget() {
    const { user, accountingRole } = useAuth();

    if (!user) {
        return (
            <div className="px-4 py-3 border-t border-sidebar-border mt-auto">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>Non connecté</span>
                </div>
            </div>
        );
    }

    const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();

    return (
        <div className="border-t border-sidebar-border/60 mt-auto bg-slate-50/30">
            <Link
                href="/accounting/profile"
                className={cn(
                    "px-4 py-4 flex items-center gap-3 group transition-all hover:bg-white hover:shadow-sm"
                )}
            >
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    {initials || <User className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                        {user.firstName} {user.lastName}
                    </p>
                    <div className="flex items-center gap-1.5">
                        <Shield className="h-3 w-3 text-slate-400 flex-shrink-0" />
                        <p className="text-[11px] font-medium text-slate-500 truncate uppercase tracking-tight">
                            {getRoleLabel(accountingRole)}
                        </p>
                    </div>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
        </div>
    );
}
