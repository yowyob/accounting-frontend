/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CashRegisterMovementDto = {
    id?: string;
    session_id?: string;
    sense?: string;
    amount?: number;
    reason?: string;
    recipient_id?: string;
    emitter_id?: string;
    is_accounted?: boolean;
    event_ticketing_details?: boolean;
    external_reference?: string;
    create_on?: string;
    create_by?: string;
    emitter_accounting_account?: string;
    recipient_accounting_account?: string;
    attachmentIds?: Array<string>;
    is_deleted?: boolean;
};

