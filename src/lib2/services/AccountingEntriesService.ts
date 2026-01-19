/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseWrapperEcritureComptableDto } from '../models/ApiResponseWrapperEcritureComptableDto';
import type { ApiResponseWrapperListEcritureComptableDto } from '../models/ApiResponseWrapperListEcritureComptableDto';
import type { ApiResponseWrapperVoid } from '../models/ApiResponseWrapperVoid';
import type { ComptableObjectRequest } from '../models/ComptableObjectRequest';
import type { EcritureComptableDto } from '../models/EcritureComptableDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AccountingEntriesService {
    /**
     * List all accounting entries
     * @returns ApiResponseWrapperListEcritureComptableDto OK
     * @throws ApiError
     */
    public static getAllEcritures(): CancelablePromise<ApiResponseWrapperListEcritureComptableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/entries',
        });
    }
    /**
     * Create an accounting entry manually
     * Creates a new entry after period and journal validation.
     * @param requestBody
     * @returns EcritureComptableDto Entry created successfully
     * @throws ApiError
     */
    public static createEcriture(
        requestBody: EcritureComptableDto,
    ): CancelablePromise<EcritureComptableDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/accounting/entries',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Data validation error`,
            },
        });
    }
    /**
     * Validate an accounting entry
     * @param id
     * @returns ApiResponseWrapperEcritureComptableDto OK
     * @throws ApiError
     */
    public static validateEcriture(
        id: string,
    ): CancelablePromise<ApiResponseWrapperEcritureComptableDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/accounting/entries/{id}/validate',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Generate an entry from an accounting object
     * @param requestBody
     * @returns ApiResponseWrapperEcritureComptableDto OK
     * @throws ApiError
     */
    public static generateFromComptableObject(
        requestBody: ComptableObjectRequest,
    ): CancelablePromise<ApiResponseWrapperEcritureComptableDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/accounting/entries/generate-from-object',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get an accounting entry by ID
     * @param id
     * @returns ApiResponseWrapperEcritureComptableDto OK
     * @throws ApiError
     */
    public static getEcritureById(
        id: string,
    ): CancelablePromise<ApiResponseWrapperEcritureComptableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/entries/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Delete an accounting entry (if not validated)
     * @param id
     * @returns ApiResponseWrapperVoid OK
     * @throws ApiError
     */
    public static deleteEcriture(
        id: string,
    ): CancelablePromise<ApiResponseWrapperVoid> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/accounting/entries/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Search entries by period and journal
     * @param startDate
     * @param endDate
     * @param journalId
     * @returns ApiResponseWrapperListEcritureComptableDto OK
     * @throws ApiError
     */
    public static searchEcritures(
        startDate?: string,
        endDate?: string,
        journalId?: string,
    ): CancelablePromise<ApiResponseWrapperListEcritureComptableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/entries/search',
            query: {
                'start_date': startDate,
                'end_date': endDate,
                'journal_id': journalId,
            },
        });
    }
    /**
     * List non-validated entries
     * @returns ApiResponseWrapperListEcritureComptableDto OK
     * @throws ApiError
     */
    public static getNonValidatedEcritures(): CancelablePromise<ApiResponseWrapperListEcritureComptableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/entries/non-validated',
        });
    }
}
