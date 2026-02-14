// components/accounting/journal-comptable-read-view.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { JournalComptableDto } from '@/src/lib2/models/JournalComptableDto';
import { Badge } from '@/components/ui/badge';
import { Info, Book, FileText, Activity, Layers } from 'lucide-react';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { EcritureComptableDto } from '@/src/lib2/models/EcritureComptableDto';
import { OperationComptableDto } from '@/src/lib2/models/OperationComptableDto';
import { AccountingOperationsService } from '@/src/lib2/services/AccountingOperationsService';
import { AccountingJournalManagementService } from '@/src/lib2/services/AccountingJournalManagementService';
import { AccountingEntriesService } from '@/src/lib2/services/AccountingEntriesService';
import { AccountingComptesService } from '@/src/lib2/services/AccountingComptesService';
import { OperationComptableListView } from './operation-comptable-list-view';
import { JournalEntriesAnalysisTable } from './journal-entries-analysis-table';
import { JournalOperationsAnalysisTable } from './journal-operations-analysis-table';
import { toast } from 'sonner';

interface JournalComptableReadViewProps {
    journal: JournalComptableDto;
}

const TYPE_LABELS: Record<string, string> = {
    "VENTE": "Vente",
    "ACHAT": "Achat",
    "BANQUE": "Banque",
    "CAISSE": "Caisse",
    "DIVERS": "Opérations Diverses",
};

export const JournalComptableReadView: React.FC<JournalComptableReadViewProps> = ({ journal }) => {
    const [operations, setOperations] = useState<OperationComptableDto[]>([]);
    const [entries, setEntries] = useState<EcritureComptableDto[]>([]);
    const [accountMap, setAccountMap] = useState<Record<string, string>>({});
    const [isLoadingOperations, setIsLoadingOperations] = useState(false);
    const [isLoadingEntries, setIsLoadingEntries] = useState(false);

    const [selectedOperationId, setSelectedOperationId] = useState<string | null>(null);
    const [selectedEcritureId, setSelectedEcritureId] = useState<string | null>(null);

    useEffect(() => {
        if (journal.id) {
            const fetchData = async () => {
                setIsLoadingOperations(true);
                setIsLoadingEntries(true);
                try {
                    const [opsRes, entriesRes, accountsRes] = await Promise.all([
                        AccountingOperationsService.getAllOperationsComptables(),
                        AccountingJournalManagementService.getJournal(journal.id!),
                        AccountingComptesService.getAllComptes()
                    ]);

                    if (opsRes.success && opsRes.data) {
                        setOperations(opsRes.data.filter(op => op.journalComptableId === journal.id));
                    }
                    if (entriesRes.success && entriesRes.data) {
                        // Si le point de terminaison renvoie l'objet journal au lieu d'une liste d'écritures
                        // on extrait les écritures de la propriété ecritureComptable
                        const entriesData = Array.isArray(entriesRes.data)
                            ? entriesRes.data
                            : (entriesRes.data as any).ecritureComptable || [];
                        setEntries(entriesData);
                    }
                    if (accountsRes.success && accountsRes.data) {
                        const map: Record<string, string> = {};
                        accountsRes.data.forEach(acc => {
                            if (acc.id) map[acc.id] = acc.noCompte;
                        });
                        setAccountMap(map);
                    }
                } catch (error) {
                    console.error("Failed to fetch journal related data:", error);
                    toast.error("Erreur lors du chargement des données liées");
                } finally {
                    setIsLoadingOperations(false);
                    setIsLoadingEntries(false);
                }
            };
            fetchData();
        }
    }, [journal.id]);

    return (
        <div className="space-y-6 p-1">
            {/* Summary Header */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100 rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-indigo-600 text-white border-none px-3">
                                {TYPE_LABELS[journal.typeJournal] || journal.typeJournal}
                            </Badge>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mt-2">{journal.libelle}</h2>
                    </div>
                    <Badge variant={journal.actif ? "success" : "secondary"} className={journal.actif ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}>
                        {journal.actif ? "ACTIF" : "INACTIF"}
                    </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-white rounded-lg border shadow-sm text-indigo-600">
                            <Book className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Code Journal</p>
                            <p className="font-semibold text-gray-900 font-mono">{journal.codeJournal}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-white rounded-lg border shadow-sm text-blue-600">
                            <Layers className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Type</p>
                            <p className="font-semibold text-gray-900">{TYPE_LABELS[journal.typeJournal] || journal.typeJournal}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-white rounded-lg border shadow-sm text-emerald-600">
                            <Activity className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Status</p>
                            <p className="font-semibold text-gray-900">{journal.actif ? "Actif" : "Inactif"}</p>
                        </div>
                    </div>
                </div>

                {journal.notes && (
                    <div className="mt-6 p-3 bg-white/50 rounded-lg border border-dashed border-indigo-200 text-sm text-gray-600 italic">
                        &quot;{journal.notes}&quot;
                    </div>
                )}
            </div>

            {/* Tabs for Related Data */}
            <Tabs defaultValue="entries" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-auto rounded-xl p-1 bg-gray-100/50 border mb-6">
                    <TabsTrigger
                        value="operations"
                        className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm py-2.5"
                    >
                        <Activity className="h-4 w-4 mr-2" />
                        OPÉRATIONS
                    </TabsTrigger>
                    <TabsTrigger
                        value="entries"
                        className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm py-2.5"
                    >
                        <FileText className="h-4 w-4 mr-2" />
                        ÉCRITURES
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="operations">
                    <JournalOperationsAnalysisTable
                        operations={operations}
                        isLoading={isLoadingOperations}
                        accountMap={accountMap}
                    />
                </TabsContent>

                <TabsContent value="entries">
                    <JournalEntriesAnalysisTable
                        ecritures={entries}
                        isLoading={isLoadingEntries}
                        accountMap={accountMap}
                    />
                </TabsContent>
            </Tabs>

            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-dashed text-xs text-gray-400">
                <Info className="h-3.5 w-3.5" />
                Ce journal est utilisé pour enregistrer les transactions de type {journal.typeJournal?.toLowerCase()}.
            </div>
        </div>
    );
};
