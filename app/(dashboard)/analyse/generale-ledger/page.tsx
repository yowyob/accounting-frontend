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
import { Download, Search, RefreshCw, ChevronDown, ChevronRight } from 'lucide-react';
import { AccountingFinancialReportsService } from '@/src/lib2/services/AccountingFinancialReportsService';
import { GrandLivreDto } from '@/src/lib2/models/GrandLivreDto';
import { toast } from 'sonner';
import { getPeriodeComptables } from '@/lib/api';

export default function GeneralLedgerPage() {
  const [periodes, setPeriodes] = useState<any[]>([]);
  const [selectedPeriodeId, setSelectedPeriodeId] = useState<string | null>(null);
  const [ledgerData, setLedgerData] = useState<GrandLivreDto[]>([]);
  const [isLoadingPeriods, setIsLoadingPeriods] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set());

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

  const generateReport = useCallback(async () => {
    if (!selectedPeriodeId) return;
    const periode = periodes.find(p => p.id === selectedPeriodeId);
    if (!periode) return;

    setIsGenerating(true);
    try {
      const response = await AccountingFinancialReportsService.generateGrandLivre(
        periode.dateDebut,
        periode.dateFin
      );

      if (response.success && Array.isArray(response.data)) {
        setLedgerData(response.data);
      } else {
        toast.error("Erreur lors de la génération du grand livre");
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error("Échec de la génération du grand livre");
    } finally {
      setIsGenerating(false);
    }
  }, [selectedPeriodeId, periodes]);

  useEffect(() => {
    if (selectedPeriodeId) {
      generateReport();
    }
  }, [selectedPeriodeId, generateReport]);

  const toggleAccount = (accNo: string) => {
    const newSet = new Set(expandedAccounts);
    if (newSet.has(accNo)) newSet.delete(accNo);
    else newSet.add(accNo);
    setExpandedAccounts(newSet);
  };

  const handleGeneratePDF = async () => {
    if (!selectedPeriodeId) return;
    const periode = periodes.find(p => p.id === selectedPeriodeId);
    if (!periode) return;

    try {
      toast.info("Génération du PDF...");
      const pdfUrl = await AccountingFinancialReportsService.exportGrandLivrePdf(periode.dateDebut, periode.dateFin);
      window.open(pdfUrl, '_blank');
    } catch (error) {
      console.error("PDF Export failed", error);
      toast.error("Erreur lors de l'export PDF");
    }
  };

  const handleGenerateXLSX = () => {
    toast.info("L'export XLSX sera disponible prochainement");
  };

  const filteredData = ledgerData.filter(acc =>
    acc.noCompte?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    acc.libelleCompte?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoadingPeriods) return <div className="flex items-center justify-center min-h-[400px]">Chargement des données...</div>;

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Grand Livre</h1>
            {isGenerating && <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleGeneratePDF} disabled={isGenerating || !selectedPeriodeId}>
              <Download className="h-4 w-4 mr-2" /> PDF
            </Button>
            <Button variant="outline" onClick={handleGenerateXLSX} disabled={isGenerating || !selectedPeriodeId}>
              <Download className="h-4 w-4 mr-2" /> XLSX
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            <Select value={selectedPeriodeId || ''} onValueChange={setSelectedPeriodeId} disabled={isGenerating}>
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
                placeholder="Filtrer par compte..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <Button variant="ghost" size="icon" onClick={() => { setExpandedAccounts(new Set()) }} title="Tout replier">
              Replier tout
            </Button>
            <Button variant="ghost" size="icon" onClick={fetchPeriodesData} title="Rafraîchir les périodes">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {filteredData.length > 0 ? filteredData.map((account) => {
              const isExpanded = expandedAccounts.has(account.noCompte || '');
              return (
                <Card key={account.noCompte} className="overflow-hidden border-l-4 border-l-blue-500">
                  <div
                    className="p-4 bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-between"
                    onClick={() => toggleAccount(account.noCompte || '')}
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
                      <div>
                        <span className="font-mono text-blue-600 font-bold mr-2">{account.noCompte}</span>
                        <span className="font-semibold text-gray-800">{account.libelleCompte}</span>
                      </div>
                    </div>
                    <div className="flex gap-6 text-sm">
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Report</p>
                        <p className="font-medium">{account.soldeOuverture?.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Mouvements</p>
                        <p className="font-medium text-emerald-600">D: {account.totalDebit?.toLocaleString()} / C: {account.totalCredit?.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Solde Final</p>
                        <p className={`font-bold ${account.soldeCloture! >= 0 ? 'text-blue-700' : 'text-red-600'}`}>
                          {account.soldeCloture?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t bg-gray-50/50 p-0 overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-100 border-b text-gray-600 font-bold">
                            <th className="px-4 py-2 w-24">Date</th>
                            <th className="px-4 py-2 w-32">Journal</th>
                            <th className="px-4 py-2 w-32">Référence</th>
                            <th className="px-4 py-2">Libellé de l'écriture</th>
                            <th className="px-4 py-2 w-32 text-right text-emerald-700">Débit</th>
                            <th className="px-4 py-2 w-32 text-right text-orange-700">Crédit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {account.lignes && account.lignes.length > 0 ? account.lignes.map((line, idx) => (
                            <tr key={idx} className="border-b bg-white hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-2 text-gray-500">{new Date(line.date || '').toLocaleDateString()}</td>
                              <td className="px-4 py-2 text-gray-600">{line.journal}</td>
                              <td className="px-4 py-2 font-mono text-gray-400">{line.reference}</td>
                              <td className="px-4 py-2 text-gray-800">{line.libelle}</td>
                              <td className="px-4 py-2 text-right text-emerald-600 font-medium">{line.debit?.toLocaleString()}</td>
                              <td className="px-4 py-2 text-right text-orange-600 font-medium">{line.credit?.toLocaleString()}</td>
                            </tr>
                          )) : (
                            <tr><td colSpan={6} className="px-4 py-4 text-center text-gray-400 italic">Aucun mouvement pour cette période</td></tr>
                          )}
                        </tbody>
                        <tfoot>
                          <tr className="bg-blue-50/30 font-bold">
                            <td colSpan={4} className="px-4 py-2 text-right uppercase text-[9px] tracking-widest text-gray-400">Totaux mouvements</td>
                            <td className="px-4 py-2 text-right text-emerald-700">{account.totalDebit?.toLocaleString()}</td>
                            <td className="px-4 py-2 text-right text-orange-700">{account.totalCredit?.toLocaleString()}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </Card>
              );
            }) : (
              <div className="text-center py-20 bg-white border rounded-lg text-gray-400 italic">
                {isGenerating ? "Génération du grand livre..." : "Aucun compte trouvé"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}