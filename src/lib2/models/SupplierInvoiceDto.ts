/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InvoiceLineDto } from './InvoiceLineDto';
export type SupplierInvoiceDto = {
    idFacture?: string;
    numeroFacture?: string;
    dateFacturation?: string;
    dateEcheance?: string;
    dateSysteme?: string;
    etat?: string;
    type?: string;
    idFournisseur?: string;
    nomFournisseru?: string;
    adresseFournisseur?: string;
    emailFournisseur?: string;
    telephoneFournisseur?: string;
    montantHT?: number;
    montantTVA?: number;
    montantTTC?: number;
    montantTotal?: number;
    montantRestant?: number;
    finalAmount?: number;
    remiseGlobalePourcentage?: number;
    remiseGlobaleMontant?: number;
    applyVat?: boolean;
    devise?: string;
    tauxChange?: number;
    modeReglement?: string;
    conditionsPaiement?: string;
    nbreEcheance?: number;
    nosRef?: string;
    vosRef?: string;
    referenceCommande?: string;
    idGRN?: string;
    numeroGRN?: string;
    attachmentIds?: Array<string>;
    lignesFacture?: Array<InvoiceLineDto>;
};

