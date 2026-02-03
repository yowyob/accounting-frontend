"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { PlanComptableDto } from '@/src/lib2/models/PlanComptableDto';
import { AccountingPlanComptableService } from '@/src/lib2/services/AccountingPlanComptableService';
import { AccountListView } from '@/components/accounting/account-list-view';
import { AccountDetailView } from '@/components/accounting/account-detail-view'; // Assuming this exists or using Form if not
import { AccountingForm } from '@/components/accounting/account-form'; // Fallback if DetailView is read-only or we want to use Form
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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

export default function ChartOfAccountsPage() {
  const [accounts, setAccounts] = useState<PlanComptableDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AccountingPlanComptableService.getAllPlanComptables();
      if (response && response.data) {
        setAccounts(response.data);
      } else {
        setAccounts([]);
      }
    } catch (err: any) {
      let reason = "Impossible de charger le plan comptable.";
      if (err.body?.message) reason = err.body.message;
      else if (err.message) reason = err.message;

      console.error("Failed to fetch accounts:", err);
      toast.error('Erreur lors du chargement', {
        description: reason,
        className: "bg-red-50 border-red-200 text-red-800"
      });
      setError('Impossible de charger les comptes. Veuillez vérifier votre connexion internet.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleSave = async (data: PlanComptableDto) => {
    try {
      const isNew = !data.id;
      if (isNew) {
        await AccountingPlanComptableService.createPlanComptable(data);
        toast.success('Compte créé avec succès');
      } else {
        await AccountingPlanComptableService.updatePlanComptable(data.id!, data);
        toast.success('Compte mis à jour avec succès');
      }
      await fetchAccounts();
      setSelectedAccountId(null);
      setIsEditing(false);
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

  const confirmDelete = (account: PlanComptableDto) => {
    if (account.id) setDeleteId(account.id);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await AccountingPlanComptableService.deactivatePlanComptable(deleteId);
      toast.success('Compte désactivé/supprimé');
      await fetchAccounts();
      if (selectedAccountId === deleteId) {
        setSelectedAccountId(null);
        setIsEditing(false);
      }
    } catch (err: any) {
      let reason = "Impossible de supprimer ce compte.";
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

  const handleSelectAccount = (id: string) => {
    setSelectedAccountId(id);
    setIsEditing(false);
  };

  const handleEditAccount = (id: string) => {
    setSelectedAccountId(id);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setSelectedAccountId('new');
    setIsEditing(true);
  };

  const handleBack = () => {
    setSelectedAccountId(null);
    setIsEditing(false);
  };

  const selectedAccount = selectedAccountId === 'new' ? null : accounts.find(a => a.id === selectedAccountId);

  if (selectedAccountId) {
    // Note: Assuming AccountingForm is the editor and AccountDetailView is the viewer.
    // If AccountDetailView handles both (like CompteComptableDetailView), use that.
    // Let's use AccountingForm for editing/new and AccountDetailView for view?
    // Actually, to match AccountsPage perfectly, it's usually `DetailView` that handles both states via `isEditing` prop.
    // But here we see `AccountForm` separate in original file.
    // Let's check if AccountDetailView supports edit. The `view_file` will tell us. 
    // For now, I'll Assume WRAPPING logic similar to others:

    return (
      <div className="min-h-screen p-4 bg-gray-100">
        <div className="w-full max-w-5xl mx-auto">
          {/* If isEditing, show Form. If not, show Detail.
                        Or if AccountDetailView supports both, use it. */
            isEditing ? (
              <div className="space-y-6">
                <AccountingForm
                  initialData={selectedAccount || null}
                  onSave={handleSave}
                  onCancel={handleBack}
                />
              </div>
            ) : (
              <div className="space-y-6 bg-white p-6 rounded-lg shadow">
                <AccountDetailView
                  account={selectedAccount!}
                  onSave={handleSave}
                  onDelete={() => {
                    if (selectedAccount) confirmDelete(selectedAccount);
                  }}
                  onBack={handleBack}
                />
              </div>
            )
          }
        </div>
        <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible.
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
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 bg-gray-100">
      <div className="w-full max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-1">Plan Comptable</h2>
          <p className="text-sm text-gray-500">Gérez la liste de tous vos comptes.</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <AccountListView
          accounts={accounts}
          isLoading={isLoading}
          onSelectAccount={handleSelectAccount}
          onEditAccount={handleEditAccount}
          onDeleteAccount={confirmDelete}
          onAddNew={handleAddNew}
          onRefresh={fetchAccounts}
          selectedId={selectedAccountId || undefined}
        />

        <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action désactivera le compte.
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