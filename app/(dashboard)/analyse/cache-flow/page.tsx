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
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Search, RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getPeriodeComptables } from '@/lib/api';

interface CashFlowData {
  code: string;
  description: string;
  amount: number;
  category: 'operationnel' | 'investissement' | 'financement';
}

const staticCashFlowData: CashFlowData[] = [
  // Activités opérationnelles
  { code: 'A1', description: 'Résultat net', amount: 620000, category: 'operationnel' },
  { code: 'A2', description: 'Ajustements non monétaires', amount: 150000, category: 'operationnel' },
  { code: 'A3', description: 'Variation du BFR', amount: -200000, category: 'operationnel' },
  // Activités d'investissement
  { code: 'B1', description: 'Achat d\'immobilisations', amount: -300000, category: 'investissement' },
  { code: 'B2', description: 'Vente d\'actifs', amount: 100000, category: 'investissement' },
  // Activités de financement
  { code: 'C1', description: 'Emprunts obtenus', amount: 400000, category: 'financement' },
  { code: 'C2', description: 'Remboursement d\'emprunts', amount: -150000, category: 'financement' },
  { code: 'C3', description: 'Dividendes versés', amount: -100000, category: 'financement' },
];

export default function CashFlowPage() {
  const [periodes, setPeriodes] = useState<any[]>([]);
  const [selectedPeriodeId, setSelectedPeriodeId] = useState<string | null>(null);
  const [isLoadingPeriods, setIsLoadingPeriods] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPeriodesData = useCallback(async () => {
    setIsLoadingPeriods(true);
    try {
      const data = await getPeriodeComptables();
      setPeriodes(data);
      if (data.length > 0 && !selectedPeriodeId) {
        setSelectedPeriodeId(data[0].id || null);
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

  const handleGeneratePDF = () => {
    toast.info("L'export PDF sera disponible prochainement pour ce rapport");
  };

  const handleGenerateXLSX = () => {
    toast.info("L'export XLSX sera disponible prochainement");
  };

  const operationnel = staticCashFlowData.filter(item => item.category === 'operationnel');
  const investissement = staticCashFlowData.filter(item => item.category === 'investissement');
  const financement = staticCashFlowData.filter(item => item.category === 'financement');

  const totalOperationnel = operationnel.reduce((sum, item) => sum + item.amount, 0);
  const totalInvestissement = investissement.reduce((sum, item) => sum + item.amount, 0);
  const totalFinancement = financement.reduce((sum, item) => sum + item.amount, 0);
  const totalFluxNet = totalOperationnel + totalInvestissement + totalFinancement;

  if (isLoadingPeriods) return <div className="flex items-center justify-center min-h-[400px]">Chargement des données...</div>;

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Flux de Trésorerie</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleGeneratePDF} disabled={!selectedPeriodeId}>
              <Download className="h-4 w-4 mr-2" /> PDF
            </Button>
            <Button variant="outline" onClick={handleGenerateXLSX} disabled={!selectedPeriodeId}>
              <Download className="h-4 w-4 mr-2" /> XLSX
            </Button>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 flex gap-3 text-blue-700 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>
            <strong>Note :</strong> La génération automatique des flux de trésorerie est en cours de développement. Les données affichées ci-dessous sont des exemples illustratifs (Mock) pour la période sélectionnée.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            <Select value={selectedPeriodeId || ''} onValueChange={setSelectedPeriodeId}>
              <SelectTrigger className="w-64">
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
            <div className="relative w-64">
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <Button variant="ghost" size="icon" onClick={fetchPeriodesData} title="Rafraîchir les périodes">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          <Card>
            <CardHeader className="bg-white border-b">
              <CardTitle className="flex justify-between items-center text-sm font-semibold uppercase tracking-wider text-gray-400">
                <span>Tableau des flux - État au {selectedPeriodeId ? new Date(periodes.find(p => p.id === selectedPeriodeId)?.dateFin || '').toLocaleDateString('fr-FR') : '...'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8 mt-6">
                {/* Activités opérationnelles */}
                <div>
                  <h2 className="text-lg font-semibold text-emerald-700 border-b pb-2 mb-4">Activités Opérationnelles</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="px-4 py-3 text-left font-medium text-gray-600">Code</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-600">Intitulé</th>
                          <th className="px-4 py-3 text-right font-medium text-gray-600">Montant</th>
                        </tr>
                      </thead>
                      <tbody>
                        {operationnel.map((item, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-mono text-gray-500">{item.code}</td>
                            <td className="px-4 py-3 font-medium text-gray-900">{item.description}</td>
                            <td className={`px-4 py-3 text-right font-bold ${item.amount >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                              {item.amount.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-emerald-50/50 font-bold border-t-2 border-emerald-100">
                          <td colSpan={2} className="px-4 py-3 text-right text-emerald-900 uppercase text-xs tracking-wider">Flux opérationnel net</td>
                          <td className="px-4 py-3 text-right text-emerald-700">{totalOperationnel.toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Activités d'investissement */}
                <div>
                  <h2 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-4">Activités d'Investissement</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="px-4 py-3 text-left font-medium text-gray-600">Code</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-600">Intitulé</th>
                          <th className="px-4 py-3 text-right font-medium text-gray-600">Montant</th>
                        </tr>
                      </thead>
                      <tbody>
                        {investissement.map((item, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-mono text-gray-500">{item.code}</td>
                            <td className="px-4 py-3 font-medium text-gray-900">{item.description}</td>
                            <td className={`px-4 py-3 text-right font-bold ${item.amount >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                              {item.amount.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-blue-50/50 font-bold border-t-2 border-blue-100">
                          <td colSpan={2} className="px-4 py-3 text-right text-blue-900 uppercase text-xs tracking-wider">Flux d'investissement net</td>
                          <td className="px-4 py-3 text-right text-blue-700">{totalInvestissement.toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Activités de financement */}
                <div>
                  <h2 className="text-lg font-semibold text-purple-700 border-b pb-2 mb-4">Activités de Financement</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="px-4 py-3 text-left font-medium text-gray-600">Code</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-600">Intitulé</th>
                          <th className="px-4 py-3 text-right font-medium text-gray-600">Montant</th>
                        </tr>
                      </thead>
                      <tbody>
                        {financement.map((item, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-mono text-gray-500">{item.code}</td>
                            <td className="px-4 py-3 font-medium text-gray-900">{item.description}</td>
                            <td className={`px-4 py-3 text-right font-bold ${item.amount >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                              {item.amount.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-purple-50/50 font-bold border-t-2 border-purple-100">
                          <td colSpan={2} className="px-4 py-3 text-right text-purple-900 uppercase text-xs tracking-wider">Flux de financement net</td>
                          <td className="px-4 py-3 text-right text-purple-700">{totalFinancement.toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Résumé */}
                <div className="pt-6 border-t flex flex-col items-end gap-1">
                  <div className="flex gap-8 text-sm">
                    <span className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">Variation nette de trésorerie</span>
                    <span className={`text-xl w-32 text-right font-black ${totalFluxNet >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                      {totalFluxNet.toLocaleString()} XAF
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}