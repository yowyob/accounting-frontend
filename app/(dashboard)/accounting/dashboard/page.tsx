/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, DollarSign, CreditCard, Clock, Calendar } from 'lucide-react';
import Chart from 'chart.js/auto';
import { useNationalCurrency } from '@/hooks/use-national-currency';

export default function AccountingDashboard() {
  const { nationalCurrency } = useNationalCurrency();
  const currencyCode = nationalCurrency?.code || 'XAF';
  const [kpis, setKpis] = useState({
    totalDebit: 1500000,
    totalCredit: 1450000,
    pendingEntries: 5,
    currentPeriod: 'Septembre 2025',
  });

  const [recentOperations, setRecentOperations] = useState([
    { id: 1, type: 'Vente', amount: 50000, date: '2025-09-24' },
    { id: 2, type: 'Achat', amount: 30000, date: '2025-09-23' },
    { id: 3, type: 'Paiement', amount: 20000, date: '2025-09-22' },
  ]);

  const [periodSummary, setPeriodSummary] = useState({
    totalRevenue: 2000000,
    totalExpenses: 1600000,
    netProfit: 400000,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Refreshing data...');
      // In a real app, fetch data from API here
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    // Initial fetch, simulate API call
    console.log('Fetching dashboard data...');
    // In a real app, call API here
  }, []);

  const debitCreditChartRef = useRef<Chart | null>(null);
  const periodStatusChartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const debitCreditCtx = document.getElementById('debit-credit-chart') as HTMLCanvasElement;
    if (debitCreditCtx) {
      if (debitCreditChartRef.current) {
        debitCreditChartRef.current.destroy();
      }

      debitCreditChartRef.current = new Chart(debitCreditCtx, {
        type: 'bar',
        data: {
          labels: ['Débit', 'Crédit'],
          datasets: [{
            label: 'Montants',
            data: [kpis.totalDebit, kpis.totalCredit],
            backgroundColor: ['#4B5EAA', '#AA4B5E'],
          }],
        },
        options: {
          responsive: true,
          plugins: { legend: { position: 'top' } },
        },
      });
    }

    const periodStatusCtx = document.getElementById('period-status-chart') as HTMLCanvasElement;
    if (periodStatusCtx) {
      if (periodStatusChartRef.current) {
        periodStatusChartRef.current.destroy();
      }

      periodStatusChartRef.current = new Chart(periodStatusCtx, {
        type: 'pie',
        data: {
          labels: ['Revenu', 'Dépenses', 'Profit Net'],
          datasets: [{
            data: [periodSummary.totalRevenue, periodSummary.totalExpenses, periodSummary.netProfit],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          }],
        },
        options: {
          responsive: true,
        },
      });
    }

    return () => {
      if (debitCreditChartRef.current) {
        debitCreditChartRef.current.destroy();
        debitCreditChartRef.current = null;
      }
      if (periodStatusChartRef.current) {
        periodStatusChartRef.current.destroy();
        periodStatusChartRef.current = null;
      }
    };
  }, [kpis, periodSummary]);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Comptable</h1>
          <Button onClick={handleRefresh} variant="outline" disabled={isLoading} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" /> Rafraîchir
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Débit</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis.totalDebit.toLocaleString('fr-FR')} {currencyCode}</div>
              <p className="text-xs text-muted-foreground">+5% vs mois dernier</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Crédit</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis.totalCredit.toLocaleString('fr-FR')} {currencyCode}</div>
              <p className="text-xs text-muted-foreground">+3% vs mois dernier</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Écritures en Attente</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis.pendingEntries}</div>
              <p className="text-xs text-muted-foreground">3 nouvelles aujourd'hui</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Débit vs Crédit</CardTitle>
            </CardHeader>
            <CardContent>
              <canvas id="debit-credit-chart" className="h-64"></canvas>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Statut des Périodes</CardTitle>
            </CardHeader>
            <CardContent>
              <canvas id="period-status-chart" className="h-64"></canvas>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Opérations Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOperations.map((op) => (
                <div key={op.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">{op.type}</span>
                  <span>{op.amount.toLocaleString('fr-FR')} {currencyCode}</span>
                  <span className="text-sm text-gray-500">{op.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Résumé Financier</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="font-medium">Chiffre d'Affaires</p>
              <p className="text-2xl font-bold">{periodSummary.totalRevenue.toLocaleString('fr-FR')} {currencyCode}</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="font-medium">Dépenses Totales</p>
              <p className="text-2xl font-bold">{periodSummary.totalExpenses.toLocaleString('fr-FR')} {currencyCode}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="font-medium">Bénéfice Net</p>
              <p className="text-2xl font-bold">{periodSummary.netProfit.toLocaleString('fr-FR')} {currencyCode}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Période Courante</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Calendar className="h-6 w-6 text-muted-foreground" />
            <p className="text-lg font-semibold">{kpis.currentPeriod}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};