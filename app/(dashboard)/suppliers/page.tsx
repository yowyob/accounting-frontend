"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { CompteDto } from '@/src/lib2/models/CompteDto';
import { AccountingComptesService } from '@/src/lib2/services/AccountingComptesService';
import { SupplierListView } from '@/components/suppliers/supplier-list-view';
import { SupplierDetailView } from '@/components/suppliers/supplier-detail-view';
import { SupplierForm } from '@/components/suppliers/supplier-form';
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

export default function SuppliersPage() {
    const [suppliers, setSuppliers] = useState<CompteDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const fetchAndSetSuppliers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await AccountingComptesService.getSupplierAccounts();
            if (res.success && res.data) {
                setSuppliers(res.data);
            } else {
                setSuppliers([]);
            }
        } catch (error: any) {
            console.error("Failed to fetch suppliers:", error);
            setError("Impossible de charger les fournisseurs. Veuillez vérifier votre connexion.");
            toast.error("Erreur lors de la récupération des fournisseurs");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAndSetSuppliers();
    }, [fetchAndSetSuppliers]);

    const handleSave = async (data: CompteDto) => {
        try {
            if (data.id) {
                await AccountingComptesService.updateCompte(data.id, data);
                toast.success("Fournisseur mis à jour");
            } else {
                await AccountingComptesService.createCompte({
                    ...data,
                    typeCompte: 'FOURNISSEUR'
                });
                toast.success("Fournisseur créé");
            }
            await fetchAndSetSuppliers();
            setSelectedSupplierId(null);
            setIsEditing(false);
        } catch (error: any) {
            console.error("Failed to save supplier", error);
            toast.error("Erreur lors de l'enregistrement");
        }
    };

    const confirmDelete = (id: string) => {
        setDeleteId(id);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await AccountingComptesService.deleteCompte(deleteId);
            toast.success("Fournisseur supprimé");
            await fetchAndSetSuppliers();
            if (selectedSupplierId === deleteId) {
                setSelectedSupplierId(null);
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Failed to delete supplier:", error);
            toast.error("Erreur lors de la suppression");
        } finally {
            setDeleteId(null);
        }
    };

    const handleSelectSupplier = (id: string) => {
        setSelectedSupplierId(id);
        setIsEditing(false);
    };

    const handleEditSupplier = (id: string) => {
        setSelectedSupplierId(id);
        setIsEditing(true);
    };

    const handleAddNew = () => {
        setSelectedSupplierId('new');
        setIsEditing(true);
    };

    const handleBack = () => {
        setSelectedSupplierId(null);
        setIsEditing(false);
    };

    const selectedSupplier = selectedSupplierId === 'new' ? null : suppliers.find(s => s.id === selectedSupplierId);

    if (selectedSupplierId) {
        return (
            <div className="min-h-screen p-4 bg-gray-100">
                <div className="w-full max-w-5xl mx-auto">
                    {isEditing ? (
                        <div className="space-y-6">
                            {/* Assuming SupplierForm exists and behaves like others */}
                            <SupplierForm
                                initialData={selectedSupplier || null}
                                onSave={handleSave}
                                // onCancel may or may not exist on SupplierForm based on previous patterns, 
                                // but we should check. If it doesn't, we might need a wrapper.
                                // I'll assume standard args for now or check in next step if error.
                                onCancel={handleBack}
                            />
                        </div>
                    ) : (
                        <div className="space-y-6 bg-white p-6 rounded-lg shadow">
                            <SupplierDetailView
                                supplier={selectedSupplier!}
                                onSave={handleSave}
                                onDelete={(id) => confirmDelete(id)} // Signature mismatch check? DetailView usually passes ID?
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
                    <h2 className="text-xl font-semibold text-gray-700 mb-1">Fournisseurs</h2>
                    <p className="text-sm text-gray-500">Gérez la liste de vos fournisseurs.</p>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Erreur</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <SupplierListView
                    suppliers={suppliers}
                    isLoading={isLoading}
                    onSelectSupplier={handleSelectSupplier}
                    onEditSupplier={handleEditSupplier}
                    onDeleteSupplier={(s) => { if (s.id) confirmDelete(s.id) }}
                    onAddNew={handleAddNew}
                    onRefresh={fetchAndSetSuppliers}
                />

                <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Cette action supprimera définivement ce fournisseur.
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