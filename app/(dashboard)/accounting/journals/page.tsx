// app/(dashboard)/accounting/journals/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { JournalComptableDto } from '@/src/lib2/models/JournalComptableDto';
import { JournalManagementService } from '@/src/lib2/services/JournalManagementService';
import { JournalComptableListView } from '@/components/accounting/journal-comptable-list-view';
import { JournalComptableDetailView } from '@/components/accounting/journal-comptable-detail-view';
import { useCompose } from '@/hooks/use-compose-store';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { toast } from 'sonner';

export default function JournalComptablePage() {
  const [journals, setJournals] = useState<JournalComptableDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJournalId, setSelectedJournalId] = useState<string | null>(null);
  const [journalToDelete, setJournalToDelete] = useState<JournalComptableDto | null>(null);

  const { onOpen, onClose: closeCompose } = useCompose();

  const fetchAndSetJournals = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await JournalManagementService.getAllJournals();
      setJournals(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch journals:", error);
      setJournals([]);
      toast.error("Échec du chargement des journaux");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndSetJournals();
  }, [fetchAndSetJournals]);

  const handleSave = async (data: JournalComptableDto) => {
    const isNew = !data.id;
    try {
      if (isNew) {
        await JournalManagementService.createJournal(data);
        toast.success("Journal créé avec succès");
      } else {
        await JournalManagementService.updateJournal(data.id!, data);
        toast.success("Journal mis à jour avec succès");
      }
      closeCompose();
      setSelectedJournalId(null);
      await fetchAndSetJournals();
    } catch (error) {
      console.error("Failed to save journal:", error);
      toast.error("Erreur lors de l'enregistrement du journal");
    }
  };

  const confirmDelete = async () => {
    if (!journalToDelete?.id) return;
    try {
      await JournalManagementService.deleteJournal(journalToDelete.id);
      toast.success("Journal supprimé avec succès");
      await fetchAndSetJournals();
      if (selectedJournalId === journalToDelete.id) {
        setSelectedJournalId(null);
      }
    } catch (error) {
      console.error("Failed to delete journal:", error);
      toast.error("Erreur lors de la suppression du journal");
    } finally {
      setJournalToDelete(null);
    }
  };

  const handleOpenCompose = (journal?: JournalComptableDto) => {
    onOpen({
      title: journal ? "Modifier le Journal" : "Nouveau Journal",
      content: (
        <JournalComptableDetailView
          journal={journal || null}
          onSave={handleSave}
          onDelete={() => {
            if (journal) {
              setJournalToDelete(journal);
              closeCompose();
            }
          }}
          onBack={closeCompose}
        />
      ),
    });
  };

  const handleSelectJournal = (id: string) => {
    const journal = journals.find(j => j.id === id);
    if (journal) handleOpenCompose(journal);
  };

  return (
    <div className="min-h-screen flex flex-col p-4 bg-gray-100">
      <div className="w-full bg-white p-6 rounded-lg shadow-lg">
        <JournalComptableListView
          journals={journals}
          isLoading={isLoading}
          onSelectJournal={handleSelectJournal}
          onEditJournal={handleSelectJournal}
          onDeleteJournal={setJournalToDelete}
          onAddNew={() => handleOpenCompose()}
          onRefresh={fetchAndSetJournals}
        />
      </div>
      {journalToDelete && (
        <ConfirmationDialog
          isOpen={!!journalToDelete}
          onClose={() => setJournalToDelete(null)}
          onConfirm={confirmDelete}
          title={`Supprimer le journal ${journalToDelete.libelle} ?`}
          description="Cette action est irréversible. Toutes les données associées seront définitivement supprimées."
        />
      )}
    </div>
  );
}