// app/(dashboard)/accounting/positions-fiscales/page.tsx
"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { PositionFiscale, Taxe, OperationType } from '@/types/accounting';

// --- Vraies importations API (pour plus tard) ---
// import { getPositionsFiscales, createPositionFiscale, updatePositionFiscale, deletePositionFiscale } from '@/lib/api';
// import { getTaxes } from '@/lib/api'; 

import { PositionFiscaleListView } from '@/components/accounting/position-fiscale-list-view';
import { PositionFiscaleForm } from '@/components/accounting/settings/position-fiscale-form';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useCompose } from '@/hooks/use-compose-store';

// --- Données Mockées (Actuellement utilisées) ---
// 1. Les taxes (pour remplir la liste déroulante du formulaire)
const mockTaxes: Taxe[] = [
  { id: 't1', name: 'TVA Facturée (18%)', rate: 18, taxAccount: '4431', type: 'collectee', mode: 'ajoute' },
  { id: 't2', name: 'TVA Récupérable (18%)', rate: 18, taxAccount: '4452', type: 'deductible', mode: 'ajoute' },
  { id: 't3', name: 'TVA Exonérée (0% Export)', rate: 0, taxAccount: '4433', type: 'collectee', mode: 'ajoute' },
];

// 2. Les positions fiscales (basées sur la nouvelle structure)
const mockPositions: PositionFiscale[] = [
  { id: 'pf1', name: 'Régime normal (Ventes)', typeOperation: 'vente', taxeLieeId: 't1', description: 'Ventes locales taxées' },
  { id: 'pf2', name: 'Régime normal (Achats)', typeOperation: 'achat', taxeLieeId: 't2', description: 'Achats locaux taxés' },
  { id: 'pf3', name: 'Exportations', typeOperation: 'exportation', taxeLieeId: 't3', description: 'Ventes à l\'export 0%' },
];
// -------------------------------------

export default function PositionsFiscalesPage() {
  // --- États (configurés pour les mocks) ---
  const [positions, setPositions] = useState<PositionFiscale[]>(mockPositions);
  const [taxes, setTaxes] = useState<Taxe[]>(mockTaxes); // État pour les taxes
  const [isLoading, setIsLoading] = useState(false); 
  
  // --- Vrais états (à décommenter plus tard) ---
  // const [positions, setPositions] = useState<PositionFiscale[]>([]);
  // const [taxes, setTaxes] = useState<Taxe[]>([]);
  // const [isLoading, setIsLoading] = useState(true);
  
  const [positionToDelete, setPositionToDelete] = useState<PositionFiscale | null>(null);

  const { onOpen, onClose: closeCompose } = useCompose();

  // --- useEffect (commenté pour utiliser les mocks) ---
  // useEffect(() => {
  //   fetchAndSetData();
  // }, []);

  // --- Fonction de chargement (simulée pour les mocks) ---
  const fetchAndSetData = useCallback(async () => {
    console.log("Simulation du rafraîchissement");
    setIsLoading(true);
    setTimeout(() => {
      setPositions(mockPositions); 
      setTaxes(mockTaxes);
      setIsLoading(false);
    }, 500);
  }, []);

  /* // --- Vraie fonction de chargement API (pour plus tard) ---
  const fetchAndSetData = useCallback(async () => {
    setIsLoading(true);
    try {
      // const taxesRes = await getTaxes();
      // const positionsRes = await getPositionsFiscales();
      // setTaxes(Array.isArray(taxesRes.data) ? taxesRes.data : []);
      // setPositions(Array.isArray(positionsRes.data) ? positionsRes.data : []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  */

  // --- Fonction de sauvegarde (simulée pour les mocks) ---
  const handleSave = async (data: PositionFiscale) => {
    const isNew = !data.id;
    if (isNew) {
      const created = { ...data, id: Math.random().toString() };
      setPositions((prev) => [...prev, created]);
    } else {
      setPositions((prev) => prev.map(p => p.id === data.id ? data : p));
    }
    closeCompose();
  };

  /*
  // --- Vraie fonction de sauvegarde API (pour plus tard) ---
  const handleSave = async (data: PositionFiscale) => {
    const isNew = !data.id;
    try {
      if (isNew) {
        // await createPositionFiscale(data);
      } else {
        // await updatePositionFiscale(data.id!, data);
      }
      await fetchAndSetData(); 
      closeCompose();
    } catch (error) {
      console.error("Failed to save position:", error);
    }
  };
  */

  // --- Fonction de suppression (simulée pour les mocks) ---
  const confirmDelete = async () => {
    if (!positionToDelete?.id) return;
    setPositions((prev) => prev.filter(p => p.id !== positionToDelete.id));
    setPositionToDelete(null);
  };

  /*
  // --- Vraie fonction de suppression API (pour plus tard) ---
  const confirmDelete = async () => {
    if (!positionToDelete?.id) return;
    try {
      // await deletePositionFiscale(positionToDelete.id);
      await fetchAndSetData(); 
    } catch (error) {
      console.error("Failed to delete position:", error);
    } finally {
      setPositionToDelete(null);
    }
  };
  */

  // --- Fonctions pour ouvrir la modale ---
  const handleAddNew = () => {
    onOpen({
      title: "Nouvelle Position Fiscale",
      content: <PositionFiscaleForm
        initialData={{}}
        allTaxes={taxes} // <-- Passe les taxes au formulaire
        onSave={handleSave}
        onCancel={closeCompose}
      />
    });
  };

  const handleEdit = (id: string) => {
    const positionToEdit = positions.find(p => p.id === id);
    if (!positionToEdit) return;

    onOpen({
      title: "Modifier la Position Fiscale",
      content: <PositionFiscaleForm
        initialData={positionToEdit}
        allTaxes={taxes} // <-- Passe les taxes au formulaire
        onSave={handleSave}
        onCancel={closeCompose}
      />
    });
  };

  // --- Rendu ---
  return (
    <div className="max-w-4xl mx-auto p-4">
      <PositionFiscaleListView
        positions={positions}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={setPositionToDelete}
        onAddNew={handleAddNew}
        onRefresh={fetchAndSetData}
      />
      {positionToDelete && (
        <ConfirmationDialog
          isOpen={!!positionToDelete}
          onClose={() => setPositionToDelete(null)}
          onConfirm={confirmDelete}
          title={`Supprimer ${positionToDelete.name} ?`}
          description="Cette action est irréversible."
        />
      )}
    </div>
  );
}