/*
"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Trash2, ArrowLeft, Check, Plus, Trash, ChevronsUpDown } from 'lucide-react';
import { EcritureComptable, DetailEcritureDto, UUID } from '@/types/accounting';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getJounalComptables, getPeriodeComptables } from '@/lib/api';

interface EcritureComptableDetailViewProps {
  ecriture: EcritureComptable | null;
  onSave: (data: EcritureComptable) => void;
  onDelete: () => void;
  onValidate: () => void;
  onBack: () => void;
}

export const EcritureComptableDetailView: React.FC<EcritureComptableDetailViewProps> = ({
  ecriture,
  onSave,
  onDelete,
  onValidate,
  onBack,
}) => {
  const [journals, setJournals] = useState<{ id: string; libelle: string }[]>([]);
  const [periodes, setPeriodes] = useState<{ id: string; code: string }[]>([]);
  const [isLoadingJournals, setIsLoadingJournals] = useState(true);
  const [isLoadingPeriodes, setIsLoadingPeriodes] = useState(true);

  const form = useForm<EcritureComptable>({
    defaultValues: ecriture || {
      libelle: '',
      dateEcriture: new Date().toISOString().split('T')[0],
      journalComptableId: '',
      periodeComptableId: '',
      montantTotalDebit: 0,
      montantTotalCredit: 0,
      validee: false,
      referenceExterne: '',
      notes: '',
      detailsEcriture: [{ compteId: crypto.randomUUID() as UUID, libelle: '', montantDebit: 0, montantCredit: 0 }],
    },
  });

  useEffect(() => {
    form.reset(ecriture || {
      libelle: '',
      dateEcriture: new Date().toISOString().split('T')[0],
      journalComptableId: '',
      periodeComptableId: '',
      montantTotalDebit: 0,
      montantTotalCredit: 0,
      validee: false,
      referenceExterne: '',
      notes: '',
      detailsEcriture: [{ compteId: crypto.randomUUID() as UUID, libelle: '', montantDebit: 0, montantCredit: 0 }],
    });
  }, [ecriture, form]);

  const fetchJournals = async () => {
    try {
      const response = await getJounalComptables();
      setJournals(response.data.map((j) => ({ id: j.id!, libelle: j.libelle })));
    } catch (error) {
      console.error("Failed to fetch journals:", error);
    } finally {
      setIsLoadingJournals(false);
    }
  };

  const fetchPeriodes = async () => {
    try {
      const response = await getPeriodeComptables();
      setPeriodes(response.data.map((p) => ({ id: p.id!, code: p.code || p.id!.slice(0, 8) })));
    } catch (error) {
      console.error("Failed to fetch periods:", error);
    } finally {
      setIsLoadingPeriodes(false);
    }
  };

  useEffect(() => {
    fetchJournals();
    fetchPeriodes();
  }, []);

  const onSubmit = (data: EcritureComptable) => {
    const totalDebit = data.detailsEcriture?.reduce((sum, d) => sum + (d.montantDebit || 0), 0) || 0;
    const totalCredit = data.detailsEcriture?.reduce((sum, d) => sum + (d.montantCredit || 0), 0) || 0;
    if (totalDebit !== totalCredit) {
      form.setError('detailsEcriture', { message: 'Les montants de débit et de crédit doivent être égaux.' });
      return;
    }
    onSave({ ...data, montantTotalDebit: totalDebit, montantTotalCredit: totalCredit });
  };

  const addDetailLine = () => {
    form.setValue('detailsEcriture', [
      ...(form.getValues('detailsEcriture') || []),
      { compteId: crypto.randomUUID() as UUID, libelle: '', montantDebit: 0, montantCredit: 0 },
    ]);
  };

  const removeDetailLine = (index: number) => {
    const currentDetails = form.getValues('detailsEcriture') || [];
    form.setValue('detailsEcriture', currentDetails.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      <div className="flex justify-end items-center p-6 border-b">

        {!ecriture?.validee && (
          <Button onClick={onValidate} className="bg-green-600 hover:bg-green-700 text-white">
            <Check className="mr-2 h-4 w-4" />
            Valider
          </Button>
        )}
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="libelle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Libellé <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateEcriture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date Écriture <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="journalComptableId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Journal Comptable <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value || ''}
                        disabled={isLoadingJournals}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={isLoadingJournals ? "Chargement..." : "Sélectionner un journal"} />
                        </SelectTrigger>
                        <SelectContent>
                          {journals.map((journal) => (
                            <SelectItem key={journal.id} value={journal.id}>
                              {journal.libelle}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="periodeComptableId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Période Comptable <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value || ''}
                        disabled={isLoadingPeriodes}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={isLoadingPeriodes ? "Chargement..." : "Sélectionner une période"} />
                        </SelectTrigger>
                        <SelectContent>
                          {periodes.map((periode) => (
                            <SelectItem key={periode.id} value={periode.id}>
                              {periode.code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="montantTotalDebit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant Total Débit</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="montantTotalCredit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant Total Crédit</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="referenceExterne"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Référence Externe</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Réf-001" />
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
                      <Input {...field} placeholder="Informations supplémentaires..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            //{/* Détails de l'Écriture *///}
/*            
            <div className="p-4 border-t border-b bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Détails de l&#39;Écriture</h3>
                {!ecriture?.validee && (
                  <Button variant="outline" size="sm" onClick={addDetailLine}>
                    <Plus className="mr-2 h-4 w-4" /> Ajouter une ligne
                  </Button>
                )}
              </div>
              {form.watch('detailsEcriture')?.map((detail, index) => (
                <div key={detail.compteId} className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-4 p-4 bg-white rounded-lg shadow-sm">
                  <FormField
                    control={form.control}
                    name={`detailsEcriture.${index}.compteId`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Compte</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Numéro du compte" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`detailsEcriture.${index}.libelle`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Libellé</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Description de la ligne" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`detailsEcriture.${index}.montantDebit`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Débit</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value) || 0)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`detailsEcriture.${index}.montantCredit`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Crédit</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value) || 0)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-end">
                    {!ecriture?.validee && (
                      <Button variant="destructive" size="sm" onClick={() => removeDetailLine(index)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <FormMessage>{form.formState.errors.detailsEcriture?.message}</FormMessage>
            </div>
          </div>
          <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
            {!ecriture?.validee && (
              <>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer
                </Button>
                <Button variant="destructive" onClick={onDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </>
            )}

          </div>
        </form>
      </Form>
    </div>
  );
};
*/

"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Trash2, ArrowLeft, Check, Plus, Trash, ChevronsUpDown } from 'lucide-react';
import { EcritureComptableDto } from '@/src/lib2/models/EcritureComptableDto';
import { DetailEcritureDto } from '@/src/lib2/models/DetailEcritureDto';
import { JournalComptableDto } from '@/src/lib2/models/JournalComptableDto';
import { PeriodeComptableDto } from '@/src/lib2/models/PeriodeComptableDto';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { AccountingJournalsService } from '@/src/lib2/services/AccountingJournalsService';
import { AccountingPeriodsService } from '@/src/lib2/services/AccountingPeriodsService';

interface EcritureComptableDetailViewProps {
  ecriture: EcritureComptableDto | null;
  onSave: (data: EcritureComptableDto) => void;
  onDelete: () => void;
  onValidate: () => void;
  onBack: () => void;
}

// Fonction pour générer un UUID simple en local
const generateUUID = (): string => {
  return `uuid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Créer un type pour le formulaire avec dateEcriture en string (déjà string dans le DTO)
type EcritureComptableForm = EcritureComptableDto;

// Convertir Date en string pour l'input
const formatDateForInput = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const EcritureComptableDetailView: React.FC<EcritureComptableDetailViewProps> = ({
  ecriture,
  onSave,
  onDelete,
  onValidate,
  onBack,
}) => {
  const [journals, setJournals] = useState<{ id: string; libelle: string }[]>([]);
  const [periodes, setPeriodes] = useState<PeriodeComptableDto[]>([]);
  const [openPeriodePopover, setOpenPeriodePopover] = useState(false);
  const [isLoadingJournals, setIsLoadingJournals] = useState(true);
  const [isLoadingPeriodes, setIsLoadingPeriodes] = useState(true);

  // Initialiser les valeurs par défaut
  const getDefaultValues = (): EcritureComptableForm => {
    if (ecriture) {
      return {
        ...ecriture,
        detailsEcriture: ecriture.detailsEcriture?.map(d => ({
          ...d,
          // Handle legacy mapping if necessary, but lib2 expects compteComptableId
          compteComptableId: d.compteComptableId || (d as any).compteId
        })) || []
      };
    }

    return {
      libelle: '',
      dateEcriture: formatDateForInput(new Date()),
      journalComptableId: '',
      periodeComptableId: '',
      montantTotalDebit: 0,
      montantTotalCredit: 0,
      validee: false,
      referenceExterne: '',
      notes: '',
      detailsEcriture: [
        {
          compteComptableId: '',
          libelle: '',
          montantDebit: 0,
          montantCredit: 0,
          sens: 'DEBIT', // Required field in DetailEcritureDto
          ecritureComptableId: '' // Required field in DetailEcritureDto
        } as DetailEcritureDto
      ],
    } as EcritureComptableForm;
  };

  const form = useForm<EcritureComptableForm>({
    defaultValues: getDefaultValues(),
  });

  useEffect(() => {
    form.reset(getDefaultValues());
  }, [ecriture, form]);

  const fetchJournals = async () => {
    try {
      const response = await AccountingJournalsService.getAllJournalComptables();
      if (response.success && response.data) {
        setJournals(response.data.map((j) => ({ id: j.id!, libelle: j.libelle })));
      }
    } catch (error) {
      console.error("Failed to fetch journals:", error);
      setJournals([
        { id: 'journal-1', libelle: 'Journal Général' },
        { id: 'journal-2', libelle: 'Journal de Ventes' },
      ]);
    } finally {
      setIsLoadingJournals(false);
    }
  };

  const fetchPeriodes = async () => {
    try {
      const response = await AccountingPeriodsService.getAllPeriodeComptables();
      if (response.success && response.data) {
        // Filter only non-closed periods
        const nonClosedPeriodes = response.data.filter(p => !p.cloturee);
        setPeriodes(nonClosedPeriodes);
      }
    } catch (error) {
      console.error("Failed to fetch periods:", error);
      setPeriodes([]);
    } finally {
      setIsLoadingPeriodes(false);
    }
  };

  useEffect(() => {
    fetchJournals();
    fetchPeriodes();
  }, []);

  const onSubmit = (data: EcritureComptableForm) => {
    const totalDebit = data.detailsEcriture?.reduce((sum, d) => sum + (d.montantDebit || 0), 0) || 0;
    const totalCredit = data.detailsEcriture?.reduce((sum, d) => sum + (d.montantCredit || 0), 0) || 0;

    if (totalDebit !== totalCredit) {
      form.setError('detailsEcriture', {
        type: 'manual',
        message: 'Les montants de débit et de crédit doivent être égaux.'
      });
      return;
    }

    onSave({
      ...data,
      montantTotalDebit: totalDebit,
      montantTotalCredit: totalCredit
    });
  };

  const addDetailLine = () => {
    const currentDetails = form.getValues('detailsEcriture') || [];
    form.setValue('detailsEcriture', [
      ...currentDetails,
      {
        compteComptableId: '',
        libelle: '',
        montantDebit: 0,
        montantCredit: 0,
        sens: 'DEBIT',
        ecritureComptableId: ecriture?.id || ''
      } as DetailEcritureDto,
    ]);
  };

  const removeDetailLine = (index: number) => {
    const currentDetails = form.getValues('detailsEcriture') || [];
    form.setValue('detailsEcriture', currentDetails.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center p-6 border-b">
        {!ecriture?.validee && (
          <Button onClick={onValidate} className="bg-green-600 hover:bg-green-700 text-white">
            <Check className="mr-2 h-4 w-4" />
            Valider
          </Button>
        )}
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="libelle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Libellé <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateEcriture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date Écriture <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="journalComptableId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Journal Comptable <span className="text-red-500">*</span></FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                      disabled={isLoadingJournals}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={isLoadingJournals ? "Chargement..." : "Sélectionner un journal"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {journals.map((journal) => (
                          <SelectItem key={journal.id} value={journal.id}>
                            {journal.libelle}
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
                name="periodeComptableId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Période Comptable <span className="text-red-500">*</span></FormLabel>
                    <Popover open={openPeriodePopover} onOpenChange={setOpenPeriodePopover}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={isLoadingPeriodes}
                          >
                            {field.value
                              ? periodes.find(
                                (periode) => periode.id === field.value
                              )?.code
                              : isLoadingPeriodes ? "Chargement..." : "Sélectionner une période"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0">
                        <Command
                          filter={(value, search) => {
                            if (value.toLowerCase().includes(search.toLowerCase())) return 1;
                            return 0;
                          }}
                        >
                          <CommandInput placeholder="Rechercher une période..." className="border-none focus:ring-0" />
                          <CommandList>
                            <CommandEmpty>Aucune période trouvée.</CommandEmpty>
                            <CommandGroup>
                              {periodes.filter(p => p.id).map((periode) => (
                                <CommandItem
                                  value={periode.code}
                                  key={periode.id!}
                                  onSelect={() => {
                                    form.setValue("periodeComptableId", periode.id!);
                                    setOpenPeriodePopover(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      periode.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {periode.code}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="montantTotalDebit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant Total Débit</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="montantTotalCredit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant Total Crédit</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="referenceExterne"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Référence Externe</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Réf-001" />
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
                      <Input {...field} placeholder="Informations supplémentaires..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Détails de l'Écriture */}
            <div className="p-4 border-t border-b bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Détails de l&#39;Écriture</h3>
                {!ecriture?.validee && (
                  <Button variant="outline" size="sm" onClick={addDetailLine} type="button">
                    <Plus className="mr-2 h-4 w-4" /> Ajouter une ligne
                  </Button>
                )}
              </div>
              {form.watch('detailsEcriture')?.map((detail, index) => (
                <div key={detail.compteComptableId || index} className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-4 p-4 bg-white rounded-lg shadow-sm">
                  <FormField
                    control={form.control}
                    name={`detailsEcriture.${index}.compteComptableId`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Compte</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Numéro du compte" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`detailsEcriture.${index}.libelle`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Libellé</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Description de la ligne" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`detailsEcriture.${index}.montantDebit`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Débit</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`detailsEcriture.${index}.montantCredit`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Crédit</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-end">
                    {!ecriture?.validee && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeDetailLine(index)}
                        type="button"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {form.formState.errors.detailsEcriture?.message && (
                <p className="text-red-500 text-sm mt-2">
                  {form.formState.errors.detailsEcriture.message}
                </p>
              )}
            </div>
          </div>
          <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
            {!ecriture?.validee && (
              <>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer
                </Button>
                <Button variant="destructive" onClick={onDelete} type="button">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};