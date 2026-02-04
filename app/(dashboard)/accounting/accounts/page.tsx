"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { CompteDto } from '@/src/lib2/models/CompteDto';
import { AccountingComptesService } from '@/src/lib2/services/AccountingComptesService';
import { CompteComptableListView } from '@/components/accounting/compte-comptable-list-view';
import { CompteComptableDetailView } from '@/components/accounting/compte-comptable-detail-view';
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

export default function AccountsPage() {
    const [comptes, setComptes] = useState<CompteDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCompteId, setSelectedCompteId] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchComptes = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await AccountingComptesService.getAllComptes();
            if (response && response.data) {
                setComptes(response.data);
            } else {
                setComptes([]);
            }
        } catch (err: any) {
            let reason = "Impossible de charger les comptes.";
            if (err.body?.message) reason = err.body.message;
            else if (err.message) reason = err.message;
            toast.error('Erreur lors du chargement', {
                description: reason,
                className: "bg-red-50 border-red-200 text-red-800"
            });
            setError('Impossible de charger les comptes comptables. Veuillez vérifier votre connexion internet.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchComptes();
    }, [fetchComptes]);

    const [deleteId, setDeleteId] = useState<string | null>(null);

    // ... existing fetchComptes ...

    const handleSave = async (data: CompteDto) => {
        try {
            if (data.id) {
                await AccountingComptesService.updateCompte(data.id, data);
                toast.success('Compte mis à jour avec succès', {
                    description: `Le compte ${data.noCompte} a été modifié.`,
                    className: "bg-green-50 border-green-200 text-green-800"
                });
            } else {
                await AccountingComptesService.createCompte(data);
                toast.success('Compte créé avec succès', {
                    description: `Le nouveau compte ${data.noCompte} a été ajouté au plan comptable.`,
                    className: "bg-green-50 border-green-200 text-green-800"
                });
            }
            await fetchComptes();
            setSelectedCompteId(null);
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

    const confirmDelete = (id: string) => {
        setDeleteId(id);
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            await AccountingComptesService.deleteCompte(deleteId);
            toast.success('Compte supprimé', {
                description: 'Le compte a été retiré avec succès.',
                className: "bg-green-50 border-green-200 text-green-800"
            });
            await fetchComptes();
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

    const handleSelectCompte = (id: string) => {
        setSelectedCompteId(id);
        setIsEditing(false);
    };

    const handleEditCompte = (id: string) => {
        setSelectedCompteId(id);
        setIsEditing(true);
    };

    const handleAddNew = () => {
        setSelectedCompteId('new');
        setIsEditing(true);
    };

    const handleBack = () => {
        setSelectedCompteId(null);
        setIsEditing(false);
    };

    const selectedCompte = selectedCompteId === 'new' ? null : comptes.find(c => c.id === selectedCompteId);

    // Show detail view if a compte is selected
    if (selectedCompteId) {
        return (
            <div className="min-h-screen p-4 bg-gray-100">
                <div className="w-full max-w-5xl mx-auto">
                    <CompteComptableDetailView
                        compte={selectedCompte || null}
                        onSave={handleSave}
                        onBack={handleBack}
                        isEditing={isEditing}
                    />
                </div>
            </div>
        );
    }

    // Show list view
    return (
        <div className="min-h-screen flex flex-col p-4 bg-gray-100">
            <div className="w-full max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-1">Comptes Comptables</h2>
                    <p className="text-sm text-gray-500">Gérez votre plan comptable et vos comptes.</p>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Erreur</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <CompteComptableListView
                    comptes={comptes}
                    isLoading={isLoading}
                    onSelectCompte={handleSelectCompte}
                    onEditCompte={handleEditCompte}
                    onDeleteCompte={confirmDelete}
                    onAddNew={handleAddNew}
                    onRefresh={fetchComptes}
                    selectedId={selectedCompteId || undefined}
                />

                <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Cette action est irréversible. Cela supprimera définitivement le compte comptable
                                et pourrait affecter les écritures associées.
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
