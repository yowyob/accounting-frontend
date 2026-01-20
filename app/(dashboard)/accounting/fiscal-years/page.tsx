"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { AccountingFiscalYearsService } from '@/src/lib2/services/AccountingFiscalYearsService';
import { ExerciceComptableDto } from '@/src/lib2/models/ExerciceComptableDto';
import { ExerciceComptableListView } from '@/components/accounting/exercice-comptable-list-view';
import { ExerciceComptableDetailView } from '@/components/accounting/exercice-comptable-detail-view';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import { useCompose } from '@/hooks/use-compose-store';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function FiscalYearsPage() {
    const [exercices, setExercices] = useState<ExerciceComptableDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedExercice, setSelectedExercice] = useState<ExerciceComptableDto | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { onOpen, onClose: closeCompose } = useCompose();

    const fetchExercices = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await AccountingFiscalYearsService.getAllExercices();
            if (response && response.data) {
                setExercices(response.data);
            } else {
                setExercices([]);
            }
        } catch (err) {
            console.error('Error fetching fiscal years:', err);
            setError('Impossible de charger les exercices comptables. Veuillez vérifier votre connexion au serveur.');
            toast.error('Erreur lors du chargement des exercices');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchExercices();
    }, [fetchExercices]);

    const handleOpenCompose = (exercice?: ExerciceComptableDto) =>
        onOpen({
            title: exercice ? "Modifier l'Exercice" : "Nouvel Exercice",
            content: <ExerciceComptableDetailView
                exercice={exercice || null}
                onSave={handleSave}
                onClose={() => handleClose(exercice?.id || '')}
                onDelete={() => handleDelete(exercice)}
                onBack={closeCompose}
            />,
        });

    const handleSave = async (data: ExerciceComptableDto) => {
        try {
            if (data.id) {
                await AccountingFiscalYearsService.updateExercice(data.id, data);
                toast.success('Exercice mis à jour avec succès');
            } else {
                await AccountingFiscalYearsService.createExercice(data);
                toast.success('Exercice créé avec succès');
            }
            fetchExercices();
            closeCompose();
        } catch (err) {
            console.error('Error saving fiscal year:', err);
            toast.error("Erreur lors de l'enregistrement de l'exercice");
        }
    };

    const handleDelete = async (exerciceToDelete?: ExerciceComptableDto) => {
        const target = exerciceToDelete || selectedExercice;
        if (!target || !target.id) return;

        if (!confirm('Êtes-vous sûr de vouloir supprimer cet exercice ?')) return;

        try {
            await AccountingFiscalYearsService.deleteExercice(target.id);
            toast.success('Exercice supprimé avec succès');
            fetchExercices();
            closeCompose();
        } catch (err) {
            console.error('Error deleting fiscal year:', err);
            toast.error("Erreur lors de la suppression de l'exercice");
        }
    };

    const handleClose = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir clôturer cet exercice ? Cette action est irréversible.')) return;

        try {
            await AccountingFiscalYearsService.closeExercice(id);
            toast.success('Exercice clôturé avec succès');
            fetchExercices();
        } catch (err) {
            console.error('Error closing fiscal year:', err);
            toast.error("Erreur lors de la clôture de l'exercice");
        }
    };

    return (
        <div className="min-h-screen flex flex-col p-4 bg-gray-100">
            <div className="w-full bg-white p-6 rounded-lg shadow-lg">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-1">Exercices Comptables</h2>
                    <p className="text-sm text-gray-500">Gérez les périodes d'activité de votre entreprise et leurs clôtures.</p>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Erreur</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <ExerciceComptableListView
                    exercices={exercices}
                    isLoading={isLoading}
                    onSelectExercice={(id) => handleOpenCompose(exercices.find(e => e.id === id))}
                    onEditExercice={(id) => handleOpenCompose(exercices.find(e => e.id === id))}
                    onDeleteExercice={handleDelete}
                    onCloseExercice={handleClose}
                    onAddNew={() => handleOpenCompose()}
                    onRefresh={fetchExercices}
                />
            </div>
        </div>
    );
}
