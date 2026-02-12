"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CompteDto } from '@/src/lib2/models/CompteDto';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface SupplierFormProps {
    initialData: Partial<CompteDto> | null;
    onSave: (data: CompteDto) => void;
    onCancel: () => void;
}

export function SupplierForm({ initialData, onSave, onCancel }: SupplierFormProps) {
    const form = useForm<CompteDto>({
        defaultValues: {
            libelle: '',
            noCompte: '',
            actif: true,
            notes: '',
            solde: 0,
            ...initialData
        },
    });

    useEffect(() => {
        form.reset({
            libelle: '',
            noCompte: '',
            actif: true,
            notes: '',
            solde: 0,
            ...initialData
        });
    }, [initialData, form]);

    const onSubmit = (data: CompteDto) => {
        onSave(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <FormField control={form.control} name="libelle" rules={{ required: "La raison sociale est requise" }} render={({ field }) => (
                        <FormItem><FormLabel>Raison sociale *</FormLabel><FormControl><Input {...field} value={field.value || ''} className="border-gray-300" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="noCompte" rules={{ required: "Le code est requis" }} render={({ field }) => (
                        <FormItem><FormLabel>Code *</FormLabel><FormControl><Input {...field} value={field.value || ''} className="border-gray-300" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="notes" render={({ field }) => (
                        <FormItem><FormLabel>Notes</FormLabel><FormControl><Textarea {...field} value={field.value || ''} rows={3} className="border-gray-300" /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="actif" render={({ field }) => (
                        <FormItem className="flex items-center gap-2 pt-4"><FormControl><Switch checked={!!field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Fournisseur Actif</FormLabel></FormItem>
                    )} />
                </div>
                <div className="p-4 border-t bg-gray-50 flex justify-end">
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        <Save size={16} className="mr-2" />
                        {form.formState.isSubmitting ? "Enregistrement..." : (initialData?.id ? "Enregistrer les modifications" : "Créer le Fournisseur")}
                    </Button>
                </div>
            </form>
        </Form>
    );
}