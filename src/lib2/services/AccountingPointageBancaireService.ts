/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AccountingPointageBancaireService {
    /**
     * Import and point bank statement
     * @param file
     * @returns string OK
     * @throws ApiError
     */
    public static importerReleve1(
        file: Blob,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/accounting/pointage/import',
            query: {
                'file': file,
            },
        });
    }
}
