/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JsonNode } from './JsonNode';
export type FactureComptable = {
    id?: string;
    organization_id?: string;
    montant_ht?: number;
    taux_tva?: number;
    date?: string;
    libelle?: string;
    journal_comptable_id?: string;
    periode_comptable_id?: string;
    client_id?: string;
    get_debit_account?: string;
    get_credit_account?: string;
    get_journal_comptable_id?: string;
    get_montant?: number;
    get_description?: string;
    get_source_type?: FactureComptable.get_source_type;
    is_achat?: boolean;
    get_date?: string;
    get_id?: string;
    get_organization_id?: string;
    get_periode_comptable_id?: string;
    get_attachment_ids?: JsonNode;
};
export namespace FactureComptable {
    export enum get_source_type {
        TRANSACTION = 'TRANSACTION',
        FACTURE = 'FACTURE',
        STOCK = 'STOCK',
    }
}

