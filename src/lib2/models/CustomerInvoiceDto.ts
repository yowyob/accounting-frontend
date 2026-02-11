/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InvoiceLineDto } from './InvoiceLineDto';
export type CustomerInvoiceDto = {
    idFacture?: string;
    numeroFacture?: string;
    dateFacturation?: string;
    dateEcheance?: string;
    dateSysteme?: string;
    type?: string;
    etat?: string;
    idClient?: string;
    nomClient?: string;
    adresseClient?: string;
    emailClient?: string;
    telephoneClient?: string;
    montantHT?: number;
    montantTVA?: number;
    montantTTC?: number;
    montantTotal?: number;
    montantRestant?: number;
    finalAmount?: number;
    applyVat?: boolean;
    devise?: string;
    tauxChange?: number;
    modeReglement?: string;
    conditionsPaiement?: string;
    nbreEcheance?: number;
    nosRef?: string;
    vosRef?: string;
    referenceCommande?: string;
    idDevisOrigine?: string;
    lignesFacture?: Array<InvoiceLineDto>;
    notes?: string;
    pdfPath?: string;
    attachmentIds?: Array<string>;
    envoyeParEmail?: boolean;
    dateEnvoiEmail?: string;
    referalClientId?: string;
    organizationId?: string;
    remiseGlobalePourcentage?: number;
    remiseGlobaleMontant?: number;
    createdBy?: string;
    createdByUsername?: string;
    validatedBy?: string;
    validatedByUsername?: string;
    validatedAt?: string;
    version?: number;
    createdAt?: string;
    updatedAt?: string;
};

