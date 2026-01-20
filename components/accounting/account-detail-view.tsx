"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { PlanComptableDto } from '@/src/lib2/models/PlanComptableDto';
import { Save, Trash2, ArrowLeft } from 'lucide-react';
import { UUID } from '@/types/accounting';

// Define form-specific defaults that align with PlanComptableDto type
const defaultAccountValues: Partial<PlanComptableDto> = {
  noCompte: '',
  libelle: '',
  notes: '',
  actif: true,
};

interface AccountDetailViewProps {
  account: PlanComptableDto | null;
  onSave: (data: PlanComptableDto) => void;
  onDelete: () => void;
  onBack: () => void;
}

export const AccountDetailView: React.FC<AccountDetailViewProps> = ({
  account,
  onSave,
  onDelete,
  onBack,
}) => {
  const form = useForm<PlanComptableDto>({
    defaultValues: account || defaultAccountValues as PlanComptableDto,
  });

  const onSubmit = (data: PlanComptableDto) => {
    const validatedData: PlanComptableDto = {
      ...data,
      id: data.id || crypto.randomUUID() as UUID,
      noCompte: data.noCompte || '',
      libelle: data.libelle || '',
    };
    onSave(validatedData);
  };

  // Predefined options for journalType and amountType
  const journalTypeOptions = [
    'Journal des ventes',
    'Journal des achats',
    'Journal des opérations diverses',
    'Journal de trésorerie',
  ];

  const amountTypeOptions = [
    'Montant TTC',
    'Montant HT',
    'Montant TVA',
  ];

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="noCompte"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="libelle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du compte <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="actif"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0">
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel>Actif</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"allowEntry" as any}
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0">
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel>Autoriser l&#39;écriture</FormLabel>
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Enregistrer
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
            <Button onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};