"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { TaxeDto } from '@/src/lib2/models/TaxeDto';
import { TaxManagementService } from '@/src/lib2/services/TaxManagementService';
import { TaxeListView } from '@/components/accounting/taxe-list-view';
import { TaxeForm } from '@/components/accounting/settings/taxes-form';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useCompose } from '@/hooks/use-compose-store';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export default function TaxesPage() {
  const [taxes, setTaxes] = useState<TaxeDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [taxeToDelete, setTaxeToDelete] = useState<TaxeDto | null>(null);
  const { onOpen, onClose: closeCompose } = useCompose();

  const fetchTaxes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await TaxManagementService.getAllTaxes();
      if (response.success && response.data) {
        setTaxes(response.data);
      } else {
        toast.error(response.message || "Erreur lors du chargement des taxes");
      }
    } catch (error) {
      console.error("Error fetching taxes:", error);
      toast.error("Une erreur est survenue lors de la récupération des taxes");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTaxes();
  }, [fetchTaxes]);

  const handleSave = async (data: TaxeDto) => {
    try {
      let response;
      if (data.id) {
        response = await TaxManagementService.updateTaxe(data.id, data);
      } else {
        response = await TaxManagementService.createTaxe(data);
      }

      if (response.success) {
        toast.success(data.id ? "Taxe mise à jour avec succès" : "Taxe créée avec succès");
        fetchTaxes();
        closeCompose();
      } else {
        toast.error(response.message || "Erreur lors de l'enregistrement");
      }
    } catch (error) {
      console.error("Error saving tax:", error);
      toast.error("Une erreur est survenue lors de l'enregistrement");
    }
  };

  const confirmDelete = async () => {
    if (!taxeToDelete?.id) return;
    try {
      const response = await TaxManagementService.deleteTaxe(taxeToDelete.id);
      if (response.success) {
        toast.success("Taxe supprimée avec succès");
        fetchTaxes();
        setTaxeToDelete(null);
      } else {
        toast.error(response.message || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Error deleting tax:", error);
      toast.error("Une erreur est survenue lors de la suppression");
    }
  };

  const handleAddNew = () => {
    onOpen({
      title: "Nouvelle Taxe",
      content: <TaxeForm
        initialData={null}
        onSave={handleSave}
        onCancel={closeCompose}
      />
    });
  };

  const handleEdit = (id: string) => {
    const taxeToEdit = taxes.find(t => t.id === id);
    if (!taxeToEdit) return;

    onOpen({
      title: "Modifier la Taxe",
      content: <TaxeForm
        initialData={taxeToEdit}
        onSave={handleSave}
        onCancel={closeCompose}
      />
    });
  };

  const handleDeleteClick = (taxe: TaxeDto) => {
    setTaxeToDelete(taxe);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 border-b-4 border-blue-600 pb-2 inline-block">Gestion des Taxes</h1>
          <p className="text-muted-foreground mt-2">
            Configurez et gérez les différentes taxes applicables dans votre comptabilité
          </p>
        </div>
      </div>

      <Separator className="bg-gray-200" />

      <TaxeListView
        taxes={taxes}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onAddNew={handleAddNew}
        onRefresh={fetchTaxes}
      />

      {taxeToDelete && (
        <ConfirmationDialog
          isOpen={!!taxeToDelete}
          onClose={() => setTaxeToDelete(null)}
          onConfirm={confirmDelete}
          title={`Supprimer la taxe "${taxeToDelete.libelle}" ?`}
          description={`Code: ${taxeToDelete.code} | Taux: ${taxeToDelete.taux}%

Cette action est irréversible. Vérifiez qu'aucune transaction n'utilise cette taxe avant suppression.`}
        />
      )}
    </div>
  );
}