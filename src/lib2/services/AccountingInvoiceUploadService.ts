/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseWrapperFactureComptable } from '../models/ApiResponseWrapperFactureComptable';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AccountingInvoiceUploadService {
    /**
     * Upload and analyze an invoice document
     * @param formData
     * @returns ApiResponseWrapperFactureComptable OK
     * @throws ApiError
     */
    public static upload(
        formData?: {
            file: Blob;
        },
    ): CancelablePromise<ApiResponseWrapperFactureComptable> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/accounting/invoices/upload',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
}
