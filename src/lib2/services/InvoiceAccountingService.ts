/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseWrapperObject } from '../models/ApiResponseWrapperObject';
import type { CustomerInvoiceDto } from '../models/CustomerInvoiceDto';
import type { SupplierInvoiceDto } from '../models/SupplierInvoiceDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class InvoiceAccountingService {
    /**
     * Account a customer invoice (sale)
     * @param requestBody
     * @returns ApiResponseWrapperObject OK
     * @throws ApiError
     */
    public static accountCustomerInvoice(
        requestBody: CustomerInvoiceDto,
    ): CancelablePromise<ApiResponseWrapperObject> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/accounting/invoices/sale',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Account a supplier invoice (purchase)
     * @param requestBody
     * @returns ApiResponseWrapperObject OK
     * @throws ApiError
     */
    public static accountSupplierInvoice(
        requestBody: SupplierInvoiceDto,
    ): CancelablePromise<ApiResponseWrapperObject> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/accounting/invoices/purchase',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
