"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { PlanComptableDto } from '@/src/lib2/models/PlanComptableDto';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AccountingFormProps {
  initialData: Partial<PlanComptableDto> | null;
  onSave: (data: PlanComptableDto) => void;
  onCancel: () => void;
}

export function AccountingForm({ initialData, onSave, onCancel }: AccountingFormProps) {
  const form = useForm<PlanComptableDto>({
    defaultValues: initialData || {
      id: undefined,
      noCompte: '',
      libelle: '',
      notes: '',
      actif: true,
    } as PlanComptableDto,
  });

  useEffect(() => {
    form.reset(initialData || {
      id: undefined,
      noCompte: '',
      libelle: '',
      notes: '',
      actif: true,
    } as PlanComptableDto);
  }, [initialData, form]);

  const onSubmit = (data: PlanComptableDto) => {
    // Nettoyage des données
    const cleanData = {
      ...data,
      id: data.id || undefined,
    } as PlanComptableDto;

    onSave(cleanData);
  };


  const journalTypeOptions = [
    'Journal des ventes',
    'Journal des achats',
    'Journal des opérations diverses',
    'Journal de trésorerie',
  ];

  const amountTypeOptions = [
    'Montant Toutes Taxes Comprises',
    'Montant Hors Taxes',
    'Montant Taxe sur Valeur Ajoutée',
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col rounded-lg shadow-lg bg-white overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8 space-y-6">


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="noCompte"
              rules={{ required: "Le code est requis" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: 411000" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="libelle"
              rules={{ required: "Le nom est requis" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du compte <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Clients" />
                  </FormControl>
                  <FormMessage />
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
                  <Input {...field} placeholder="Ex: Informations sur le compte" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name={"journalType" as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de journal</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type de journal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {journalTypeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
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
              name={"amountType" as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de montant</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type de montant" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {amountTypeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
            <FormField
              control={form.control}
              name={"allowEntry" as any}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Autoriser l&#39;écriture</FormLabel>
                    <FormMessage />
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
            <FormField
              control={form.control}
              name={"isStatic" as any}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Compte statique</FormLabel>
                    <FormMessage />
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
                  <Textarea {...field} rows={3} placeholder="Informations supplémentaires..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="p-4 border-t flex justify-end bg-gray-50 rounded-b-lg gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            ANNULER
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            <span>{form.formState.isSubmitting ? "Enregistrement..." : (initialData?.id ? "Enregistrer les modifications" : "Enregistrer")}</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}