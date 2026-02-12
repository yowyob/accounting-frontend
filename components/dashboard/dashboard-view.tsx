"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Order } from "@/types/sales";
import { Banknote, Users, Package, ShoppingCart } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "../ui/badge";
import { useNationalCurrency } from "@/hooks/use-national-currency";

interface DashboardViewProps {
    totalRevenue: number;
    totalClients: number;
    totalProducts: number;
    recentOrders: Order[];
}

export function DashboardView({ totalRevenue, totalClients, totalProducts, recentOrders }: DashboardViewProps) {
    const { nationalCurrency } = useNationalCurrency();
    const currencyCode = nationalCurrency?.code || 'XAF';

    const orderColumns: ColumnDef<Order>[] = [
        { accessorKey: 'orderNumber', header: 'Commande' },
        { accessorKey: 'client.name', header: 'Client' },
        { accessorKey: 'orderDate', header: 'Date', cell: ({ row }) => format(new Date(row.original.orderDate), 'dd/MM/yyyy') },
        { accessorKey: 'netToPay', header: 'Montant', cell: ({ row }) => `${row.original.netToPay.toLocaleString('fr-FR')} ${currencyCode}` },
        { accessorKey: 'status', header: 'Statut', cell: ({ row }) => <Badge>{row.original.status}</Badge> },
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Chiffre d'Affaires (Total)"
                    value={`${totalRevenue.toLocaleString('fr-FR')} ${currencyCode}`}
                    icon={<Banknote className="h-5 w-5 text-muted-foreground" />}
                    variant="primary"
                />
                <StatCard
                    title="Clients Enregistrés"
                    value={totalClients}
                    icon={<Users className="h-5 w-5 text-muted-foreground" />}
                />
                <StatCard
                    title="Articles au Catalogue"
                    value={totalProducts}
                    icon={<Package className="h-5 w-5 text-muted-foreground" />}
                />
                <StatCard
                    title="Commandes Récentes"
                    value={recentOrders.length}
                    icon={<ShoppingCart className="h-5 w-5 text-muted-foreground" />}
                />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Dernières Commandes</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable columns={orderColumns} data={recentOrders} />
                </CardContent>
            </Card>
        </div>
    );
}