"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Client } from '@/types/core';
import { CustomerListView } from '@/components/customers/customer-list-view';
import { CustomerDetailView } from '@/components/customers/customer-detail-view';
import { CustomerForm } from '@/components/customers/customer-form';
import { AccountingComptesService } from '@/src/lib2/services/AccountingComptesService';
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

export default function CustomersPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchAndSetClients = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const accountsRes = await AccountingComptesService.getClientAccounts();

      if (accountsRes.success && accountsRes.data) {
        const mappedClients: Client[] = accountsRes.data.map(account => ({
          id: account.id || account.noCompte,
          code: account.noCompte,
          companyName: account.libelle,
          balance: account.solde || 0,
          isActive: account.actif ?? true,
          notes: account.notes,
          isTaxable: false,
          pricingLevels: [],
        }));
        setClients(mappedClients);
      } else {
        setClients([]);
      }
    } catch (error: any) {
      console.error("Failed to fetch clients:", error);
      setError("Impossible de charger les clients. Veuillez vérifier votre connexion.");
      toast.error("Erreur lors de la récupération des clients");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndSetClients();
  }, [fetchAndSetClients]);

  const handleSave = useCallback(async (data: Client) => {
    const isNew = !data.id || data.id === data.code;
    try {
      const accountData = {
        id: isNew ? undefined : data.id,
        libelle: data.companyName,
        noCompte: data.code,
        notes: data.notes || '',
        actif: data.isActive,
        typeCompte: 'CLIENT',
        solde: data.balance,
      };

      if (isNew) {
        await AccountingComptesService.createCompte(accountData);
        toast.success("Client créé");
      } else {
        await AccountingComptesService.updateCompte(data.id, accountData);
        toast.success("Client mis à jour");
      }
      await fetchAndSetClients();
      setSelectedClientId(null);
      setIsEditing(false);
    } catch (error: any) {
      console.error("Failed to save client", error);
      toast.error("Erreur lors de l'enregistrement");
    }
  }, [fetchAndSetClients]);

  const confirmDelete = (client: Client) => {
    if (client.id) setDeleteId(client.id);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await AccountingComptesService.deleteCompte(deleteId);
      toast.success("Client supprimé");
      await fetchAndSetClients();
      if (selectedClientId === deleteId) {
        setSelectedClientId(null);
        setIsEditing(false);
      }
    } catch (error: any) {
      console.error("Failed to delete client:", error);
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeleteId(null);
    }
  };

  const handleSelectClient = (id: string) => {
    setSelectedClientId(id);
    setIsEditing(false);
  };

  const handleEditClient = (id: string) => {
    setSelectedClientId(id);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setSelectedClientId('new');
    setIsEditing(true);
  };

  const handleBack = () => {
    setSelectedClientId(null);
    setIsEditing(false);
  };

  const selectedClient = selectedClientId === 'new' ? null : clients.find(c => c.id === selectedClientId);

  if (selectedClientId) {
    return (
      <div className="min-h-screen p-4 bg-gray-100">
        <div className="w-full max-w-5xl mx-auto">
          {isEditing ? (
            <div className="space-y-6">
              <CustomerForm
                initialData={selectedClient || null}
                onSave={handleSave}
                onCancel={handleBack}
              />
            </div>
          ) : (
            <div className="space-y-6 bg-white p-6 rounded-lg shadow">
              <CustomerDetailView
                client={selectedClient!}
                onSave={handleSave}
                onDelete={() => { if (selectedClient) confirmDelete(selectedClient) }}
                onBack={handleBack}
              />
            </div>
          )}
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
          <h2 className="text-xl font-semibold text-gray-700 mb-1">Clients</h2>
          <p className="text-sm text-gray-500">Gérez la liste de vos clients.</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <CustomerListView
          clients={clients}
          isLoading={isLoading}
          onSelectClient={handleSelectClient}
          onEditClient={handleEditClient}
          onDeleteClient={confirmDelete}
          onAddNew={handleAddNew}
          onRefresh={fetchAndSetClients}
        />

        <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action supprimera définitivement ce client.
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