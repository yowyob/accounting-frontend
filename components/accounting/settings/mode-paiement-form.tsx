// components/accounting/settings/mode-paiement-form.tsx
"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save } from 'lucide-react';
import { ModePaiement, ModePaiementType } from '@/types/accounting';

interface ModePaiementFormProps {
  initialData: Partial<ModePaiement> | null;
  onSave: (data: ModePaiement) => void;
  onCancel: () => void;
}

// Pour remplir le menu déroulant "Type"
const modeTypeLabels: Record<ModePaiementType, string> = {
  banque: 'Banque',
  especes: 'Espèces',
  mobile_money: 'Mobile Money',
  autre: 'Autre'
};

export const ModePaiementForm: React.FC<ModePaiementFormProps> = ({
  initialData,
  onSave,
  onCancel
}) => {
  const form = useForm<ModePaiement>({
    defaultValues: initialData || {
      name: '',
      type: 'banque',
      journalId: '',
    },
  });

  const onSubmit = (data: ModePaiement) => {
    const cleanData = {
      ...data,
      id: data.id || undefined,
    } as ModePaiement;
    onSave(cleanData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col rounded-lg shadow-lg bg-white overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium">{initialData?.id ? 'Modifier le Mode de Paiement' : 'Nouveau Mode de Paiement'}</h3>
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du mode de paiement *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="ex: Compte UBA, Caisse Espèces..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(modeTypeLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="journalId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Compte Comptable (ex: 571)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="ex: 571100" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

        </div>

        <div className="p-4 border-t flex justify-end bg-gray-50 rounded-b-lg gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            ANNULER
          </Button>
          <Button type="submit">
            {form.formState.isSubmitting ? "Enregistrement..." : (initialData?.id ? "Enregistrer les modifications" : "Enregistrer")}
          </Button>
        </div>
      </form>
    </Form>
  );
};