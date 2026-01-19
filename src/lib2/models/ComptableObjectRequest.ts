/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ComptableObjectRequest = {
    type: ComptableObjectRequest.type;
    id?: string;
    date?: string;
    libelle?: string;
    montant?: number;
    contrepartie?: string;
    quantite?: number;
    tenant_id?: string;
    journal_comptable_id?: string;
    periode_comptable_id?: string;
    compte_principal?: string;
    montant_ht?: number;
    client_id?: string;
    is_achat?: boolean;
    cout_unitaire?: number;
    is_entree?: boolean;
    fournisseur_id?: string;
};
export namespace ComptableObjectRequest {
    export enum type {
        TRANSACTION = 'TRANSACTION',
        FACTURE = 'FACTURE',
        STOCK = 'STOCK',
    }
}

