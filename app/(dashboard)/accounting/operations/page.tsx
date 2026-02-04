"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { OperationComptableDto } from '@/src/lib2/models/OperationComptableDto';
import { AccountingOperationsService } from '@/src/lib2/services/AccountingOperationsService';
import { OperationComptableListView } from '@/components/accounting/operation-comptable-list-view';
import { OperationForm } from '@/components/accounting/settings/operation-form';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useCompose } from '@/hooks/use-compose-store';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function OperationComptablePage() {
  const [operations, setOperations] = useState<OperationComptableDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOperationId, setSelectedOperationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { onOpen, onClose: closeCompose } = useCompose();

  const fetchOperations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AccountingOperationsService.getAllOperationsComptables();
      if (response && response.data) {
        setOperations(response.data);
      } else {
        setOperations([]);
      }
    } catch (err: any) {
      let reason = "Impossible de charger les opérations.";
      if (err.body?.message) reason = err.body.message;
      else if (err.message) reason = err.message;

      console.error("Failed to fetch operations:", err);
      toast.error('Erreur lors du chargement', {
        description: reason,
        className: "bg-red-50 border-red-200 text-red-800"
      });
      setError('Impossible de charger les opérations comptables. Veuillez vérifier votre connexion internet.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOperations();
  }, [fetchOperations]);

  const handleSave = async (data: OperationComptableDto, journalIds: string[]) => {
    try {
      const isNew = !data.id;
      if (isNew) {
        const creationPromises = journalIds.map(journalId => {
          const operationForJournal: OperationComptableDto = {
            ...data,
            journalComptableId: journalId,
            contreparties: data.contreparties?.map(cp => ({
              ...cp,
              journalComptableId: cp.journalComptableId || journalId
            }))
          };
          return AccountingOperationsService.createOperationComptable(operationForJournal);
        });
        await Promise.all(creationPromises);
        toast.success(`${journalIds.length} opération(s) créée(s) avec succès`);
      } else {
        const updatedData: OperationComptableDto = {
          ...data,
          journalComptableId: journalIds[0] || data.journalComptableId,
          contreparties: data.contreparties?.map(cp => ({
            ...cp,
            journalComptableId: cp.journalComptableId || journalIds[0] || data.journalComptableId
          }))
        };
        await AccountingOperationsService.updateOperationComptable(data.id!, updatedData);
        toast.success('Opération mise à jour avec succès');
      }
      await fetchOperations();
      setSelectedOperationId(null);
    } catch (err: any) {
      let reason = "Une erreur inattendue est survenue.";
      if (err.body?.message) reason = err.body.message;
      else if (err.message) reason = err.message;

      toast.error("Erreur lors de l'enregistrement", {
        description: reason,
        className: "bg-red-50 border-red-200 text-red-800"
      });
    }
  };

  const confirmDelete = (operation: OperationComptableDto) => {
    if (operation.id) setDeleteId(operation.id);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await AccountingOperationsService.deleteOperationComptable(deleteId);
      toast.success('Opération supprimée');
      await fetchOperations();
      if (selectedOperationId === deleteId) {
        setSelectedOperationId(null);
      }
    } catch (err: any) {
      let reason = "Impossible de supprimer cette opération.";
      if (err.body?.message) reason = err.body.message;
      else if (err.message) reason = err.message;

      toast.error("Erreur de suppression", {
        description: reason,
        className: "bg-red-50 border-red-200 text-red-800"
      });
    } finally {
      setDeleteId(null);
    }
  };

  const handleSelectOperation = (id: string) => {
    const operation = operations.find(o => o.id === id);
    if (operation) handleOpenCompose(operation);
  };

  const handleEditOperation = (id: string) => {
    const operation = operations.find(o => o.id === id);
    if (operation) handleOpenCompose(operation);
  };

  const handleAddNew = () => {
    handleOpenCompose(null);
  };

  const handleOpenCompose = (operation: OperationComptableDto | null = null) => {
    onOpen({
      title: operation ? "Modifier le Modèle d'Opération" : "Nouveau Modèle d'Opération",
      content: (
        <OperationForm
          initialData={operation}
          onSave={async (data, journalIds) => {
            await handleSave(data, journalIds);
            closeCompose();
          }}
          onCancel={closeCompose}
        />
      )
    });
  };

  const selectedOperation = selectedOperationId === 'new' ? null : operations.find(o => o.id === selectedOperationId);


  return (
    <div className="min-h-screen flex flex-col p-4 bg-gray-100">
      <div className="w-full max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-1">Opérations Comptables</h2>
          <p className="text-sm text-gray-500">Gérez les modèles d'opérations courantes (Ventes, Achats, Salaires).</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <OperationComptableListView
          operations={operations}
          isLoading={isLoading}
          onSelectOperation={handleSelectOperation}
          onEditOperation={handleEditOperation}
          onDeleteOperation={confirmDelete}
          onAddNew={handleAddNew}
          onRefresh={fetchOperations}
          selectedId={selectedOperationId || undefined}
        />

        <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Cela supprimera définitivement le modèle d'opération.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}