/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseWrapperListPeriodeComptableDto } from '../models/ApiResponseWrapperListPeriodeComptableDto';
import type { ApiResponseWrapperPeriodeComptableDto } from '../models/ApiResponseWrapperPeriodeComptableDto';
import type { ApiResponseWrapperString } from '../models/ApiResponseWrapperString';
import type { PeriodeComptableDto } from '../models/PeriodeComptableDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AccountingPeriodsService {
    /**
     * Retrieve an accounting period by ID
     * @param id
     * @returns ApiResponseWrapperPeriodeComptableDto OK
     * @throws ApiError
     */
    public static getPeriodeComptable(
        id: string,
    ): CancelablePromise<ApiResponseWrapperPeriodeComptableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/periodes/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update an accounting period
     * @param id
     * @param requestBody
     * @returns ApiResponseWrapperPeriodeComptableDto OK
     * @throws ApiError
     */
    public static updatePeriodeComptable(
        id: string,
        requestBody: PeriodeComptableDto,
    ): CancelablePromise<ApiResponseWrapperPeriodeComptableDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/accounting/periodes/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete an accounting period
     * @param id
     * @returns ApiResponseWrapperString OK
     * @throws ApiError
     */
    public static deletePeriodeComptable(
        id: string,
    ): CancelablePromise<ApiResponseWrapperString> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/accounting/periodes/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Close an accounting period
     * @param id
     * @returns ApiResponseWrapperPeriodeComptableDto OK
     * @throws ApiError
     */
    public static closePeriodeComptable(
        id: string,
    ): CancelablePromise<ApiResponseWrapperPeriodeComptableDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/accounting/periodes/{id}/close',
            path: {
                'id': id,
            },
        });
    }
    /**
     * List all accounting periods
     * @returns ApiResponseWrapperListPeriodeComptableDto OK
     * @throws ApiError
     */
    public static getAllPeriodeComptables(): CancelablePromise<ApiResponseWrapperListPeriodeComptableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/periodes',
        });
    }
    /**
     * Create an accounting period
     * Adds a new accounting period for the current tenant.
     * @param requestBody
     * @returns PeriodeComptableDto Period created successfully
     * @throws ApiError
     */
    public static createPeriodeComptable(
        requestBody: PeriodeComptableDto,
    ): CancelablePromise<PeriodeComptableDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/accounting/periodes',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error or overlapping period`,
            },
        });
    }
    /**
     * List periods within a date range
     * @param startDate
     * @param endDate
     * @returns ApiResponseWrapperListPeriodeComptableDto OK
     * @throws ApiError
     */
    public static getPeriodesByRange(
        startDate: string,
        endDate: string,
    ): CancelablePromise<ApiResponseWrapperListPeriodeComptableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/periodes/range',
            query: {
                'start_date': startDate,
                'end_date': endDate,
            },
        });
    }
    /**
     * List non-closed (open) periods
     * @returns ApiResponseWrapperListPeriodeComptableDto OK
     * @throws ApiError
     */
    public static getNonClosedPeriodes(): CancelablePromise<ApiResponseWrapperListPeriodeComptableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/periodes/non-closed',
        });
    }
    /**
     * Retrieve a period by code
     * @param code
     * @returns ApiResponseWrapperPeriodeComptableDto OK
     * @throws ApiError
     */
    public static getPeriodeByCode(
        code: string,
    ): CancelablePromise<ApiResponseWrapperPeriodeComptableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/periodes/code/{code}',
            path: {
                'code': code,
            },
        });
    }
    /**
     * Retrieve an accounting period by date
     * @param date
     * @returns ApiResponseWrapperPeriodeComptableDto OK
     * @throws ApiError
     */
    public static getPeriodeByDate(
        date: string,
    ): CancelablePromise<ApiResponseWrapperPeriodeComptableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/periodes/by-date',
            query: {
                'date': date,
            },
        });
    }
}
