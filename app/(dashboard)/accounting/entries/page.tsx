// app/(dashboard)/accounting/entries/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { EcritureComptableDto } from '@/src/lib2/models/EcritureComptableDto';
import { AccountingEntriesService } from '@/src/lib2/services/AccountingEntriesService';
import { EcritureComptableListView } from '@/components/accounting/ecriture-comptable-list-view';
import { EcritureComptableDetailView } from '@/components/accounting/ecriture-comptable-detail-view';
import { useCompose } from '@/hooks/use-compose-store';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

export default function EcritureComptablePage() {
  const [ecritures, setEcritures] = useState<EcritureComptableDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEcritureId, setSelectedEcritureId] = useState<string | null>(null);
  const [ecritureToDelete, setEcritureToDelete] = useState<EcritureComptableDto | null>(null);

  const { onOpen, onClose: closeCompose } = useCompose();

  const fetchAndSetEcritures = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await AccountingEntriesService.getAllEcritures();
      setEcritures(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch ecritures:", error);
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
        closeCompose();
      } else {
        await AccountingEntriesService.createEcriture(data); // Assuming create handles update or POST is used for both
      }
      await fetchAndSetEcritures();
    } catch (error) {
      console.error("Failed to save ecriture:", error);
    }
  };

  const handleValidate = async (id: string) => {
    try {
      await AccountingEntriesService.validateEcriture(id);
      await fetchAndSetEcritures();
    } catch (error) {
      console.error("Failed to validate ecriture:", error);
    }
  };

  const confirmDelete = async () => {
    if (!ecritureToDelete?.id) return;
    try {
      await AccountingEntriesService.deleteEcriture(ecritureToDelete.id);
      await fetchAndSetEcritures();
      if (selectedEcritureId === ecritureToDelete.id) {
        setSelectedEcritureId(null);
      }
    } catch (error) {
      console.error("Failed to delete ecriture:", error);
    } finally {
      setEcritureToDelete(null);
    }
  };

  const handleOpenCompose = () => {
    onOpen({
      title: "Nouvelle Écriture Comptable",
      content: <EcritureComptableDetailView onSave={handleSave} onDelete={() => { }} onValidate={() => { }} onBack={() => { }} ecriture={null} />,
    });
  };

  const handleBackToList = () => {
    setSelectedEcritureId(null);
  };

  const selectedEcriture = selectedEcritureId && Array.isArray(ecritures)
    ? ecritures.find(ec => ec.id === selectedEcritureId) || null
    : null;

  if (selectedEcritureId && selectedEcriture) {
    return (
      <EcritureComptableDetailView
        ecriture={selectedEcriture}
        onSave={handleSave}
        onDelete={() => setEcritureToDelete(selectedEcriture)}
        onValidate={() => handleValidate(selectedEcriture.id!)}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <>
      <EcritureComptableListView
        ecritures={ecritures}
        isLoading={isLoading}
        onSelectEcriture={setSelectedEcritureId}
        onEditEcriture={setSelectedEcritureId}
        onDeleteEcriture={setEcritureToDelete}
        onValidateEcriture={handleValidate}
        onAddNew={handleOpenCompose}
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
    </>
  );
}