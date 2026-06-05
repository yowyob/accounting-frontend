import Link from 'next/link';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';
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
        <div className="border-t border-sidebar-border mt-auto">
            <Link
                href="/accounting/profile"
                className={cn(
                    "mx-2 mb-2 mt-2 px-3 py-2.5 flex items-center gap-3 rounded-full transition-colors hover:bg-secondary"
                )}
            >
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                    {initials || <User className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-normal text-foreground truncate">
                        {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                        {getRoleLabel(accountingRole)}
                    </p>
                </div>
            </Link>
        </div>
    );
}
