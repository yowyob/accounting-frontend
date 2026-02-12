// app/(dashboard)/accounting/entries/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { EcritureComptableDto } from '@/src/lib2/models/EcritureComptableDto';
import { AccountingEntriesService } from '@/src/lib2/services/AccountingEntriesService';
import { AccountingJournalManagementService } from '@/src/lib2/services/AccountingJournalManagementService';
import { AccountingPlanComptableService } from '@/src/lib2/services/AccountingPlanComptableService';
import { JournalComptableDto } from '@/src/lib2/models/JournalComptableDto';
import { EcritureComptableListView } from '@/components/accounting/ecriture-comptable-list-view';
import { EcritureComptableDetailView } from '@/components/accounting/ecriture-comptable-detail-view';
import { useCompose } from '@/hooks/use-compose-store';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { OpenAPI } from '@/src/lib2/core/OpenAPI';
import { request as __request } from '@/src/lib2/core/request';
import { toast } from 'sonner';

export default function EcritureComptablePage() {
  const router = useRouter();
  const [ecritures, setEcritures] = useState<EcritureComptableDto[]>([]);
  const [journals, setJournals] = useState<JournalComptableDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEcritureId, setSelectedEcritureId] = useState<string | null>(null);
  const [ecritureToDelete, setEcritureToDelete] = useState<EcritureComptableDto | null>(null);

  const [accounts, setAccounts] = useState<{ id: string; noCompte: string }[]>([]);

  const { onOpen, onClose: closeCompose } = useCompose();

  const fetchAndSetEcritures = useCallback(async () => {
    setIsLoading(true);
    try {
      const [entriesRes, journalsRes, accountsRes] = await Promise.all([
        AccountingEntriesService.getAll1(),
        AccountingJournalManagementService.getAllJournals(),
        AccountingPlanComptableService.getAllPlanComptables()
      ]);

      const fetchedJournals = Array.isArray(journalsRes.data) ? journalsRes.data : [];
      setJournals(fetchedJournals);

      const fetchedAccounts = Array.isArray(accountsRes.data) ? accountsRes.data : [];
      setAccounts(fetchedAccounts.map(a => ({ id: a.id!, noCompte: a.noCompte })));

      const fetchedEntries = Array.isArray(entriesRes.data) ? entriesRes.data : [];

      // Map journal labels
      const subbedEntries = fetchedEntries.map((entry: EcritureComptableDto) => ({
        ...entry,
        journalComptableLibelle: fetchedJournals.find((j: JournalComptableDto) => j.id === entry.journalComptableId)?.libelle || entry.journalComptableId
      }));

      setEcritures(subbedEntries);
    } catch (error) {
      console.error("Failed to fetch ecritures or journals:", error);
      setEcritures([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndSetEcritures();
  }, [fetchAndSetEcritures]);

  const handleSave = async (data: EcritureComptableDto) => {
    const isNew = !data.id;
    try {
      if (isNew) {
        await AccountingEntriesService.createEcriture(data);
      } else {
        // Manual PUT request since AccountingEntriesService is missing an update method
        await __request(OpenAPI, {
          method: 'PUT',
          url: `/api/accounting/entries/${data.id}`,
          body: data,
          mediaType: 'application/json',
        });
      }
      closeCompose();
      await fetchAndSetEcritures();
      toast.success(isNew ? "Écriture créée avec succès" : "Écriture mise à jour avec succès");
    } catch (error: any) {
      console.error("Failed to save ecriture:", error);
      toast.error(`Erreur lors de l'enregistrement: ${error.body?.message || error.message || "Erreur inconnue"}`);
    }
  };

  const handleValidate = async (id: string) => {
    try {
      await AccountingEntriesService.validateEcriture(id);
      await fetchAndSetEcritures();
      toast.success("Écriture validée avec succès");
    } catch (error: any) {
      console.error("Failed to validate ecriture:", error);
      toast.error(`Erreur lors de la validation: ${error.body?.message || error.message || "Erreur inconnue"}`);
    }
  };

  const confirmDelete = async () => {
    if (!ecritureToDelete?.id) return;
    try {
      await AccountingEntriesService.delete1(ecritureToDelete.id);
      await fetchAndSetEcritures();
      if (selectedEcritureId === ecritureToDelete.id) {
        setSelectedEcritureId(null);
      }
      toast.success("Écriture supprimée avec succès");
    } catch (error: any) {
      console.error("Failed to delete ecriture:", error);
      toast.error(`Erreur lors de la suppression: ${error.body?.message || error.message || "Erreur inconnue"}`);
    } finally {
      setEcritureToDelete(null);
    }
  };

  const handleEditEcriture = async (id: string) => {
    try {
      const response = await AccountingEntriesService.getById1(id);
      if (response.success && response.data) {
        handleOpenCompose(response.data);
      }
    } catch (e) {
      console.error("Failed to fetch full entry for editing", e);
    }
  };

  const handleViewEcriture = (id: string) => {
    router.push(`/accounting/entries/${id}`);
  };

  const handleOpenCompose = (ecriture: EcritureComptableDto | null = null) => {
    onOpen({
      title: ecriture ? "Modifier l'Écriture Comptable" : "Nouvelle Écriture Comptable",
      content: (
        <EcritureComptableDetailView
          onSave={handleSave}
          onDelete={() => {
            if (ecriture) setEcritureToDelete(ecriture);
            closeCompose();
          }}
          onBack={closeCompose}
          ecriture={ecriture}
        />
      ),
    });
  };

  return (
    <div className="min-h-screen flex flex-col p-4 bg-gray-100">
      <div className="w-full max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-1">Écritures Comptables</h2>
          <p className="text-sm text-gray-500">Gérez et consultez vos écritures comptables.</p>
        </div>

        <EcritureComptableListView
          ecritures={ecritures}
          isLoading={isLoading}
          onSelectEcriture={handleViewEcriture} // Row click -> Navigate to Details Page
          onEditEcriture={handleEditEcriture}   // Edit click -> Edit Mode
          onDeleteEcriture={setEcritureToDelete}
          onAddNew={() => handleOpenCompose()}
          onRefresh={fetchAndSetEcritures}
        />

        {ecritureToDelete && (
          <ConfirmationDialog
            isOpen={!!ecritureToDelete}
            onClose={() => setEcritureToDelete(null)}
            onConfirm={confirmDelete}
            title={`Supprimer ${ecritureToDelete.libelle} ?`}
            description="Cette action est irréversible. L'écriture sera supprimée si elle n'est pas validée."
          />
        )}
      </div>
    </div>
  );
}