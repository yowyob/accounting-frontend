"use client";

import { Invoice } from "@/types/sales";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { useNationalCurrency } from "@/hooks/use-national-currency";

interface PrintableInvoiceProps {
    invoice: Invoice;
    companyName: string;
}

export function PrintableInvoice({ invoice, companyName }: PrintableInvoiceProps) {
    const { nationalCurrency } = useNationalCurrency();
    const currencyCode = nationalCurrency?.code || 'XAF';
    return (
        <div className="text-sm text-black font-sans">

            <section className="flex justify-between items-start pb-4 mb-8 border-b-2 border-black">
                <div>
                    <h1 className="text-3xl font-bold text-black">{companyName}</h1>
                    <p>BP 933 Yaoundé, CAMEROUN</p>
                    <p>Commerce Général - Import/Export</p>
                    <p>Tel: (+237) 699 00 00 00</p>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-semibold">FACTURE</h2>
                    <p className="font-bold text-base">N° : {invoice.invoiceNumber}</p>
                    <p>Date : {format(new Date(invoice.orderDate), 'dd/MM/yyyy')}</p>
                </div>
            </section>

            <section className="mb-8">
                <div className="p-2 border border-gray-300 rounded-sm bg-gray-50 w-1/2">
                    <p className="text-gray-600">Client :</p>
                    <p className="font-bold text-base">{invoice.client.name}</p>
                    <p>{invoice.client.address || 'Adresse non spécifiée'}</p>
                </div>
            </section>

            <section className="my-8">
                <table className="w-full text-left table-auto">
                    <thead>
                        <tr className="bg-gray-200 text-black">
                            <th className="p-2 font-semibold">Code</th>
                            <th className="p-2 font-semibold w-2/5">Libellé</th>
                            <th className="p-2 font-semibold text-center">Qté</th>
                            <th className="p-2 font-semibold text-right">P.U.</th>
                            <th className="p-2 font-semibold text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="p-2 align-top">{item.code}</td>
                                <td className="p-2 align-top">{item.name}</td>
                                <td className="p-2 align-top text-center">{item.quantity}</td>
                                <td className="p-2 align-top text-right">{item.unitPrice.toLocaleString('fr-FR')}</td>
                                <td className="p-2 align-top text-right font-semibold">{item.total.toLocaleString('fr-FR')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <section className="mt-8 flex justify-end">
                <div className="w-full max-w-sm space-y-2">
                    <div className="flex justify-between"><span className="text-gray-600">Total HT :</span><span className="font-semibold">{invoice.totalHT.toLocaleString('fr-FR')}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">TVA (19.25%) :</span><span className="font-semibold">{invoice.totalTVA.toLocaleString('fr-FR')}</span></div>
                    <Separator className="my-2 bg-gray-400" />
                    <div className="flex justify-between text-lg font-bold"><span >TOTAL TTC :</span><span>{invoice.totalTTC.toLocaleString('fr-FR')} {currencyCode}</span></div>
                    <Separator className="my-2" />
                    <div className="flex justify-between"><span className="text-gray-600">Montant Payé :</span><span className="font-semibold">{invoice.totalPaid.toLocaleString('fr-FR')}</span></div>
                    <div className="flex justify-between font-bold text-red-600"><span>Solde Dû :</span><span>{invoice.balanceDue.toLocaleString('fr-FR')}</span></div>
                </div>
            </section>

            <footer className="absolute bottom-12 w-full left-0 px-12">
                <div className="flex justify-between text-center pt-8">
                    <div className="w-1/3">
                        <p className="border-t border-gray-400 pt-2">La Direction</p>
                    </div>
                    <div className="w-1/3">
                        <p className="border-t border-gray-400 pt-2">Client</p>
                    </div>
                </div>
                <div className="mt-12 pt-4 border-t text-center text-xs text-gray-500">
                    <p>Merci de votre confiance.</p>
                </div>
            </footer>
        </div>
    );
}