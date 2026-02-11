"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ExerciceComptableDto } from '@/src/lib2/models/ExerciceComptableDto';
import { PeriodeComptableDto } from '@/src/lib2/models/PeriodeComptableDto';
import { OperationComptableDto } from '@/src/lib2/models/OperationComptableDto';
import { AccountingFiscalYearsService } from '@/src/lib2/services/AccountingFiscalYearsService';
import { AccountingPeriodsService } from '@/src/lib2/services/AccountingPeriodsService';
import { AccountingOperationsService } from '@/src/lib2/services/AccountingOperationsService';
import { LedgerSettings, GeneralSettings } from '@/types/accounting';
import {
  getLedgerSettings,
  updateLedgerSettings,
  getGeneralSettings,
  updateGeneralSettings,
} from '@/lib/api';
import { ExerciceComptableListView } from '@/components/accounting/exercice-comptable-list-view';
import { PeriodeComptableListView } from '@/components/accounting/periode-comptable-list-view';
import { OperationComptableListView } from '@/components/accounting/operation-comptable-list-view';
import { ExerciceComptableDetailView } from '@/components/accounting/exercice-comptable-detail-view';
import { PeriodeComptableDetailView } from '@/components/accounting/periode-comptable-detail-view';
import { OperationForm } from '@/components/accounting/settings/operation-form';
import { useCompose } from '@/hooks/use-compose-store';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useNationalCurrency } from '@/hooks/use-national-currency';

export default function AccountingSettingsPage() {
  const { nationalCurrency } = useNationalCurrency();
  const currencyCode = nationalCurrency?.code || 'XAF';
  const [exercices, setExercices] = useState<ExerciceComptableDto[]>([]);
  const [periodes, setPeriodes] = useState<PeriodeComptableDto[]>([]);
  const [operations, setOperations] = useState<OperationComptableDto[]>([]);
  const [ledgerSettings, setLedgerSettings] = useState<LedgerSettings | null>(null);
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [operationToDelete, setOperationToDelete] = useState<OperationComptableDto | null>(null);
  const { onOpen, onClose: closeCompose } = useCompose();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [exerciceResponse, periodeResponse, operationResponse, ledgerResponse, generalResponse] = await Promise.all([
        AccountingFiscalYearsService.getAllExercices(),
        AccountingPeriodsService.getAllPeriodeComptables(),
        AccountingOperationsService.getAllOperationsComptables(),
        getLedgerSettings(),
        getGeneralSettings(),
      ]);
      setExercices(exerciceResponse.data || []);
      setPeriodes(periodeResponse.data || []);
      setOperations(operationResponse.data || []);
      setLedgerSettings(ledgerResponse || null);
      setGeneralSettings(generalResponse || null);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      toast.error("Erreur lors du chargement des paramètres");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async <T extends { id?: string }>(
    data: T,
    createFn: (data: T) => Promise<any>,
    updateFn: (id: string, data: T) => Promise<any>,
    setState: React.Dispatch<React.SetStateAction<T[]>>,
    refresh = true
  ) => {
    const isNew = !data.id;
    try {
      const response = await (isNew ? createFn(data) : updateFn(data.id!, data));
      // Extract data from response which can be { data: ... } or just ...
      const savedItem = response?.data !== undefined ? response.data : response;

      setState((prev) => {
        if (isNew) return [...prev, savedItem];
        return prev.map((item) => (item.id === savedItem.id ? savedItem : item));
      });

      if (refresh) await fetchData();
      toast.success(isNew ? "Création réussie" : "Modification enregistrée");
      closeCompose();
    } catch (error) {
      console.error(`Failed to save ${isNew ? 'new' : 'updated'} item:`, error);
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const handleDelete = async <T extends { id?: string }>(
    item: T | null,
    deleteFn: (id: string) => Promise<any>,
    setState: React.Dispatch<React.SetStateAction<T[]>>,
    setItemToDelete: React.Dispatch<React.SetStateAction<T | null>>
  ) => {
    if (!item?.id) return;
    try {
      await deleteFn(item.id);
      setState((prev) => prev.filter((i) => i.id !== item.id));
      setItemToDelete(null);
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };


  const handleSaveLedgerSettings = async (data: Partial<LedgerSettings>) => {
    try {
      const updated = await updateLedgerSettings(data);
      setLedgerSettings(updated);
    } catch (error) {
      console.error("Failed to save ledger settings:", error);
    }
  };

  const handleSaveGeneralSettings = async (data: Partial<GeneralSettings>) => {
    try {
      const updated = await updateGeneralSettings(data);
      setGeneralSettings(updated);
    } catch (error) {
      console.error("Failed to save general settings:", error);
    }
  };

  const handleOpenExerciceCompose = (exercice?: ExerciceComptableDto) =>
    onOpen({
      title: exercice ? "Modifier l'Exercice" : "Nouvel Exercice",
      content: <ExerciceComptableDetailView
        exercice={exercice || null}
        onSave={(data) => handleSave(data, AccountingFiscalYearsService.createExercice, AccountingFiscalYearsService.updateExercice, setExercices)}
        onClose={() => handleCloseExercice(exercice?.id || '')}
        onBack={closeCompose}
      />,
    });

  const handleOpenPeriodeCompose = (periode?: PeriodeComptableDto) =>
    onOpen({
      title: periode ? "Modifier la Période" : "Nouvelle Période",
      content: <PeriodeComptableDetailView
        periode={periode || null}
        onSave={(data) => handleSave(data, AccountingPeriodsService.createPeriodeComptable, AccountingPeriodsService.updatePeriodeComptable, setPeriodes)}
        onClose={() => handleClosePeriode(periode?.id || '')}
        onBack={closeCompose}
      />,
    });

  const handleOpenOperationCompose = (operation?: OperationComptableDto) =>
    onOpen({
      title: operation ? "Modifier l'Opération" : "Nouvelle Opération",
      content: <OperationForm
        initialData={operation || null}
        onSave={(data) => handleSave(data, AccountingOperationsService.createOperationComptable, AccountingOperationsService.updateOperationComptable, setOperations)}
        onCancel={closeCompose}
      />,
    });

  const handleCloseExercice = async (id: string) => {
    try {
      await AccountingFiscalYearsService.closeExercice(id);
      toast.success("Exercice clôturé");
      fetchData();
    } catch (error) {
      toast.error("Erreur lors de la clôture de l'exercice");
    }
  };

  const handleClosePeriode = async (id: string) => {
    try {
      await AccountingPeriodsService.closePeriodeComptable(id);
      toast.success("Période clôturée");
      fetchData();
    } catch (error) {
      toast.error("Erreur lors de la clôture de la période");
    }
  };

  const handleDeleteOperation = () => handleDelete(operationToDelete, AccountingOperationsService.deleteOperationComptable, setOperations, setOperationToDelete);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="mb-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-indigo-900">Paramètres Comptables</h1>
        <p className="text-gray-500">Gérez vos exercices, périodes et opérations systèmes.</p>
      </div>

      <Tabs defaultValue="exercices" className="w-full max-w-5xl mx-auto">
        <TabsList className="grid w-full grid-cols-4 bg-white rounded-t-lg shadow-sm border">
          <TabsTrigger value="exercices" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Exercices</TabsTrigger>
          <TabsTrigger value="periodes" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Périodes</TabsTrigger>
          <TabsTrigger value="operations" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Opérations</TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Général</TabsTrigger>
        </TabsList>
        <TabsContent value="exercices" className="bg-white rounded-b-lg shadow-sm border border-t-0 p-6">
          <ExerciceComptableListView
            exercices={exercices}
            isLoading={isLoading}
            onSelectExercice={(id) => handleOpenExerciceCompose(exercices.find((e) => e.id === id))}
            onEditExercice={(id) => handleOpenExerciceCompose(exercices.find((e) => e.id === id))}
            onCloseExercice={handleCloseExercice}
            onAddNew={() => handleOpenExerciceCompose()}
            onRefresh={fetchData}
          />
        </TabsContent>
        <TabsContent value="periodes" className="bg-white rounded-b-lg shadow-sm border border-t-0 p-6">
          <PeriodeComptableListView
            periodes={periodes}
            isLoading={isLoading}
            onSelectPeriode={(id) => handleOpenPeriodeCompose(periodes.find((p) => p.id === id))}
            onEditPeriode={(id) => handleOpenPeriodeCompose(periodes.find((p) => p.id === id))}
            onClosePeriode={handleClosePeriode}
            onAddNew={() => handleOpenPeriodeCompose()}
            onRefresh={fetchData}
          />
        </TabsContent>
        <TabsContent value="operations" className="bg-white rounded-b-lg shadow-sm border border-t-0 p-6">
          <OperationComptableListView
            operations={operations}
            isLoading={isLoading}
            onSelectOperation={(id) => handleOpenOperationCompose(operations.find((o) => o.id === id))}
            onEditOperation={(id) => handleOpenOperationCompose(operations.find((o) => o.id === id))}
            onDeleteOperation={setOperationToDelete}
            onAddNew={() => handleOpenOperationCompose()}
            onRefresh={fetchData}
          />
        </TabsContent>
        <TabsContent value="settings" className="bg-white rounded-b-lg shadow p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Paramètres du Grand Livre</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveLedgerSettings({
                  accountRangeStart: (e.target as any).accountRangeStart.value,
                  accountRangeEnd: (e.target as any).accountRangeEnd.value,
                  reportFormat: (e.target as any).reportFormat.value,
                  includeDetails: (e.target as any).includeDetails.checked,
                });
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Plage de comptes (Début)</label>
                  <Input name="accountRangeStart" defaultValue={ledgerSettings?.accountRangeStart || '10000'} className="mt-1" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Plage de comptes (Fin)</label>
                  <Input name="accountRangeEnd" defaultValue={ledgerSettings?.accountRangeEnd || '99999'} className="mt-1" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Format du rapport</label>
                <select name="reportFormat" defaultValue={ledgerSettings?.reportFormat || 'PDF'} className="w-full p-2 mt-1 border border-gray-300 rounded-lg">
                  <option value="PDF">PDF</option>
                  <option value="EXCEL">Excel</option>
                  <option value="CSV">CSV</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Input type="checkbox" name="includeDetails" defaultChecked={ledgerSettings?.includeDetails || false} className="h-4 w-4" />
                <label className="text-sm text-gray-700">Inclure les détails</label>
              </div>
              <Button type="submit" className="w-full md:w-auto">Enregistrer</Button>
            </form>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Paramètres Généraux</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveGeneralSettings({
                  defaultCurrency: (e.target as any).defaultCurrency.value,
                  defaultFiscalYear: (e.target as any).defaultFiscalYear.value,
                  entryMode: (e.target as any).entryMode.value as 'AUTOMATIC' | 'SEMI_AUTOMATIC' | 'MANUAL',
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">Devise par défaut</label>
                <Input name="defaultCurrency" defaultValue={generalSettings?.defaultCurrency || currencyCode} className="mt-1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Année fiscale par défaut</label>
                <Input name="defaultFiscalYear" defaultValue={generalSettings?.defaultFiscalYear || '2025'} className="mt-1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mode de saisie des écritures</label>
                <select
                  name="entryMode"
                  defaultValue={generalSettings?.entryMode || 'MANUAL'}
                  className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
                >
                  <option value="MANUAL">Manuel</option>
                  <option value="SEMI_AUTOMATIC">Semi-automatique</option>
                  <option value="AUTOMATIC">Automatique</option>
                </select>
              </div>
              <Button type="submit" className="w-full md:w-auto">Enregistrer</Button>
            </form>
          </div>
        </TabsContent>
      </Tabs>
      {operationToDelete && (
        <ConfirmationDialog
          isOpen={!!operationToDelete}
          onClose={() => setOperationToDelete(null)}
          onConfirm={handleDeleteOperation}
          title={`Supprimer ${operationToDelete.typeOperation} (${operationToDelete.modeReglement}) ?`}
          description="Cette action est irréversible. L'opération sera supprimée."
        />
      )}
    </div>
  );
}