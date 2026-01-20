"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { AccountingPeriodsService } from '@/src/lib2/services/AccountingPeriodsService';
import { PeriodeComptableDto } from '@/src/lib2/models/PeriodeComptableDto';
import { PeriodeComptableListView } from '@/components/accounting/periode-comptable-list-view';
import { PeriodeComptableDetailView } from '@/components/accounting/periode-comptable-detail-view';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import { useCompose } from '@/hooks/use-compose-store';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function PeriodsPage() {
    const [periodes, setPeriodes] = useState<PeriodeComptableDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPeriode, setSelectedPeriode] = useState<PeriodeComptableDto | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { onOpen, onClose: closeCompose } = useCompose();

    const fetchPeriodes = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await AccountingPeriodsService.getAllPeriodeComptables();
            if (response && response.data) {
                setPeriodes(response.data);
            } else {
                setPeriodes([]);
            }
        } catch (err) {
            console.error('Error fetching periods:', err);
            setError('Impossible de charger les périodes comptables. Veuillez vérifier votre connexion au serveur.');
            toast.error('Erreur lors du chargement des périodes');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPeriodes();
    }, [fetchPeriodes]);

    const handleOpenCompose = (periode?: PeriodeComptableDto) =>
        onOpen({
            title: periode ? "Modifier la Période" : "Nouvelle Période",
            content: <PeriodeComptableDetailView
                periode={periode || null}
                onSave={handleSave}
                onClose={() => handleClose(periode?.id || '')}
                onDelete={() => handleDelete(periode)}
                onBack={closeCompose}
            />,
        });

    const handleSave = async (data: PeriodeComptableDto) => {
        try {
            if (data.id) {
                await AccountingPeriodsService.updatePeriodeComptable(data.id, data);
                toast.success('Période mise à jour avec succès');
            } else {
                await AccountingPeriodsService.createPeriodeComptable(data);
                toast.success('Période créée avec succès');
            }
            fetchPeriodes();
            closeCompose();
        } catch (err) {
            console.error('Error saving period:', err);
            toast.error("Erreur lors de l'enregistrement de la période");
        }
    };

    const handleDelete = async (periodeToDelete?: PeriodeComptableDto) => {
        const target = periodeToDelete || selectedPeriode;
        if (!target || !target.id) return;

        if (!confirm('Êtes-vous sûr de vouloir supprimer cette période ?')) return;

        try {
            await AccountingPeriodsService.deletePeriodeComptable(target.id);
            toast.success('Période supprimée avec succès');
            fetchPeriodes();
            closeCompose();
        } catch (err) {
            console.error('Error deleting period:', err);
            toast.error("Erreur lors de la suppression de la période");
        }
    };

    const handleClose = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir clôturer cette période ?')) return;

        try {
            await AccountingPeriodsService.closePeriodeComptable(id);
            toast.success('Période clôturée avec succès');
            fetchPeriodes();
        } catch (err) {
            console.error('Error closing period:', err);
            toast.error("Erreur lors de la clôture de la période");
        }
    };

    return (
        <div className="min-h-screen flex flex-col p-4 bg-gray-100">
            <div className="w-full bg-white p-6 rounded-lg shadow-lg">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-1">Périodes Comptables</h2>
                    <p className="text-sm text-gray-500">Gérez les sous-périodes de vos exercices comptables.</p>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Erreur</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <PeriodeComptableListView
                    periodes={periodes}
                    isLoading={isLoading}
                    onSelectPeriode={(id) => handleOpenCompose(periodes.find(p => p.id === id))}
                    onEditPeriode={(id) => handleOpenCompose(periodes.find(p => p.id === id))}
                    onDeletePeriode={handleDelete}
                    onClosePeriode={handleClose}
                    onAddNew={() => handleOpenCompose()}
                    onRefresh={fetchPeriodes}
                />
            </div>
        </div>
    );
}
