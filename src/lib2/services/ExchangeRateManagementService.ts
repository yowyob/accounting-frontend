/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseWrapperListTauxChangeDto } from '../models/ApiResponseWrapperListTauxChangeDto';
import type { ApiResponseWrapperTauxChangeDto } from '../models/ApiResponseWrapperTauxChangeDto';
import type { ApiResponseWrapperVoid } from '../models/ApiResponseWrapperVoid';
import type { TauxChangeDto } from '../models/TauxChangeDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ExchangeRateManagementService {
    /**
     * List all exchange rates for the current tenant
     * @returns ApiResponseWrapperListTauxChangeDto OK
     * @throws ApiError
     */
    public static getTenantRates(): CancelablePromise<ApiResponseWrapperListTauxChangeDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/exchange-rates',
        });
    }
    /**
     * Create a new exchange rate
     * @param requestBody
     * @returns ApiResponseWrapperTauxChangeDto OK
     * @throws ApiError
     */
    public static createTauxChange(
        requestBody: TauxChangeDto,
    ): CancelablePromise<ApiResponseWrapperTauxChangeDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/accounting/exchange-rates',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get the latest rate for a currency pair at a specific date
     * @param sourceId
     * @param targetId
     * @param date
     * @returns ApiResponseWrapperTauxChangeDto OK
     * @throws ApiError
     */
    public static getLatestRate(
        sourceId: string,
        targetId: string,
        date?: string,
    ): CancelablePromise<ApiResponseWrapperTauxChangeDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/exchange-rates/latest',
            query: {
                'sourceId': sourceId,
                'targetId': targetId,
                'date': date,
            },
        });
    }
    /**
     * Delete an exchange rate
     * @param id
     * @returns ApiResponseWrapperVoid OK
     * @throws ApiError
     */
    public static deleteTauxChange(
        id: string,
    ): CancelablePromise<ApiResponseWrapperVoid> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/accounting/exchange-rates/{id}',
            path: {
                'id': id,
            },
        });
    }
}
