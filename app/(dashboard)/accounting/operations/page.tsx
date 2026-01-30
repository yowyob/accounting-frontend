// app/(dashboard)/accounting/operations/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { OperationComptableDto } from '@/src/lib2/models/OperationComptableDto';
import { AccountingOperationsService } from '@/src/lib2/services/AccountingOperationsService';
import { OperationComptableListView } from '@/components/accounting/operation-comptable-list-view';
import { OperationForm } from '@/components/accounting/settings/operation-form';
import { useCompose } from '@/hooks/use-compose-store';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { toast } from 'sonner';

export default function OperationComptablePage() {
  const [operations, setOperations] = useState<OperationComptableDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOperationId, setSelectedOperationId] = useState<string | null>(null);
  const [operationToDelete, setOperationToDelete] = useState<OperationComptableDto | null>(null);

  const { onOpen, onClose: closeCompose } = useCompose();

  const fetchAndSetOperations = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await AccountingOperationsService.getAllOperationsComptables();
      setOperations(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch operations:", error);
      setOperations([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndSetOperations();
  }, [fetchAndSetOperations]);
  const handleSave = async (data: OperationComptableDto) => {
    const isNew = !data.id;
    console.log("Operation Request Body:", JSON.stringify(data, null, 2));
    try {
      if (isNew) {
        await AccountingOperationsService.createOperationComptable(data);
        closeCompose();
      } else {
        await AccountingOperationsService.updateOperationComptable(data.id!, data);
      }
      await fetchAndSetOperations();
      toast.success(isNew ? "Opération créée avec succès" : "Opération mise à jour avec succès");
    } catch (error: any) {
      console.error("Failed to save operation:", error);
      console.error("Error details:", {
        message: error.message,
        body: error.body,
        status: error.status,
        statusText: error.statusText,
        url: error.url
      });
      console.error("Full error body:", JSON.stringify(error.body, null, 2));
      toast.error(`Erreur: ${error.body?.message || error.message || "Validation échouée"}`);
    }
  };

  const confirmDelete = async () => {
    if (!operationToDelete?.id) return;
    try {
      await AccountingOperationsService.deleteOperationComptable(operationToDelete.id);
      await fetchAndSetOperations();
      if (selectedOperationId === operationToDelete.id) {
        setSelectedOperationId(null);
      }
      toast.success("Opération supprimée avec succès");
    } catch (error: any) {
      console.error("Failed to delete operation:", error);
      toast.error(`Erreur lors de la suppression: ${error.body?.message || error.message || "Erreur inconnue"}`);
    } finally {
      setOperationToDelete(null);
    }
  };

  const handleOpenCompose = (operation?: OperationComptableDto) => {
    onOpen({
      title: operation ? "Modifier l'Opération Comptable" : "Nouvelle Opération Comptable",
      content: (
        <OperationForm
          onSave={handleSave}
          onCancel={closeCompose}
          initialData={operation || null}
        />
      ),
    });
  };

  const selectedOperation = selectedOperationId && Array.isArray(operations)
    ? operations.find(op => op.id === selectedOperationId) || null
    : null;

  return (
    <div className="min-h-screen flex flex-col p-4 bg-gray-100">
      <div className="w-full bg-white p-6 rounded-lg shadow-lg">
        <OperationComptableListView
          operations={operations}
          isLoading={isLoading}
          onSelectOperation={(id) => handleOpenCompose(operations.find(op => op.id === id))}
          onEditOperation={(id) => handleOpenCompose(operations.find(op => op.id === id))}
          onDeleteOperation={setOperationToDelete}
          onAddNew={() => handleOpenCompose()}
          onRefresh={fetchAndSetOperations}
        />
      </div>
      {operationToDelete && (
        <ConfirmationDialog
          isOpen={!!operationToDelete}
          onClose={() => setOperationToDelete(null)}
          onConfirm={confirmDelete}
          title={`Supprimer ${operationToDelete.typeOperation} ?`}
          description="Cette action est irréversible. Toutes les données associées à cette opération seront perdues."
        />
      )}
    </div>
  );
} 