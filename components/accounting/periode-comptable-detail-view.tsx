"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Trash2, ArrowLeft, Lock } from 'lucide-react';
import { PeriodeComptableDto } from '@/src/lib2/models/PeriodeComptableDto';
import { ExerciceComptableDto } from '@/src/lib2/models/ExerciceComptableDto';
import { AccountingFiscalYearsService } from '@/src/lib2/services/AccountingFiscalYearsService';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface PeriodeComptableDetailViewProps {
  periode: PeriodeComptableDto | null;
  onSave: (data: PeriodeComptableDto) => void;
  onClose: () => void;
  onBack: () => void;
  onConfirmClose?: (id: string) => void;
}

export const PeriodeComptableDetailView: React.FC<PeriodeComptableDetailViewProps> = ({
  periode,
  onSave,
  onClose,
  onBack,
  onConfirmClose,
}) => {
  const [exercices, setExercices] = React.useState<ExerciceComptableDto[]>([]);
  const [isLoadingExercices, setIsLoadingExercices] = React.useState(true);

  React.useEffect(() => {
    const fetchExercices = async () => {
      try {
        const response = await AccountingFiscalYearsService.getAllExercices();
        setExercices(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to fetch fiscal years:", error);
      } finally {
        setIsLoadingExercices(false);
      }
    };
    fetchExercices();
  }, []);

  const form = useForm<PeriodeComptableDto>({
    defaultValues: periode || {
      code: '',
      dateDebut: new Date().toISOString().split('T')[0], // Use string format for input type="date"
      dateFin: new Date().toISOString().split('T')[0],   // Use string format for input type="date"
      cloturee: false,
      notes: '',
      exercice_id: '',
    },
  });

  const onSubmit = (data: PeriodeComptableDto) => {
    onSave(data);
  };

  const handleClose = () => {
    if (periode?.id && onConfirmClose) {
      onConfirmClose(periode.id);
      onClose(); // Close the detail view after triggering confirmation
    } else {
      onClose();
    }
  };

  const isReadOnly = !!periode?.cloturee;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col rounded-lg shadow-lg bg-white overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="flex items-center justify-between border-b border-blue-100 pb-4 mb-2">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg text-white font-bold">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-blue-900 uppercase tracking-tight">
                {periode?.id ? "Détails de la Période" : "Nouvelle Période"}
              </h3>
            </div>

            {isReadOnly && (
              <div className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold border border-slate-300 flex items-center gap-2">
                <Lock className="h-3 w-3" />
                Lecture seule (Clôturée)
              </div>
            )}

            <FormField
              control={form.control}
              name="cloturee"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="font-semibold text-blue-900 cursor-pointer">Période Clôturée</FormLabel>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="code"
              rules={{ required: "Le code est requis" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-blue-900">Code (YYYY-MM) <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="2025-09" disabled={isReadOnly} className="bg-white border-blue-200 focus:ring-blue-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="exercice_id"
              rules={{ required: "L'exercice comptable est requis" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-blue-900">Exercice Comptable <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isReadOnly}>
                    <FormControl>
                      <SelectTrigger className="bg-white border-blue-200 focus:ring-blue-500">
                        <SelectValue placeholder={isLoadingExercices ? "Chargement..." : "Sélectionner un exercice"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {exercices.map((exercice) => (
                        <SelectItem key={exercice.id} value={exercice.id!}>
                          {exercice.code} ({exercice.date_debut} - {exercice.date_fin})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="dateDebut"
              rules={{ required: "Requis" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-blue-900">Date de début <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input type="date" {...field} disabled={isReadOnly} className="bg-white border-blue-200 focus:ring-blue-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateFin"
              rules={{ required: "Requis" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-blue-900">Date de fin <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input type="date" {...field} disabled={isReadOnly} className="bg-white border-blue-200 focus:ring-blue-500" />
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
                <FormLabel className="font-semibold text-blue-900">Notes</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Informations complémentaires..." disabled={isReadOnly} className="bg-white border-blue-200 focus:ring-blue-500" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>

        <div className="p-4 border-t flex justify-end gap-3 bg-gray-50 rounded-b-lg">
          <Button variant="outline" type="button" onClick={onBack}>
            Annuler
          </Button>
          {periode && !periode.cloturee && (
            <>
              <Button variant="outline" type="button" onClick={handleClose} className="text-orange-600 border-orange-200 hover:bg-orange-50">
                <Lock className="mr-2 h-4 w-4" />
                Clôturer
              </Button>
            </>
          )}
          {!isReadOnly && (
            <Button type="submit" disabled={form.formState.isSubmitting} className="bg-[#007bff] hover:bg-[#0069d9]">
              <span>{form.formState.isSubmitting ? "Enregistrement..." : (periode?.id ? "Enregistrer les modifications" : "Enregistrer")}</span>
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};