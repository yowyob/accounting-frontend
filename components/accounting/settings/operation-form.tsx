"use client";

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Save, PlusCircle, Trash2, ChevronDown } from 'lucide-react';
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
import { OperationComptableDto } from '@/src/lib2/models/OperationComptableDto';
import { ContrepartieDto } from '@/src/lib2/models/ContrepartieDto';
import { toast } from 'sonner';

interface OperationFormProps {
  initialData: Partial<OperationComptableDto> | null;
  onSave: (data: OperationComptableDto) => void;
  onCancel: () => void;
}

export const OperationForm: React.FC<OperationFormProps> = ({ initialData, onSave, onCancel }) => {
  const [journals, setJournals] = useState<JournalComptableDto[]>([]);
  const [isLoadingJournals, setIsLoadingJournals] = useState(true);
  const [accounts, setAccounts] = useState<CompteDto[]>([]);

  const getAccountNumber = (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId || acc.noCompte === accountId);
    return account ? account.noCompte : accountId;
  };

  const getAccountId = (accountNo: string) => {
    const account = accounts.find(acc => acc.noCompte === accountNo || acc.id === accountNo);
    return account ? account.id : accountNo;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [journalsRes, accountsRes] = await Promise.all([
          JournalManagementService.getActiveJournals(),
          AccountingComptesService.getAllComptes()
        ]);
        const fetchedJournals = Array.isArray(journalsRes.data) ? journalsRes.data : [];
        const fetchedAccounts = Array.isArray(accountsRes.data) ? accountsRes.data : [];

        setJournals(fetchedJournals);
        setAccounts(fetchedAccounts);

        // If initialData exists, we might need to update form values once accounts are loaded
        if (initialData) {
          if (initialData.comptePrincipal) {
            const acc = fetchedAccounts.find(a => a.id === initialData.comptePrincipal || a.noCompte === initialData.comptePrincipal);
            if (acc) form.setValue('comptePrincipal', acc.noCompte);
          }
          if (initialData.contreparties) {
            initialData.contreparties.forEach((cp, index) => {
              const acc = fetchedAccounts.find(a => a.id === cp.compte || a.noCompte === cp.compte);
              if (acc) form.setValue(`contreparties.${index}.compte`, acc.noCompte);
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch form dependencies:", error);
      } finally {
        setIsLoadingJournals(false);
      }
    };
    fetchData();
  }, [initialData]);

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
    // Validation for account existence
    const invalidAccounts: string[] = [];

    if (data.comptePrincipal && !accounts.some(acc => acc.noCompte === data.comptePrincipal)) {
      invalidAccounts.push(data.comptePrincipal);
    }

    data.contreparties?.forEach(cp => {
      if (cp.compte && !accounts.some(acc => acc.noCompte === cp.compte)) {
        invalidAccounts.push(cp.compte);
      }
    });

    if (invalidAccounts.length > 0) {
      toast.error(`Le(s) compte(s) suivant(s) n'existe(nt) pas : ${invalidAccounts.join(', ')}`);
      return;
    }

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
                        <Input {...field} placeholder="ex. 571100" className="font-mono" />
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
                                <Input {...field} placeholder="ex. 411100" className="font-mono" />
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