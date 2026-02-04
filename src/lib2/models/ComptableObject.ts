/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ComptableObject = {
    get_debit_account?: string;
    get_credit_account?: string;
    get_montant?: number;
    get_description?: string;
    get_source_type?: ComptableObject.get_source_type;
    get_journal_comptable_id?: string;
    get_date?: string;
    get_id?: string;
    get_tenant_id?: string;
    get_periode_comptable_id?: string;
};
export namespace ComptableObject {
    export enum get_source_type {
        TRANSACTION = 'TRANSACTION',
        FACTURE = 'FACTURE',
        STOCK = 'STOCK',
    }
}

