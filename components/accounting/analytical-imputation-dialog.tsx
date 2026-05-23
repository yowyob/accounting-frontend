"use client";

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Calculator, Info } from 'lucide-react';
import { toast } from 'sonner';

interface ImputationLine {
    id: string;
    axeId: string;
    compteAnalytiqueId: string;
    percentage: number;
    amount: number;
}

interface AnalyticalImputationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    totalAmount: number;
    onConfirm: (lines: ImputationLine[]) => void;
}

export function AnalyticalImputationDialog({
    isOpen,
    onClose,
    totalAmount,
    onConfirm
}: AnalyticalImputationDialogProps) {
    const [lines, setLines] = useState<ImputationLine[]>([
        { id: '1', axeId: 'a1', compteAnalytiqueId: 'ca1', percentage: 100, amount: totalAmount }
    ]);

    const addLine = () => {
        setLines([...lines, { id: Math.random().toString(36).substr(2, 9), axeId: '', compteAnalytiqueId: '', percentage: 0, amount: 0 }]);
    };

    const removeLine = (id: string) => {
        if (lines.length > 1) {
            setLines(lines.filter(l => l.id !== id));
        }
    };

    const updateLine = (id: string, field: keyof ImputationLine, value: any) => {
        const newLines = lines.map(l => {
            if (l.id === id) {
                const updated = { ...l, [field]: value };
                if (field === 'percentage') {
                    updated.amount = (totalAmount * (parseFloat(value) || 0)) / 100;
                } else if (field === 'amount') {
                    updated.percentage = totalAmount > 0 ? ((parseFloat(value) || 0) / totalAmount) * 100 : 0;
                }
                return updated;
            }
            return l;
        });
        setLines(newLines);
    };

    const totalPercentage = lines.reduce((acc, l) => acc + (l.percentage || 0), 0);
    const totalAllocated = lines.reduce((acc, l) => acc + (l.amount || 0), 0);

    const handleConfirm = () => {
        if (Math.abs(totalPercentage - 100) > 0.01) {
            toast.error('Le total des répartitions doit être égal à 100%');
            return;
        }
        onConfirm(lines);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] border-slate-200">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-blue-600">
                        <Calculator className="h-5 w-5" /> Imputation Analytique
                    </DialogTitle>
                    <DialogDescription>
                        Ventilez le montant de <strong>{totalAmount.toLocaleString('fr-FR')} XAF</strong> sur vos comptes analytiques.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    <div className="bg-slate-50 p-4 rounded-lg flex items-start gap-3 border border-slate-100">
                        <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Pour respecter la norme SYSCOA, vous devez imputer la totalité du montant sur un ou plusieurs comptes analytiques d'un axe défini.
                        </p>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3">
                        {lines.map((line) => (
                            <div key={line.id} className="grid grid-cols-12 gap-3 items-end bg-white border border-slate-200 p-3 rounded-md shadow-sm">
                                <div className="col-span-4 space-y-1.5">
                                    <Label className="text-[10px] uppercase font-bold text-slate-500">Axe & Compte</Label>
                                    <select
                                        className="w-full h-9 text-sm border border-slate-300 rounded-md bg-white px-2"
                                        value={line.compteAnalytiqueId}
                                        onChange={(e) => updateLine(line.id, 'compteAnalytiqueId', e.target.value)}
                                    >
                                        <option value="ca1">Projet Alpha</option>
                                        <option value="ca2">Département IT</option>
                                        <option value="ca3">Marketing Digital</option>
                                    </select>
                                </div>

                                <div className="col-span-3 space-y-1.5">
                                    <Label className="text-[10px] uppercase font-bold text-slate-500">Pourcentage (%)</Label>
                                    <Input
                                        type="number"
                                        value={line.percentage}
                                        onChange={(e) => updateLine(line.id, 'percentage', e.target.value)}
                                        className="h-9 border-slate-300"
                                    />
                                </div>

                                <div className="col-span-4 space-y-1.5">
                                    <Label className="text-[10px] uppercase font-bold text-slate-500">Montant (XAF)</Label>
                                    <Input
                                        type="number"
                                        value={line.amount}
                                        onChange={(e) => updateLine(line.id, 'amount', e.target.value)}
                                        className="h-9 border-slate-300"
                                    />
                                </div>

                                <div className="col-span-1 pb-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"
                                        onClick={() => removeLine(line.id)}
                                        disabled={lines.length === 1}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button variant="outline" size="sm" onClick={addLine} className="w-full border-dashed border-slate-300 text-slate-500 hover:text-blue-600 hover:bg-blue-50">
                        <Plus className="h-4 w-4 mr-2" /> Ajouter une ventilation
                    </Button>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                        <div className={`p-3 rounded-lg border flex flex-col items-center justify-center ${Math.abs(totalPercentage - 100) < 0.1 ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                            <span className="text-[10px] uppercase font-bold text-slate-500">Total Pourcentage</span>
                            <span className={`text-xl font-black ${Math.abs(totalPercentage - 100) < 0.1 ? 'text-green-600' : 'text-red-600'}`}>
                                {totalPercentage.toFixed(1)}%
                            </span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex flex-col items-center justify-center">
                            <span className="text-[10px] uppercase font-bold text-slate-500">Total Alloué</span>
                            <span className="text-xl font-black text-slate-800">
                                {totalAllocated.toLocaleString('fr-FR')} XAF
                            </span>
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose}>Annuler</Button>
                    <Button onClick={handleConfirm} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200">
                        Confirmer l'imputation
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
