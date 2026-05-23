"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, HelpCircle, Save, CheckCircle, X, PlusCircle, Target, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
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
    const [axeId, setAxeId] = useState('');
    const [compteAnalytiqueId, setCompteAnalytiqueId] = useState('');
    const [dateDebut, setDateDebut] = useState('2026-01-01');
    const [dateFin, setDateFin] = useState('2026-12-31');
    const [seuilAlerte, setSeuilAlerte] = useState('80');
    const [typeBudget, setTypeBudget] = useState('DETAILED');
    const [montantGlobal, setMontantGlobal] = useState<number>(0);
    const [lines, setLines] = useState<(BudgetLine & { pourcentage: number })[]>([
        { id: '1', compteComptableId: '', montantAlloue: 0, description: '', pourcentage: 100 }
    ]);

    const selectedAxe = axes.find(a => a.id === axeId);
    const mockComptesAnalytiques = selectedAxe ? [
        { id: 'ca1', libelle: `Compte 1 - ${selectedAxe.libelle}` },
        { id: 'ca2', libelle: `Compte 2 - ${selectedAxe.libelle}` },
    ] : [];

    const addLine = () => {
        setLines([...lines, { id: Math.random().toString(36).substr(2, 9), compteComptableId: '', montantAlloue: 0, description: '', pourcentage: 0 }]);
    };

    const removeLine = (id: string) => {
        if (lines.length > 1) {
            setLines(lines.filter(l => l.id !== id));
        }
    };

    const updateLine = (id: string, field: string, value: any) => {
        setLines(lines.map(l => {
            if (l.id === id) {
                const updatedLine = { ...l, [field]: value };
                if (field === 'pourcentage') {
                    updatedLine.montantAlloue = (montantGlobal * (parseFloat(value) || 0)) / 100;
                } else if (field === 'montantAlloue') {
                    updatedLine.pourcentage = montantGlobal > 0 ? ((parseFloat(value) || 0) / montantGlobal) * 100 : 0;
                }
                return updatedLine;
            }
            return l;
        }));
    };

    // Update lines when total budget changes
    useEffect(() => {
        setLines(prev => prev.map(l => ({
            ...l,
            montantAlloue: (montantGlobal * (l.pourcentage || 0)) / 100
        })));
    }, [montantGlobal]);

    const totalPercentage = lines.reduce((acc, line) => acc + (line.pourcentage || 0), 0);
    const totalBudget = lines.reduce((acc, line) => acc + (line.montantAlloue || 0), 0);

    const handleSubmit = (status: 'DRAFT' | 'ACTIVE') => {
        if (!nom || !axeId || !compteAnalytiqueId || montantGlobal <= 0) {
            toast.error('Veuillez remplir les champs obligatoires (*) et un montant global valide');
            return;
        }

        if (status === 'ACTIVE' && Math.round(totalPercentage) !== 100) {
            toast.error('La répartition doit être égale à exactement 100% pour activer le budget');
            return;
        }

        onSubmit({
            nom, axeId, compteAnalytiqueId, dateDebut, dateFin, seuilAlerte, typeBudget, lines, status, totalBudget, montantGlobal
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
                    <div className="space-y-2">
                        <Label className="text-slate-700 font-medium">Nom du budget <span className="text-red-500">*</span></Label>
                        <Input
                            placeholder="Ex: Budget Projet Alpha 2026"
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                            className="border-slate-300 focus:ring-blue-500"
                        />
                        <p className="text-xs text-slate-500">Donnez un nom explicite à votre budget pour le retrouver facilement.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-slate-700 font-medium">Axe analytique <span className="text-red-500">*</span></Label>
                            <Select value={axeId} onValueChange={setAxeId}>
                                <SelectTrigger className="border-slate-300">
                                    <SelectValue placeholder="Sélectionner un axe..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {axes.map(axe => (
                                        <SelectItem key={axe.id} value={axe.id}>{axe.libelle}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-slate-500">L'axe détermine la dimension d'analyse : projet, département ou produit.</p>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-700 font-medium">Compte analytique <span className="text-red-500">*</span></Label>
                            <Select value={compteAnalytiqueId} onValueChange={setCompteAnalytiqueId} disabled={!axeId}>
                                <SelectTrigger className="border-slate-300">
                                    <SelectValue placeholder={axeId ? "Sélectionner un compte..." : "Sélectionner d'abord un axe..."} />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockComptesAnalytiques.map(ca => (
                                        <SelectItem key={ca.id} value={ca.id}>{ca.libelle}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-slate-500">Le compte analytique correspond à l'entité spécifique à budgéter.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label className="text-slate-700 font-semibold flex items-center gap-2">
                                <Target className="h-4 w-4 text-blue-600" /> Montant Global (XAF) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="number"
                                placeholder="Ex: 5000000"
                                value={montantGlobal || ''}
                                onChange={(e) => setMontantGlobal(parseFloat(e.target.value) || 0)}
                                className="h-11 border-slate-300 focus:ring-blue-600 font-bold text-lg text-blue-700"
                            />
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
                                    <SelectValue placeholder="80% - Alerte standard" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="50">50% - Alerte précoce</SelectItem>
                                    <SelectItem value="80">80% - Alerte standard</SelectItem>
                                    <SelectItem value="90">90% - Alerte critique</SelectItem>
                                    <SelectItem value="100">100% - Budget épuisé</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-slate-500">Une notification sera envoyée lorsque le réalisé dépassera ce pourcentage du budget alloué.</p>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-700 font-medium">Type de budget</Label>
                            <Select value={typeBudget} onValueChange={setTypeBudget}>
                                <SelectTrigger className="border-slate-300">
                                    <SelectValue placeholder="Détaillé par compte" />
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

            {/* Allocation budgétaire par compte */}
            {typeBudget === 'DETAILED' && (
                <Card className="border-slate-200 shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b py-4">
                        <CardTitle className="text-lg font-semibold text-slate-800">Allocation budgétaire par compte</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-100/80 text-[11px] uppercase tracking-wider text-slate-600 font-bold border-b text-center">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Compte Comptable</th>
                                        <th className="px-4 py-3">Description</th>
                                        <th className="px-4 py-3 w-[120px]">Répartition (%)</th>
                                        <th className="px-4 py-3 w-[180px] text-right">Montant (XAF)</th>
                                        <th className="px-4 py-3 w-[80px]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {lines.map((line) => (
                                        <tr key={line.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-4 py-3 w-64">
                                                <Select value={line.compteComptableId} onValueChange={(val) => updateLine(line.id, 'compteComptableId', val)}>
                                                    <SelectTrigger className="h-10 border-slate-300">
                                                        <SelectValue placeholder="Choisir..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="601">601 - Matières premières</SelectItem>
                                                        <SelectItem value="613">613 - Loyers</SelectItem>
                                                        <SelectItem value="623">623 - Publicité</SelectItem>
                                                        <SelectItem value="641">641 - Salaires</SelectItem>
                                                    </SelectContent>
                                                </Select>
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
                                                <div className="relative">
                                                    <Input
                                                        type="number"
                                                        className="h-10 text-center border-slate-300 font-bold text-blue-600 pr-7"
                                                        value={line.pourcentage || ''}
                                                        onChange={(e) => updateLine(line.id, 'pourcentage', e.target.value)}
                                                    />
                                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs mt-0.5">%</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Input
                                                    type="number"
                                                    className="h-10 text-right border-slate-300 font-mono font-medium"
                                                    value={line.montantAlloue || ''}
                                                    onChange={(e) => updateLine(line.id, 'montantAlloue', e.target.value)}
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
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
                                <PlusCircle className="h-4 w-4 mr-2" /> Ajouter une ligne d'imputation
                            </Button>

                            <div className="flex items-center gap-6">
                                <div className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg border font-bold",
                                    Math.round(totalPercentage) === 100
                                        ? "bg-green-50 text-green-700 border-green-200"
                                        : "bg-red-50 text-red-700 border-red-200"
                                )}>
                                    Total: {totalPercentage.toFixed(1)}%
                                    {Math.round(totalPercentage) !== 100 && (
                                        <span className="text-[10px] font-normal ml-1">(Doit être 100%)</span>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-500 uppercase font-bold">Total Budget</p>
                                    <p className="text-lg font-black text-slate-900">{totalBudget.toLocaleString()} XAF</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Résumé du budget */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="bg-slate-50/50 border-b py-4">
                    <CardTitle className="text-lg font-semibold text-slate-800">Résumé du budget</CardTitle>
                </CardHeader>
                <CardContent className="py-8 text-center text-slate-400 italic">
                    {!nom || !axeId || !compteAnalytiqueId ? (
                        <div className="flex flex-col items-center gap-2">
                            <HelpCircle className="h-8 w-8 opacity-20" />
                            <p>Remplissez les informations ci-dessus pour voir le résumé.</p>
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
                                    <p className="text-2xl font-black text-blue-600">{totalBudget.toLocaleString('fr-FR')} XAF</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-2">
                                <div>
                                    <p className="text-xs text-slate-500 font-bold">Axe</p>
                                    <p className="text-sm font-medium">{selectedAxe?.libelle}</p>
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
                                    <p className="text-sm font-medium">{lines.length} comptes</p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Footer Buttons */}
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
                >
                    <CheckCircle className="h-4 w-4 mr-2" /> Activer le budget
                </Button>
            </div>
        </div>
    );
}
