"use client";

import React, { useState, useCallback, useEffect } from 'react'; // useEffect est importé
import { Devise } from '@/types/accounting';

// --- Vraies importations API (pour plus tard) ---
// import { getDevises, createDevise, updateDevise, deleteDevise } from '@/lib/api'; 

import { DeviseListView } from '@/components/accounting/devise-list-view';
import { DeviseForm } from '@/components/accounting/settings/devise-form';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useCompose } from '@/hooks/use-compose-store'; // <-- 1. IMPORTATION AJOUTÉE

// --- Données Mockées (Actuellement utilisées) ---
const mockDevises: Devise[] = [
  { id: '1', name: 'Franc CFA (BEAC)', code: 'XAF', symbol: 'FCFA', rate: 1.0 },
  { id: '2', name: 'Euro', code: 'EUR', symbol: '€', rate: 655.957 },
  { id: '3', name: 'Dollar Américain', code: 'USD', symbol: '$', rate: 610.50 },
];
// -------------------------------------

export default function DevisesPage() {
  // --- États (configurés pour les mocks) ---
  const [devises, setDevises] = useState<Devise[]>(mockDevises); 
  const [isLoading, setIsLoading] = useState(false); 
  
  // --- Vrais états (à décommenter plus tard) ---
  // const [devises, setDevises] = useState<Devise[]>([]);
  // const [isLoading, setIsLoading] = useState(true);

  const [deviseToDelete, setDeviseToDelete] = useState<Devise | null>(null);

  // 2. RÉCUPÉRER LES FONCTIONS DE LA MODALE
  const { onOpen, onClose: closeCompose } = useCompose();

  // --- useEffect (commenté pour utiliser les mocks) ---
  // useEffect(() => {
  //   fetchAndSetDevises();
  // }, [fetchAndSetDevises]);

  // --- Fonction de chargement (simulée pour les mocks) ---
  const fetchAndSetDevises = useCallback(async () => {
    console.log("Simulation du rafraîchissement");
    setIsLoading(true);
    setTimeout(() => {
      setDevises(mockDevises); // Remet les mocks
      setIsLoading(false);
    }, 500);
  }, []);

  /* // --- Vraie fonction de chargement API (pour plus tard) ---
  const fetchAndSetDevises = useCallback(async () => {
    setIsLoading(true);
    try {
      // const response = await getDevises();
      // setDevises(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch devises:", error);
      setDevises([]);
    } finally {
      setIsLoading(false);
    }
  }, []);
  */

  // --- Fonction de sauvegarde (simulée pour les mocks) ---
  const handleSave = async (data: Devise) => {
    data.rate = parseFloat(data.rate as any); 
    const isNew = !data.id;
    if (isNew) {
      const created = { ...data, id: Math.random().toString() };
      setDevises((prev) => [...prev, created]);
    } else {
      setDevises((prev) => prev.map(d => d.id === data.id ? data : d));
    }
    
    closeCompose(); // <-- 3. FERMER LA MODALE
  };

  /*
  // --- Vraie fonction de sauvegarde API (pour plus tard) ---
  const handleSave = async (data: Devise) => {
    data.rate = parseFloat(data.rate as any); 
    const isNew = !data.id;
    try {
      if (isNew) {
        // await createDevise(data);
      } else {
        // await updateDevise(data.id!, data);
      }
      await fetchAndSetDevises(); 
      closeCompose(); // Ferme la modale
    } catch (error) {
      console.error("Failed to save devise:", error);
    }
  };
  */

  // --- Fonction de suppression (simulée pour les mocks) ---
  const confirmDelete = async () => {
    if (!deviseToDelete?.id) return;
    setDevises((prev) => prev.filter(d => d.id !== deviseToDelete.id));
    setDeviseToDelete(null);
  };

  /*
  // --- Vraie fonction de suppression API (pour plus tard) ---
  const confirmDelete = async () => {
    if (!deviseToDelete?.id) return;
    try {
      // await deleteDevise(deviseToDelete.id);
      await fetchAndSetDevises(); 
    } catch (error) {
      console.error("Failed to delete devise:", error);
    } finally {
      setDeviseToDelete(null);
    }
  };
  */

  // --- 4. NOUVELLES FONCTIONS POUR OUVRIR LA MODALE ---

  // Ouvre la modale pour une NOUVELLE devise
  const handleAddNew = () => {
    onOpen({
      title: "Nouvelle Devise",
      content: <DeviseForm
        initialData={{ rate: 1.0 }} // Données initiales
        onSave={handleSave}
        onCancel={closeCompose}
      />
    });
  };

  // Ouvre la modale pour MODIFIER une devise existante
  const handleEdit = (id: string) => {
    const deviseToEdit = devises.find(d => d.id === id);
    if (!deviseToEdit) return;

    onOpen({
      title: "Modifier la Devise",
      content: <DeviseForm
        initialData={deviseToEdit} // Pré-remplit le formulaire
        onSave={handleSave}
        onCancel={closeCompose}
      />
    });
  };

  // --- 5. LOGIQUE DE RENDU (Simplifiée) ---
  
  // On supprime le bloc 'if (selectedDeviseId) { ... }'

  return (
    <div className="max-w-4xl mx-auto p-4">
      <DeviseListView
        devises={devises}
        isLoading={isLoading}
        onEdit={handleEdit} // <-- 6. Connecte la nouvelle fonction
        onDelete={setDeviseToDelete}
        onAddNew={handleAddNew} // <-- 7. Connecte la nouvelle fonction
        onRefresh={fetchAndSetDevises}
      />
      {deviseToDelete && (
        <ConfirmationDialog
          isOpen={!!deviseToDelete}
          onClose={() => setDeviseToDelete(null)}
          onConfirm={confirmDelete}
          title={`Supprimer ${deviseToDelete.name} ?`}
          description="Cette action est irréversible."
        />
      )}
    </div>
  );
}