"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AccountingEntriesService } from '@/src/lib2/services/AccountingEntriesService';
import { EcritureComptableDto } from '@/src/lib2/models/EcritureComptableDto';
import { AccountingJournalManagementService } from '@/src/lib2/services/AccountingJournalManagementService';
import { AccountingPlanComptableService } from '@/src/lib2/services/AccountingPlanComptableService';
import { JournalComptableDto } from '@/src/lib2/models/JournalComptableDto';
import { EcritureComptableReadView } from '@/components/accounting/ecriture-comptable-read-view';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useCompose } from '@/hooks/use-compose-store';
import { EcritureComptableDetailView } from '@/components/accounting/ecriture-comptable-detail-view';
import { request as __request } from '@/src/lib2/core/request';
import { OpenAPI } from '@/src/lib2/core/OpenAPI';

export default function EcritureComptableDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [ecriture, setEcriture] = useState<EcritureComptableDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [ecritureToDelete, setEcritureToDelete] = useState<EcritureComptableDto | null>(null);
    const { onOpen, onClose } = useCompose();

    const fetchEcriture = async () => {
        setIsLoading(true);
        try {
            const [entryRes, journalsRes, accountsRes] = await Promise.all([
                AccountingEntriesService.getById1(id),
                AccountingJournalManagementService.getAllJournals(),
                AccountingPlanComptableService.getAllPlanComptables()
            ]);

            if (entryRes.success && entryRes.data) {
                const entry = entryRes.data;
                const journals = (Array.isArray(journalsRes.data) ? journalsRes.data : []) as JournalComptableDto[];
                const accounts = (Array.isArray(accountsRes.data) ? accountsRes.data : []) as any[];

                // Map Journal Label
                if (!entry.journalComptableLibelle) {
                    const journal = journals.find(j => j.id === entry.journalComptableId);
                    if (journal) entry.journalComptableLibelle = journal.libelle;
                }

                // Map Account Numbers in Lines
                if (entry.detailsEcriture) {
                    entry.detailsEcriture = entry.detailsEcriture.map(detail => {
                        const acc = accounts.find(a => a.id === detail.compteComptableId);
                        return {
                            ...detail,
                            // Use casting to add the property efficiently
                            compteComptableNo: acc?.noCompte || detail.compteComptableId
                        } as any;
                    });
                }

                setEcriture(entry);
            } else {
                router.push('/accounting/entries'); // Redirect if not found
            }
        } catch (error) {
            console.error("Failed to fetch ecriture details:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchEcriture();
        }
    }, [id]);

    const handleSave = async (data: EcritureComptableDto) => {
        try {
            // Manual PUT
            await __request(OpenAPI, {
                method: 'PUT',
                url: `/api/accounting/entries/${data.id}`,
                body: data,
                mediaType: 'application/json',
            });
            onClose();
            fetchEcriture();
        } catch (error) {
            console.error("Failed to update ecriture:", error);
        }
    };

    const handleValidate = async (id: string) => {
        try {
            await AccountingEntriesService.validateEcriture(id);
            onClose();
            fetchEcriture();
        } catch (error) {
            console.error("Failed to validate:", error);
        }
    };

    const confirmDelete = async () => {
        if (!ecritureToDelete?.id) return;
        try {
            await AccountingEntriesService.delete1(ecritureToDelete.id);
            router.push('/accounting/entries');
        } catch (error) {
            console.error("Failed to delete:", error);
        } finally {
            setEcritureToDelete(null);
        }
    };

    const handleEdit = () => {
        if (!ecriture) return;
        onOpen({
            title: "Modifier l'Écriture Comptable",
            content: (
                <EcritureComptableDetailView
                    ecriture={ecriture}
                    onSave={handleSave}
                    onDelete={() => {
                        setEcritureToDelete(ecriture);
                        onClose();
                    }}
                    onValidate={() => {
                        if (ecriture.id) handleValidate(ecriture.id);
                    }}
                    onBack={onClose}
                />
            )
        });
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Chargement des détails...</div>;
    }

    if (!ecriture) {
        return <div className="p-8 text-center text-red-500">Ecriture introuvable.</div>;
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-6 md:p-8">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => router.back()} className="gap-2">
                    <ArrowLeft className="h-4 w-4" /> Retour à la liste
                </Button>

                {!ecriture.validee && (
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleEdit} className="text-blue-600 border-blue-200 bg-blue-50">
                            <Edit className="mr-2 h-4 w-4" /> Modifier
                        </Button>
                        <Button variant="destructive" onClick={() => setEcritureToDelete(ecriture)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                        </Button>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <EcritureComptableReadView ecriture={ecriture} />
            </div>

            {ecritureToDelete && (
                <ConfirmationDialog
                    isOpen={!!ecritureToDelete}
                    onClose={() => setEcritureToDelete(null)}
                    onConfirm={confirmDelete}
                    title={`Supprimer ${ecritureToDelete.libelle} ?`}
                    description="Cette action est irréversible."
                />
            )}
        </div>
    );
}
