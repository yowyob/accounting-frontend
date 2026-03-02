"use client";

import React from 'react';
import { Invoice } from '@/types/sales';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Printer, Mail, Download, User, MapPin } from 'lucide-react';

interface InvoiceDetailPanelProps {
    invoice: Invoice;
    onPrint?: () => void;
    onEmail?: () => void;
    onDownload?: () => void;
}

export function InvoiceDetailPanel({
    invoice,
    onPrint,
    onEmail,
    onDownload
}: InvoiceDetailPanelProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('fr-FR');
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            'P': 'Payée',
            'PP': 'Partiellement Payée',
            'NP': 'Non Payée',
            'A': 'Annulée',
        };
        return labels[status] || status;
    };

    const getStatusVariant = (status: string): "success" | "warning" | "destructive" | "default" => {
        const variants: Record<string, "success" | "warning" | "destructive" | "default"> = {
            'P': 'success',
            'PP': 'warning',
            'NP': 'default',
            'A': 'destructive',
        };
        return variants[status] || 'default';
    };

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl">Facture N° {invoice.invoiceNumber}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            Date: {formatDate(invoice.orderDate)}
                        </p>
                    </div>
                    <Badge variant={getStatusVariant(invoice.status)} className="text-sm">
                        {getStatusLabel(invoice.status)}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="flex-grow overflow-y-auto space-y-6">
                {/* Client Information */}
                <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-600" />
                        Informations Client
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex items-start gap-2">
                            <User className="h-4 w-4 text-gray-500 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-500">Nom</p>
                                <p className="font-medium">{invoice.client.name}</p>
                            </div>
                        </div>
                        {invoice.client.address && (
                            <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-500">Adresse</p>
                                    <p className="font-medium">{invoice.client.address}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <Separator />

                {/* Invoice Items */}
                <div>
                    <h3 className="font-semibold text-lg mb-3">Articles</h3>
                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left p-3 text-sm font-semibold">Description</th>
                                    <th className="text-right p-3 text-sm font-semibold">Qté</th>
                                    <th className="text-right p-3 text-sm font-semibold">Prix Unit.</th>
                                    <th className="text-right p-3 text-sm font-semibold">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.items.map((item, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="p-3">{item.name}</td>
                                        <td className="p-3 text-right">{item.quantity}</td>
                                        <td className="p-3 text-right font-mono">{formatCurrency(item.unitPrice)}</td>
                                        <td className="p-3 text-right font-mono">{formatCurrency(item.total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Separator />

                {/* Totals */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Sous-total HT</span>
                        <span className="font-mono">{formatCurrency(invoice.totalHT)} FCFA</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">TVA</span>
                        <span className="font-mono">{formatCurrency(invoice.totalTVA)} FCFA</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                        <span>Total TTC</span>
                        <span className="font-mono text-blue-600">{formatCurrency(invoice.totalTTC)} FCFA</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                    {onPrint && (
                        <Button onClick={onPrint} className="flex-1">
                            <Printer className="h-4 w-4 mr-2" />
                            Imprimer
                        </Button>
                    )}
                    {onEmail && (
                        <Button onClick={onEmail} variant="outline" className="flex-1">
                            <Mail className="h-4 w-4 mr-2" />
                            Envoyer
                        </Button>
                    )}
                    {onDownload && (
                        <Button onClick={onDownload} variant="outline" className="flex-1">
                            <Download className="h-4 w-4 mr-2" />
                            Télécharger
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
