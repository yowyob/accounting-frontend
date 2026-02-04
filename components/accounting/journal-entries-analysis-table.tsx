// components/accounting/journal-entries-analysis-table.tsx
"use client";

import React, { useMemo } from 'react';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '@/components/ui/table';
import { EcritureComptableDto } from '@/src/lib2/models/EcritureComptableDto';
import { Loader2 } from 'lucide-react';

interface JournalEntriesAnalysisTableProps {
    ecritures: EcritureComptableDto[];
    isLoading: boolean;
    accountMap?: Record<string, string>;
}

export const JournalEntriesAnalysisTable: React.FC<JournalEntriesAnalysisTableProps> = ({
    ecritures = [],
    isLoading,
    accountMap = {},
}) => {
    // Flatten ecritures into detail rows
    const flattenedRows = useMemo(() => {
        const rows: any[] = [];
        ecritures.forEach((ecriture) => {
            if (ecriture.detailsEcriture && ecriture.detailsEcriture.length > 0) {
                ecriture.detailsEcriture.forEach((detail, index) => {
                    rows.push({
                        dateEc: ecriture.dateEcriture,
                        sens: detail.montantDebit && detail.montantDebit > 0 ? 'D' : 'C',
                        compte: accountMap[detail.compteComptableId] || detail.compteComptableId,
                        intitule: detail.libelle,
                        debit: detail.montantDebit || 0,
                        credit: detail.montantCredit || 0,
                        piece: ecriture.libelle,
                        noSaisie: ecriture.numeroEcriture || ecriture.id?.slice(0, 8),
                    });
                });
            }
        });
        return rows;
    }, [ecritures, accountMap]);

    const totals = useMemo(() => {
        return flattenedRows.reduce(
            (acc, row) => {
                acc.debit += row.debit;
                acc.credit += row.credit;
                return acc;
            },
            { debit: 0, credit: 0 }
        );
    }, [flattenedRows]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p className="italic text-sm">Chargement de l'analyse du journal...</p>
            </div>
        );
    }

    if (flattenedRows.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500 italic bg-gray-50 rounded-lg border border-dashed border-gray-200 shadow-inner">
                Aucune écriture trouvée pour ce journal.
            </div>
        );
    }

    return (
        <div className="border border-blue-200 rounded-xl overflow-hidden shadow-md bg-white">
            {/* Table Header Section */}
            <div className="bg-blue-600 px-6 py-3 flex justify-between items-center text-white">
                <h3 className="font-bold text-sm uppercase tracking-wide">Journal détaillé</h3>
            </div>

            <div className="overflow-x-auto">
                <Table className="border-collapse">
                    <TableHeader className="bg-blue-100/80 border-b border-blue-200">
                        <TableRow className="hover:bg-transparent border-none">
                            <TableHead className="font-bold text-blue-900 text-[11px] uppercase tracking-wider py-3 border-r border-blue-200 px-4 w-[110px]">Date Ec</TableHead>
                            <TableHead className="font-bold text-blue-900 text-[11px] uppercase tracking-wider py-3 border-r border-blue-200 px-2 w-[50px] text-center">Se.</TableHead>
                            <TableHead className="font-bold text-blue-900 text-[11px] uppercase tracking-wider py-3 border-r border-blue-200 px-4 w-[130px]">Compte</TableHead>
                            <TableHead className="font-bold text-blue-900 text-[11px] uppercase tracking-wider py-3 border-r border-blue-200 px-4 min-w-[220px]">Intitulé écriture</TableHead>
                            <TableHead className="font-bold text-blue-900 text-[11px] uppercase tracking-wider py-3 border-r border-blue-200 px-4 w-[130px] text-right">Débit</TableHead>
                            <TableHead className="font-bold text-blue-900 text-[11px] uppercase tracking-wider py-3 border-r border-blue-200 px-4 w-[130px] text-right">Crédit</TableHead>
                            <TableHead className="font-bold text-blue-900 text-[11px] uppercase tracking-wider py-3 border-r border-blue-200 px-4 min-w-[180px]">Pièce</TableHead>
                            <TableHead className="font-bold text-blue-900 text-[11px] uppercase tracking-wider py-3 text-center px-4 w-[110px]">N° saisie</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {flattenedRows.map((row, idx) => (
                            <TableRow key={idx} className="hover:bg-blue-50/50 transition-colors border-b border-gray-100 last:border-0 h-10">
                                <TableCell className="py-2 px-4 text-xs font-medium text-gray-700 border-r border-gray-100">
                                    {new Date(row.dateEc).toLocaleDateString('fr-FR')}
                                </TableCell>
                                <TableCell className={`py-2 px-2 text-xs font-bold border-r border-gray-100 text-center ${row.sens === 'D' ? 'text-red-600' : 'text-blue-700'}`}>
                                    {row.sens}
                                </TableCell>
                                <TableCell className={`py-2 px-4 text-xs font-mono border-r border-gray-100 font-semibold ${row.sens === 'D' ? 'text-red-700' : 'text-blue-800'}`}>
                                    {row.compte}
                                </TableCell>
                                <TableCell className={`py-2 px-4 text-[11px] border-r border-gray-100 leading-tight ${row.sens === 'D' ? 'text-red-700 font-bold uppercase' : 'text-gray-700 font-medium'}`}>
                                    {row.intitule}
                                </TableCell>
                                <TableCell className="py-2 px-4 text-xs font-mono text-right border-r border-gray-100 text-red-600 font-bold bg-red-50/20">
                                    {row.debit > 0 ? row.debit.toLocaleString('fr-FR') : '0'}
                                </TableCell>
                                <TableCell className="py-2 px-4 text-xs font-mono text-right border-r border-gray-100 text-blue-800 font-bold bg-blue-50/20">
                                    {row.credit > 0 ? row.credit.toLocaleString('fr-FR') : '0'}
                                </TableCell>
                                <TableCell className="py-2 px-4 text-[11px] text-gray-600 border-r border-gray-100 truncate max-w-[200px]" title={row.piece}>
                                    {row.piece}
                                </TableCell>
                                <TableCell className="py-2 px-4 text-xs text-center font-mono text-gray-500 font-semibold">
                                    {row.noSaisie}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <tfoot className="bg-blue-600 text-white font-bold h-11 border-t-2 border-blue-700">
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={4} className="py-2 px-6 text-right text-xs font-bold uppercase tracking-widest">Sommes totales</TableCell>
                            <TableCell className="py-2 px-4 text-right font-mono text-sm border-l border-blue-500/50">{totals.debit.toLocaleString('fr-FR')}</TableCell>
                            <TableCell className="py-2 px-4 text-right font-mono text-sm border-l border-blue-500/50">{totals.credit.toLocaleString('fr-FR')}</TableCell>
                            <TableCell colSpan={2} className="border-l border-blue-500/50"></TableCell>
                        </TableRow>
                    </tfoot>
                </Table>
            </div>
        </div>
    );
};
