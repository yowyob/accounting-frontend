"use client";

import React, { useState } from 'react';
import { AnalyticsListView, AxeAnalytique } from '@/components/accounting/analytics-list-view';
import { toast } from 'sonner';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCompose } from '@/hooks/use-compose-store';
import { AxeForm } from '@/components/accounting/axe-form';

// Mock data pour la démo
const MOCK_AXES: AxeAnalytique[] = [
    { id: 'a1', code: 'MKT', libelle: 'Marketing Digital', type: 'DEPARTEMENT', responsable: 'M. Kouamé Paul', actif: true },
    { id: 'a2', code: 'IT', libelle: 'Service Informatique', type: 'DEPARTEMENT', responsable: 'Mme. Biya Claire', actif: true },
    { id: 'a3', code: 'PROJ-ERP', libelle: 'Projet ERP Yowyob', type: 'PROJET', responsable: 'M. Ngono Henri', actif: true },
    { id: 'a4', code: 'ADMIN', libelle: 'Administration Générale', type: 'DEPARTEMENT', responsable: 'Mme. Fouda Anne', actif: true },
    { id: 'a5', code: 'FORM', libelle: 'Activité Formation', type: 'ACTIVITE', actif: true },
    { id: 'a6', code: 'CC-SUD', libelle: 'Centre de coût Sud', type: 'CENTRE_COUT', actif: false },
];

export default function AnalyticsPage() {
    const [axes, setAxes] = useState<AxeAnalytique[]>(MOCK_AXES);
    const [isLoading, setIsLoading] = useState(false);
    const [axeToDelete, setAxeToDelete] = useState<AxeAnalytique | null>(null);
    const { onOpen, onClose: closeCompose } = useCompose();

    const handleRefresh = () => {
        setIsLoading(true);
        setTimeout(() => { setAxes([...MOCK_AXES]); setIsLoading(false); }, 800);
    };

    const handleAddNew = () => {
        onOpen({
            title: "Nouvel Axe Analytique",
            content: (
                <AxeForm
                    onCancel={closeCompose}
                    onSubmit={(data) => {
                        const newAxe = { ...data, id: Math.random().toString(36).substr(2, 9) };
                        setAxes(prev => [newAxe, ...prev]);
                        closeCompose();
                        toast.success(`Axe "${data.libelle}" créé`);
                    }}
                />
            )
        });
    };

    const handleEdit = (id: string) => {
        const axeToEdit = axes.find(a => a.id === id);
        if (!axeToEdit) return;

        onOpen({
            title: `Mettre à jour l'Axe : ${axeToEdit.libelle}`,
            content: (
                <AxeForm
                    initialData={axeToEdit}
                    onCancel={closeCompose}
                    onSubmit={(updatedData) => {
                        setAxes(prev => prev.map(a => a.id === updatedData.id ? updatedData : a));
                        closeCompose();
                        toast.success(`Axe "${updatedData.libelle}" mis à jour`);
                    }}
                />
            )
        });
    };

    const handleDelete = () => {
        if (!axeToDelete) return;
        setAxes(prev => prev.filter(a => a.id !== axeToDelete.id));
        toast.success('Axe supprimé', { description: `"${axeToDelete.libelle}" a été supprimé.` });
        setAxeToDelete(null);
    };

    return (
        <div className="min-h-screen flex flex-col p-4 bg-gray-100">
            <div className="w-full max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-1">Axes Analytiques</h2>
                    <p className="text-sm text-gray-500">
                        Définissez vos centres de coût, projets, départements et activités pour l'imputation analytique.
                    </p>
                </div>

                <AnalyticsListView
                    axes={axes}
                    isLoading={isLoading}
                    onEdit={handleEdit}
                    onDelete={(a) => setAxeToDelete(a)}
                    onAddNew={handleAddNew}
                    onRefresh={handleRefresh}
                />
            </div>

            <AlertDialog open={!!axeToDelete} onOpenChange={(open) => !open && setAxeToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer cet axe analytique ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. L'axe analytique "{axeToDelete?.libelle}" sera définitivement supprimé.
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
