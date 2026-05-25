"use client";

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, HelpCircle, Save, CheckCircle, PlusCircle, Target, Calendar, Search, X } from 'lucide-react';
import { toast } from 'sonner';
import { AxeAnalytique } from './analytics-list-view';

interface BudgetLine {
    id: string;
    compteComptableId: string;
    montantAlloue: number;
    description: string;
}

interface BudgetFormProps {
    onCancel: () => void;
    onSubmit: (data: any) => void;
    axes: AxeAnalytique[];
}

export function BudgetForm({ onCancel, onSubmit, axes }: BudgetFormProps) {
    const [nom, setNom] = useState('');
    const [selectedAxeIds, setSelectedAxeIds] = useState<string[]>([]);
    const [axeSearch, setAxeSearch] = useState('');
    const [dateDebut, setDateDebut] = useState('2026-01-01');
    const [dateFin, setDateFin] = useState('2026-12-31');
    const [seuilAlerte, setSeuilAlerte] = useState('80');
    const [typeBudget, setTypeBudget] = useState('DETAILED');
    const [lines, setLines] = useState<BudgetLine[]>([
        { id: '1', compteComptableId: '', montantAlloue: 0, description: '' }
    ]);

    // Uniquement les axes actifs
    const activeAxes = useMemo(() => axes.filter(a => a.actif), [axes]);

    // Axes filtrés par la recherche
    const filteredAxes = useMemo(() =>
        activeAxes.filter(a =>
            a.libelle.toLowerCase().includes(axeSearch.toLowerCase()) ||
            (a.code && a.code.toLowerCase().includes(axeSearch.toLowerCase()))
        ), [activeAxes, axeSearch]);

    const selectedAxes = activeAxes.filter(a => selectedAxeIds.includes(a.id));

    // Union des comptes de tous les axes sélectionnés
    const allComptes = useMemo(() =>
        selectedAxes.flatMap(a => a.comptes || []),
        [selectedAxes]);

    // Montant global = somme des montants des lignes
    const montantGlobal = lines.reduce((acc, l) => acc + (l.montantAlloue || 0), 0);

    const toggleAxe = (id: string) => {
        setSelectedAxeIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const addLine = () => {
        setLines([...lines, { id: Math.random().toString(36).substr(2, 9), compteComptableId: '', montantAlloue: 0, description: '' }]);
    };

    const removeLine = (id: string) => {
        if (lines.length > 1) setLines(lines.filter(l => l.id !== id));
    };

    const updateLine = (id: string, field: string, value: any) => {
        setLines(lines.map(l => l.id === id ? { ...l, [field]: value } : l));
    };

    const handleSubmit = (status: 'DRAFT' | 'ACTIVE') => {
        if (!nom || selectedAxeIds.length === 0) {
            toast.error('Veuillez remplir le nom et sélectionner au moins un axe analytique (*)');
            return;
        }
        if (status === 'ACTIVE' && montantGlobal <= 0) {
            toast.error('Le montant global doit être supérieur à 0 pour activer le budget');
            return;
        }

        onSubmit({
            nom,
            axeId: selectedAxeIds[0],
            axeIds: selectedAxeIds,
            axeLibelle: selectedAxes.map(a => a.libelle).join(', '),
            dateDebut, dateFin, seuilAlerte, typeBudget, lines, status,
            totalBudget: montantGlobal, montantGlobal,
        });
    };

    return (
        <div className="space-y-6 pb-14 p-8">
            {/* Informations générales */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="bg-slate-50/50 border-b py-4">
                    <CardTitle className="text-lg font-semibold text-slate-800">Informations générales du budget</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">

                    {/* Nom */}
                    <div className="space-y-2">
                        <Label className="text-slate-700 font-medium">Nom du budget <span className="text-red-500">*</span></Label>
                        <Input
                            placeholder="Ex: Budget Projet Alpha 2026"
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                            className="border-slate-300 focus:ring-blue-500"
                        />
                    </div>

                    {/* Sélection multiple d'axes actifs */}
                    <div className="space-y-2">
                        <Label className="text-slate-700 font-medium">
                            Axes analytiques <span className="text-red-500">*</span>
                            <span className="ml-2 text-xs text-slate-400 font-normal">(uniquement les axes actifs)</span>
                        </Label>

                        {/* Champ de recherche */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Rechercher un axe..."
                                value={axeSearch}
                                onChange={(e) => setAxeSearch(e.target.value)}
                                className="pl-9 border-slate-300 h-9 text-sm"
                            />
                        </div>

                        {/* Liste scrollable avec checkboxes */}
                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <div className="max-h-48 overflow-y-auto divide-y divide-slate-100">
                                {filteredAxes.length === 0 ? (
                                    <div className="px-4 py-6 text-center text-sm text-slate-400">
                                        {activeAxes.length === 0
                                            ? 'Aucun axe actif disponible. Créez d\'abord des axes analytiques actifs.'
                                            : 'Aucun axe ne correspond à la recherche.'}
                                    </div>
                                ) : (
                                    filteredAxes.map(axe => (
                                        <label
                                            key={axe.id}
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
                                        >
                                            <Checkbox
                                                checked={selectedAxeIds.includes(axe.id)}
                                                onCheckedChange={() => toggleAxe(axe.id)}
                                                className="shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-800 truncate">{axe.libelle}</p>
                                                <p className="text-xs text-slate-400">
                                                    {axe.code && <span className="font-mono mr-2">{axe.code}</span>}
                                                    {axe.type}
                                                    {axe.comptes && axe.comptes.length > 0 && (
                                                        <span className="ml-2 text-emerald-600">{axe.comptes.length} compte(s)</span>
                                                    )}
                                                </p>
                                            </div>
                                        </label>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Axes sélectionnés comme badges */}
                        {selectedAxes.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                                {selectedAxes.map(axe => (
                                    <Badge
                                        key={axe.id}
                                        variant="secondary"
                                        className="bg-blue-50 text-blue-700 border border-blue-200 gap-1 pr-1"
                                    >
                                        {axe.libelle}
                                        <button
                                            type="button"
                                            onClick={() => toggleAxe(axe.id)}
                                            className="ml-1 hover:text-red-600 transition-colors"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setSelectedAxeIds([])}
                                    className="text-xs text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    Tout désélectionner
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Montant global calculé */}
                        <div className="space-y-2">
                            <Label className="text-slate-700 font-semibold flex items-center gap-2">
                                <Target className="h-4 w-4 text-blue-600" /> Montant Global (XAF)
                            </Label>
                            <div className="h-11 border border-slate-200 rounded-md bg-slate-50 flex items-center px-3 font-bold text-lg text-blue-700 font-mono">
                                {montantGlobal.toLocaleString('fr-FR')}
                            </div>
                            <p className="text-xs text-slate-500">Calculé automatiquement depuis les lignes.</p>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-700 font-medium flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-slate-400" /> Date de début <span className="text-red-500">*</span>
                            </Label>
                            <Input type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} className="h-11 border-slate-300" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-700 font-medium flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-slate-400" /> Date de fin <span className="text-red-500">*</span>
                            </Label>
                            <Input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} className="h-11 border-slate-300" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-slate-700 font-medium">Seuil d'alerte</Label>
                            <Select value={seuilAlerte} onValueChange={setSeuilAlerte}>
                                <SelectTrigger className="border-slate-300">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="50">50% - Alerte précoce</SelectItem>
                                    <SelectItem value="80">80% - Alerte standard</SelectItem>
                                    <SelectItem value="90">90% - Alerte critique</SelectItem>
                                    <SelectItem value="100">100% - Budget épuisé</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-700 font-medium">Type de budget</Label>
                            <Select value={typeBudget} onValueChange={setTypeBudget}>
                                <SelectTrigger className="border-slate-300">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="GLOBAL">Global (Montant unique)</SelectItem>
                                    <SelectItem value="DETAILED">Détaillé par compte</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Allocation budgétaire */}
            {typeBudget === 'DETAILED' && (
                <Card className="border-slate-200 shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b py-4">
                        <CardTitle className="text-lg font-semibold text-slate-800">Allocation budgétaire par compte</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-100/80 text-[11px] uppercase tracking-wider text-slate-600 font-bold border-b">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Compte Analytique</th>
                                        <th className="px-4 py-3">Description</th>
                                        <th className="px-4 py-3 w-[200px] text-right">Montant (XAF)</th>
                                        <th className="px-4 py-3 w-[80px]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {lines.map((line) => (
                                        <tr key={line.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-4 py-3 w-64">
                                                {allComptes.length > 0 ? (
                                                    <Select value={line.compteComptableId} onValueChange={(val) => updateLine(line.id, 'compteComptableId', val)}>
                                                        <SelectTrigger className="h-10 border-slate-300">
                                                            <SelectValue placeholder="Choisir un compte..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {allComptes.map(c => (
                                                                <SelectItem key={c.id} value={c.id}>{c.libelle}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <Input
                                                        placeholder={selectedAxeIds.length === 0 ? "Sélectionnez d'abord un axe..." : "Aucun compte dans les axes sélectionnés"}
                                                        value={line.compteComptableId}
                                                        onChange={(e) => updateLine(line.id, 'compteComptableId', e.target.value)}
                                                        className="h-10 border-slate-300"
                                                        disabled={selectedAxeIds.length === 0}
                                                    />
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Input
                                                    placeholder="Détail..."
                                                    className="h-10 border-slate-300"
                                                    value={line.description}
                                                    onChange={(e) => updateLine(line.id, 'description', e.target.value)}
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <Input
                                                    type="number"
                                                    className="h-10 text-right border-slate-300 font-mono font-medium"
                                                    value={line.montantAlloue || ''}
                                                    onChange={(e) => updateLine(line.id, 'montantAlloue', parseFloat(e.target.value) || 0)}
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Button
                                                    variant="ghost" size="icon"
                                                    className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => removeLine(line.id)}
                                                    disabled={lines.length === 1}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
                            <Button variant="outline" size="sm" onClick={addLine} className="text-blue-600 border-blue-200 hover:bg-blue-50 border-dashed">
                                <PlusCircle className="h-4 w-4 mr-2" /> Ajouter une ligne
                            </Button>
                            <div className="text-right">
                                <p className="text-[10px] text-slate-500 uppercase font-bold">Total Budget</p>
                                <p className="text-lg font-black text-slate-900">{montantGlobal.toLocaleString('fr-FR')} XAF</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Résumé */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="bg-slate-50/50 border-b py-4">
                    <CardTitle className="text-lg font-semibold text-slate-800">Résumé du budget</CardTitle>
                </CardHeader>
                <CardContent className="py-8 text-center text-slate-400 italic">
                    {!nom || selectedAxeIds.length === 0 ? (
                        <div className="flex flex-col items-center gap-2">
                            <HelpCircle className="h-8 w-8 opacity-20" />
                            <p>Remplissez le nom et sélectionnez au moins un axe pour voir le résumé.</p>
                        </div>
                    ) : (
                        <div className="text-left text-slate-700 not-italic space-y-4">
                            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-md">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Budget</p>
                                    <p className="text-xl font-bold text-slate-900">{nom}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total Alloué</p>
                                    <p className="text-2xl font-black text-blue-600">{montantGlobal.toLocaleString('fr-FR')} XAF</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-2">
                                <div>
                                    <p className="text-xs text-slate-500 font-bold">Axes</p>
                                    <p className="text-sm font-medium">{selectedAxes.map(a => a.libelle).join(', ')}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold">Période</p>
                                    <p className="text-sm font-medium">Du {new Date(dateDebut).toLocaleDateString('fr-FR')} au {new Date(dateFin).toLocaleDateString('fr-FR')}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold">Seuil</p>
                                    <p className="text-sm font-medium">{seuilAlerte}%</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold">Lignes</p>
                                    <p className="text-sm font-medium">{lines.length} compte(s)</p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Footer */}
            <div className="sticky bottom-0 bg-slate-50/90 backdrop-blur-sm p-6 border-t border-slate-200 flex items-center justify-end gap-4 mt-6 -mx-8 -mb-14">
                <Button variant="outline" onClick={onCancel} className="h-11 px-8 border-slate-300 bg-white hover:bg-slate-50 font-semibold text-slate-600">
                    Annuler
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => handleSubmit('DRAFT')}
                    className="h-11 px-8 bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200 font-semibold"
                >
                    <Save className="h-4 w-4 mr-2" /> Brouillon
                </Button>
                <Button
                    onClick={() => handleSubmit('ACTIVE')}
                    className="h-11 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200"
                    disabled={montantGlobal <= 0}
                >
                    <CheckCircle className="h-4 w-4 mr-2" /> Activer le budget
                </Button>
            </div>
        </div>
    );
}
