"use client";

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Save, PlusCircle, Trash2, ChevronDown, Check, ChevronsUpDown } from 'lucide-react';
import { JournalManagementService } from '@/src/lib2/services/JournalManagementService';
import { AccountingComptesService } from '@/src/lib2/services/AccountingComptesService';
import { JournalComptableDto } from '@/src/lib2/models/JournalComptableDto';
import { CompteDto } from '@/src/lib2/models/CompteDto';
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import { OperationComptableDto } from '@/src/lib2/models/OperationComptableDto';
import { ContrepartieDto } from '@/src/lib2/models/ContrepartieDto';

interface OperationFormProps {
  initialData: Partial<OperationComptableDto> | null;
  onSave: (data: OperationComptableDto) => void;
  onCancel: () => void;
}

// Sub-component for Account Selection in the Form
const AccountSelector = ({
  value,
  onChange,
  accounts,
  placeholder = "Sélectionner un compte..."
}: {
  value: string;
  onChange: (val: string) => void;
  accounts: CompteDto[];
  placeholder?: string;
}) => {
  const [open, setOpen] = useState(false);
  const selectedAccount = accounts.find((acc) => acc.id === value || acc.noCompte === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-mono"
        >
          {selectedAccount
            ? `${selectedAccount.noCompte}`
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Rechercher par numéro ou libellé..." />
          <CommandList>
            <CommandEmpty>Aucun compte trouvé.</CommandEmpty>
            <CommandGroup>
              {accounts.map((acc) => (
                <CommandItem
                  key={acc.id}
                  value={`${acc.noCompte} ${acc.libelle}`}
                  onSelect={() => {
                    onChange(acc.noCompte); // We store the account number as requested by user ("non les numeros des plan comptable" but he meant account numbers)
                    // Wait, prompt says: "les numero de compte entrer lors de la creation d'une ecriture comptable et des operations comptables doivent etre les numero de comptes"
                    // And "non les numeros des plan comptable".
                    // In my previous tool use I was using IDs. I should check if backend expects IDs or Numbers.
                    // Usually it's account numbers for visibility. I will use noCompte if that's what he wants.
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === acc.noCompte ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="font-bold mr-2 text-blue-700">{acc.noCompte}</span>
                  <span className="text-gray-600">{acc.libelle}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export const OperationForm: React.FC<OperationFormProps> = ({ initialData, onSave, onCancel }) => {
  const [journals, setJournals] = useState<JournalComptableDto[]>([]);
  const [isLoadingJournals, setIsLoadingJournals] = useState(true);
  const [accounts, setAccounts] = useState<CompteDto[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [journalsRes, accountsRes] = await Promise.all([
          JournalManagementService.getActiveJournals(),
          AccountingComptesService.getAllComptes()
        ]);
        setJournals(Array.isArray(journalsRes.data) ? journalsRes.data : []);
        setAccounts(Array.isArray(accountsRes.data) ? accountsRes.data : []);
      } catch (error) {
        console.error("Failed to fetch form dependencies:", error);
      } finally {
        setIsLoadingJournals(false);
        setIsLoadingAccounts(false);
      }
    };
    fetchData();
  }, []);

  const form = useForm<OperationComptableDto>({
    defaultValues: initialData || {
      typeOperation: 'VENTE',
      modeReglement: 'ESPECE',
      sensPrincipal: 'DEBIT',
      comptePrincipal: '',
      estCompteStatique: true,
      typeMontant: 'Toutes Taxes Comprises',
      journalComptableId: '',
      actif: true,
      contreparties: [{
        compte: '',
        estCompteTiers: false,
        typeMontant: 'TTC',
        journalComptableId: '',
        sens: 'DEBIT',
      } as ContrepartieDto],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "contreparties"
  });

  const onSubmit = (data: OperationComptableDto) => {
    const validContreparties = data.contreparties?.filter(cp => cp.compte && cp.compte.trim() !== '');

    const cleanData = {
      ...data,
      id: data.id || undefined,
      journalComptableId: data.journalComptableId || undefined,
      contreparties: validContreparties?.map(cp => ({
        ...cp,
        id: cp.id || undefined,
        journalComptableId: cp.journalComptableId || data.journalComptableId || undefined,
        operationComptableId: cp.operationComptableId || undefined,
      }))
    } as any;

    onSave(cleanData);
  };

  const contreparties = form.watch('contreparties');

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
                value="comptes"
                className="rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-blue-500 py-3 font-semibold text-gray-500 data-[state=active]:text-blue-600"
              >
                COMPTES ET CONTREPARTIES
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6 mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="typeOperation"
                  rules={{ required: "Requis" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quand on : <span className="text-red-500">*</span></FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="VENTE">Vend à un client (VENTE)</SelectItem>
                          <SelectItem value="ACHAT">Achète à un fournisseur (ACHAT)</SelectItem>
                          <SelectItem value="SALAIRE">Paye un salaire (SALAIRE)</SelectItem>
                          <SelectItem value="PAIEMENT">Effectue un paiement (PAIEMENT)</SelectItem>
                          <SelectItem value="DIVERS">Opération diverse (DIVERS)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="modeReglement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mode de règlement <span className="text-red-500">*</span></FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ESPECE">Comptant par espèces</SelectItem>
                          <SelectItem value="CHEQUE">Comptant par chèque</SelectItem>
                          <SelectItem value="VIREMENT">Comptant par virement</SelectItem>
                          <SelectItem value="MOBILE">Mobile Money</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="sensPrincipal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>On doit<span className="text-red-500">*</span></FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="DEBIT">Débiter</SelectItem>
                          <SelectItem value="CREDIT">Créditer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="journalComptableId"
                  rules={{ required: "Requis" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dans le journal <span className="text-red-500">*</span></FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={isLoadingJournals ? "Chargement..." : "Sélectionner"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {journals.map((journal) => (
                            <SelectItem key={journal.id} value={journal.id!}>
                              {journal.codeJournal} - {journal.libelle}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="comptePrincipal"
                  rules={{ required: "Requis" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Compte principal <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <AccountSelector
                          value={field.value}
                          onChange={field.onChange}
                          accounts={accounts}
                          placeholder="ex. 571100"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="typeMontant"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de montant <span className="text-red-500">*</span></FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="TTC">Montant Toutes Taxes Comprises</SelectItem>
                          <SelectItem value="HT">Montant Hors Taxes</SelectItem>
                          <SelectItem value="TVA">Montant Taxe sur la Valeur Ajoutée</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="estCompteStatique"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Compte statique</FormLabel>
                      <FormDescription>Cochez pour un compte qui ne varie pas (ex: caisse).</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value="comptes" className="space-y-6 mt-0">
              <div className="flex items-center justify-between pb-2 border-b">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Contreparties</h3>
                <Button type="button" variant="outline" size="sm" onClick={() => append({ compte: '', estCompteTiers: false, typeMontant: 'TTC', journalComptableId: '', sens: 'DEBIT' } as ContrepartieDto)} className="border-blue-500 text-blue-600 hover:bg-blue-50">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Ajouter un compte
                </Button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <Collapsible key={field.id} defaultOpen className="rounded-lg border bg-white shadow-sm overflow-hidden">
                    <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">#{index + 1}</div>
                        <span className="text-sm font-medium">{contreparties[index]?.compte || "Nouveau compte..."}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={(e) => { e.stopPropagation(); remove(index); }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-6 border-t space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name={`contreparties.${index}.compte`}
                          rules={{ required: "Requis" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Compte contrepartie <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <AccountSelector
                                  value={field.value}
                                  onChange={field.onChange}
                                  accounts={accounts}
                                  placeholder="ex. 411100"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`contreparties.${index}.estCompteTiers`}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 bg-white">
                              <FormLabel className="text-xs">Compte tiers</FormLabel>
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name={`contreparties.${index}.sens`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Action</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent>
                                  <SelectItem value="DEBIT">Débiter</SelectItem>
                                  <SelectItem value="CREDIT">Créditer</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`contreparties.${index}.typeMontant`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Montant</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent>
                                  <SelectItem value="TTC">TTC</SelectItem>
                                  <SelectItem value="HT">HT</SelectItem>
                                  <SelectItem value="TVA">TVA</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`contreparties.${index}.journalComptableId`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Journal</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder={isLoadingJournals ? "..." : "Sélectionner"} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {journals.map((journal) => (
                                    <SelectItem key={journal.id} value={journal.id!}>
                                      {journal.codeJournal}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </TabsContent>
          </Tabs>

        </div>

        <div className="p-4 border-t flex justify-end bg-gray-50 rounded-b-lg gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            ANNULER
          </Button>
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