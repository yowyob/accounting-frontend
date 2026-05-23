"use client";

import React, { useState } from 'react';
import { BudgetListView, Budget } from '@/components/accounting/budget-list-view';
import { BudgetForm } from '@/components/accounting/budget-form';
import { BudgetVsRealiseView } from '@/components/accounting/budget-vs-realise-view';
import { useCompose } from '@/hooks/use-compose-store';
import { toast } from 'sonner';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, BarChart3 } from 'lucide-react';

// Mock data pour la démo (backend non disponible)
const MOCK_BUDGETS: Budget[] = [
    {
        id: 'b1', name: 'Budget Marketing Q1', code: 'MKT-2024-Q1',
        axeAnalytique: 'Marketing Digital', montantAlloue: 5000000,
        montantConsomme: 3200000, dateDebut: '2024-01-01', dateFin: '2024-03-31', statut: 'ACTIF',
    },
    {
        id: 'b2', name: 'Budget Informatique', code: 'IT-2024',
        axeAnalytique: 'Département IT', montantAlloue: 8000000,
        montantConsomme: 7500000, dateDebut: '2024-01-01', dateFin: '2024-12-31', statut: 'ACTIF',
    },
    {
        id: 'b3', name: 'Budget RH Formation', code: 'RH-FORM-2024',
        axeAnalytique: 'Ressources Humaines', montantAlloue: 2000000,
        montantConsomme: 0, dateDebut: '2024-06-01', dateFin: '2024-12-31', statut: 'BROUILLON',
    },
    {
        id: 'b4', name: 'Budget Commercial 2023', code: 'COM-2023',
        axeAnalytique: 'Direction Commerciale', montantAlloue: 10000000,
        montantConsomme: 9800000, dateDebut: '2023-01-01', dateFin: '2023-12-31', statut: 'CLOTURE',
    },
];

// Mock axes pour le formulaire
const MOCK_AXES = [
    { id: 'a1', libelle: 'Projets' },
    { id: 'a2', libelle: 'Départements' },
    { id: 'a3', libelle: 'Produits' },
];

export default function BudgetsPage() {
    const [budgets, setBudgets] = useState<Budget[]>(MOCK_BUDGETS);
    const [isLoading, setIsLoading] = useState(false);
    const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);
    const { onOpen, onClose: closeCompose } = useCompose();

    const handleRefresh = () => {
        setIsLoading(true);
        setTimeout(() => { setBudgets([...MOCK_BUDGETS]); setIsLoading(false); }, 800);
    };

    const handleFormSubmit = (data: any) => {
        const newBudget: Budget = {
            id: Math.random().toString(36).substr(2, 9),
            name: data.nom,
            code: `BUD-${Math.floor(Math.random() * 1000)}`,
            axeAnalytique: MOCK_AXES.find(a => a.id === data.axeId)?.libelle || 'Inconnu',
            montantAlloue: data.totalBudget,
            montantConsomme: 0,
            dateDebut: data.dateDebut,
            dateFin: data.dateFin,
            statut: data.status === 'ACTIVE' ? 'ACTIF' : 'BROUILLON',
        };
        setBudgets(prev => [newBudget, ...prev]);
        closeCompose();
        toast.success(data.status === 'ACTIVE' ? 'Budget activé !' : 'Brouillon sauvegardé', {
            description: `Le budget "${data.nom}" a été enregistré.`
        });
    };

    const handleAddNew = () => {
        onOpen({
            title: "Création d'un Nouveau Budget",
            content: (
                <BudgetForm
                    onCancel={closeCompose}
                    onSubmit={handleFormSubmit}
                    axes={MOCK_AXES as any}
                />
            )
        });
    };

    const handleEdit = (id: string) => {
        toast.info('Modification du budget', {
            description: `Édition du budget ${id} — sera connecté au backend.`
        });
    };

    const handleLock = (id: string) => {
        const budget = budgets.find(b => b.id === id);
        if (!budget) return;
        const updated = budgets.map(b => b.id === id ? { ...b, statut: 'CLOTURE' as Budget['statut'] } : b);
        setBudgets(updated);
        toast.success('Budget clôturé', {
            description: `Le budget "${budget.name}" a été clôturé.`
        });
    };

    const handleDelete = () => {
        if (!budgetToDelete) return;
        setBudgets(prev => prev.filter(b => b.id !== budgetToDelete.id));
        toast.success('Budget supprimé', { description: `"${budgetToDelete.name}" a été supprimé.` });
        setBudgetToDelete(null);
    };

    return (
        <div className="min-h-screen flex flex-col p-4 bg-gray-100">
            <div className="w-full max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-1">Gestion Budgétaire</h2>
                    <p className="text-sm text-gray-500">
                        Planifiez, suivez et contrôlez vos budgets par axe analytique.
                    </p>
                </div>

                <Tabs defaultValue="liste" className="w-full">
                    <TabsList className="mb-6 bg-gray-100 p-1 rounded-lg h-10">
                        <TabsTrigger value="liste" className="flex items-center gap-2 text-sm">
                            <List className="h-4 w-4" />
                            Liste des budgets
                        </TabsTrigger>
                        <TabsTrigger value="vs-realise" className="flex items-center gap-2 text-sm">
                            <BarChart3 className="h-4 w-4" />
                            Budget vs Réalisé
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="liste">
                        <BudgetListView
                            budgets={budgets}
                            isLoading={isLoading}
                            onEdit={handleEdit}
                            onDelete={(b) => setBudgetToDelete(b)}
                            onAddNew={handleAddNew}
                            onRefresh={handleRefresh}
                            onLock={handleLock}
                        />
                    </TabsContent>

                    <TabsContent value="vs-realise">
                        <BudgetVsRealiseView
                            budgets={budgets}
                            isLoading={isLoading}
                            onRefresh={handleRefresh}
                        />
                    </TabsContent>
                </Tabs>
            </div>

            <AlertDialog open={!!budgetToDelete} onOpenChange={(open) => !open && setBudgetToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer ce budget ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. Le budget "{budgetToDelete?.name}" sera définitivement supprimé.
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
