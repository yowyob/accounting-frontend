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
import { EcritureComptableDto } from '@/src/lib2/models/EcritureComptableDto';
import { OperationComptableDto } from '@/src/lib2/models/OperationComptableDto';
import { AccountingOperationsService } from '@/src/lib2/services/AccountingOperationsService';
import { AccountingEntriesService } from '@/src/lib2/services/AccountingEntriesService';
import { OperationComptableListView } from './operation-comptable-list-view';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

import { JournalComptableReadView } from './journal-comptable-read-view';
import { Edit } from 'lucide-react';

interface JournalComptableDetailViewProps {
  journal: JournalComptableDto | null;
  onSave: (data: JournalComptableDto) => void;
  onDelete: () => void;
  onBack: () => void;
  onEdit?: () => void;
  forceEdit?: boolean;
}

export const JournalComptableDetailView: React.FC<JournalComptableDetailViewProps> = ({
  journal,
  onSave,
  onDelete,
  onBack,
  onEdit,
  forceEdit = false,
}) => {
  const [isEditing, setIsEditing] = useState(forceEdit || !journal);

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
    if (journal) setIsEditing(false);
  };

  if (!isEditing && journal) {
    return (
      <div className="space-y-6">
        <div className="flex justify-end items-center px-1">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit || (() => setIsEditing(true))}
              className="text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100"
            >
              <Edit className="h-4 w-4 mr-2" /> Modifier
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="text-red-600 border-red-200 bg-red-50 hover:bg-red-100"
            >
              <Trash2 className="h-4 w-4 mr-2" /> Supprimer
            </Button>
          </div>
        </div>

        <JournalComptableReadView journal={journal} />

        <div className="flex justify-end pt-4 border-t px-1">
          <Button
            onClick={onBack}
            variant="outline"
            className="bg-white hover:bg-gray-50 text-gray-800 border-gray-300 px-10 font-semibold shadow-sm"
          >
            Fermer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col rounded-lg shadow-lg bg-white overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {journal && !forceEdit && (
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" /> Retour à la vue lecture
            </Button>
          )}

          <div className="space-y-6">
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
          </div>
        </div>

        <div className="p-4 border-t flex justify-end gap-3 bg-gray-50 rounded-b-lg">
          <Button variant="outline" type="button" onClick={journal ? () => setIsEditing(false) : onBack}>
            Annuler
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting} className="bg-[#007bff] hover:bg-[#0069d9]">
            <span>{form.formState.isSubmitting ? "Enregistrement..." : (journal?.id ? "Enregistrer les modifications" : "Enregistrer")}</span>
          </Button>
        </div>
      </form>
    </Form>
  );
};
