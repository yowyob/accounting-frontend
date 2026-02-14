"use client";

import React, { useState } from 'react';
import { CustomerInvoiceDto } from '@/src/lib2/models/CustomerInvoiceDto';
import { SupplierInvoiceDto } from '@/src/lib2/models/SupplierInvoiceDto';
import { EcritureComptableDto } from '@/src/lib2/models/EcritureComptableDto';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Save, X, FileText, Calendar, User, DollarSign } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface SemiAutoEntryPreviewProps {
    invoice: CustomerInvoiceDto | SupplierInvoiceDto;
    generatedEntry: EcritureComptableDto;
    type: 'SALE' | 'PURCHASE';
    onValidate: () => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export function SemiAutoEntryPreview({
    invoice,
    generatedEntry,
    type,
    onValidate,
    onCancel,
    isSubmitting = false,
}: SemiAutoEntryPreviewProps) {
    const formatCurrency = (amount?: number) => {
        if (!amount) return '0,00';
        return new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    const getPartnerName = () => {
        if (type === 'SALE') {
            return (invoice as CustomerInvoiceDto).nomClient || '-';
        } else {
            return (invoice as SupplierInvoiceDto).nomFournisseru || '-';
        }
    };

    const totalDebit = generatedEntry.detailsEcriture?.reduce(
        (sum, detail) => sum + (detail.montantDebit || 0),
        0
    ) || 0;

    const totalCredit = generatedEntry.detailsEcriture?.reduce(
        (sum, detail) => sum + (detail.montantCredit || 0),
        0
    ) || 0;

    const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

    return (
        <div className="space-y-6">
            {/* Invoice Information */}
            <Card>
                <CardHeader className="bg-gray-50">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <FileText className="h-5 w-5 text-blue-600" />
                        Informations de la Facture
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-start gap-3">
                            <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-500">Numéro</p>
                                <p className="font-semibold text-gray-900">{invoice.numeroFacture || '-'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-500">Date</p>
                                <p className="font-semibold text-gray-900">{formatDate(invoice.dateFacturation)}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <User className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-500">{type === 'SALE' ? 'Client' : 'Fournisseur'}</p>
                                <p className="font-semibold text-gray-900">{getPartnerName()}</p>
                            </div>
                        </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-start gap-3">
                            <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-500">Montant HT</p>
                                <p className="font-semibold text-gray-900">{formatCurrency(invoice.montantHT)} FCFA</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-500">TVA</p>
                                <p className="font-semibold text-gray-900">{formatCurrency(invoice.montantTVA)} FCFA</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-500">Montant TTC</p>
                                <p className="font-semibold text-blue-600 text-lg">{formatCurrency(invoice.montantTTC)} FCFA</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Generated Entry */}
            <Card>
                <CardHeader className="bg-blue-50">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <FileText className="h-5 w-5 text-blue-600" />
                            Écriture Comptable Générée
                        </CardTitle>
                        {isBalanced ? (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                                ✓ Équilibrée
                            </Badge>
                        ) : (
                            <Badge variant="destructive">
                                ✗ Non équilibrée
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Libellé</p>
                                <p className="font-medium text-gray-900">{generatedEntry.libelle || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Date d'écriture</p>
                                <p className="font-medium text-gray-900">{formatDate(generatedEntry.dateEcriture)}</p>
                            </div>
                        </div>

                        <Separator />

                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50">
                                        <TableHead className="font-semibold">Compte</TableHead>
                                        <TableHead className="font-semibold">Libellé</TableHead>
                                        <TableHead className="font-semibold text-right">Débit</TableHead>
                                        <TableHead className="font-semibold text-right">Crédit</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {generatedEntry.detailsEcriture?.map((detail, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-mono text-sm">{detail.compteComptableId || '-'}</TableCell>
                                            <TableCell>{detail.libelle || '-'}</TableCell>
                                            <TableCell className="text-right font-mono">
                                                {detail.montantDebit ? formatCurrency(detail.montantDebit) : '-'}
                                            </TableCell>
                                            <TableCell className="text-right font-mono">
                                                {detail.montantCredit ? formatCurrency(detail.montantCredit) : '-'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow className="bg-gray-50 font-semibold">
                                        <TableCell colSpan={2}>Total</TableCell>
                                        <TableCell className="text-right font-mono">{formatCurrency(totalDebit)}</TableCell>
                                        <TableCell className="text-right font-mono">{formatCurrency(totalCredit)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t">
                <Button
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="min-w-32"
                >
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                </Button>
                <Button
                    onClick={onValidate}
                    disabled={!isBalanced || isSubmitting}
                    className="min-w-32 bg-blue-600 hover:bg-blue-700"
                >
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Enregistrement...' : 'Valider et Enregistrer'}
                </Button>
            </div>

            {!isBalanced && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <div className="text-red-600 mt-0.5">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-red-900">Écriture non équilibrée</p>
                            <p className="text-sm text-red-700 mt-1">
                                Le total des débits ({formatCurrency(totalDebit)} FCFA) doit être égal au total des crédits ({formatCurrency(totalCredit)} FCFA).
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
