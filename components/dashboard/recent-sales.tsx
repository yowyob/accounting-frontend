"use client";

import { Order } from "@/types/sales";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useNationalCurrency } from "@/hooks/use-national-currency";

interface RecentSalesProps {
    sales: Order[];
}

export function RecentSales({ sales }: RecentSalesProps) {
    const { nationalCurrency } = useNationalCurrency();
    const currencyCode = nationalCurrency?.code || 'XAF';
    return (
        <div className="space-y-6">
            {sales.map(sale => (
                <div key={sale.id} className="flex items-center">
                    <Avatar className="h-9 w-9">
                        <AvatarFallback>{sale.client.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{sale.client.name}</p>
                        <p className="text-sm text-muted-foreground">
                            {format(new Date(sale.orderDate), "d MMMM yyyy", { locale: fr })}
                        </p>
                    </div>
                    <div className="ml-auto font-medium text-right">
                        <p>+{sale.netToPay.toLocaleString('fr-FR')} {currencyCode}</p>
                        <p className="text-xs text-muted-foreground">{sale.orderNumber}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}