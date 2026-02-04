// components/accounting/operation-comptable-read-view.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { OperationComptableDto } from '@/src/lib2/models/OperationComptableDto';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Info, Tag, User, Briefcase, CreditCard, Building2 } from 'lucide-react';
import { AccountingComptesService } from '@/src/lib2/services/AccountingComptesService';
import { CompteDto } from '@/src/lib2/models/CompteDto';

interface OperationComptableReadViewProps {
    operation: OperationComptableDto;
    onBack?: () => void;
}

const TYPE_LABELS: Record<string, string> = {
    "VENTE": "Vente Client",
    "ACHAT": "Achat Fournisseur",
    "SALAIRE": "Paiement Salaire",
    "PAIEMENT": "Paiement Divers",
    "DIVERS": "Opération Diverse",
};

const MODE_LABELS: Record<string, string> = {
    "ESPECE": "Espèces",
    "CHEQUE": "Chèque",
    "VIREMENT": "Virement",
    "MOBILE": "Mobile Money",
};

export const OperationComptableReadView: React.FC<OperationComptableReadViewProps> = ({
    operation,
    onBack
}) => {
    const [accounts, setAccounts] = useState<CompteDto[]>([]);

    useEffect(() => {
        const fetchAccounts = async () => {
            const res = await AccountingComptesService.getAllComptes();
            if (res.success && res.data) {
                setAccounts(res.data);
            }
        };
        fetchAccounts();
    }, []);

    const getAccountLabel = (noCompte: string) => {
        const account = accounts.find(acc => acc.noCompte === noCompte || acc.id === noCompte);
        return account ? `${account.noCompte} - ${account.libelle}` : noCompte;
    };

    return (
        <div className="space-y-6 p-1">
            {/* Header Info (Blue Summary Box) */}
            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-blue-100 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-lg text-white">
                            <Briefcase className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-blue-900 uppercase tracking-tight">
                                {TYPE_LABELS[operation.typeOperation] || operation.typeOperation}
                            </h3>
                            <p className="text-sm text-blue-600/70 font-medium font-mono">#{operation.id?.slice(0, 8)}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Mode de règlement</p>
                        <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-blue-500" />
                            <p className="text-sm font-semibold text-blue-900">{MODE_LABELS[operation.modeReglement] || operation.modeReglement}</p>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Compte Principal</p>
                        <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-indigo-500" />
                            <p className="text-sm font-semibold text-blue-900 font-mono italic">
                                {getAccountLabel(operation.comptePrincipalId)} ({operation.sensPrincipal})
                            </p>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Type de Montant</p>
                        <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-emerald-500" />
                            <p className="text-sm font-semibold text-blue-900">{operation.typeMontant}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Counterparties Table */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-1 bg-blue-600 rounded-full" />
                    <h3 className="text-lg font-bold text-gray-800 uppercase tracking-tight">Comptes de Contrepartie</h3>
                </div>

                <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                                <TableHead className="font-bold text-gray-700 py-3 px-6">Compte</TableHead>
                                <TableHead className="font-bold text-gray-700 py-3">Sens</TableHead>
                                <TableHead className="font-bold text-gray-700 py-3">Type Montant</TableHead>
                                <TableHead className="font-bold text-gray-700 py-3 px-6 text-right text-xs">Tiers</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {operation.contreparties?.map((cp, index) => (
                                <TableRow key={index} className="hover:bg-blue-50/30 transition-colors">
                                    <TableCell className="font-bold text-blue-800 px-6 py-4">
                                        <div className="font-mono text-sm">
                                            {getAccountLabel(cp.compteId)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cp.sens === 'DEBIT' ? "border-emerald-200 text-emerald-700 bg-emerald-50" : "border-rose-200 text-rose-700 bg-rose-50"}>
                                            {cp.sens}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-gray-600 text-sm">{cp.typeMontant}</TableCell>
                                    <TableCell className="text-right px-6">
                                        {cp.estCompteTiers ? (
                                            <div className="inline-flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                                <User className="h-3 w-3" /> TIERS
                                            </div>
                                        ) : (
                                            <span className="text-gray-300 text-[10px]">NON</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-dashed text-xs text-gray-400">
                <Info className="h-3.5 w-3.5" />
                Cette opération sera utilisée comme modèle pour générer automatiquement des écritures comptables lors des transactions.
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t">
                {onBack && (
                    <Button variant="outline" type="button" onClick={onBack} className="min-w-[100px]">
                        Fermer
                    </Button>
                )}
            </div>
        </div>
    );
};
