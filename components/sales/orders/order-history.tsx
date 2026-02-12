"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { DateRangePicker } from "@/components/date-range-picker";
import { Order } from "@/types/sales";
import { Trash2, Printer, Eraser } from "lucide-react";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { getOrders, updateOrder } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { DateRange } from "react-day-picker";
import { useNationalCurrency } from "@/hooks/use-national-currency";

type SearchFormData = {
    dateRange?: DateRange;
    orderNumber?: string;
    clientName?: string;
};

export function OrderHistory() {
    const { nationalCurrency } = useNationalCurrency();
    const currencyCode = nationalCurrency?.code || 'XAF';
    const [allOrders, setAllOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const searchForm = useForm<SearchFormData>();

    const fetchAndSetOrders = async () => {
        setIsLoading(true);
        try {
            const data = await getOrders();
            setAllOrders(data);
            setFilteredOrders(data);
            if (data.length > 0) {
                setSelectedOrder(data[0]);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAndSetOrders();
    }, []);

    const handleSearch = (data: SearchFormData) => {
        let tempOrders = [...allOrders];

        if (data.orderNumber) {
            tempOrders = tempOrders.filter(o => o.orderNumber.toLowerCase().includes(data.orderNumber!.toLowerCase()));
        }
        if (data.clientName) {
            tempOrders = tempOrders.filter(o => o.client.name.toLowerCase().includes(data.clientName!.toLowerCase()));
        }
        if (data.dateRange?.from) {
            tempOrders = tempOrders.filter(o => o.orderDate >= data.dateRange!.from!);
        }
        if (data.dateRange?.to) {
            tempOrders = tempOrders.filter(o => o.orderDate <= data.dateRange!.to!);
        }
        setFilteredOrders(tempOrders);
    };

    const handleCancelOrder = async () => {
        if (!selectedOrder) return;
        if (window.confirm(`Voulez-vous vraiment annuler la commande N°${selectedOrder.orderNumber} ?`)) {
            try {
                await updateOrder(selectedOrder.id, { status: 'Cancelled' });
                await fetchAndSetOrders();
                setSelectedOrder(prev => prev ? { ...prev, status: 'Cancelled' } : null);
            } catch (error) {
                console.error("Failed to cancel order:", error);
            }
        }
    };

    return (
        <div className="h-full flex flex-col space-y-4">
            <Card className="flex-shrink-0">
                <CardHeader className="p-4"><CardTitle className="text-base">Critères de recherche</CardTitle></CardHeader>
                <CardContent className="p-4">
                    <Form {...searchForm}>
                        <form onSubmit={searchForm.handleSubmit(handleSearch)} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
                            <FormItem><FormLabel>Date entre</FormLabel><DateRangePicker onDateChange={(range) => searchForm.setValue('dateRange', range)} /></FormItem>
                            <FormItem><FormLabel>N° CMD</FormLabel><Input {...searchForm.register("orderNumber")} /></FormItem>
                            <FormItem><FormLabel>Client</FormLabel><Input {...searchForm.register("clientName")} /></FormItem>
                            <Button type="submit">Rechercher</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
                <Card className="lg:col-span-1 h-full flex flex-col">
                    <CardHeader className="p-4 flex-shrink-0"><CardTitle className="text-base">Résultats ({filteredOrders.length})</CardTitle></CardHeader>
                    <CardContent className="p-2 flex-grow overflow-y-auto">
                        <div className="space-y-1">
                            {isLoading ? (
                                Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-md" />)
                            ) : (
                                filteredOrders.map(order => (
                                    <div key={order.id} onClick={() => setSelectedOrder(order)} className={`p-2 rounded-md cursor-pointer text-sm hover:bg-accent ${selectedOrder?.id === order.id ? 'bg-accent font-semibold' : ''}`}>
                                        <p>{order.orderNumber} - {order.client.name}</p>
                                        <p className="text-xs text-muted-foreground">{format(order.orderDate, 'dd-MM-yyyy')} - {order.netToPay.toLocaleString('fr-FR')} {currencyCode}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2 h-full flex flex-col">
                    <CardHeader className="p-4 flex-shrink-0">
                        <CardTitle className="text-base">Détails et Annulation de la Commande</CardTitle>
                        {selectedOrder && <p className="text-sm text-muted-foreground">Commande N°: {selectedOrder.orderNumber}</p>}
                    </CardHeader>
                    {selectedOrder ? (
                        <>
                            <CardContent className="p-4 flex-grow overflow-y-auto space-y-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div><p className="text-muted-foreground">Client</p><p className="font-medium">{selectedOrder.client.name}</p></div>
                                    <div><p className="text-muted-foreground">Date</p><p className="font-medium">{format(selectedOrder.orderDate, 'dd-MM-yyyy')}</p></div>
                                    <div><p className="text-muted-foreground">Statut</p><p className="font-medium">{selectedOrder.status}</p></div>
                                    <div><p className="text-muted-foreground">Montant TTC</p><p className="font-medium">{selectedOrder.totalTTC.toLocaleString('fr-FR')}</p></div>
                                </div>
                                <FormItem><FormLabel>Motif de l'annulation</FormLabel><Textarea rows={3} /></FormItem>
                            </CardContent>
                            <CardContent className="p-4 flex-shrink-0 border-t">
                                <div className="flex items-center justify-end gap-2">
                                    <Button variant="outline"><Eraser className="mr-2 h-4 w-4" />Effacer</Button>
                                    <Button variant="outline"><Printer className="mr-2 h-4 w-4" />Imprimer</Button>
                                    <Button variant="destructive" onClick={handleCancelOrder} disabled={selectedOrder.status === 'Cancelled'}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        {selectedOrder.status === 'Cancelled' ? 'Déjà Annulée' : 'Annuler la commande'}
                                    </Button>
                                </div>
                            </CardContent>
                        </>
                    ) : (
                        <CardContent className="flex items-center justify-center h-full text-muted-foreground">
                            <p>{isLoading ? "Chargement..." : "Sélectionnez une commande pour voir les détails."}</p>
                        </CardContent>
                    )}
                </Card>
            </div>
        </div>
    );
}