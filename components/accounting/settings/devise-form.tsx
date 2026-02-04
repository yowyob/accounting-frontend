// components/accounting/settings/devise-form.tsx
"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Devise } from '@/types/accounting';

interface DeviseFormProps {
  initialData: Partial<Devise> | null;
  onSave: (data: Devise) => void;
  onCancel: () => void;
  isNationalDisabled?: boolean;
}

export const DeviseForm: React.FC<DeviseFormProps> = ({ initialData, onSave, onCancel, isNationalDisabled }) => {
  const form = useForm<Devise>({
    defaultValues: initialData || {
      name: '',
      code: '',
      symbol: '',
      rate: 1.0,
      isActive: true,
      estNationale: false,
    },
  });

  const onSubmit = (data: Devise) => {
    data.rate = parseFloat(data.rate as any);
    const cleanData = {
      ...data,
      id: data.id || undefined,
    } as Devise;
    onSave(cleanData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col rounded-lg shadow-lg bg-white overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8 space-y-6">

          {/* Nom de la devise (Pleine largeur comme "Nom du compte") */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de la devise <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input {...field} placeholder="ex: Euro" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Code ISO */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code (ISO) <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="ex: EUR" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Symbole */}
            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Symbole <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="ex: €" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>


          <div className="flex items-center space-x-8 pt-4">
            <FormField
              control={form.control}
              name="estNationale"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isNationalDisabled && !field.value}
                    />
                  </FormControl>
                  <FormLabel className={isNationalDisabled && !field.value ? "text-muted-foreground" : ""}>
                    Devise Nationale {isNationalDisabled && !field.value && "(Déjà définie)"}
                  </FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Active</FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Footer avec structure harmonisée et bouton ANNULER conservé */}
        <div className="p-4 border-t flex justify-end bg-gray-50 rounded-b-lg gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            ANNULER
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting} className="bg-[#007bff] hover:bg-[#0069d9]">
            {form.formState.isSubmitting ? "Enregistrement..." : (initialData?.id ? "Enregistrer les modifications" : "Enregistrer")}
          </Button>
        </div>
      </form>
    </Form>
  );
};