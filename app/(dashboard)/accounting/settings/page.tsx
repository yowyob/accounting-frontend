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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings, FileText, Globe, Calendar, Save, Loader2, Info } from 'lucide-react';
import { CustomPageLoader } from '@/components/ui/custom-page-loader';
import { cn } from '@/lib/utils';

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
    return <CustomPageLoader />;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50/50">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-end border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Paramètres Généraux</h1>
            <p className="text-gray-500 mt-2">Configurez les réglages globaux et les préférences du module comptable.</p>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">
            <Info className="h-4 w-4" />
            Configuration Active
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Grand Livre Settings */}
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-white border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">Paramètres du Grand Livre</CardTitle>
                  <CardDescription>Définissez les plages de comptes et formats d'export.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-6">
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
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-tight">Plage de comptes (Début)</label>
                    <Input
                      name="accountRangeStart"
                      defaultValue={ledgerSettings?.accountRangeStart || '10000'}
                      className="bg-gray-50 border-gray-200 focus:bg-white h-12 text-lg font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-tight">Plage de comptes (Fin)</label>
                    <Input
                      name="accountRangeEnd"
                      defaultValue={ledgerSettings?.accountRangeEnd || '99999'}
                      className="bg-gray-50 border-gray-200 focus:bg-white h-12 text-lg font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-tight">Format du rapport par défaut</label>
                    <select
                      name="reportFormat"
                      defaultValue={ledgerSettings?.reportFormat || 'PDF'}
                      className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    >
                      <option value="PDF">Document PDF (.pdf)</option>
                      <option value="EXCEL">Feuille Excel (.xlsx)</option>
                      <option value="CSV">Données CSV (.csv)</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors cursor-pointer border border-transparent hover:border-indigo-100">
                    <input
                      type="checkbox"
                      id="includeDetails"
                      name="includeDetails"
                      defaultChecked={ledgerSettings?.includeDetails || false}
                      className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-all"
                    />
                    <label htmlFor="includeDetails" className="text-sm font-semibold text-gray-900 cursor-pointer select-none">
                      Inclure les détails de l'écriture dans les rapports
                    </label>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white h-12 px-8 font-bold shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-[0.98]">
                    <Save className="h-4 w-4 mr-2" /> Enregistrer les modifications
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* General Settings */}
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-white border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                  <Settings className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">Préférences Globales</CardTitle>
                  <CardDescription>Configurez les valeurs par défaut du système.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveGeneralSettings({
                    defaultCurrency: (e.target as any).defaultCurrency.value,
                    defaultFiscalYear: (e.target as any).defaultFiscalYear.value,
                    entryMode: (e.target as any).entryMode.value as 'AUTOMATIC' | 'SEMI_AUTOMATIC' | 'MANUAL',
                  });
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-tight">Devise par défaut</label>
                    </div>
                    <Input
                      name="defaultCurrency"
                      defaultValue={generalSettings?.defaultCurrency || currencyCode}
                      className="bg-gray-50 border-gray-200 focus:bg-white h-12 text-lg font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-tight">Année fiscale active</label>
                    </div>
                    <Input
                      name="defaultFiscalYear"
                      defaultValue={generalSettings?.defaultFiscalYear || '2025'}
                      className="bg-gray-50 border-gray-200 focus:bg-white h-12 text-lg font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-tight block">Mode de saisie privilégié</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { value: 'MANUAL', label: 'Manuel', desc: 'Saisie directe par le comptable' },
                      { value: 'SEMI_AUTOMATIC', label: 'Semi-Auto', desc: 'Assistance par IA et brouillon' },
                      { value: 'AUTOMATIC', label: 'Automatique', desc: 'Validation et génération directe' }
                    ].map((mode) => (
                      <label
                        key={mode.value}
                        className={cn(
                          "relative p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-white group",
                          generalSettings?.entryMode === mode.value
                            ? "border-amber-500 bg-amber-50/20"
                            : "border-gray-100 bg-gray-50 hover:border-amber-200"
                        )}
                      >
                        <input
                          type="radio"
                          name="entryMode"
                          value={mode.value}
                          defaultChecked={generalSettings?.entryMode === mode.value}
                          className="hidden"
                        />
                        <div className="font-bold text-gray-900 mb-1">{mode.label}</div>
                        <div className="text-xs text-gray-500 leading-tight">{mode.desc}</div>
                        {generalSettings?.entryMode === mode.value && (
                          <div className="absolute top-2 right-2 h-2 w-2 bg-amber-500 rounded-full" />
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white h-12 px-8 font-bold shadow-lg shadow-amber-200 transition-all hover:scale-[1.02] active:scale-[0.98]">
                    <Save className="h-4 w-4 mr-2" /> Mettre à jour les préférences
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}