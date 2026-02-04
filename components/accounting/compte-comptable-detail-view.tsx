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
            <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between border-b pb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Détails du Compte</h2>
                        <p className="text-sm text-gray-500 mt-1">Informations en lecture seule</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600">N° Compte</label>
                        <p className="text-lg font-mono font-bold text-gray-900">{compte.noCompte}</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600">Libellé</label>
                        <p className="text-lg text-gray-900">{compte.libelle}</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600">Type de Compte</label>
                        <p className="text-lg text-gray-900">{compte.typeCompte || '-'}</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600">Classe</label>
                        <p className="text-lg text-gray-900">{compte.classe || '-'}</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600">Solde</label>
                        <p className={`text-lg font-semibold ${(compte.solde || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {compte.solde?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || '0.00'} FCFA
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600">Statut</label>
                        <div>
                            <Badge variant={compte.actif ? 'default' : 'secondary'} className={
                                compte.actif
                                    ? 'bg-green-100 text-green-700 border-green-200'
                                    : 'bg-gray-100 text-gray-600 border-gray-200'
                            }>
                                {compte.actif ? 'Actif' : 'Inactif'}
                            </Badge>
                        </div>
                    </div>
                </div>

                {compte.notes && (
                    <div className="space-y-2 pt-4 border-t">
                        <label className="text-sm font-semibold text-gray-600">Notes</label>
                        <p className="text-gray-700 whitespace-pre-wrap">{compte.notes}</p>
                    </div>
                )}

                {compte.createdAt && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t text-sm text-gray-500">
                        <div>
                            <span className="font-semibold">Créé le : </span>
                            {new Date(compte.createdAt).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                        {compte.updatedAt && (
                            <div>
                                <span className="font-semibold">Modifié le : </span>
                                {new Date(compte.updatedAt).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        )}
                    </div>
                )}
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
