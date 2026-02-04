/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseWrapperObject } from '../models/ApiResponseWrapperObject';
import type { ApiResponseWrapperVoid } from '../models/ApiResponseWrapperVoid';
import type { ReleveBancaireDto } from '../models/ReleveBancaireDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BankReconciliationService {
    /**
     * Formally reconcile a bank line with a ledger entry
     * @param releveId
     * @param detailId
     * @returns ApiResponseWrapperVoid OK
     * @throws ApiError
     */
    public static reconcile(
        releveId: string,
        detailId: string,
    ): CancelablePromise<ApiResponseWrapperVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/accounting/bank-statements/{releveId}/reconcile/{detailId}',
            path: {
                'releveId': releveId,
                'detailId': detailId,
            },
        });
    }
    /**
     * Import bank statement lines
     * @param requestBody
     * @returns ApiResponseWrapperVoid OK
     * @throws ApiError
     */
    public static importReleve(
        requestBody: Array<ReleveBancaireDto>,
    ): CancelablePromise<ApiResponseWrapperVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/accounting/bank-statements/import',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get potential reconciliation candidates for a bank line
     * @param id
     * @returns ApiResponseWrapperObject OK
     * @throws ApiError
     */
    public static getCandidates(
        id: string,
    ): CancelablePromise<ApiResponseWrapperObject> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/bank-statements/{id}/candidates',
            path: {
                'id': id,
            },
        });
    }
}
