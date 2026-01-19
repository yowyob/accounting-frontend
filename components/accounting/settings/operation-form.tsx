// components/accounting/operation-form.tsx
"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Save, PlusCircle, Trash2, ChevronDown } from 'lucide-react';
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
import { OperationComptable } from '@/types/accounting';

interface OperationFormProps {
  initialData: Partial<OperationComptable> | null;
  onSave: (data: OperationComptable) => void;
  onCancel: () => void;
}

export const OperationForm: React.FC<OperationFormProps> = ({ initialData, onSave, onCancel }) => {
  const form = useForm<OperationComptable>({
    defaultValues: initialData || {
      typeOperation: 'VENTE',
      modeReglement: 'CCE',
      sensPrincipal: 'DEBIT',
      comptePrincipal: '',
      estCompteStatique: true,
      typeMontant: 'TTC',
      journalComptableId: 'VENTES',
      counterpartyDetails: [{ account: '', isTiers: false, amountType: 'TTC', journalType: 'VENTES', debitOrCredit: 'DEBIT' }],
    },
  });

  const onSubmit = (data: OperationComptable) => {
    onSave(data);
  };

  const addCounterparty = () => {
    const currentCounterparties = form.getValues('counterpartyDetails') || [];
    form.setValue('counterpartyDetails', [
      ...(currentCounterparties || []),
      { account: '', isTiers: false, amountType: 'TTC', journalType: 'VENTES', debitOrCredit: 'DEBIT' },
    ]);
  };

  const removeCounterparty = (index: number) => {
    const newCounterparties = [...(form.getValues('counterpartyDetails') || [])];
    newCounterparties.splice(index, 1);
    form.setValue('counterpartyDetails', newCounterparties);
  };

  const counterpartyDetails = form.watch('counterpartyDetails');

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
                          <SelectItem value="VENTE">Vend à un client</SelectItem>
                          <SelectItem value="ACHAT">Achète à un fournisseur</SelectItem>
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
                          <SelectItem value="CCE">au comptant par espèces</SelectItem>
                          <SelectItem value="CCB">au comptant par chèque bancaire</SelectItem>
                          <SelectItem value="CCP">au comptant par chèque postal</SelectItem>
                          <SelectItem value="CREDIT">par crédit</SelectItem>
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
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dans le journal <span className="text-red-500">*</span></FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="VENTES">Journal des ventes</SelectItem>
                          <SelectItem value="ACHATS">Journal des achats</SelectItem>
                          <SelectItem value="DIVERS">Journal des opérations diverses</SelectItem>
                          <SelectItem value="TRESORERIE">Journal de trésorerie</SelectItem>
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
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Compte principal <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="ex. 571100" />
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
                          <SelectItem value="TTC">Montant TTC</SelectItem>
                          <SelectItem value="HT">Montant HT</SelectItem>
                          <SelectItem value="TVA">Montant TVA</SelectItem>
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
                <Button type="button" variant="outline" size="sm" onClick={addCounterparty} className="border-blue-500 text-blue-600 hover:bg-blue-50">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Ajouter un compte
                </Button>
              </div>

              <div className="space-y-4">
                {counterpartyDetails?.map((counterparty, index) => (
                  <Collapsible key={index} defaultOpen className="rounded-lg border bg-white shadow-sm overflow-hidden">
                    <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">#{index + 1}</div>
                        <span className="text-sm font-medium">{counterparty.account || "Nouveau compte..."}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={(e) => { e.stopPropagation(); removeCounterparty(index); }}
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
                          name={`counterpartyDetails.${index}.account`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Compte contrepartie <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="ex. 411100" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`counterpartyDetails.${index}.isTiers`}
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
                          name={`counterpartyDetails.${index}.debitOrCredit`}
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
                          name={`counterpartyDetails.${index}.amountType`}
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
                          name={`counterpartyDetails.${index}.journalType`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Journal</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent>
                                  <SelectItem value="VENTES">Ventes</SelectItem>
                                  <SelectItem value="ACHATS">Achats</SelectItem>
                                  <SelectItem value="TRESORERIE">Trésorerie</SelectItem>
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

        {/* Footer harmonisé */}
        <div className="p-4 border-t flex justify-end bg-gray-50 rounded-b-lg">
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