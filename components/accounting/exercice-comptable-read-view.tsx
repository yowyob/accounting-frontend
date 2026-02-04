"use client";

import React from 'react';
import { ExerciceComptableDto } from '@/src/lib2/models/ExerciceComptableDto';
import { PeriodeComptableDto } from '@/src/lib2/models/PeriodeComptableDto';
import { AccountingPeriodsService } from '@/src/lib2/services/AccountingPeriodsService';
import { Badge } from '@/components/ui/badge';
import {
    Calendar,
    Hash,
    Clock,
    CheckCircle2,
    AlertCircle,
    FileText
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";

interface ExerciceComptableReadViewProps {
    exercice: ExerciceComptableDto;
}

export const ExerciceComptableReadView: React.FC<ExerciceComptableReadViewProps> = ({ exercice }) => {
    const [periodes, setPeriodes] = React.useState<PeriodeComptableDto[]>([]);
    const [isLoadingPeriodes, setIsLoadingPeriodes] = React.useState(false);

    React.useEffect(() => {
        const fetchPeriodes = async () => {
            if (!exercice?.id) return;
            setIsLoadingPeriodes(true);
            try {
                const response = await AccountingPeriodsService.getAllPeriodeComptables();
                if (response && response.data) {
                    setPeriodes(response.data.filter(p => p.exercice_id === exercice.id));
                }
            } catch (error) {
                console.error("Failed to fetch periods for fiscal year:", error);
            } finally {
                setIsLoadingPeriodes(false);
            }
        };
        fetchPeriodes();
    }, [exercice?.id]);

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="space-y-6 p-1">
            {/* Summary Header */}
            <div className={`bg-gradient-to-br ${exercice.cloture ? 'from-gray-50 to-slate-100 border-gray-200' : 'from-blue-50 to-indigo-50 border-blue-100'} border rounded-xl p-6 shadow-sm`}>
                <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className={`${exercice.cloture ? 'bg-gray-500' : 'bg-blue-600'} text-white border-none px-3`}>
                                {exercice.cloture ? 'EXERCICE CLÔTURÉ' : 'EXERCICE OUVERT'}
                            </Badge>
                            <span className="text-sm font-medium text-gray-500 font-mono">#{exercice.id?.slice(0, 8)}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mt-2">{exercice.libelle}</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-start gap-3">
                        <div className={`p-2 bg-white rounded-lg border shadow-sm ${exercice.cloture ? 'text-gray-600' : 'text-blue-600'}`}>
                            <Hash className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Code</p>
                            <p className="font-semibold text-gray-900 font-mono">{exercice.code}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className={`p-2 bg-white rounded-lg border shadow-sm ${exercice.cloture ? 'text-gray-600' : 'text-indigo-600'}`}>
                            <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Période d'activité</p>
                            <p className="font-semibold text-gray-900">
                                Du {formatDate(exercice.date_debut)} <br />
                                Au {formatDate(exercice.date_fin)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className={`p-2 bg-white rounded-lg border shadow-sm ${exercice.cloture ? 'text-emerald-600' : 'text-amber-500'}`}>
                            {exercice.cloture ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Statut</p>
                            <p className="font-semibold text-gray-900">{exercice.cloture ? 'Clôturé' : 'En cours'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Content */}
            <Tabs defaultValue="periods" className="w-full">
                <TabsList className="grid w-full grid-cols-1 h-auto rounded-xl p-1 bg-gray-100/50 border mb-6">
                    <TabsTrigger
                        value="periods"
                        className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm py-2.5 font-bold text-xs tracking-widest uppercase"
                    >
                        <FileText className="h-4 w-4 mr-2" />
                        Périodes Comptables
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="periods">
                    <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                                    <TableHead className="font-bold text-gray-700 py-4 px-6">Code Période</TableHead>
                                    <TableHead className="font-bold text-gray-700 py-4">Intervalle de dates</TableHead>
                                    <TableHead className="font-bold text-gray-700 py-4 text-right px-6">Statut</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoadingPeriodes ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-10 text-gray-400 italic font-medium">
                                            Chargement des périodes...
                                        </TableCell>
                                    </TableRow>
                                ) : periodes.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-10 text-gray-400 italic font-medium border-2 border-dashed mx-6 my-4 rounded-lg">
                                            Aucune période définie pour cet exercice.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    periodes.map((periode) => (
                                        <TableRow key={periode.id} className="hover:bg-blue-50/30 transition-colors group">
                                            <TableCell className="font-bold text-blue-900 px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-blue-400 group-hover:scale-125 transition-transform" />
                                                    {periode.code}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-gray-600">
                                                Du {formatDate(periode.dateDebut)} au {formatDate(periode.dateFin)}
                                            </TableCell>
                                            <TableCell className="text-right px-6">
                                                <Badge
                                                    variant={periode.cloturee ? 'secondary' : 'default'}
                                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${periode.cloturee ? '' : 'bg-emerald-100 text-emerald-700 border-none hover:bg-emerald-200'}`}
                                                >
                                                    {periode.cloturee ? 'CLÔTURÉE' : 'OUVERTE'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>

            {!exercice.cloture && (
                <div className="flex items-center gap-2 p-3 bg-blue-50/50 rounded-lg border border-dashed border-blue-200 text-[11px] text-blue-600">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Cet exercice est actuellement ouvert. Vous pouvez enregistrer des écritures comptables dans les périodes qui lui sont rattachées.
                </div>
            )}
        </div>
    );
};
