"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { EcritureComptableDto } from '@/src/lib2/models/EcritureComptableDto';
import { AccountingEntriesService } from '@/src/lib2/services/AccountingEntriesService';
import { AccountingJournalManagementService } from '@/src/lib2/services/AccountingJournalManagementService';
import { AccountingPlanComptableService } from '@/src/lib2/services/AccountingPlanComptableService';
import { JournalComptableDto } from '@/src/lib2/models/JournalComptableDto';
import { EcritureComptableReadView } from '@/components/accounting/ecriture-comptable-read-view';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Check, Eye, RefreshCw, Search, XCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { OpenAPI } from '@/src/lib2/core/OpenAPI';
import { request as __request } from '@/src/lib2/core/request';

export default function AccountingValidationPage() {
  const [ecritures, setEcritures] = useState<EcritureComptableDto[]>([]);
  const [journals, setJournals] = useState<JournalComptableDto[]>([]);
  const [accounts, setAccounts] = useState<{ id: string; noCompte: string }[]>([]);
  const [selectedEcritureId, setSelectedEcritureId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("list");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Reject dialog state
  const [rejectDialog, setRejectDialog] = useState<{ open: boolean; entry: EcritureComptableDto | null }>({
    open: false,
    entry: null,
  });
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [entriesRes, journalsRes, accountsRes] = await Promise.all([
        AccountingEntriesService.getNonValidated(),
        AccountingJournalManagementService.getAllJournals(),
        AccountingPlanComptableService.getAllPlanComptables()
      ]);

      const fetchedJournals = Array.isArray(journalsRes.data) ? journalsRes.data : [];
      setJournals(fetchedJournals);

      const fetchedAccounts = Array.isArray(accountsRes.data) ? accountsRes.data : [];
      setAccounts(fetchedAccounts.map(a => ({ id: a.id!, noCompte: a.noCompte })));

      const fetchedEntries = Array.isArray(entriesRes.data) ? entriesRes.data : [];
      const enrichedEntries = fetchedEntries.map(e => ({
        ...e,
        journalComptableLibelle: fetchedJournals.find(j => j.id === e.journalComptableId)?.libelle || e.journalComptableId
      }));

      setEcritures(enrichedEntries);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Erreur lors du chargement des écritures");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleValidate = async (id: string) => {
    try {
      await AccountingEntriesService.validateEcriture(id);
      toast.success("Écriture validée avec succès");

      setEcritures((prev) => prev.filter((e) => e.id !== id));

      if (selectedEcritureId === id) {
        setSelectedEcritureId(null);
        setActiveTab("list");
      }
    } catch (error) {
      console.error("Failed to validate ecriture:", error);
      toast.error("Erreur lors de la validation");
    }
  };

  const openRejectDialog = (entry: EcritureComptableDto) => {
    setRejectDialog({ open: true, entry });
    setRejectionReason('');
  };

  const closeRejectDialog = () => {
    setRejectDialog({ open: false, entry: null });
    setRejectionReason('');
  };

  const handleReject = async () => {
    if (!rejectDialog.entry) return;
    if (!rejectionReason.trim()) {
      toast.error('Veuillez saisir un motif de rejet');
      return;
    }

    setIsRejecting(true);
    const entry = rejectDialog.entry;
    try {
      // Update the entry notes with the rejection reason
      const updatedEntry = {
        ...entry,
        notes: `${entry.notes || ''}\n[REJETÉ]: ${rejectionReason}`.trim(),
      };

      await __request(OpenAPI, {
        method: 'PUT',
        url: `/api/accounting/ecritures/${entry.id}`,
        body: updatedEntry,
        mediaType: 'application/json',
      });

      // Deactivate the entry
      await AccountingEntriesService.deactivate(entry.id!);

      toast.success('Écriture rejetée et désactivée');
      setEcritures((prev) => prev.filter((e) => e.id !== entry.id));

      if (selectedEcritureId === entry.id) {
        setSelectedEcritureId(null);
        setActiveTab("list");
      }

      closeRejectDialog();
    } catch (error) {
      console.error("Failed to reject ecriture:", error);
      toast.error("Erreur lors du rejet de l'écriture");
    } finally {
      setIsRejecting(false);
    }
  };

  const filteredEcritures = ecritures.filter((e) =>
    e.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.referenceExterne?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (e.journalComptableLibelle?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleOpenDetail = async (id: string) => {
    try {
      const response = await AccountingEntriesService.getById(id);
      if (response.success && response.data) {
        const entry = response.data;
        if (!entry.journalComptableLibelle) {
          const journal = journals.find(j => j.id === entry.journalComptableId);
          if (journal) entry.journalComptableLibelle = journal.libelle;
        }
        if (entry.detailsEcriture) {
          entry.detailsEcriture = entry.detailsEcriture.map(d => {
            const acc = accounts.find(a => a.id === d.compteComptableId);
            return {
              ...d,
              compteComptableNo: acc?.noCompte || d.compteComptableId
            } as any;
          });
        }

        setEcritures(prev => prev.map(e => e.id === id ? entry : e));
        setSelectedEcritureId(id);
        setActiveTab("details");
      }
    } catch (e) {
      console.error("Error loading details", e);
      toast.error("Impossible de charger les détails");
    }
  };

  const selectedEcriture = selectedEcritureId
    ? ecritures.find((e) => e.id === selectedEcritureId) || null
    : null;

  return (
    <div className="min-h-screen flex flex-col p-4 bg-gray-100">
      <div className="w-full max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-1">Validation des Écritures</h2>
          <p className="text-sm text-gray-500">Validez ou rejetez les écritures comptables en attente.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white rounded-t-lg shadow">
            <TabsTrigger value="list" className="data-[state=active]:bg-blue-100">Liste des Écritures</TabsTrigger>
            <TabsTrigger value="details" className="data-[state=active]:bg-blue-100" disabled={!selectedEcritureId}>
              Détails {selectedEcriture && ` - ${selectedEcriture.libelle}`}
            </TabsTrigger>
          </TabsList>

          {/* ── LIST TAB ── */}
          <TabsContent value="list" className="bg-white rounded-b-lg shadow p-6 mt-0">
            <div className="flex items-center mb-6">
              <div className="relative w-full md:w-96">
                <Input
                  placeholder="Rechercher par libellé, référence, journal..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Libellé</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Journal</TableHead>
                    <TableHead className="text-right">Débit</TableHead>
                    <TableHead className="text-right">Crédit</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">Chargement des écritures...</TableCell>
                    </TableRow>
                  ) : filteredEcritures.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">Aucune écriture à valider.</TableCell>
                    </TableRow>
                  ) : (
                    filteredEcritures.map((ecriture) => (
                      <TableRow
                        key={ecriture.id}
                        className="group hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleOpenDetail(ecriture.id!)}
                      >
                        <TableCell className="font-medium">{ecriture.libelle}</TableCell>
                        <TableCell>{new Date(ecriture.dateEcriture).toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell>{ecriture.journalComptableLibelle}</TableCell>
                        <TableCell className="text-right font-mono text-emerald-600">
                          {(ecriture.montantTotalDebit || (ecriture.detailsEcriture?.reduce((sum, d) => sum + (Number(d.montantDebit) || 0), 0) || 0)).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right font-mono text-emerald-600">
                          {(ecriture.montantTotalCredit || (ecriture.detailsEcriture?.reduce((sum, d) => sum + (Number(d.montantCredit) || 0), 0) || 0)).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDetail(ecriture.id!)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Eye className="h-4 w-4 mr-1" /> Détails
                            </Button>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    onClick={() => handleValidate(ecriture.id!)}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Valider</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openRejectDialog(ecriture)}
                              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                              <XCircle className="h-4 w-4 mr-1" /> Rejeter
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* ── DETAILS TAB (read-only) ── */}
          <TabsContent value="details" className="bg-white rounded-b-lg shadow p-6 mt-0">
            {selectedEcriture ? (
              <div className="space-y-6">
                {/* Action buttons */}
                <div className="flex justify-end gap-3 border-b pb-4">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => openRejectDialog(selectedEcriture)}
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 shadow-sm"
                  >
                    <XCircle className="h-5 w-5 mr-2" />
                    Rejeter cette écriture
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => handleValidate(selectedEcriture.id!)}
                    className="bg-green-600 hover:bg-green-700 text-white shadow-md transition-all hover:scale-105"
                  >
                    <Check className="h-5 w-5 mr-2" />
                    Valider cette écriture
                  </Button>
                </div>

                {/* Read-only detail view */}
                <EcritureComptableReadView ecriture={selectedEcriture} />
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">Sélectionnez une écriture pour voir les détails.</div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* ── REJECT DIALOG ── */}
      <Dialog open={rejectDialog.open} onOpenChange={closeRejectDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              Rejeter l'écriture comptable
            </DialogTitle>
            <DialogDescription>
              {rejectDialog.entry && (
                <span className="font-medium text-gray-700">« {rejectDialog.entry.libelle} »</span>
              )}
              <br />
              Veuillez indiquer le motif du rejet. L'écriture sera désactivée et ne pourra plus être validée.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <Textarea
              placeholder="Motif du rejet (obligatoire)..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              className="resize-none border-red-200 focus:border-red-400 focus:ring-red-300"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={closeRejectDialog} disabled={isRejecting}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isRejecting || !rejectionReason.trim()}
            >
              {isRejecting ? (
                <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Rejet en cours...</>
              ) : (
                <><XCircle className="h-4 w-4 mr-2" /> Confirmer le rejet</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}