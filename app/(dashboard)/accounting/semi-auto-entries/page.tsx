"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  EcritureComptable,
  DetailEcritureDto,
  OperationComptable,
  PeriodeComptable,
  UUID,
} from '@/types/accounting';
import {
  getOperationsComptables,
  getPeriodeComptables,
  getJounalComptables,
  createEcritureComptable,
} from '@/lib/api';
import { useForm } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Plus, Trash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from "sonner";

export default function AccountingSemiAutoEntryPage() {
  const [operations, setOperations] = useState<OperationComptable[]>([]);
  const [periodes, setPeriodes] = useState<PeriodeComptable[]>([]);
  const [journals, setJournals] = useState<{ id: string; libelle: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOperation, setSelectedOperation] = useState<OperationComptable | null>(null);

  const form = useForm<EcritureComptable>({
    defaultValues: {
      libelle: '',
      dateEcriture: new Date().toISOString().split('T')[0] as any,
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

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [operationsResponse, periodesResponse, journalsResponse] = await Promise.all([
        getOperationsComptables(),
        getPeriodeComptables(),
        getJounalComptables(),
      ]);
      setOperations(Array.isArray(operationsResponse) ? (operationsResponse as any) : []);
      setPeriodes(Array.isArray(periodesResponse) ? (periodesResponse as any) : []);
      setJournals(Array.isArray(journalsResponse) ? (journalsResponse as any).map((j: any) => ({ id: j.id!, libelle: j.libelle })) : []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOperationSelect = (operationId: string) => {
    const operation = operations.find(op => op.id === operationId) || null;
    setSelectedOperation(operation);
    if (operation) {
      form.reset({
        ...form.getValues(),
        libelle: `Saisie semi-automatique - ${operation.typeOperation}`,
        journalComptableId: operation.journalComptableId,
        detailsEcriture: [
          {
            compteId: crypto.randomUUID() as UUID,
            libelle: operation.typeOperation,
            montantDebit: operation.sensPrincipal === 'DEBIT' ? operation.plafondClient || 0 : 0,
            montantCredit: operation.sensPrincipal === 'CREDIT' ? operation.plafondClient || 0 : 0,
          },
        ],
      });
    }
  };

  const addDetailLine = () => {
    const details = form.getValues('detailsEcriture') || [];
    form.setValue('detailsEcriture', [
      ...details,
      { compteId: crypto.randomUUID() as UUID, libelle: '', montantDebit: 0, montantCredit: 0 },
    ]);
  };

  const removeDetailLine = (index: number) => {
    const details = form.getValues('detailsEcriture') || [];
    form.setValue('detailsEcriture', details.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: EcritureComptable) => {
    const totalDebit = data.detailsEcriture?.reduce((sum, d) => sum + (d.montantDebit || 0), 0) || 0;
    const totalCredit = data.detailsEcriture?.reduce((sum, d) => sum + (d.montantCredit || 0), 0) || 0;
    if (totalDebit !== totalCredit) {
      toast.error("Erreur", { description: "Les montants de débit et de crédit doivent être égaux." });
      return;
    }

    setIsLoading(true);
    try {
      await createEcritureComptable({ ...data, dateEcriture: new Date(data.dateEcriture) as any, montantTotalDebit: totalDebit, montantTotalCredit: totalCredit });
      toast.success("Succès", { description: "Écriture créée avec succès." });
      form.reset();
      setSelectedOperation(null);
    } catch (error) {
      console.error("Failed to create ecriture:", error);
      toast.error("Erreur", { description: "Échec de la création de l'écriture." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50 justify-center">
      <div className="mx-auto space-y-6 justify-center">
        <h1 className="text-2xl font-bold">Saisie Semi-Automatique des Écritures</h1>

        {isLoading ? (
          <div className="text-center py-10 text-gray-500">Chargement...</div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de Saisie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Opération Comptable</label>
                  <Select onValueChange={handleOperationSelect} value={selectedOperation?.id || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une opération" />
                    </SelectTrigger>
                    <SelectContent>
                      {operations.map((op) => (
                        <SelectItem key={op.id} value={op.id!}>
                          {op.typeOperation} ({op.modeReglement})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Période Comptable</label>
                  <Select
                    onValueChange={(value) => form.setValue('periodeComptableId', value)}
                    value={form.watch('periodeComptableId') || ''}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une période" />
                    </SelectTrigger>
                    <SelectContent>
                      {periodes.map((periode) => (
                        <SelectItem key={periode.id} value={periode.id!}>
                          {periode.code} - {periode.cloturee}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Journal Comptable</label>
                  <Select
                    onValueChange={(value) => form.setValue('journalComptableId', value)}
                    value={form.watch('journalComptableId') || ''}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un journal" />
                    </SelectTrigger>
                    <SelectContent>
                      {journals.map((journal) => (
                        <SelectItem key={journal.id} value={journal.id}>
                          {journal.libelle}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <Input
                    type="date"
                    {...form.register('dateEcriture')}
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Référence Externe</label>
                <Input {...form.register('referenceExterne')} placeholder="Ex: Réf-001" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <Input {...form.register('notes')} placeholder="Informations supplémentaires..." />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Détails de l&#39;Écriture</h3>
                {form.watch('detailsEcriture')?.map((detail, index) => (
                  <div key={detail.compteId} className="grid grid-cols-5 gap-5 mb-4 p-2 bg-gray-50 rounded-lg">
                    <Input
                      {...form.register(`detailsEcriture.${index}.compteId` as const)}
                      placeholder="Compte"
                      className="col-span-1"
                    />
                    <Input
                      {...form.register(`detailsEcriture.${index}.libelle` as const)}
                      placeholder="Description"
                      className="col-span-1"
                    />
                    <Input
                      type="number"
                      {...form.register(`detailsEcriture.${index}.montantDebit` as const, { valueAsNumber: true })}
                      placeholder="Débit"
                      className="col-span-1"
                    />
                    <Input
                      type="number"
                      {...form.register(`detailsEcriture.${index}.montantCredit` as const, { valueAsNumber: true })}
                      placeholder="Crédit"
                      className="col-span-1"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeDetailLine(index)}
                      className="col-span-1"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addDetailLine} className="mt-2">
                  <Plus className="mr-2 h-4 w-4" /> Ajouter une ligne
                </Button>
              </div>

              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={isLoading}
                className="w-full md:w-auto"
              >
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}