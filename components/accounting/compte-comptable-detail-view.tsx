"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Save, ArrowLeft } from 'lucide-react';
import { CompteDto } from '@/src/lib2/models/CompteDto';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface CompteComptableDetailViewProps {
    compte: CompteDto | null;
    onSave: (data: CompteDto) => void;
    onBack: () => void;
    onEdit?: () => void;
    isEditing?: boolean;
}

const ACCOUNT_TYPES = [
    { value: 'ACTIF', label: 'Actif' },
    { value: 'PASSIF', label: 'Passif' },
    { value: 'CHARGE', label: 'Charge' },
    { value: 'PRODUIT', label: 'Produit' },
    { value: 'AUTRE', label: 'Autre' },
];

export const CompteComptableDetailView: React.FC<CompteComptableDetailViewProps> = ({
    compte,
    onSave,
    onBack,
    onEdit,
    isEditing = false,
}) => {
    const form = useForm<CompteDto>({
        defaultValues: compte || {
            noCompte: '',
            libelle: '',
            typeCompte: 'AUTRE',
            classe: 1,
            actif: true,
            solde: 0,
            notes: '',
        },
    });

    const noCompte = form.watch('noCompte');

    React.useEffect(() => {
        if (noCompte && noCompte.length > 0) {
            const firstDigit = parseInt(noCompte.charAt(0));
            if (!isNaN(firstDigit) && firstDigit >= 1 && firstDigit <= 9) {
                form.setValue('classe', firstDigit);
            }
        }
    }, [noCompte, form]);

    const onSubmit = (data: CompteDto) => {
        onSave(data);
    };

    // Read-only view
    if (!isEditing && compte) {
        return (
            <div className="bg-white min-h-full">
                <div className="p-8 space-y-8">
                    {/* Header Info (Blue Summary Box) */}
                    <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 shadow-sm space-y-6">
                        <div className="flex items-center justify-between border-b border-blue-100 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-600 p-2 rounded-lg text-white">
                                    <div className="h-5 w-5 flex items-center justify-center font-bold text-xs">C</div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-blue-900 uppercase tracking-tight">Détails du Compte</h3>
                                    <p className="text-sm text-blue-600/70 font-medium">Numéro: {compte.noCompte}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant={compte.actif ? 'default' : 'secondary'} className={
                                    compte.actif
                                        ? 'bg-green-100 text-green-700 border-green-200'
                                        : 'bg-gray-100 text-gray-600 border-gray-200'
                                }>
                                    {compte.actif ? 'Actif' : 'Inactif'}
                                </Badge>
                                {onEdit && (
                                    <Button variant="outline" size="sm" onClick={onEdit} className="h-8 border-blue-200 text-blue-700 hover:bg-blue-50">
                                        Modifier
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Libellé</p>
                                <p className="text-sm font-semibold text-blue-900">{compte.libelle}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Type de Compte</p>
                                <p className="text-sm font-semibold text-blue-900">{compte.typeCompte || '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Classe</p>
                                <p className="text-sm font-semibold text-blue-900">{compte.classe || '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Solde actuel</p>
                                <p className={`text-sm font-bold ${(compte.solde || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {compte.solde?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || '0.00'} FCFA
                                </p>
                            </div>
                        </div>
                    </div>

                    {compte.notes && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 border-b pb-2">
                                <div className="h-4 w-1 bg-blue-600 rounded-full" />
                                <h4 className="text-sm font-bold text-gray-700 tracking-tight uppercase">Notes</h4>
                            </div>
                            <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100 italic leading-relaxed whitespace-pre-wrap">
                                {compte.notes}
                            </p>
                        </div>
                    )}

                    {compte.createdAt && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                            <div className="flex items-center gap-1.5 font-bold tracking-wider">
                                <span>Créé le : </span>
                                <span className="text-gray-500">
                                    {new Date(compte.createdAt).toLocaleDateString('fr-FR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                            {compte.updatedAt && (
                                <div className="flex items-center gap-1.5 font-bold tracking-wider">
                                    <span>Modifié le : </span>
                                    <span className="text-gray-500">
                                        {new Date(compte.updatedAt).toLocaleDateString('fr-FR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
                    <Button variant="outline" onClick={onBack} className="min-w-[100px] border-gray-300">
                        Fermer
                    </Button>
                </div>
            </div>
        );
    }

    // Edit/Create form
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between border-b pb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {compte ? 'Modifier le Compte' : 'Nouveau Compte'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {compte ? 'Modifiez les informations du compte' : 'Créez un nouveau compte comptable'}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="noCompte"
                        rules={{ required: "Le numéro de compte est requis" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>N° Compte <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Ex: 411000" className="font-mono" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="libelle"
                        rules={{ required: "Le libellé est requis" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Libellé <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Ex: Clients" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="typeCompte"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type de Compte</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value || undefined}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner un type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {ACCOUNT_TYPES.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="classe"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Classe</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                        placeholder="Ex: 4"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="solde"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Solde Initial</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        {...field}
                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                        placeholder="0.00"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="actif"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Compte Actif</FormLabel>
                                    <div className="text-sm text-gray-500">
                                        Le compte est-il actif ?
                                    </div>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    placeholder="Notes ou commentaires sur ce compte..."
                                    rows={4}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="outline" type="button" onClick={onBack}>
                        Annuler
                    </Button>
                    <Button type="submit" disabled={form.formState.isSubmitting} className="bg-[#007bff] hover:bg-[#0069d9]">
                        <span>{form.formState.isSubmitting ? "Enregistrement..." : (compte?.id ? "Enregistrer les modifications" : "Enregistrer")}</span>
                    </Button>
                </div>
            </form>
        </Form>
    );
};
