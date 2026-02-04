"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Lock } from 'lucide-react';
import { ExerciceComptableDto } from '@/src/lib2/models/ExerciceComptableDto';

interface ExerciceComptableDetailViewProps {
    exercice: ExerciceComptableDto | null;
    onSave: (data: ExerciceComptableDto) => void;
    onClose: () => void;
    onBack: () => void;
    onEdit?: () => void;
    forceEdit?: boolean;
}

export const ExerciceComptableDetailView: React.FC<ExerciceComptableDetailViewProps> = ({
    exercice,
    onSave,
    onClose,
    onBack,
    forceEdit = false,
}) => {
    const form = useForm<ExerciceComptableDto>({
        defaultValues: exercice || {
            code: '',
            libelle: '',
            date_debut: new Date().getFullYear() + '-01-01',
            date_fin: new Date().getFullYear() + '-12-31',
            cloture: false,
        },
    });

    const onSubmit = (data: ExerciceComptableDto) => {
        onSave(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="code"
                            rules={{ required: "Le code est requis" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Code <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="EX: 2025" disabled={exercice?.cloture} />
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
                                        <Input {...field} placeholder="EX: Exercice 2025" disabled={exercice?.cloture} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="date_debut"
                            rules={{ required: "Requis" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date de début <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} disabled={exercice?.cloture} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="date_fin"
                            rules={{ required: "Requis" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date de fin <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} disabled={exercice?.cloture} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="p-4 border-t flex justify-between gap-3 bg-gray-50">
                    <div>
                        {exercice && !exercice.cloture && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="text-orange-600 border-orange-200 bg-orange-50 hover:bg-orange-100"
                            >
                                <Lock className="mr-2 h-4 w-4" />
                                Clôturer
                            </Button>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" type="button" onClick={onBack}>
                            Annuler
                        </Button>
                        {!exercice?.cloture && (
                            <Button type="submit" disabled={form.formState.isSubmitting} className="bg-[#007bff] hover:bg-[#0069d9]">
                                <Save className="mr-2 h-4 w-4" />
                                <span>{form.formState.isSubmitting ? "Enregistrement..." : (exercice ? "Enregistrer les modifications" : "Créer l'Exercice")}</span>
                            </Button>
                        )}
                    </div>
                </div>
            </form>
        </Form>
    );
};
