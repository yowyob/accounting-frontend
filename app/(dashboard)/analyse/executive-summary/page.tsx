"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download, RefreshCw, AlertCircle, PieChart, TrendingUp, Wallet, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { AccountingFinancialReportsService } from '@/src/lib2/services/AccountingFinancialReportsService';
import { AccountingPeriodsService } from '@/src/lib2/services/AccountingPeriodsService';
import { CustomPageLoader } from '@/components/ui/custom-page-loader';
import { useNationalCurrency } from '@/hooks/use-national-currency';
import { formatDateForApi } from '@/lib/utils';

export default function GeneralSummaryPage() {
  const { nationalCurrency } = useNationalCurrency();
  const currencyCode = nationalCurrency?.code || 'XAF';
  const [periodes, setPeriodes] = useState<any[]>([]);
  const [selectedPeriodeId, setSelectedPeriodeId] = useState<string | null>(null);
  const [isLoadingPeriods, setIsLoadingPeriods] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [summaryData, setSummaryData] = useState<any>(null);

  const fetchPeriodesData = useCallback(async () => {
    setIsLoadingPeriods(true);
    try {
      const response = await AccountingPeriodsService.getAllPeriodeComptables();
      if (response.success && Array.isArray(response.data)) {
        setPeriodes(response.data);
        if (response.data.length > 0 && !selectedPeriodeId) {
          const today = new Date();
          const currentPeriod = response.data.find(p => {
            const start = new Date(p.dateDebut);
            const end = new Date(p.dateFin);
            return today >= start && today <= end;
          });
          setSelectedPeriodeId(currentPeriod?.id || response.data[0].id || null);
        }
      }
    } catch (error) {
      console.error('Error fetching periods:', error);
      toast.error("Erreur lors de la récupération des périodes");
    } finally {
      setIsLoadingPeriods(false);
    }
  }, [selectedPeriodeId]);

  useEffect(() => {
    fetchPeriodesData();
  }, [fetchPeriodesData]);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!selectedPeriodeId || periodes.length === 0) {
        setSummaryData(null);
        return;
      }

      const periode = periodes.find(p => p.id === selectedPeriodeId);
      if (!periode) {
        setSummaryData(null);
        return;
      }

      setIsLoadingData(true);
      try {
        const response = await AccountingFinancialReportsService.generateExecutiveSummary(
          formatDateForApi(periode.dateDebut),
          formatDateForApi(periode.dateFin)
        );

        if (response.success && response.data) {
          setSummaryData(response.data);
        } else {
          setSummaryData(null);
          toast.error("Erreur lors de la génération du résumé exécutif.");
        }
      } catch (error) {
        console.error("Erreur lors de la génération du résumé exécutif:", error);
        toast.error("Erreur lors de la génération du résumé exécutif.");
        setSummaryData(null);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchSummary();
  }, [selectedPeriodeId, periodes]);

  const handleGeneratePDF = () => {
    toast.info("L'export PDF sera disponible prochainement");
  };

  const handleGenerateXLSX = () => {
    toast.info("L'export XLSX sera disponible prochainement");
  };

  // Helper variables for UI
  const formatValue = (val: number | undefined) => {
    if (val === undefined || val === null) return 0;
    return val;
  };

  const formatCurrencyString = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: currencyCode }).format(amount).replace(currencyCode, '').trim() + ' ' + currencyCode;
  };

  const totalActifs = summaryData?.bilan ? formatValue(summaryData.bilan.find((item: any) => item.description === 'Total Assets')?.total) : 0;
  const totalPassifs = summaryData?.bilan ? formatValue(summaryData.bilan.find((item: any) => item.description === 'Total Liabilities')?.total) : 0;
  const totalCapitaux = summaryData?.bilan ? formatValue(summaryData.bilan.find((item: any) => item.description === 'Total Equity')?.total) : 0;

  const totalProduits = summaryData?.compteResultat ? formatValue(summaryData.compteResultat.find((item: any) => item.description === 'Total Products')?.total) : 0;
  const totalCharges = summaryData?.compteResultat ? formatValue(summaryData.compteResultat.find((item: any) => item.description === 'Total Expenses')?.total) : 0;
  const resultatNet = summaryData?.compteResultat ? formatValue(summaryData.compteResultat.find((item: any) => item.description === 'Net Result')?.total) : 0;

  const totalOperationnel = summaryData?.fluxTresorerie ? formatValue(summaryData.fluxTresorerie.find((item: any) => item.category === 'operationnel')?.total) : 0;
  const totalInvestissement = summaryData?.fluxTresorerie ? formatValue(summaryData.fluxTresorerie.find((item: any) => item.category === 'investissement')?.total) : 0;
  const totalFinancement = summaryData?.fluxTresorerie ? formatValue(summaryData.fluxTresorerie.find((item: any) => item.category === 'financement')?.total) : 0;
  const fluxNet = summaryData?.fluxTresorerie ? formatValue(summaryData.fluxTresorerie.find((item: any) => item.description === 'Net Cash Flow')?.total) : 0;

  // Formatting for large numbers (M, K)
  const formatShortNumber = (num: number) => {
    if (Math.abs(num) >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (Math.abs(num) >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (isLoadingPeriods || isLoadingData) return <CustomPageLoader />;

  return (
    <div className="min-h-screen p-6 bg-gray-50/30">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Résumé Exécutif</h1>
            <p className="text-gray-500 mt-2">Vue d'ensemble synthétique des indicateurs financiers clés.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleGeneratePDF} disabled={!selectedPeriodeId || !summaryData}>
              <Download className="h-4 w-4 mr-2" /> PDF
            </Button>
            <Button variant="outline" onClick={handleGenerateXLSX} disabled={!selectedPeriodeId || !summaryData}>
              <Download className="h-4 w-4 mr-2" /> XLSX
            </Button>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <Select value={selectedPeriodeId || ''} onValueChange={setSelectedPeriodeId}>
            <SelectTrigger className="w-72">
              <SelectValue placeholder="Sélectionner une période" />
            </SelectTrigger>
            <SelectContent>
              {periodes.map((periode) => (
                <SelectItem key={periode.id} value={periode.id!}>
                  {periode.code} ({new Date(periode.dateDebut).toLocaleDateString()} - {new Date(periode.dateFin).toLocaleDateString()})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" onClick={fetchPeriodesData} title="Rafraîchir les périodes">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border-none shadow-sm overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <PieChart className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest bg-blue-50/50 px-2 py-1 rounded">Actifs</span>
              </div>
              <h3 className="text-2xl font-black text-gray-900">{formatShortNumber(totalActifs)}</h3>
              <p className="text-xs text-gray-400 mt-1">Valeur totale du patrimoine</p>
            </CardContent>
            <div className="h-1 bg-blue-500 w-full" />
          </Card>

          <Card className="bg-white border-none shadow-sm overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-50/50 px-2 py-1 rounded">Chiffre d'affaires</span>
              </div>
              <h3 className="text-2xl font-black text-gray-900">{formatShortNumber(totalProduits)}</h3>
              <p className="text-xs text-gray-400 mt-1">Total des produits générés</p>
            </CardContent>
            <div className="h-1 bg-emerald-500 w-full" />
          </Card>

          <Card className="bg-white border-none shadow-sm overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                  <Wallet className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest bg-purple-50/50 px-2 py-1 rounded">Trésorerie</span>
              </div>
              <h3 className="text-2xl font-black text-gray-900">{formatShortNumber(fluxNet)}</h3>
              <p className="text-xs text-gray-400 mt-1">Variation nette de cash</p>
            </CardContent>
            <div className="h-1 bg-purple-500 w-full" />
          </Card>

          <Card className="bg-white border-none shadow-sm overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50/50 px-2 py-1 rounded">Résultat Net</span>
              </div>
              <h3 className="text-2xl font-black text-gray-900">{formatShortNumber(resultatNet)}</h3>
              <p className="text-xs text-gray-400 mt-1">Bénéfice net après charges</p>
            </CardContent>
            <div className="h-1 bg-indigo-500 w-full" />
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Répartition Bilan</CardTitle>
              <CardDescription>Comparaison Actif / Passif / Capitaux</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Actifs</span>
                  <span className="font-bold">3 500 000 {currencyCode}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[100%]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Passifs</span>
                  <span className="font-bold">1 250 000 {currencyCode}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full w-[35%]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Capitaux Propres</span>
                  <span className="font-bold">2 250 000 {currencyCode}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[65%]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Opérationnelle</CardTitle>
              <CardDescription>Produits vs Charges vs Résultat</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Produits</span>
                  <span className="font-bold">2 000 000 {currencyCode}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[100%]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Charges</span>
                  <span className="font-bold">700 000 {currencyCode}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full w-[35%]" />
                </div>
              </div>
              <div className="mt-8 p-4 bg-emerald-50 rounded-lg border border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-semibold text-emerald-800 uppercase tracking-tighter">Marge Nette</span>
                </div>
                <span className="text-2xl font-black text-emerald-900">65%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}