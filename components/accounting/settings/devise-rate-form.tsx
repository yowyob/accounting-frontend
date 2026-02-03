// components/accounting/settings/devise-rate-form.tsx
"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save } from 'lucide-react';

interface DeviseRateFormProps {
    initialRate: number;
    currencyCode: string;
    nationalCurrencyCode: string;
    onSave: (rate: number) => void;
    onCancel: () => void;
}

export const DeviseRateForm: React.FC<DeviseRateFormProps> = ({
    initialRate,
    currencyCode,
    nationalCurrencyCode,
    onSave,
    onCancel
}) => {
    const form = useForm({
        defaultValues: {
            rate: initialRate || 1.0,
        },
    });

    const onSubmit = (data: { rate: number }) => {
        onSave(parseFloat(data.rate as any));
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
                    Définissez le taux de change pour <strong>1 {currencyCode}</strong> par rapport à la devise nationale (<strong>{nationalCurrencyCode}</strong>).
                </div>

                <FormField
                    control={form.control}
                    name="rate"
                    rules={{ required: "Requis", min: { value: 0.0000001, message: "Le taux doit être supérieur à 0" } }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nouveau taux de change <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <div className="flex items-center gap-3">
                                    <Input type="number" step="0.000001" {...field} className="font-mono text-lg" />
                                    <span className="font-bold text-gray-500">{nationalCurrencyCode}</span>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        ANNULER
                    </Button>
                    <Button type="submit" disabled={form.formState.isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                        <Save className="mr-2 h-4 w-4" />
                        Enregistrer le taux
                    </Button>
                </div>
            </form>
        </Form>
    );
};
