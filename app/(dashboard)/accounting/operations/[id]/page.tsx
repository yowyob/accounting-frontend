// app/(dashboard)/accounting/operations/[id]/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AccountingOperationsService } from '@/src/lib2/services/AccountingOperationsService';
import { OperationComptableDto } from '@/src/lib2/models/OperationComptableDto';
import { OperationComptableDetailView } from '@/components/accounting/operation-comptable-detail-view';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { toast } from 'sonner';

export default function OperationComptableDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [operation, setOperation] = useState<OperationComptableDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [operationToDelete, setOperationToDelete] = useState<OperationComptableDto | null>(null);

    const fetchOperation = async () => {
        setIsLoading(true);
        try {
            const response = await AccountingOperationsService.getOperationComptable(id);
            if (response.success && response.data) {
                setOperation(response.data);
            } else {
                toast.error("Opération introuvable");
                router.push('/accounting/operations');
            }
        } catch (error) {
            console.error("Failed to fetch operation details:", error);
            toast.error("Erreur lors du chargement des détails");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchOperation();
        }
    }, [id]);

    const handleSave = async (data: OperationComptableDto) => {
        try {
            await AccountingOperationsService.updateOperationComptable(data.id!, data);
            toast.success("Opération mise à jour avec succès");
            fetchOperation();
        } catch (error: any) {
            console.error("Failed to update operation:", error);
            toast.error(`Erreur lors de la mise à jour: ${error.body?.message || error.message || "Erreur inconnue"}`);
        }
    };

    const confirmDelete = async () => {
        if (!operationToDelete?.id) return;
        try {
            await AccountingOperationsService.deleteOperationComptable(operationToDelete.id);
            toast.success("Opération supprimée avec succès");
            router.push('/accounting/operations');
        } catch (error: any) {
            console.error("Failed to delete operation:", error);
            toast.error(`Erreur lors de la suppression: ${error.body?.message || error.message || "Erreur inconnue"}`);
        } finally {
            setOperationToDelete(null);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Chargement des détails...</div>;
    }

    if (!operation) {
        return <div className="p-8 text-center text-red-500">Opération introuvable.</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6 md:p-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <OperationComptableDetailView
                    operation={operation}
                    onSave={handleSave}
                    onDelete={setOperationToDelete}
                    onBack={() => router.push('/accounting/operations')}
                />
            </div>

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
