"use client";

import React, { useEffect, useState } from 'react';
import { EcritureComptableDto } from '@/src/lib2/models/EcritureComptableDto';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, FileText, Hash, Info, Notebook, Tag } from 'lucide-react';
import { AccountingComptesService } from '@/src/lib2/services/AccountingComptesService';
import { CompteDto } from '@/src/lib2/models/CompteDto';

interface EcritureComptableReadViewProps {
    ecriture: EcritureComptableDto;
}

export const EcritureComptableReadView: React.FC<EcritureComptableReadViewProps> = ({ ecriture }) => {
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

    const getAccountNumber = (accountId: string) => {
        const account = accounts.find(acc => acc.id === accountId || acc.noCompte === accountId);
        return account ? account.noCompte : accountId;
    };

    const calculatedTotals = React.useMemo(() => {
        const totalDebit = ecriture.detailsEcriture?.reduce((sum, d) => sum + (Number(d.montantDebit) || 0), 0) || 0;
        const totalCredit = ecriture.detailsEcriture?.reduce((sum, d) => sum + (Number(d.montantCredit) || 0), 0) || 0;
        return { totalDebit, totalCredit };
    }, [ecriture.detailsEcriture]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Main Info Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-blue-100 text-sm font-medium mb-1">Écriture Comptable</p>
                            <h2 className="text-2xl font-bold tracking-tight">{ecriture.libelle}</h2>
                        </div>
                        <Badge className={ecriture.validee ? "bg-white/20 text-white border-white/30 backdrop-blur-md" : "bg-orange-500 text-white border-none shadow-lg"}>
                            {ecriture.validee ? "Validée" : "Brouillon"}
                        </Badge>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-gray-50/30">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Date</p>
                            <p className="font-semibold text-gray-900">
                                {ecriture.dateEcriture ? format(new Date(ecriture.dateEcriture), 'dd MMMM yyyy', { locale: fr }) : '-'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                            <FileText className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Journal</p>
                            <p className="font-semibold text-indigo-700">{ecriture.journalComptableLibelle || ecriture.journalComptableId}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                            <Hash className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Référence</p>
                            <p className="font-semibold text-gray-900">{ecriture.referenceExterne || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                            <Tag className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Numéro</p>
                            <p className="font-mono font-semibold text-gray-700">{ecriture.numeroEcriture || 'EN ATTENTE'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notes Section if exists */}
            {ecriture.notes && (
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 flex gap-4">
                    <div className="text-blue-600 shrink-0">
                        <Notebook className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-1">Notes Internes</p>
                        <p className="text-sm text-blue-900 leading-relaxed italic">{ecriture.notes}</p>
                    </div>
                </div>
            )}

            {/* Details Table */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-1.5 bg-blue-600 rounded-full" />
                    <h3 className="text-xl font-bold text-gray-800">Lignes d'Écritures</h3>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                                <TableHead className="font-bold text-gray-700 py-4 px-6">Compte</TableHead>
                                <TableHead className="font-bold text-gray-700 py-4">Désignation</TableHead>
                                <TableHead className="text-right font-bold text-gray-700 py-4">Débit</TableHead>
                                <TableHead className="text-right font-bold text-gray-700 py-4 px-6">Crédit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ecriture.detailsEcriture?.map((detail: any, index) => (
                                <TableRow key={index} className="group hover:bg-blue-50/30 transition-all">
                                    <TableCell className="font-bold text-blue-800 px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            {getAccountNumber(detail.compteComptableId)}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-600">{detail.libelle}</TableCell>
                                    <TableCell className="text-right font-mono font-semibold text-emerald-600">
                                        {detail.montantDebit ? detail.montantDebit.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) : '0,00'}
                                    </TableCell>
                                    <TableCell className="text-right font-mono font-semibold text-rose-600 px-6">
                                        {detail.montantCredit ? detail.montantCredit.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) : '0,00'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <tfoot className="bg-gray-900 text-white">
                            <TableRow className="hover:bg-gray-900">
                                <TableCell colSpan={2} className="px-6 py-5 text-right">
                                    <span className="text-gray-400 text-xs font-bold uppercase tracking-widest mr-4">Total Équilibre</span>
                                </TableCell>
                                <TableCell className="text-right py-5">
                                    <div className="flex flex-col items-end">
                                        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Débit</span>
                                        <span className="font-mono font-bold text-lg text-emerald-400">
                                            {calculatedTotals.totalDebit.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right px-6 py-5">
                                    <div className="flex flex-col items-end">
                                        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Crédit</span>
                                        <span className="font-mono font-bold text-lg text-rose-400">
                                            {calculatedTotals.totalCredit.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </tfoot>
                    </Table>
                </div>
            </div>

            <div className="flex items-center justify-center p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-xs text-gray-400 flex items-center gap-2">
                    <Info className="h-3 w-3" />
                    Cette vue est en lecture seule. Si l'écriture n'est pas validée, vous pouvez utiliser le bouton d'édition pour la modifier.
                </p>
            </div>
        </div>
    );
};
