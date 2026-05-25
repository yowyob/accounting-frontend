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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Tag, X, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { hasPermission } from '@/src/lib/auth/roles';

const MOCK_AXES: AxeAnalytique[] = [
    {
        id: 'a1', code: 'MKT', libelle: 'Marketing Digital', type: 'DEPARTEMENT', responsable: 'M. Kouamé Paul', actif: true,
        comptes: [{ id: 'c1', libelle: 'Publicité en ligne' }, { id: 'c2', libelle: 'Événements marketing' }]
    },
    {
        id: 'a2', code: 'IT', libelle: 'Service Informatique', type: 'DEPARTEMENT', responsable: 'Mme. Biya Claire', actif: true,
        comptes: [{ id: 'c3', libelle: 'Licences logicielles' }, { id: 'c4', libelle: 'Matériel informatique' }]
    },
    { id: 'a3', code: 'PROJ-ERP', libelle: 'Projet ERP Yowyob', type: 'PROJET', responsable: 'M. Ngono Henri', actif: true },
    { id: 'a4', code: 'ADMIN', libelle: 'Administration Générale', type: 'DEPARTEMENT', responsable: 'Mme. Fouda Anne', actif: true },
    { id: 'a5', code: 'FORM', libelle: 'Activité Formation', type: 'ACTIVITE', actif: true },
    { id: 'a6', code: 'CC-SUD', libelle: 'Centre de coût Sud', type: 'CENTRE_COUT', actif: false },
];

// ─── Panneau détail d'un axe (inline, pas dans un modal) ─────────────────────
interface AxeDetailPanelProps {
    axe: AxeAnalytique;
    onEdit: () => void;
    onClose: () => void;
    onToggleActif: () => void;
    canToggleActif: boolean;
}

function AxeDetailPanel({ axe, onEdit, onClose, onToggleActif, canToggleActif }: AxeDetailPanelProps) {
    return (
        <div className="w-[440px] shrink-0 bg-white border-l border-slate-200 flex flex-col h-full overflow-hidden">
            {/* Header du panneau */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <div>
                    <h3 className="font-bold text-slate-800 text-base">{axe.libelle}</h3>
                    {axe.code && <p className="text-xs text-slate-400 font-mono mt-0.5">{axe.code}</p>}
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-slate-400 hover:text-slate-700">
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {/* Contenu scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Infos principales */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Type</p>
                        <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200 text-xs">
                            {axe.type}
                        </Badge>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Statut</p>
                        {axe.actif ? (
                            <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100 text-xs">Actif</Badge>
                        ) : (
                            <Badge variant="secondary" className="bg-slate-100 text-slate-500 text-xs">Inactif</Badge>
                        )}
                    </div>
                    <div className="col-span-2 space-y-1">
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Responsable</p>
                        <p className="text-sm text-slate-700">{axe.responsable || 'Non assigné'}</p>
                    </div>
                </div>

                {/* Toggle actif/inactif */}
                {canToggleActif && (
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-slate-700">
                                    {axe.actif ? 'Désactiver cet axe' : 'Activer cet axe'}
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    {axe.actif
                                        ? 'L\'axe ne sera plus proposé dans les budgets.'
                                        : 'L\'axe sera disponible pour la création de budgets.'}
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onToggleActif}
                                className={axe.actif
                                    ? 'border-amber-200 text-amber-700 hover:bg-amber-50 gap-1.5'
                                    : 'border-green-200 text-green-700 hover:bg-green-50 gap-1.5'}
                            >
                                {axe.actif
                                    ? <><ToggleLeft className="h-4 w-4" /> Désactiver</>
                                    : <><ToggleRight className="h-4 w-4" /> Activer</>}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Comptes analytiques */}
                <div className="space-y-3">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-2">
                        <Tag className="h-3 w-3" /> Comptes analytiques liés
                    </p>
                    {axe.comptes && axe.comptes.length > 0 ? (
                        <div className="space-y-2">
                            {axe.comptes.map((compte) => (
                                <div key={compte.id} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                    <span className="text-sm text-slate-700">{compte.libelle}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400 italic">Aucun compte analytique lié à cet axe.</p>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                <Button onClick={onEdit} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-2">
                    <Pencil className="h-4 w-4" /> Modifier cet axe
                </Button>
            </div>
        </div>
    );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function AnalyticsPage() {
    const [axes, setAxes] = useState<AxeAnalytique[]>(MOCK_AXES);
    const [isLoading, setIsLoading] = useState(false);
    const [axeToDelete, setAxeToDelete] = useState<AxeAnalytique | null>(null);
    const [selectedAxe, setSelectedAxe] = useState<AxeAnalytique | null>(null);
    const { onOpen, onClose: closeCompose } = useCompose();
    const { accountingRole } = useAuth();
    const canToggleActif = hasPermission(accountingRole, 'analytics', 'update');

    const persistAxes = (updated: AxeAnalytique[]) => {
        localStorage.setItem('mock_axes', JSON.stringify(updated));
    };

    const handleRefresh = () => {
        setIsLoading(true);
        setTimeout(() => { setAxes([...MOCK_AXES]); setSelectedAxe(null); setIsLoading(false); }, 800);
    };

    const handleAddNew = () => {
        onOpen({
            title: "Nouvel Axe Analytique",
            content: (
                <AxeForm
                    onCancel={closeCompose}
                    onSubmit={(data) => {
                        const newAxe: AxeAnalytique = { ...data, id: Math.random().toString(36).substr(2, 9) };
                        setAxes(prev => {
                            const updated = [newAxe, ...prev];
                            persistAxes(updated);
                            return updated;
                        });
                        closeCompose();
                        toast.success(`Axe "${data.libelle}" créé`);
                    }}
                />
            )
        });
    };

    const openEditForm = (id: string) => {
        const axeToEdit = axes.find(a => a.id === id);
        if (!axeToEdit) return;

        onOpen({
            title: `Mettre à jour l'Axe : ${axeToEdit.libelle}`,
            content: (
                <AxeForm
                    initialData={axeToEdit}
                    onCancel={closeCompose}
                    onSubmit={(updatedData) => {
                        setAxes(prev => {
                            const updated = prev.map(a => a.id === updatedData.id ? updatedData : a);
                            persistAxes(updated);
                            // Synchroniser le panneau détail si c'est le même axe
                            if (selectedAxe?.id === updatedData.id) setSelectedAxe(updatedData);
                            return updated;
                        });
                        closeCompose();
                        toast.success(`Axe "${updatedData.libelle}" mis à jour`);
                    }}
                />
            )
        });
    };

    // Clic sur une ligne → panneau détail inline (pas de modal)
    const handleView = (id: string) => {
        const axe = axes.find(a => a.id === id);
        if (!axe) return;
        setSelectedAxe(axe);
    };

    const handleEdit = (id: string) => {
        openEditForm(id);
    };

    const handleToggleActif = (id: string) => {
        setAxes(prev => {
            const updated = prev.map(a => a.id === id ? { ...a, actif: !a.actif } : a);
            persistAxes(updated);
            // Synchroniser le panneau détail
            const updatedAxe = updated.find(a => a.id === id);
            if (selectedAxe?.id === id && updatedAxe) setSelectedAxe(updatedAxe);
            return updated;
        });
        const axe = axes.find(a => a.id === id);
        if (axe) {
            toast.success(axe.actif ? `Axe "${axe.libelle}" désactivé` : `Axe "${axe.libelle}" activé`);
        }
    };

    const handleDelete = () => {
        if (!axeToDelete) return;
        setAxes(prev => {
            const updated = prev.filter(a => a.id !== axeToDelete.id);
            persistAxes(updated);
            return updated;
        });
        if (selectedAxe?.id === axeToDelete.id) setSelectedAxe(null);
        toast.success('Axe supprimé', { description: `"${axeToDelete.libelle}" a été supprimé.` });
        setAxeToDelete(null);
    };

    return (
        <div className="min-h-screen flex flex-col p-4 bg-gray-100">
            <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-semibold text-gray-700 mb-1">Axes Analytiques</h2>
                    <p className="text-sm text-gray-500">
                        Définissez vos centres de coût, projets, départements et activités pour l'imputation analytique.
                    </p>
                </div>

                {/* Layout deux colonnes quand un axe est sélectionné */}
                <div className="flex" style={{ minHeight: '500px' }}>
                    {/* Liste */}
                    <div className="flex-1 p-6 overflow-auto">
                        <AnalyticsListView
                            axes={axes}
                            isLoading={isLoading}
                            onEdit={handleEdit}
                            onView={handleView}
                            onDelete={(a) => setAxeToDelete(a)}
                            onAddNew={handleAddNew}
                            onRefresh={handleRefresh}
                        />
                    </div>

                    {/* Panneau détail */}
                    {selectedAxe && (
                        <AxeDetailPanel
                            axe={selectedAxe}
                            onClose={() => setSelectedAxe(null)}
                            onEdit={() => openEditForm(selectedAxe.id)}
                            onToggleActif={() => handleToggleActif(selectedAxe.id)}
                            canToggleActif={canToggleActif}
                        />
                    )}
                </div>
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
