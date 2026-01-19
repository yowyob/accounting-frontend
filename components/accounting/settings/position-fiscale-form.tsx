// components/accounting/settings/position-fiscale-form.tsx
"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { PositionFiscale, Taxe, OperationType } from '@/types/accounting';

interface PositionFiscaleFormProps {
  initialData: Partial<PositionFiscale> | null;
  allTaxes: Taxe[];
  onSave: (data: PositionFiscale) => void;
  onCancel: () => void;
}

const operationTypeLabels: Record<OperationType, string> = {
  vente: 'Vente',
  achat: 'Achat',
  importation: 'Importation',
  exportation: 'Exportation',
  exonere: 'Exonéré'
};

export const PositionFiscaleForm: React.FC<PositionFiscaleFormProps> = ({
  initialData,
  allTaxes,
  onSave,
  onCancel
}) => {
  const form = useForm<PositionFiscale>({
    defaultValues: initialData || {
      name: '',
      typeOperation: 'vente',
      taxeLieeId: '',
      description: ''
    },
  });

  const onSubmit = (data: PositionFiscale) => {
    onSave(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col rounded-lg shadow-lg bg-white overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8 space-y-6">

          {/* Champ: Nom (Pleine largeur comme dans le form compte) */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de la Position Fiscale <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Régime normal, Exonération…" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Champ: Type d'Opération */}
            <FormField
              control={form.control}
              name="typeOperation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type d’Opération <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(operationTypeLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Champ: Taxe liée */}
            <FormField
              control={form.control}
              name="taxeLieeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taxe liée (TVA) <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une taxe..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allTaxes.map(taxe => (
                        <SelectItem key={taxe.id} value={taxe.id}>
                          {taxe.name} ({taxe.taxAccount})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Champ: Description (Style Notes) */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (facultatif)</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={3}
                    placeholder="Ex : S'applique pour toutes les ventes locales au taux normal."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Footer avec structure et bouton identiques */}
        <div className="p-4 border-t flex justify-end bg-gray-50 rounded-b-lg">
          <Button
            type="submit"
            className="bg-[#007bff] hover:bg-[#0069d9]"
            disabled={form.formState.isSubmitting}
          >
            <Save size={16} className="mr-2" />
            <span>
              {form.formState.isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
            </span>
          </Button>
        </div>
      </form>
    </Form>
  );
};