"use client";

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CustomerInvoiceDto } from '@/src/lib2/models/CustomerInvoiceDto';
import { SupplierInvoiceDto } from '@/src/lib2/models/SupplierInvoiceDto';
import { EcritureComptableDto } from '@/src/lib2/models/EcritureComptableDto';
import { DetailEcritureDto } from '@/src/lib2/models/DetailEcritureDto';
import { InvoiceAccountingService } from '@/src/lib2/services/InvoiceAccountingService';
import { DraftAccountingService } from '@/src/lib2/services/DraftAccountingService';
import { SemiAutoEntryListView } from '@/components/accounting/semi-auto-entry-list-view';
import { SemiAutoEntryPreview } from '@/components/accounting/semi-auto-entry-preview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { RefreshCw, FileText } from 'lucide-react';

type InvoiceType = 'SALE' | 'PURCHASE';

export default function SemiAutoEntryPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <SemiAutoEntryContent />
    </Suspense>
  );
}

function SemiAutoEntryContent() {
  const searchParams = useSearchParams();
  const fromDraftId = searchParams.get('from_draft');

  const [invoiceType, setInvoiceType] = useState<InvoiceType>('SALE');
  const [invoices, setInvoices] = useState<(CustomerInvoiceDto | SupplierInvoiceDto)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<CustomerInvoiceDto | SupplierInvoiceDto | null>(null);
  const [generatedEntry, setGeneratedEntry] = useState<EcritureComptableDto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch invoices when type changes or when redirecting from draft
  useEffect(() => {
    fetchInvoices();
  }, [invoiceType]);

  // Effect to handle from_draft param
  useEffect(() => {
    if (fromDraftId && invoices.length > 0) {
      const draft = invoices.find(inv => inv.idFacture === fromDraftId);
      if (draft) {
        generateEntry(draft);
      } else {
        // If not found in current list (maybe wrong type or not loaded), we might need to fetch it specifically or warn
        // For now, let's assume if it's not found, we might be looking at wrong type
      }
    }
  }, [fromDraftId, invoices]);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      // Fetch draft entries (brouillards) for the selected invoice type
      const type = invoiceType === 'SALE' ? 'FACTURE_CLIENT' : 'FACTURE_FOURNISSEUR';
      const response = await DraftAccountingService.getAllBrouillards(
        'EN_ATTENTE_VALIDATION',
        type,
        0,
        100
      );

      // Convert BrouillardComptableDto to invoice format
      const convertedInvoices = (response || []).map((brouillard): CustomerInvoiceDto | SupplierInvoiceDto => {
        const baseInvoice = {
          idFacture: brouillard.id || '',
          numeroFacture: brouillard.numeroPiece || '',
          dateFacturation: brouillard.datePiece || '',
          montantHT: (brouillard.montantTotal || 0) / 1.1925, // Approximate HT from TTC
          montantTVA: (brouillard.montantTotal || 0) * 0.1925 / 1.1925,
          montantTTC: brouillard.montantTotal || 0,
          modeReglement: 'Non spécifié',
        };

        if (invoiceType === 'SALE') {
          return {
            ...baseInvoice,
            nomClient: brouillard.libelle || 'Client inconnu',
          } as CustomerInvoiceDto;
        } else {
          return {
            ...baseInvoice,
            nomFournisseur: brouillard.libelle || 'Fournisseur inconnu',
          } as SupplierInvoiceDto;
        }
      });

      setInvoices(convertedInvoices);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      toast.error('Erreur lors du chargement des factures');
      setInvoices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateEntry = (invoice: CustomerInvoiceDto | SupplierInvoiceDto) => {
    // Generate accounting entry based on invoice type
    const details: DetailEcritureDto[] = [];
    const montantHT = invoice.montantHT || 0;
    const montantTVA = invoice.montantTVA || 0;
    const montantTTC = invoice.montantTTC || 0;

    if (invoiceType === 'SALE') {
      // Sale: Debit Client, Credit Sale, Credit VAT
      details.push({
        compteComptableId: '411000', // Client account
        libelle: `Facture ${invoice.numeroFacture} - ${(invoice as CustomerInvoiceDto).nomClient}`,
        sens: 'DEBIT',
        montantDebit: montantTTC,
        montantCredit: 0,
        ecritureComptableId: '',
      });
      details.push({
        compteComptableId: '701000', // Sales account
        libelle: 'Vente de marchandises',
        sens: 'CREDIT',
        montantDebit: 0,
        montantCredit: montantHT,
        ecritureComptableId: '',
      });
      details.push({
        compteComptableId: '445710', // VAT collected
        libelle: 'TVA collectée',
        sens: 'CREDIT',
        montantDebit: 0,
        montantCredit: montantTVA,
        ecritureComptableId: '',
      });
    } else {
      // Purchase: Debit Purchase, Debit VAT, Credit Supplier
      details.push({
        compteComptableId: '601000', // Purchase account
        libelle: 'Achat de marchandises',
        sens: 'DEBIT',
        montantDebit: montantHT,
        montantCredit: 0,
        ecritureComptableId: '',
      });
      details.push({
        compteComptableId: '445660', // VAT deductible
        libelle: 'TVA déductible',
        sens: 'DEBIT',
        montantDebit: montantTVA,
        montantCredit: 0,
        ecritureComptableId: '',
      });
      details.push({
        compteComptableId: '401000', // Supplier account
        libelle: `Facture ${invoice.numeroFacture} - ${(invoice as SupplierInvoiceDto).nomFournisseru}`,
        sens: 'CREDIT',
        montantDebit: 0,
        montantCredit: montantTTC,
        ecritureComptableId: '',
      });
    }

    const entry: EcritureComptableDto = {
      libelle: `Saisie semi-automatique - Facture ${invoice.numeroFacture}`,
      dateEcriture: invoice.dateFacturation,
      periodeComptableId: '', // Will be determined by backend based on date
      journalComptableId: '', // TODO: Get from accounting settings
      montantTotalDebit: montantTTC, // Assuming balanced for now
      montantTotalCredit: montantTTC,
      validee: false,
      referenceExterne: invoice.numeroFacture,
      detailsEcriture: details,
      // Store the source draft ID if needed? 
      // Ideally the backend InvoiceAccountingService should link it via referenceExterne or by ID
    };

    setGeneratedEntry(entry);
    setSelectedInvoice(invoice);
  };

  const handleValidateEntry = async () => {
    if (!generatedEntry || !selectedInvoice) return;

    setIsSubmitting(true);
    try {
      if (invoiceType === 'SALE') {
        await InvoiceAccountingService.accountCustomerInvoice(selectedInvoice as CustomerInvoiceDto);
      } else {
        await InvoiceAccountingService.accountSupplierInvoice(selectedInvoice as SupplierInvoiceDto);
      }

      toast.success('Écriture enregistrée avec succès');

      // Reset and refresh
      setSelectedInvoice(null);
      setGeneratedEntry(null);
      await fetchInvoices();
    } catch (error) {
      console.error('Failed to save entry:', error);
      toast.error('Erreur lors de l\'enregistrement de l\'écriture');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEntry = () => {
    setSelectedInvoice(null);
    setGeneratedEntry(null);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Saisie Semi-Automatique</h1>
            <p className="text-gray-500 mt-1">
              Générez automatiquement des écritures comptables à partir de vos factures
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchInvoices}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Invoice List or Entry Preview */}
        {selectedInvoice && generatedEntry ? (
          <SemiAutoEntryPreview
            invoice={selectedInvoice}
            generatedEntry={generatedEntry}
            type={invoiceType}
            onValidate={handleValidateEntry}
            onCancel={handleCancelEntry}
            isSubmitting={isSubmitting}
          />
        ) : (
          <Tabs value={invoiceType} onValueChange={(value) => setInvoiceType(value as InvoiceType)}>
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="SALE">
                <FileText className="h-4 w-4 mr-2" />
                Factures Clients
              </TabsTrigger>
              <TabsTrigger value="PURCHASE">
                <FileText className="h-4 w-4 mr-2" />
                Factures Fournisseurs
              </TabsTrigger>
            </TabsList>
            <TabsContent value="SALE" className="mt-6">
              <SemiAutoEntryListView
                invoices={invoices}
                type="SALE"
                isLoading={isLoading}
                onInvoiceDoubleClick={generateEntry}
              />
            </TabsContent>
            <TabsContent value="PURCHASE" className="mt-6">
              <SemiAutoEntryListView
                invoices={invoices}
                type="PURCHASE"
                isLoading={isLoading}
                onInvoiceDoubleClick={generateEntry}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}