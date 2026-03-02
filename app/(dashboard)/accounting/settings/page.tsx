"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { LedgerSettings, GeneralSettings } from '@/types/accounting';
import {
  getLedgerSettings,
  updateLedgerSettings,
  getGeneralSettings,
  updateGeneralSettings,
} from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useNationalCurrency } from '@/hooks/use-national-currency';

export default function AccountingSettingsPage() {
  const { nationalCurrency } = useNationalCurrency();
  const currencyCode = nationalCurrency?.code || 'XAF';
  const [ledgerSettings, setLedgerSettings] = useState<LedgerSettings | null>(null);
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [ledgerResponse, generalResponse] = await Promise.all([
        getLedgerSettings(),
        getGeneralSettings(),
      ]);
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

  const handleSaveLedgerSettings = async (data: Partial<LedgerSettings>) => {
    try {
      const updated = await updateLedgerSettings(data);
      setLedgerSettings(updated);
      toast.success("Paramètres du Grand Livre enregistrés");
    } catch (error) {
      console.error("Failed to save ledger settings:", error);
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const handleSaveGeneralSettings = async (data: Partial<GeneralSettings>) => {
    try {
      const updated = await updateGeneralSettings(data);
      setGeneralSettings(updated);
      toast.success("Paramètres généraux enregistrés");
    } catch (error) {
      console.error("Failed to save general settings:", error);
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Chargement des paramètres...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="mb-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-indigo-900">Paramètre général</h1>
        <p className="text-gray-500">Gérez les configurations globales de la comptabilité.</p>
      </div>

      <div className="w-full max-w-5xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-6 border">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-indigo-900 border-b pb-2">Paramètres du Grand Livre</h3>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <select name="reportFormat" defaultValue={ledgerSettings?.reportFormat || 'PDF'} className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-white">
                  <option value="PDF">PDF</option>
                  <option value="EXCEL">Excel</option>
                  <option value="CSV">CSV</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="includeDetails" defaultChecked={ledgerSettings?.includeDetails || false} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <label className="text-sm text-gray-700">Inclure les détails</label>
              </div>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Enregistrer</Button>
            </form>
          </div>

          <div className="pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4 text-indigo-900 border-b pb-2">Paramètres Généraux</h3>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Devise par défaut</label>
                  <Input name="defaultCurrency" defaultValue={generalSettings?.defaultCurrency || currencyCode} className="mt-1" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Année fiscale par défaut</label>
                  <Input name="defaultFiscalYear" defaultValue={generalSettings?.defaultFiscalYear || '2025'} className="mt-1" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mode de saisie des écritures</label>
                <select
                  name="entryMode"
                  defaultValue={generalSettings?.entryMode || 'MANUAL'}
                  className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="MANUAL">Manuel</option>
                  <option value="SEMI_AUTOMATIC">Semi-automatique</option>
                  <option value="AUTOMATIC">Automatique</option>
                </select>
              </div>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Enregistrer</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}