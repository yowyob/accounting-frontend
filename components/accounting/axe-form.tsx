"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Layers, User, Save, Plus, Trash2, Tag, ToggleLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { hasPermission } from '@/src/lib/auth/roles';

export interface AnalyticalAccount {
    id: string;
    libelle: string;
    dateDebut?: string;
    dateFin?: string;
}

export interface AxeFormProps {
    initialData?: any;
    onCancel: () => void;
    onSubmit: (data: any) => void;
}

export function AxeForm({ initialData, onCancel, onSubmit }: AxeFormProps) {
    const { accountingRole } = useAuth();
    const canToggleActif = hasPermission(accountingRole, 'analytics', 'update');

    const [libelle, setLibelle] = useState(initialData?.libelle || '');
    const [type, setType] = useState(initialData?.type || 'PROJET');
    const [responsable, setResponsable] = useState(initialData?.responsable || '');
    const [actif, setActif] = useState<boolean>(initialData?.actif ?? true);
    const [comptes, setComptes] = useState<AnalyticalAccount[]>(initialData?.comptes || []);

    // Autocomplétion responsable
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleResponsableChange = (value: string) => {
        setResponsable(value);
        if (value.length >= 1) {
            try {
                const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
                const fullNames: string[] = users.map((u: any) => `${u.firstName} ${u.lastName}`.trim()).filter(Boolean);
                const filtered = fullNames.filter(name =>
                    name.toLowerCase().startsWith(value.toLowerCase())
                ).slice(0, 5);
                setSuggestions(filtered);
                setShowSuggestions(filtered.length > 0);
            } catch {
                setShowSuggestions(false);
            }
        } else {
            setShowSuggestions(false);
        }
    };

    const handleAddCompte = () => {
        setComptes([...comptes, { id: Date.now().toString(), libelle: '' }]);
    };

    const handleUpdateCompte = (id: string, newLibelle: string) => {
        setComptes(comptes.map(c => c.id === id ? { ...c, libelle: newLibelle } : c));
    };

    const handleRemoveCompte = (id: string) => {
        setComptes(comptes.filter(c => c.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!libelle) {
            toast.error('Veuillez remplir les champs obligatoires');
            return;
        }
        if (comptes.some(c => !c.libelle.trim())) {
            toast.error('Veuillez donner un libellé à tous les comptes analytiques, ou supprimez les lignes vides.');
            return;
        }

        const payload: any = {
            id: initialData?.id || Date.now().toString(),
            libelle,
            type,
            responsable,
            actif,
            comptes,
        };

        if (initialData?.code) {
            payload.code = initialData.code;
        }

        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col min-h-full">
            <div className="flex-1 p-8 space-y-8">

                {/* Libellé */}
                <div className="space-y-3">
                    <Label className="text-slate-700 font-semibold flex items-center gap-2 text-sm uppercase tracking-wider">
                        <Layers className="h-4 w-4 text-blue-600" /> Libellé de l'axe <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        placeholder="Ex: Projet ERP Sud"
                        value={libelle}
                        onChange={(e) => setLibelle(e.target.value)}
                        className="h-11 border-slate-300 focus:ring-blue-600 focus:border-blue-600 text-base"
                    />
                    <p className="text-xs text-slate-400">Le code sera généré automatiquement par le système.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Type */}
                    <div className="space-y-3">
                        <Label className="text-slate-700 font-semibold text-sm uppercase tracking-wider">Type d'analyse</Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger className="h-11 border-slate-300 text-base">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PROJET">Projet</SelectItem>
                                <SelectItem value="DEPARTEMENT">Département</SelectItem>
                                <SelectItem value="PRODUIT">Produit</SelectItem>
                                <SelectItem value="ACTIVITE">Activité</SelectItem>
                                <SelectItem value="CENTRE_COUT">Centre de coût</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Responsable avec autocomplétion */}
                    <div className="space-y-3">
                        <Label className="text-slate-700 font-semibold flex items-center gap-2 text-sm uppercase tracking-wider">
                            <User className="h-4 w-4 text-slate-400" /> Responsable
                        </Label>
                        <div className="relative" ref={suggestionsRef}>
                            <Input
                                placeholder="Nom du responsable..."
                                value={responsable}
                                onChange={(e) => handleResponsableChange(e.target.value)}
                                onFocus={() => responsable.length >= 1 && suggestions.length > 0 && setShowSuggestions(true)}
                                className="h-11 border-slate-300 text-base"
                                autoComplete="off"
                            />
                            {showSuggestions && (
                                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
                                    {suggestions.map((name, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors border-b border-slate-50 last:border-0"
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                setResponsable(name);
                                                setShowSuggestions(false);
                                            }}
                                        >
                                            {name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Toggle actif/inactif — visible pour Comptable et Responsable */}
                {canToggleActif && (
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="space-y-0.5">
                            <Label className="text-slate-700 font-semibold flex items-center gap-2 text-sm">
                                <ToggleLeft className="h-4 w-4 text-slate-500" /> Statut de l'axe
                            </Label>
                            <p className="text-xs text-slate-500">
                                {actif
                                    ? 'Cet axe est actif et peut être rattaché à un budget.'
                                    : 'Cet axe est inactif et ne sera pas proposé lors de la création d\'un budget.'}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`text-xs font-semibold ${actif ? 'text-green-600' : 'text-slate-400'}`}>
                                {actif ? 'Actif' : 'Inactif'}
                            </span>
                            <Switch
                                checked={actif}
                                onCheckedChange={setActif}
                            />
                        </div>
                    </div>
                )}

                {/* Comptes analytiques */}
                <div className="space-y-4 pt-6 border-t border-slate-200">
                    <div className="flex justify-between items-center">
                        <Label className="text-slate-800 font-bold flex items-center gap-2 text-sm uppercase tracking-wider">
                            <Tag className="h-4 w-4 text-emerald-600" /> Comptes Analytiques Liés
                        </Label>
                        <Button type="button" variant="outline" size="sm" onClick={handleAddCompte} className="text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100">
                            <Plus className="h-4 w-4 mr-1" /> Ajouter un compte
                        </Button>
                    </div>

                    {comptes.length > 0 ? (
                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead>Libellé du compte</TableHead>
                                        <TableHead className="w-[80px] text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {comptes.map((compte) => (
                                        <TableRow key={compte.id} className="hover:bg-slate-50">
                                            <TableCell className="p-2 pl-4">
                                                <Input
                                                    value={compte.libelle}
                                                    onChange={(e) => handleUpdateCompte(compte.id, e.target.value)}
                                                    placeholder="Ex: Frais de déplacement"
                                                    className="h-9 border-slate-200"
                                                />
                                            </TableCell>
                                            <TableCell className="p-2 pr-4 text-right">
                                                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600" onClick={() => handleRemoveCompte(compte.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center p-6 border border-dashed border-slate-300 rounded-lg bg-slate-50">
                            <p className="text-sm text-slate-500 mb-3">Aucun compte analytique n'est encore lié à cet axe.</p>
                            <Button type="button" variant="outline" onClick={handleAddCompte} className="border-slate-300">
                                Créer le premier compte
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <div className="sticky bottom-0 bg-slate-50/90 backdrop-blur-sm p-6 border-t border-slate-200 flex justify-end gap-4 mt-auto">
                <Button type="button" variant="outline" onClick={onCancel} className="h-11 px-10 border-slate-300 bg-white hover:bg-slate-50 font-semibold text-slate-600">
                    Annuler
                </Button>
                <Button type="submit" className="h-11 px-10 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200">
                    <Save className="h-5 w-5 mr-2" /> {initialData ? "Mettre à jour l'axe" : "Créer l'axe analytique"}
                </Button>
            </div>
        </form>
    );
}
