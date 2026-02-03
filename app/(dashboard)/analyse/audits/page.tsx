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
import { Download, Search, RefreshCw, Eye } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getPeriodeComptables, getAudits } from '@/lib/api';

interface SystemAudit {
  id: string;
  user?: string;
  action?: string;
  date: string;
  description: string;
  details?: string;
  adresseIp?: string;
  donneesAvant?: string;
  donneesApres?: string;
}

export default function AuditJournalPage() {
  const [periodes, setPeriodes] = useState<any[]>([]);
  const [selectedPeriodeId, setSelectedPeriodeId] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<SystemAudit[]>([]);
  const [isLoadingPeriods, setIsLoadingPeriods] = useState(true);
  const [isFetchingAudits, setIsFetchingAudits] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAudit, setSelectedAudit] = useState<SystemAudit | null>(null);

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

  const fetchAuditsData = useCallback(async () => {
    if (!selectedPeriodeId) return;
    setIsFetchingAudits(true);
    try {
      const response = await getAudits();
      // Adjust response to match our display needs, adding missing fields if necessary
      const formattedAudits = response.audits.map(a => ({
        ...a,
        user: 'Admin',
        action: 'UPDATE',
        adresseIp: '127.0.0.1',
        details: a.description
      }));
      setAuditLogs(formattedAudits as SystemAudit[]);
    } catch (error) {
      console.error('Error fetching audits:', error);
      toast.error("Échec de la récupération des journaux d'audit");
    } finally {
      setIsFetchingAudits(false);
    }
  }, [selectedPeriodeId]);

  useEffect(() => {
    if (selectedPeriodeId) {
      fetchAuditsData();
    }
  }, [selectedPeriodeId, fetchAuditsData]);

  const handleGeneratePDF = () => {
    toast.info("L'export PDF sera disponible prochainement");
  };

  const handleGenerateXLSX = () => {
    toast.info("L'export XLSX sera disponible prochainement");
  };

  const filteredAudits = auditLogs.filter(log =>
    log.user?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoadingPeriods) return <div className="flex items-center justify-center min-h-[400px]">Chargement des données...</div>;

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Journal d&#39;Audit</h1>
            {isFetchingAudits && <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleGeneratePDF} disabled={isFetchingAudits || !selectedPeriodeId}>
              <Download className="h-4 w-4 mr-2" /> PDF
            </Button>
            <Button variant="outline" onClick={handleGenerateXLSX} disabled={isFetchingAudits || !selectedPeriodeId}>
              <Download className="h-4 w-4 mr-2" /> XLSX
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            <Select value={selectedPeriodeId || ''} onValueChange={setSelectedPeriodeId} disabled={isFetchingAudits}>
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
            <div className="relative w-96">
              <Input
                placeholder="Rechercher par utilisateur, action ou détails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <Button variant="ghost" size="icon" onClick={fetchAuditsData} title="Rafraîchir les audits">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          <Card>
            <CardHeader className="bg-white border-b py-4">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Historique des actions (Données de démonstration)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="px-4 py-3 font-bold text-gray-700 w-40">Date & Heure</th>
                      <th className="px-4 py-3 font-bold text-gray-700 w-32">Utilisateur</th>
                      <th className="px-4 py-3 font-bold text-gray-700 w-32">Action</th>
                      <th className="px-4 py-3 font-bold text-gray-700">Détails de l'opération</th>
                      <th className="px-4 py-3 font-bold text-gray-700 w-32">Adresse IP</th>
                      <th className="px-4 py-3 font-bold text-gray-700 w-20 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAudits.length > 0 ? filteredAudits.map((log, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-gray-500">
                          {log.date ? new Date(log.date).toLocaleString('fr-FR') : '-'}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 uppercase tracking-tighter">
                            {log.user}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase tracking-tighter ${log.action === 'CREATE' || log.action === 'AJOUT' ? 'bg-green-100 text-green-800' :
                            log.action === 'UPDATE' || log.action === 'MODIFICATION' ? 'bg-amber-100 text-amber-800' :
                              log.action === 'DELETE' || log.action === 'SUPPRESSION' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600 max-w-md truncate" title={log.description}>
                          {log.description}
                        </td>
                        <td className="px-4 py-3 font-mono text-gray-400">
                          {log.adresseIp || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => setSelectedAudit(log)}>
                                <Eye className="h-4 w-4 text-gray-400 hover:text-blue-500" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Détails de l'Audit</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 text-sm">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-xs text-gray-400 uppercase">Utilisateur</p>
                                    <p className="font-semibold">{selectedAudit?.user}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-400 uppercase">Date</p>
                                    <p className="font-semibold">{selectedAudit?.date ? new Date(selectedAudit.date).toLocaleString() : '-'}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-400 uppercase">Action</p>
                                    <p className="font-semibold">{selectedAudit?.action}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-400 uppercase">IP</p>
                                    <p className="font-semibold">{selectedAudit?.adresseIp}</p>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-400 uppercase">Détails</p>
                                  <p className="mt-1 p-2 bg-gray-50 rounded border">{selectedAudit?.description}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-xs text-gray-400 uppercase mb-1">Données Avant</p>
                                    <pre className="p-2 bg-red-50 text-[10px] rounded border overflow-auto max-h-40 whitespace-pre-wrap">
                                      {selectedAudit?.donneesAvant ? JSON.stringify(JSON.parse(selectedAudit.donneesAvant), null, 2) : 'Aucune donnée'}
                                    </pre>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-400 uppercase mb-1">Données Après</p>
                                    <pre className="p-2 bg-green-50 text-[10px] rounded border overflow-auto max-h-40 whitespace-pre-wrap">
                                      {selectedAudit?.donneesApres ? JSON.stringify(JSON.parse(selectedAudit.donneesApres), null, 2) : 'Aucune donnée'}
                                    </pre>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-20 text-center text-gray-400 italic">
                          {isFetchingAudits ? "Récupération des journaux d'audit..." : "Aucun journal d'audit trouvé pour cette période"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}