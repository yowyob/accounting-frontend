"use client";

import React, { useEffect } from 'react';
import { CompteDto } from '@/src/lib2/models/CompteDto';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';

interface ProductFormProps {
    initialData: Partial<CompteDto> | null;
    onSave: (data: CompteDto) => void;
}

export function ProductForm({ initialData, onSave }: ProductFormProps) {
    const form = useForm<CompteDto>({
        defaultValues: {
            libelle: '',
            noCompte: '',
            actif: true,
            solde: 0,
            notes: '',
            ...initialData
        },
    });

    useEffect(() => {
        form.reset({
            libelle: '',
            noCompte: '',
            actif: true,
            solde: 0,
            notes: '',
            ...initialData
        });
    }, [initialData, form]);

    const onSubmit = (data: CompteDto) => {
        onSave(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col">
                <div className="flex-1 p-6 overflow-y-auto space-y-6">
                    <FormField control={form.control} name="libelle" rules={{ required: "Le libellé est requis" }} render={({ field }) => (
                        <FormItem><FormLabel>Libellé de l'article *</FormLabel><FormControl><Input {...field} value={field.value || ''} className="border-gray-300" /></FormControl><FormMessage /></FormItem>
                    )} />

                    <FormField control={form.control} name="noCompte" rules={{ required: "Le code est requis" }} render={({ field }) => (
                        <FormItem><FormLabel>Code Article *</FormLabel><FormControl><Input {...field} value={field.value || ''} className="border-gray-300" /></FormControl><FormMessage /></FormItem>
                    )} />

                    <FormField control={form.control} name="notes" render={({ field }) => (
                        <FormItem><FormLabel>Description / Notes</FormLabel><FormControl><Textarea {...field} value={field.value || ''} rows={4} className="border-gray-300" /></FormControl></FormItem>
                    )} />

                    <Separator />

                    <div className="space-y-4">
                        <FormField control={form.control} name="actif" render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                <FormLabel>Article Actif ?</FormLabel>
                                <FormControl><Switch checked={!!field.value} onCheckedChange={field.onChange} /></FormControl>
                            </FormItem>
                        )} />
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        <Save className="h-4 w-4 mr-2" />
                        {form.formState.isSubmitting ? 'Sauvegarde...' : (initialData?.id ? "Enregistrer les modifications" : "Créer l'article")}
                    </Button>
                </div>
            </form>
        </Form>
    );
}