// components/accounting/journal-comptable-detail-view.tsx
"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Save, Trash2, ArrowLeft } from 'lucide-react';
import { JournalComptableDto } from '@/src/lib2/models/JournalComptableDto';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface JournalComptableDetailViewProps {
  journal: JournalComptableDto | null;
  onSave: (data: JournalComptableDto) => void;
  onDelete: () => void;
  onBack: () => void;
}

export const JournalComptableDetailView: React.FC<JournalComptableDetailViewProps> = ({
  journal,
  onSave,
  onDelete,
  onBack,
}) => {
  const form = useForm<JournalComptableDto>({
    defaultValues: journal || {
      codeJournal: '',
      libelle: '',
      typeJournal: 'DIVERS',
      notes: '',
      actif: true,
    },
  });

  const onSubmit = (data: JournalComptableDto) => {
    onSave(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col rounded-lg shadow-lg bg-white overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-auto rounded-none p-0 mb-8 border-b">
              <TabsTrigger
                value="general"
                className="rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-blue-500 py-3 font-semibold text-gray-500 data-[state=active]:text-blue-600"
              >
                GÉNÉRAL
              </TabsTrigger>
              <TabsTrigger
                value="advanced"
                className="rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-blue-500 py-3 font-semibold text-gray-500 data-[state=active]:text-blue-600"
              >
                AUTRES PARAMÈTRES
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6 mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="codeJournal"
                  rules={{ required: "Le code est requis" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code Journal <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="EX: ACH" />
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
                        <Input {...field} placeholder="EX: Journal des achats" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="typeJournal"
                  rules={{ required: "Le type est requis" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type Journal <span className="text-red-500">*</span></FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ACHAT">Achat</SelectItem>
                          <SelectItem value="VENTE">Vente</SelectItem>
                          <SelectItem value="BANQUE">Banque</SelectItem>
                          <SelectItem value="CAISSE">Caisse</SelectItem>
                          <SelectItem value="DIVERS">Opérations Diverses</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="actif"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 h-[68px]">
                      <div className="space-y-0.5">
                        <FormLabel>Journal Actif</FormLabel>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6 mt-0">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes / Observations</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Informations complémentaires..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="p-4 border-t flex justify-end gap-3 bg-gray-50 rounded-b-lg">
          <Button variant="outline" type="button" onClick={onBack}>
            Annuler
          </Button>
          {journal && (
            <Button variant="destructive" type="button" onClick={onDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          )}
          <Button type="submit" disabled={form.formState.isSubmitting} className="bg-[#007bff] hover:bg-[#0069d9]">
            <Save className="mr-2 h-4 w-4" />
            <span>{form.formState.isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}</span>
          </Button>
        </div>
      </form>
    </Form>
  );
};