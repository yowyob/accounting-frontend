"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BrouillardComptableDto } from '@/src/lib2/models/BrouillardComptableDto';
import { EcritureComptableDto } from '@/src/lib2/models/EcritureComptableDto';
import { DraftAccountingService } from '@/src/lib2/services/DraftAccountingService';
import { AccountingEntriesService } from '@/src/lib2/services/AccountingEntriesService';
import { OpenAPI } from '@/src/lib2/core/OpenAPI';
import { request as __request } from '@/src/lib2/core/request';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { RefreshCw, CheckCircle, XCircle, Trash2, Edit, ArrowRight } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useCompose } from '@/hooks/use-compose-store';
import { EcritureComptableDetailView } from '@/components/accounting/ecriture-comptable-detail-view';

export default function DraftAccountingPage() {
    const router = useRouter();
    const { onOpen, onClose: closeCompose } = useCompose();

    // State for Invoice Drafts (Brouillard de Factures)
    const [invoiceDrafts, setInvoiceDrafts] = useState<BrouillardComptableDto[]>([]);
    const [isInvoiceLoading, setIsInvoiceLoading] = useState(false);

    // State for Accounting Drafts (Brouillards Comptables / Écritures non validées)
    const [accountingDrafts, setAccountingDrafts] = useState<EcritureComptableDto[]>([]);
    const [isAccountingLoading, setIsAccountingLoading] = useState(false);

    // Filters & Selection
    const [activeTab, setActiveTab] = useState("factures");

    // Action Handling
    const [actionDialog, setActionDialog] = useState<{
        type: 'validate' | 'reject' | 'delete' | 'validate_entry' | 'reject_entry' | 'delete_entry' | null;
        item: any | null
    }>({ type: null, item: null });
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        if (activeTab === 'factures') {
            fetchInvoiceDrafts();
        } else {
            fetchAccountingDrafts();
        }
    }, [activeTab]);

    const fetchInvoiceDrafts = async () => {
        setIsInvoiceLoading(true);
        try {
            const response = await DraftAccountingService.getAllBrouillards(undefined, undefined, 0, 100);
            setInvoiceDrafts(Array.isArray(response) ? response : []);
        } catch (error) {
            console.error('Failed to fetch invoice drafts:', error);
            toast.error('Erreur lors du chargement des brouillards de factures');
            setInvoiceDrafts([]);
        } finally {
            setIsInvoiceLoading(false);
        }
    };

    const fetchAccountingDrafts = async () => {
        setIsAccountingLoading(true);
        try {
            const response = await AccountingEntriesService.getNonValidated();
            // Filter to show ONLY entries generated from Semi-Auto (based on libelle)
            const semiAutoDrafts = (response.data || []).filter(entry =>
                entry.libelle.startsWith('Saisie semi-automatique')
            );
            setAccountingDrafts(semiAutoDrafts);
        } catch (error) {
            console.error('Failed to fetch accounting drafts:', error);
            toast.error('Erreur lors du chargement des brouillards comptables');
            setAccountingDrafts([]);
        } finally {
            setIsAccountingLoading(false);
        }
    };

    // --- Actions for Invoice Drafts ---

    const handleProcessInvoice = (id: string) => {
        // Navigate to Semi-Auto Entry page to process this invoice
        // Assuming we can pass the ID or filter by it
        router.push(`/accounting/semi-auto-entries?from_draft=${id}`);
        toast.info("Redirection vers la saisie semi-automatique...");
    };

    const handleDeleteInvoiceDraft = async (draft: BrouillardComptableDto) => {
        try {
            await DraftAccountingService.deleteBrouillard(draft.id!);
            toast.success('Brouillard de facture supprimé');
            fetchInvoiceDrafts();
            setActionDialog({ type: null, item: null });
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    // --- Actions for Accounting Drafts (Ecritures) ---

    const handleValidateEntry = async (entry: EcritureComptableDto) => {
        try {
            await AccountingEntriesService.validateEcriture(entry.id!);
            toast.success('Écriture validée avec succès');
            fetchAccountingDrafts();
            setActionDialog({ type: null, item: null });
        } catch (error: any) {
            toast.error(`Erreur de validation: ${error.body?.message || error.message}`);
        }
    };

    const handleEditEntry = async (entry: EcritureComptableDto) => {
        try {
            const response = await AccountingEntriesService.getById(entry.id!);
            if (response.success && response.data) {
                onOpen({
                    title: "Modifier l'Écriture (Brouillard)",
                    content: (
                        <EcritureComptableDetailView
                            ecriture={response.data}
                            onSave={async (data) => {
                                await __request(OpenAPI, {
                                    method: 'PUT',
                                    url: `/api/accounting/ecritures/${data.id}`,
                                    body: data,
                                    mediaType: 'application/json',
                                });
                                closeCompose();
                                fetchAccountingDrafts();
                                toast.success("Écriture mise à jour");
                            }}
                            onDelete={() => {
                                setActionDialog({ type: 'delete_entry', item: entry });
                                closeCompose();
                            }}
                            onBack={closeCompose}
                        />
                    )
                });
            }
        } catch (e) {
            console.error(e);
            toast.error("Impossible de charger l'écriture");
        }
    };

    const handleDeleteEntry = async (entry: EcritureComptableDto) => {
        try {
            await AccountingEntriesService.delete(entry.id!);
            toast.success('Écriture supprimée du brouillard');
            fetchAccountingDrafts();
            setActionDialog({ type: null, item: null });
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    const handleRejectEntry = async (entry: EcritureComptableDto) => {
        if (!rejectionReason.trim()) {
            toast.error('Motif requis');
            return;
        }
        try {
            const updatedEntry = { ...entry, notes: `${entry.notes || ''} \n[REJETÉ]: ${rejectionReason}` };

            await __request(OpenAPI, {
                method: 'PUT',
                url: `/api/accounting/ecritures/${entry.id}`,
                body: updatedEntry,
                mediaType: 'application/json',
            });

            await AccountingEntriesService.deactivate(entry.id!);

            toast.success('Écriture rejetée et désactivée');
            fetchAccountingDrafts();
            setActionDialog({ type: null, item: null });
            setRejectionReason('');
        } catch (error) {
            toast.error('Erreur lors du rejet');
            console.error(error);
        }
    };

    // --- Helpers ---

    const formatCurrency = (amount?: number) => {
        return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount || 0);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    return (
        <div className="min-h-screen p-6 bg-gray-50">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Brouillards</h1>
                        <p className="text-gray-500 mt-1">
                            Gérez vos brouillards de factures et écritures en attente
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => activeTab === 'factures' ? fetchInvoiceDrafts() : fetchAccountingDrafts()}
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                    </Button>
                </div>

                <Tabs defaultValue="factures" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="factures">Brouillards de Factures (Saisie)</TabsTrigger>
                        <TabsTrigger value="ecritures">Brouillards Comptables (Validation)</TabsTrigger>
                    </TabsList>

                    {/* TAB 1: FACTURES */}
                    <TabsContent value="factures">
                        <Card>
                            <CardDescription className="px-6 pt-4 pb-2 text-gray-500">
                                Liste des factures non comptabilisées à envoyer en saisie semi-automatique.
                            </CardDescription>
                            <CardContent className="p-0">
                                {isInvoiceLoading ? (
                                    <div className="p-8 text-center"><RefreshCw className="h-6 w-6 animate-spin mx-auto" /> Chargement...</div>
                                ) : invoiceDrafts.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">Aucun brouillard de facture.</div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Numéro</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Libellé</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead className="text-right">Montant</TableHead>
                                                <TableHead>Statut</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {invoiceDrafts.map((draft) => (
                                                <TableRow key={draft.id}>
                                                    <TableCell className="font-medium">{draft.numeroPiece || '-'}</TableCell>
                                                    <TableCell>{formatDate(draft.datePiece)}</TableCell>
                                                    <TableCell>{draft.libelle}</TableCell>
                                                    <TableCell><Badge variant="outline">{draft.type}</Badge></TableCell>
                                                    <TableCell className="text-right font-mono">{formatCurrency(draft.montantTotal)} FCFA</TableCell>
                                                    <TableCell><Badge variant="secondary">{draft.statut}</Badge></TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button size="sm" variant="outline" onClick={() => handleProcessInvoice(draft.id!)} className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                                                <ArrowRight className="h-4 w-4 mr-1" /> Traiter
                                                            </Button>
                                                            <Button size="sm" variant="ghost" onClick={() => setActionDialog({ type: 'delete', item: draft })} className="text-red-500 hover:bg-red-50">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* TAB 2: ECRITURES */}
                    <TabsContent value="ecritures">
                        <Card>
                            <CardDescription className="px-6 pt-4 pb-2 text-gray-500">
                                Liste des écritures générées par la saisie semi-automatique en attente de validation.
                            </CardDescription>
                            <CardContent className="p-0">
                                {isAccountingLoading ? (
                                    <div className="p-8 text-center"><RefreshCw className="h-6 w-6 animate-spin mx-auto" /> Chargement...</div>
                                ) : accountingDrafts.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">Aucune écriture en attente de validation.</div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Libellé</TableHead>
                                                <TableHead>Journal</TableHead>
                                                <TableHead className="text-right">Débit</TableHead>
                                                <TableHead className="text-right">Crédit</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {accountingDrafts.map((entry) => (
                                                <TableRow key={entry.id}>
                                                    <TableCell>{formatDate(entry.dateEcriture)}</TableCell>
                                                    <TableCell className="font-medium">{entry.libelle}</TableCell>
                                                    <TableCell>{entry.journalComptableLibelle}</TableCell>
                                                    <TableCell className="text-right font-mono text-green-600">{formatCurrency(entry.montantTotalDebit)}</TableCell>
                                                    <TableCell className="text-right font-mono text-blue-600">{formatCurrency(entry.montantTotalCredit)}</TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-1">
                                                            <Button size="sm" variant="ghost" onClick={() => handleEditEntry(entry)} title="Modifier">
                                                                <Edit className="h-4 w-4 text-gray-600" />
                                                            </Button>
                                                            <Button size="sm" variant="ghost" onClick={() => setActionDialog({ type: 'validate_entry', item: entry })} title="Valider">
                                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                            </Button>
                                                            <Button size="sm" variant="ghost" onClick={() => setActionDialog({ type: 'reject_entry', item: entry })} title="Rejeter avec commentaire">
                                                                <XCircle className="h-4 w-4 text-orange-600" />
                                                            </Button>
                                                            <Button size="sm" variant="ghost" onClick={() => setActionDialog({ type: 'delete_entry', item: entry })} title="Supprimer">
                                                                <Trash2 className="h-4 w-4 text-red-600" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Dialogs */}
                <Dialog open={!!actionDialog.type} onOpenChange={() => setActionDialog({ type: null, item: null })}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {actionDialog.type === 'delete' && "Supprimer le brouillard de facture ?"}
                                {actionDialog.type === 'delete_entry' && "Supprimer l'écriture comptable ?"}
                                {actionDialog.type === 'validate_entry' && "Valider l'écriture comptable ?"}
                                {actionDialog.type === 'reject_entry' && "Rejeter l'écriture comptable ?"}
                            </DialogTitle>
                            <DialogDescription>
                                {actionDialog.type?.includes('delete') && "Cette action est irréversible. L'élément sera supprimé définitivement."}
                                {actionDialog.type === 'validate_entry' && "L'écriture sera comptabilisée officiellement. La facture associée sera marquée comme comptabilisée."}
                                {actionDialog.type === 'reject_entry' && "Veuillez indiquer le motif du rejet. L'écriture sera marquée comme rejetée et désactivée."}
                            </DialogDescription>
                        </DialogHeader>

                        {actionDialog.type === 'reject_entry' && (
                            <Textarea
                                placeholder="Motif du rejet..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="mt-2"
                            />
                        )}

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="outline" onClick={() => setActionDialog({ type: null, item: null })}>Annuler</Button>

                            {actionDialog.type === 'delete' && (
                                <Button variant="destructive" onClick={() => handleDeleteInvoiceDraft(actionDialog.item)}>Supprimer</Button>
                            )}
                            {actionDialog.type === 'delete_entry' && (
                                <Button variant="destructive" onClick={() => handleDeleteEntry(actionDialog.item)}>Supprimer</Button>
                            )}
                            {actionDialog.type === 'validate_entry' && (
                                <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleValidateEntry(actionDialog.item)}>Valider</Button>
                            )}
                            {actionDialog.type === 'reject_entry' && (
                                <Button variant="destructive" onClick={() => handleRejectEntry(actionDialog.item)}>Rejeter</Button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </div>
    );
}
