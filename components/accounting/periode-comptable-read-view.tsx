// components/accounting/periode-comptable-read-view.tsx
"use client";

import React from 'react';
import { PeriodeComptableDto } from '@/src/lib2/models/PeriodeComptableDto';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Info, Calendar, Lock, Unlock, ArrowLeft } from 'lucide-react';
import { ExerciceComptableDto } from '@/src/lib2/models/ExerciceComptableDto';

interface PeriodeComptableReadViewProps {
    periode: PeriodeComptableDto;
    exerciceCode?: string;
    onBack?: () => void;
}

export const PeriodeComptableReadView: React.FC<PeriodeComptableReadViewProps> = ({
    periode,
    exerciceCode = "-",
    onBack
}) => {
    return (
        <div className="space-y-6 p-1">
            {/* Header Info (Blue Summary Box) */}
            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-blue-100 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-lg text-white">
                            <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-blue-900 uppercase tracking-tight">
                                Période {periode.code}
                            </h3>
                            <p className="text-sm text-blue-600/70 font-medium font-mono">
                                Exercice: {exerciceCode}
                            </p>
                        </div>
                    </div>
                    <Badge
                        variant={periode.cloturee ? 'secondary' : 'default'}
                        className={periode.cloturee
                            ? 'bg-gray-100 text-gray-600'
                            : 'bg-emerald-100 text-emerald-700 border-none'
                        }
                    >
                        {periode.cloturee ? <Lock className="h-3 w-3 mr-1" /> : <Unlock className="h-3 w-3 mr-1" />}
                        {periode.cloturee ? 'Clôturée' : 'Ouverte'}
                    </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Date de Début</p>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-blue-500" />
                            <p className="text-sm font-semibold text-blue-900">
                                {periode.dateDebut ? new Date(periode.dateDebut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Date de Fin</p>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-indigo-500" />
                            <p className="text-sm font-semibold text-blue-900">
                                {periode.dateFin ? new Date(periode.dateFin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                            </p>
                        </div>
                    </div>
                </div>

                {periode.notes && (
                    <div className="pt-4 border-t border-blue-100">
                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Notes</p>
                        <p className="text-sm text-blue-900/80 italic">{periode.notes}</p>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-dashed text-xs text-gray-400">
                <Info className="h-3.5 w-3.5" />
                Cette période définit l'intervalle de temps pour lequel les écritures comptables peuvent être saisies et validées.
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t">
                {onBack && (
                    <Button variant="outline" type="button" onClick={onBack} className="min-w-[120px]">
                        Fermer
                    </Button>
                )}
            </div>
        </div>
    );
};
