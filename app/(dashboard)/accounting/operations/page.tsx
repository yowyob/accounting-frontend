// app/(dashboard)/accounting/operations/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { OperationComptable } from '@/types/accounting';
import { getOperationsComptables, createOperationComptable, updateOperationComptable, deleteOperationComptable } from '@/lib/api';
import { OperationComptableListView } from '@/components/accounting/operation-comptable-list-view';
import { OperationForm } from '@/components/accounting/settings/operation-form';
import { useCompose } from '@/hooks/use-compose-store';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

const mockOperations: OperationComptable[] = [
  { id: '1', typeOperation: 'Quand on vend à un client', modeReglement: 'au comptant par espèces [CCE]', comptePrincipal: '571100', sensPrincipal: 'débite', typeMontant: 'TTC' },
  { id: '2', typeOperation: 'Quand on vend à un client', modeReglement: 'par credit [CR]', comptePrincipal: 'N5', sensPrincipal: 'débite', typeMontant: 'TTC' },
  { id: '3', typeOperation: 'Quand on vend à un client', modeReglement: 'au comptant par chèque bancaire [CCB]', comptePrincipal: '521100', sensPrincipal: 'débite', typeMontant: 'TTC' },
  { id: '4', typeOperation: 'Quand on achète à un fournisseur', modeReglement: 'au comptant par espèces [CCE]', comptePrincipal: '571100', sensPrincipal: 'credite', typeMontant: 'TTC' },
];

export default function OperationComptablePage() {
  const [operations, setOperations] = useState<OperationComptable[]>(mockOperations);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOperationId, setSelectedOperationId] = useState<string | null>(null);
  const [operationToDelete, setOperationToDelete] = useState<OperationComptable | null>(null);
  
  const { onOpen, onClose: closeCompose } = useCompose();

  const fetchAndSetOperations = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getOperationsComptables();
      setOperations(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch operations:", error);
      setOperations([]);
    } finally {
      setIsLoading(false);
    }
  }, []);
  /*
  useEffect(() => {
    //fetchAndSetOperations();
  }, [fetchAndSetOperations]);
  */
  const handleSave = async (data: OperationComptable) => {
    const isNew = !data.id;
    // ---- MODIFICATION POUR LE TEST ----
    if (isNew) {
      // Simule une création avec un ID aléatoire
      const created = { ...data, id: Math.random().toString() };
      setOperations((prev) => [...prev, created]);
      closeCompose();
    } else {
      // Simule une mise à jour
      setOperations((prev) => prev.map(op => op.id === data.id ? data : op));
      // Vous devez aussi fermer le formulaire d'édition ici
      // (closeCompose() ou setSelectedOperationId(null) selon votre logique)
      closeCompose(); 
    }
    //try {
      //if (isNew) {
        //const created = await createOperationComptable(data);
        //setOperations((prev) => [...prev, created]);
        //closeCompose();
      //} else {
        //const updated = await updateOperationComptable(data.id!, data);
        //setOperations((prev) => prev.map(op => op.id === updated.id ? updated : op));
      //}
      //await fetchAndSetOperations();
    //} catch (error) {
      //console.error("Failed to save operation:", error);
    //}
  };

  const confirmDelete = async () => {
    // 1. Sécurité : toujours bien
    if (!operationToDelete?.id) return;

    // ---- DÉBUT DE LA MODIFICATION POUR LE TEST ----
    // Puisque nous sommes en "mock data", nous n'appelons pas la vraie API.
    // Nous simulons la suppression en mettant à jour la liste locale (setOperations).
    
    // 2. Met à jour la liste LOCALE
    setOperations((prev) => prev.filter(op => op.id !== operationToDelete.id));
    
    // 3. Nettoyage
    if (selectedOperationId === operationToDelete.id) {
      setSelectedOperationId(null);
    }

    // 4. Ferme le pop-up
    setOperationToDelete(null);
    if (!operationToDelete?.id) return;
    //try {
      // 1. Supprime l'opération dans la base de données
      //await deleteOperationComptable(operationToDelete.id);
      
      // 2. Met à jour la liste en redemandant TOUT au serveur
      // C'est plus fiable que le filtre local.
      //await fetchAndSetOperations(); 
      
      // 3. Nettoyage
      //if (selectedOperationId === operationToDelete.id) {
        //setSelectedOperationId(null);
      //}
    //} catch (error) {
      //console.error("Failed to delete operation:", error);
    //} finally {
      // 4. Ferme le pop-up
      //setOperationToDelete(null);
    //}
  };

  const handleOpenCompose = () => {
    onOpen({
      title: "Nouvelle Opération Comptable",
      content: <OperationForm onSave={handleSave} onCancel={() => closeCompose} initialData={null} />,
    });
  };



  const selectedOperation = selectedOperationId && Array.isArray(operations)
    ? operations.find(op => op.id === selectedOperationId) || null
    : null;

  if (selectedOperationId && selectedOperation) {
    return (
      <OperationForm
        initialData={selectedOperation}
        onSave={handleSave}
        // onDelete={() => setOperationToDelete(selectedOperation)}
        onCancel={() => setSelectedOperationId(null)} // <-- VOICI LA CORRECTION
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <OperationComptableListView
        operations={operations}
        isLoading={isLoading}
        onSelectOperation={setSelectedOperationId}
        onEditOperation={setSelectedOperationId}
        onDeleteOperation={setOperationToDelete}
        onAddNew={handleOpenCompose}
        onRefresh={fetchAndSetOperations}
      />
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