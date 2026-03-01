"use client";

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { CustomerInvoiceDto } from '@/src/lib2/models/CustomerInvoiceDto';
import { SupplierInvoiceDto } from '@/src/lib2/models/SupplierInvoiceDto';
import { EcritureComptableDto } from '@/src/lib2/models/EcritureComptableDto';
import { DetailEcritureDto } from '@/src/lib2/models/DetailEcritureDto';
import { InvoiceAccountingService } from '@/src/lib2/services/InvoiceAccountingService';
import { AccountingInvoiceUploadService } from '@/src/lib2/services/AccountingInvoiceUploadService';
import { SemiAutoEntryListView } from '@/components/accounting/semi-auto-entry-list-view';
import { SemiAutoEntryPreview } from '@/components/accounting/semi-auto-entry-preview';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { RefreshCw, FileText, UploadCloud, FileUp, Zap, Settings2 } from 'lucide-react';

type InvoiceType = 'SALE' | 'PURCHASE';
type DocumentType = 'FACTURE_CLIENT' | 'FACTURE_FOURNISSEUR' | 'MOUVEMENT_STOCK' | 'MOUVEMENT_CAISSE' | 'OPERATION_BANCAIRE' | 'AUTRE';
type ProcessMode = 'SEMI_AUTO' | 'AUTO';

export default function SemiAutoEntryPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Chargement...</div>}>
      <SemiAutoEntryContent />
    </Suspense>
  );
}

function SemiAutoEntryContent() {
  const searchParams = useSearchParams();
  const fromDraftId = searchParams.get('from_draft');

  // Input Hub States
  const [docType, setDocType] = useState<DocumentType>('FACTURE_CLIENT');
  const [processMode, setProcessMode] = useState<ProcessMode>('SEMI_AUTO');
  const [file, setFile] = useState<File | null>(null);

  // List States
  const [invoiceType, setInvoiceType] = useState<InvoiceType>('SALE');
  const [invoices, setInvoices] = useState<(CustomerInvoiceDto | SupplierInvoiceDto)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<CustomerInvoiceDto | SupplierInvoiceDto | null>(null);
  const [generatedEntry, setGeneratedEntry] = useState<EcritureComptableDto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, [invoiceType]);

  useEffect(() => {
    if (fromDraftId && invoices.length > 0) {
      const draft = invoices.find(inv => inv.idFacture === fromDraftId);
      if (draft) {
        generateEntry(draft);
      }
    }
  }, [fromDraftId, invoices]);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const type = invoiceType === 'SALE' ? 'FACTURE_CLIENT' : 'FACTURE_FOURNISSEUR';
      const response = await DraftAccountingService.getAllBrouillards(
        'EN_ATTENTE_VALIDATION',
        type,
        0,
        100
      );

      const convertedInvoices = (response || []).map((brouillard): CustomerInvoiceDto | SupplierInvoiceDto => {
        const baseInvoice = {
          idFacture: brouillard.id || '',
          numeroFacture: brouillard.numeroPiece || '',
          dateFacturation: brouillard.datePiece || '',
          montantHT: (brouillard.montantTotal || 0) / 1.1925,
          montantTVA: (brouillard.montantTotal || 0) * 0.1925 / 1.1925,
          montantTTC: brouillard.montantTotal || 0,
          modeReglement: 'Non spécifié',
        };

        if (invoiceType === 'SALE') {
          return { ...baseInvoice, nomClient: brouillard.libelle || 'Client inconnu' } as CustomerInvoiceDto;
        } else {
          return { ...baseInvoice, nomFournisseru: brouillard.libelle || 'Fournisseur inconnu' } as SupplierInvoiceDto;
        }
      });
      setInvoices(convertedInvoices);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      toast.error('Erreur lors du chargement des brouillards');
      setInvoices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateEntry = (invoice: CustomerInvoiceDto | SupplierInvoiceDto) => {
    const details: DetailEcritureDto[] = [];
    const montantHT = invoice.montantHT || 0;
    const montantTVA = invoice.montantTVA || 0;
    const montantTTC = invoice.montantTTC || 0;

    if (invoiceType === 'SALE') {
      details.push({
        compteComptableId: '411000',
        libelle: `Facture ${invoice.numeroFacture} - ${(invoice as CustomerInvoiceDto).nomClient}`,
        sens: 'DEBIT',
        montantDebit: montantTTC,
        montantCredit: 0,
        ecritureComptableId: '',
      });
      details.push({
        compteComptableId: '701000',
        libelle: 'Vente de marchandises',
        sens: 'CREDIT',
        montantDebit: 0,
        montantCredit: montantHT,
        ecritureComptableId: '',
      });
      details.push({
        compteComptableId: '445710',
        libelle: 'TVA collectée',
        sens: 'CREDIT',
        montantDebit: 0,
        montantCredit: montantTVA,
        ecritureComptableId: '',
      });
    } else {
      details.push({
        compteComptableId: '601000',
        libelle: 'Achat de marchandises',
        sens: 'DEBIT',
        montantDebit: montantHT,
        montantCredit: 0,
        ecritureComptableId: '',
      });
      details.push({
        compteComptableId: '445660',
        libelle: 'TVA déductible',
        sens: 'DEBIT',
        montantDebit: montantTVA,
        montantCredit: 0,
        ecritureComptableId: '',
      });
      details.push({
        compteComptableId: '401000',
        libelle: `Facture ${invoice.numeroFacture} - ${(invoice as SupplierInvoiceDto).nomFournisseru}`,
        sens: 'CREDIT',
        montantDebit: 0,
        montantCredit: montantTTC,
        ecritureComptableId: '',
      });
    }

    const entry: EcritureComptableDto = {
      libelle: `Saisie ${processMode === 'AUTO' ? 'automatique' : 'semi-automatique'} - Facture ${invoice.numeroFacture}`,
      dateEcriture: invoice.dateFacturation,
      periodeComptableId: '',
      journalComptableId: '',
      montantTotalDebit: montantTTC,
      montantTotalCredit: montantTTC,
      validee: processMode === 'AUTO', // Automatically validated if AUTO mode
      referenceExterne: invoice.numeroFacture,
      detailsEcriture: details,
    };

    setGeneratedEntry(entry);
    setSelectedInvoice(invoice);
  };

  const handleValidateEntry = async () => {
    if (!generatedEntry || !selectedInvoice) return;
    setIsSubmitting(true);
    try {
      if (processMode === 'AUTO') {
        // Validation et enregistrement direct
        if (invoiceType === 'SALE') {
          await InvoiceAccountingService.accountCustomerInvoice(selectedInvoice as CustomerInvoiceDto);
        } else {
          await InvoiceAccountingService.accountSupplierInvoice(selectedInvoice as SupplierInvoiceDto);
        }
        toast.success('Écriture comptabilisée et validée avec succès');
      } else {
        // Sauvegarde en tant que brouillard (SEMI_AUTO)
        const brouillardType = invoiceType === 'SALE' ? 'FACTURE_CLIENT' : 'FACTURE_FOURNISSEUR';
        await DraftAccountingService.createBrouillard({
          type: brouillardType as 'FACTURE_CLIENT' | 'FACTURE_FOURNISSEUR',
          statut: 'EN_ATTENTE_VALIDATION',
          numeroPiece: selectedInvoice.numeroFacture,
          datePiece: selectedInvoice.dateFacturation,
          libelle: generatedEntry.libelle,
          montantTotal: generatedEntry.montantTotalDebit,
          devise: 'XAF', // Adapt if currency is elsewhere
          dataJson: generatedEntry as any // Contains the details and breakdown
        });
        toast.success('Brouillard d\'écriture généré avec succès. En attente de validation.');
      }

      setSelectedInvoice(null);
      setGeneratedEntry(null);
      await fetchInvoices();
    } catch (error) {
      console.error('Failed to save entry:', error);
      toast.error('Erreur lors de l\'enregistrement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProcessFile = async () => {
    if (!file) {
      toast.error("Veuillez sélectionner un fichier à uploader");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload file to backend for OCR/analysis
      const uploadResponse = await AccountingInvoiceUploadService.upload({ file });

      if (!uploadResponse.success || !uploadResponse.data) {
        throw new Error(uploadResponse.message || "Erreur lors de l'analyse du document");
      }

      const facture = uploadResponse.data;
      const tva = (facture.montant_ht || 0) * (facture.taux_tva || 0);
      const ttc = (facture.montant_ht || 0) + tva;

      // 2. Map AI response to our DetailEcritureDto structure
      const details: DetailEcritureDto[] = [];
      const isPurchase = facture.is_achat || docType === 'FACTURE_FOURNISSEUR';

      if (!isPurchase) {
        // VENTE
        details.push({
          compteComptableId: facture.get_debit_account || '411000',
          libelle: facture.libelle || `Facture ${facture.id || ''}`,
          sens: 'DEBIT',
          montantDebit: ttc,
          montantCredit: 0,
          ecritureComptableId: '',
        });
        details.push({
          compteComptableId: facture.get_credit_account || '701000',
          libelle: 'Vente',
          sens: 'CREDIT',
          montantDebit: 0,
          montantCredit: facture.montant_ht || 0,
          ecritureComptableId: '',
        });
        if (tva > 0) {
          details.push({
            compteComptableId: '445710',
            libelle: 'TVA collectée',
            sens: 'CREDIT',
            montantDebit: 0,
            montantCredit: tva,
            ecritureComptableId: '',
          });
        }
      } else {
        // ACHAT
        details.push({
          compteComptableId: facture.get_debit_account || '601000',
          libelle: 'Achat',
          sens: 'DEBIT',
          montantDebit: facture.montant_ht || 0,
          montantCredit: 0,
          ecritureComptableId: '',
        });
        if (tva > 0) {
          details.push({
            compteComptableId: '445660',
            libelle: 'TVA déductible',
            sens: 'DEBIT',
            montantDebit: tva,
            montantCredit: 0,
            ecritureComptableId: '',
          });
        }
        details.push({
          compteComptableId: facture.get_credit_account || '401000',
          libelle: facture.libelle || `Facture ${facture.id || ''}`,
          sens: 'CREDIT',
          montantDebit: 0,
          montantCredit: ttc,
          ecritureComptableId: '',
        });
      }

      const generated: EcritureComptableDto = {
        libelle: facture.libelle || `Généré depuis ${file.name}`,
        dateEcriture: facture.date || new Date().toISOString().split('T')[0],
        journalComptableId: facture.journal_comptable_id || '',
        periodeComptableId: facture.periode_comptable_id || '',
        referenceExterne: facture.id || '',
        montantTotalDebit: ttc,
        montantTotalCredit: ttc,
        validee: processMode === 'AUTO',
        detailsEcriture: details,
      };

      // 3. Create a pseudo-invoice object to pass to Preview component
      const pseudoInvoice: CustomerInvoiceDto | SupplierInvoiceDto = isPurchase ? {
        idFacture: facture.id || 'new',
        numeroFacture: facture.id || 'N/A',
        dateFacturation: facture.date || new Date().toISOString().split('T')[0],
        montantHT: facture.montant_ht,
        montantTVA: tva,
        montantTTC: ttc,
        nomFournisseru: facture.libelle || 'Extraite du document',
      } as SupplierInvoiceDto : {
        idFacture: facture.id || 'new',
        numeroFacture: facture.id || 'N/A',
        dateFacturation: facture.date || new Date().toISOString().split('T')[0],
        montantHT: facture.montant_ht,
        montantTVA: tva,
        montantTTC: ttc,
        nomClient: facture.libelle || 'Extraite du document',
      } as CustomerInvoiceDto;

      setGeneratedEntry(generated);
      setSelectedInvoice(pseudoInvoice);
      toast.success("Document analysé avec succès. Vérifiez l'écriture générée.");
      setFile(null);

    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Erreur lors du traitement du fichier");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50/50">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ── HEADER ── */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Saisie et Comptabilisation</h1>
          <p className="text-gray-500 mt-2">
            Importez des documents ou traitez les brouillards existants (mode semi-automatique ou automatique).
          </p>
        </div>

        {/* ── INPUT HUB ── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600"></div>
          <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <UploadCloud className="h-5 w-5 text-blue-600" />
            Nouveau Document à Comptabiliser
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Colonne gauche: Config */}
            <div className="md:col-span-5 space-y-6">

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700">Type de Document</Label>
                <Select value={docType} onValueChange={(val: DocumentType) => setDocType(val)}>
                  <SelectTrigger className="w-full bg-gray-50/50">
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FACTURE_CLIENT">Facture Client</SelectItem>
                    <SelectItem value="FACTURE_FOURNISSEUR">Facture Fournisseur</SelectItem>
                    <SelectItem value="MOUVEMENT_STOCK">Mouvement de Stock</SelectItem>
                    <SelectItem value="MOUVEMENT_CAISSE">Mouvement de Caisse</SelectItem>
                    <SelectItem value="OPERATION_BANCAIRE">Opération Bancaire</SelectItem>
                    <SelectItem value="AUTRE">Autre Document</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700">Mode de Traitement</Label>
                <RadioGroup
                  value={processMode}
                  onValueChange={(val: ProcessMode) => setProcessMode(val)}
                  className="grid grid-cols-2 gap-3"
                >
                  <div>
                    <RadioGroupItem value="SEMI_AUTO" id="m-semi" className="peer sr-only" />
                    <Label
                      htmlFor="m-semi"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-gray-50 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50/50 cursor-pointer"
                    >
                      <Settings2 className="mb-2 h-5 w-5 text-gray-600 peer-data-[state=checked]:text-blue-600" />
                      <span className="text-sm font-medium">Semi-Auto</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="AUTO" id="m-auto" className="peer sr-only" />
                    <Label
                      htmlFor="m-auto"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-gray-50 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50/50 cursor-pointer"
                    >
                      <Zap className="mb-2 h-5 w-5 text-amber-500" />
                      <span className="text-sm font-medium">Automatique</span>
                    </Label>
                  </div>
                </RadioGroup>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  {processMode === 'SEMI_AUTO'
                    ? "Génère un brouillard comptable que vous devrez valider manuellement."
                    : "Tente de générer et de valider l'écriture comptable instantanément sans intervention."}
                </p>
              </div>

            </div>

            {/* Colonne droite: Upload */}
            <div className="md:col-span-7 flex flex-col justify-end">
              <div
                className={`border-2 border-dashed rounded-xl p-8 transition-colors flex flex-col items-center justify-center text-center h-full min-h-[220px] ${file ? 'border-blue-300 bg-blue-50/30' : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300'}`}
              >
                <input
                  type="file"
                  id="doc-upload"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />

                {file ? (
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center gap-3">
                      <FileUp className="h-8 w-8 text-blue-500" />
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-800 line-clamp-1">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" size="sm" onClick={() => setFile(null)}>Annuler</Button>
                      <Button size="sm" onClick={handleProcessFile} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                        {isSubmitting ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : "Traiter ce document"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <label htmlFor="doc-upload" className="cursor-pointer space-y-4 flex flex-col items-center">
                    <div className="h-14 w-14 bg-white rounded-full shadow-sm flex items-center justify-center border border-gray-100">
                      <UploadCloud className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <span className="text-blue-600 font-medium hover:underline">Cliquez pour importer</span> ou glissez-déposez un fichier
                      <p className="text-xs text-gray-500 mt-2">PDF, JPG, PNG, XML supportés</p>
                    </div>
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── EXISTING DRAFTS LIST ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-600" />
              Documents en Attente
            </h2>
            <Button variant="outline" size="sm" onClick={fetchInvoices} disabled={isLoading} className="bg-white">
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>

          {selectedInvoice && generatedEntry ? (
            <div className="bg-white rounded-xl shadow-sm border p-6 animate-in slide-in-from-bottom-4 duration-300">
              <Button variant="ghost" onClick={() => { setSelectedInvoice(null); setGeneratedEntry(null); }} className="mb-4 text-gray-500 hover:text-gray-900">
                ← Retour à la liste
              </Button>
              <SemiAutoEntryPreview
                invoice={selectedInvoice}
                generatedEntry={generatedEntry}
                type={invoiceType}
                onValidate={handleValidateEntry}
                onCancel={() => { setSelectedInvoice(null); setGeneratedEntry(null); }}
                isSubmitting={isSubmitting}
              />
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <Tabs value={invoiceType} onValueChange={(value) => setInvoiceType(value as InvoiceType)} className="w-full">
                <TabsList className="w-full justify-start rounded-none border-b bg-gray-50/50 p-0 h-14">
                  <TabsTrigger
                    value="SALE"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-white data-[state=active]:shadow-none rounded-none h-full px-6"
                  >
                    Factures Clients
                  </TabsTrigger>
                  <TabsTrigger
                    value="PURCHASE"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-white data-[state=active]:shadow-none rounded-none h-full px-6"
                  >
                    Factures Fournisseurs
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="SALE" className="p-6 m-0">
                  <SemiAutoEntryListView
                    invoices={invoices}
                    type="SALE"
                    isLoading={isLoading}
                    onInvoiceDoubleClick={generateEntry}
                  />
                </TabsContent>
                <TabsContent value="PURCHASE" className="p-6 m-0">
                  <SemiAutoEntryListView
                    invoices={invoices}
                    type="PURCHASE"
                    isLoading={isLoading}
                    onInvoiceDoubleClick={generateEntry}
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}