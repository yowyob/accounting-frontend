// components/accounting/settings/taxe-form.tsx
"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Taxe } from '@/types/accounting';

interface TaxeFormProps {
  initialData: Partial<Taxe> | null;
  onSave: (data: Taxe) => void;
  onCancel: () => void;
}

export const TaxeForm: React.FC<TaxeFormProps> = ({ initialData, onSave, onCancel }) => {
  const form = useForm<Taxe>({
    defaultValues: initialData || {
      name: '',
      rate: 0,
      taxAccount: '',
      type: 'collectee',
      mode: 'ajoute',
    },
  });

  const onSubmit = (data: Taxe) => {
    data.rate = parseFloat(data.rate as any);
    onSave(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col rounded-lg shadow-lg bg-white overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8 space-y-6">

          {/* Nom de la taxe (Pleine largeur) */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de la taxe <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input {...field} placeholder="ex: TVA Facturée 18%" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Taux et Compte sur la même ligne */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taux (en %) <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} placeholder="ex: 18" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="taxAccount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Compte comptable <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="ex: 4431" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Type et Mode sur la même ligne */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="collectee">TVA Collectée</SelectItem>
                      <SelectItem value="deductible">TVA Déductible</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mode <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un mode" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ajoute">Ajouté au prix</SelectItem>
                      <SelectItem value="inclus">Inclus dans le prix</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* PARTIE DESCRIPTION AJOUTÉE (Style Notes du Plan Comptable) */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={3}
                    placeholder="Informations supplémentaires sur cette taxe..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>

        {/* Footer harmonisé avec le Plan Comptable */}
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