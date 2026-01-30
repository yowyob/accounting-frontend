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
  onDelete: () => void;
  onBack: () => void;
}

export const PeriodeComptableDetailView: React.FC<PeriodeComptableDetailViewProps> = ({
  periode,
  onSave,
  onClose,
  onDelete,
  onBack,
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
    onClose();
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
                disabled
                className="rounded-none border-b-2 border-transparent py-3 font-semibold text-gray-300 cursor-not-allowed"
              >
                AUTRES PARAMÈTRES
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6 mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="code"
                  rules={{ required: "Le code est requis" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code (YYYY-MM) <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="2025-09" disabled={periode?.cloturee} />
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
                      <FormLabel>Exercice Comptable <span className="text-red-500">*</span></FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger disabled={periode?.cloturee}>
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
              <div className="grid grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Informations complémentaires..." disabled={periode?.cloturee} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="dateDebut"
                  rules={{ required: "Requis" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de début <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="date" {...field} disabled={periode?.cloturee} />
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
                      <FormLabel>Date de fin <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="date" {...field} disabled={periode?.cloturee} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                <FormField
                  control={form.control}
                  name="cloturee"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Clôturée</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
          </Tabs>
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
              <Button variant="destructive" type="button" onClick={onDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </>
          )}
          {!periode?.cloturee && (
            <Button type="submit" disabled={form.formState.isSubmitting} className="bg-[#007bff] hover:bg-[#0069d9]">
              <Save className="mr-2 h-4 w-4" />
              <span>{form.formState.isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}</span>
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};