"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { DateRangePicker } from "@/components/date-range-picker";
import { Invoice, InvoiceStatus } from "@/types/sales";
import { GeneralOptions } from "@/types/settings";
import { Badge } from "@/components/ui/badge";
import { InvoiceDetailPanel } from "./invoice-detail-panel";
import { Skeleton } from "../ui/skeleton";
import { PrintPreviewModal } from "@/components/ui/print-preview-modal";
import { PrintableInvoice } from "./printable-invoice";
import { useNationalCurrency } from "@/hooks/use-national-currency";

const statusVariantMap: Record<InvoiceStatus, "success" | "warning" | "destructive" | "default"> = {
  "P": "success",
  "PP": "warning",
  "NP": "default",
  "A": "destructive",
};

interface InvoiceManagementViewProps {
  initialInvoices: Invoice[];
  printSettings: GeneralOptions['printing'];
}

export function InvoiceManagementView({ initialInvoices, printSettings }: InvoiceManagementViewProps) {
  const { nationalCurrency } = useNationalCurrency();
  const currencyCode = nationalCurrency?.code || 'XAF';
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(initialInvoices[0] || null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const searchForm = useForm();

  return (
    <>
      <div className="h-full flex gap-6">
        <div className="w-1/3 xl:w-1/4 h-full flex flex-col gap-4">
          <Card className="flex-shrink-0">
            <CardHeader><CardTitle className="text-base">Rechercher une facture</CardTitle></CardHeader>
            <CardContent className="px-4">
              <Form {...searchForm}>
                <form className="space-y-3">
                  <FormItem className="flex"><FormLabel>Date</FormLabel><DateRangePicker /></FormItem>
                  <FormItem className="flex"><FormLabel>Nom</FormLabel><Input placeholder="Nom client..." /></FormItem>
                  <Button className="w-full">Rechercher</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          <Card className="flex-grow flex flex-col min-h-0">
            <CardHeader className="flex-shrink-0"><CardTitle className="text-base">Factures trouvées</CardTitle></CardHeader>
            <CardContent className="p-2 flex-grow overflow-y-auto">
              <div className="space-y-2">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    onClick={() => setSelectedInvoice(invoice)}
                    className={`p-3 rounded-lg cursor-pointer border ${selectedInvoice?.id === invoice.id ? "bg-primary/10 border-primary" : "hover:bg-accent"}`}
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-semibold-75">{invoice.invoiceNumber}</p>
                      <Badge variant={statusVariantMap[invoice.status]}>{invoice.status}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">{invoice.client.name}</p>
                      <p className="text-sm italic">{invoice.totalTTC.toLocaleString()} {currencyCode}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex-grow h-full">
          {selectedInvoice ? (
            <InvoiceDetailPanel invoice={selectedInvoice} onPrint={() => setIsPreviewOpen(true)} />
          ) : (
            <Card className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">Sélectionnez une facture pour voir les détails.</p>
            </Card>
          )}
        </div>
      </div>

      {selectedInvoice && (
        <PrintPreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} title={`Facture N° ${selectedInvoice.invoiceNumber}`}>
          <PrintableInvoice invoice={selectedInvoice} companyName="MAISON DG SARL" />
        </PrintPreviewModal>
      )}
    </>
  );
}