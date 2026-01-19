// app/(dashboard)/accounting/modes-paiement/page.tsx
"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { ModePaiement } from '@/types/accounting';

// --- Vraies importations API (pour plus tard) ---
// import { getModesPaiement, createModePaiement, updateModePaiement, deleteModePaiement } from '@/lib/api'; 

import { ModePaiementListView } from '@/components/accounting/mode-paiement-list-view';
import { ModePaiementForm } from '@/components/accounting/settings/mode-paiement-form';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useCompose } from '@/hooks/use-compose-store';

// --- Données Mockées (Actuellement utilisées) ---
const mockModes: ModePaiement[] = [
  { id: '1', name: 'Compte UBA', type: 'banque', journalId: '521100' },
  { id: '2', name: 'Caisse Principale', type: 'especes', journalId: '571100' },
  { id: '3', name: 'Orange Money', type: 'mobile_money', journalId: '573100' },
];
// -------------------------------------

export default function ModesPaiementPage() {
  // --- États (configurés pour les mocks) ---
  const [modes, setModes] = useState<ModePaiement[]>(mockModes); 
  const [isLoading, setIsLoading] = useState(false); 
  
  // --- Vrais états (à décommenter plus tard) ---
  // const [modes, setModes] = useState<ModePaiement[]>([]);
  // const [isLoading, setIsLoading] = useState(true);
  
  const [modeToDelete, setModeToDelete] = useState<ModePaiement | null>(null);

  const { onOpen, onClose: closeCompose } = useCompose();

  // --- useEffect (commenté pour utiliser les mocks) ---
  // useEffect(() => {
  //   fetchAndSetModes();
  // }, []);

  // --- Fonction de chargement (simulée pour les mocks) ---
  const fetchAndSetModes = useCallback(async () => {
    console.log("Simulation du rafraîchissement");
    setIsLoading(true);
    setTimeout(() => {
      setModes(mockModes); 
      setIsLoading(false);
    }, 500);
  }, []);

  /* // --- Vraie fonction de chargement API (pour plus tard) ---
  const fetchAndSetModes = useCallback(async () => {
    setIsLoading(true);
    try {
      // const response = await getModesPaiement();
      // setModes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch modes:", error);
      setModes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);
  */

  // --- Fonction de sauvegarde (simulée pour les mocks) ---
  const handleSave = async (data: ModePaiement) => {
    const isNew = !data.id;
    if (isNew) {
      const created = { ...data, id: Math.random().toString() };
      setModes((prev) => [...prev, created]);
    } else {
      setModes((prev) => prev.map(m => m.id === data.id ? data : m));
    }
    closeCompose();
  };

  /*
  // --- Vraie fonction de sauvegarde API (pour plus tard) ---
  const handleSave = async (data: ModePaiement) => {
    const isNew = !data.id;
    try {
      if (isNew) {
        // await createModePaiement(data);
      } else {
        // await updateModePaiement(data.id!, data);
      }
      await fetchAndSetModes(); 
      closeCompose();
    } catch (error) {
      console.error("Failed to save mode:", error);
    }
  };
  */

  // --- Fonction de suppression (simulée pour les mocks) ---
  const confirmDelete = async () => {
    if (!modeToDelete?.id) return;
    setModes((prev) => prev.filter(m => m.id !== modeToDelete.id));
    setModeToDelete(null);
  };

  /*
  // --- Vraie fonction de suppression API (pour plus tard) ---
  const confirmDelete = async () => {
    if (!modeToDelete?.id) return;
    try {
      // await deleteModePaiement(modeToDelete.id);
      await fetchAndSetModes(); 
    } catch (error) {
      console.error("Failed to delete mode:", error);
    } finally {
      setModeToDelete(null);
    }
  };
  */

  // --- Fonctions pour ouvrir la modale ---
  const handleAddNew = () => {
    onOpen({
      title: "Nouveau Mode de Paiement",
      content: <ModePaiementForm
        initialData={{}}
        onSave={handleSave}
        onCancel={closeCompose}
      />
    });
  };

  const handleEdit = (id: string) => {
    const modeToEdit = modes.find(m => m.id === id);
    if (!modeToEdit) return;

    onOpen({
      title: "Modifier le Mode de Paiement",
      content: <ModePaiementForm
        initialData={modeToEdit}
        onSave={handleSave}
        onCancel={closeCompose}
      />
    });
  };

  // --- Rendu ---
  return (
    <div className="max-w-4xl mx-auto p-4">
      <ModePaiementListView
        modes={modes}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={setModeToDelete}
        onAddNew={handleAddNew}
        onRefresh={fetchAndSetModes}
      />
      {modeToDelete && (
        <ConfirmationDialog
          isOpen={!!modeToDelete}
          onClose={() => setModeToDelete(null)}
          onConfirm={confirmDelete}
          title={`Supprimer ${modeToDelete.name} ?`}
          description="Cette action est irréversible."
        />
      )}
    </div>
  );
}