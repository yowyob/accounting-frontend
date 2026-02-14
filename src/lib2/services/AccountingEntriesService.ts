/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseWrapperEcritureComptableDto } from '../models/ApiResponseWrapperEcritureComptableDto';
import type { ApiResponseWrapperListEcritureComptableDto } from '../models/ApiResponseWrapperListEcritureComptableDto';
import type { ApiResponseWrapperObject } from '../models/ApiResponseWrapperObject';
import type { ComptableObject } from '../models/ComptableObject';
import type { EcritureComptableDto } from '../models/EcritureComptableDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AccountingEntriesService {
    /**
     * Get an entry by its ID
     * @param id
     * @returns ApiResponseWrapperEcritureComptableDto OK
     * @throws ApiError
     */
    public static getById(
        id: string,
    ): CancelablePromise<ApiResponseWrapperEcritureComptableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/ecritures/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update an existing accounting entry
     * @param id
     * @param requestBody
     * @returns ApiResponseWrapperEcritureComptableDto OK
     * @throws ApiError
     */
    public static updateEcriture(
        id: string,
        requestBody: EcritureComptableDto,
    ): CancelablePromise<ApiResponseWrapperEcritureComptableDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/accounting/ecritures/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete an accounting entry
     * @param id
     * @returns ApiResponseWrapperObject OK
     * @throws ApiError
     */
    public static delete(
        id: string,
    ): CancelablePromise<ApiResponseWrapperObject> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/accounting/ecritures/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * List all entries for the current organization
     * @returns ApiResponseWrapperListEcritureComptableDto OK
     * @throws ApiError
     */
    public static getAll1(): CancelablePromise<ApiResponseWrapperListEcritureComptableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/ecritures',
        });
    }
    /**
     * Create a new accounting entry
     * @param requestBody
     * @returns ApiResponseWrapperEcritureComptableDto OK
     * @throws ApiError
     */
    public static createEcriture(
        requestBody: EcritureComptableDto,
    ): CancelablePromise<ApiResponseWrapperEcritureComptableDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/accounting/ecritures',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Validate an accounting entry
     * @param id
     * @param user
     * @returns ApiResponseWrapperEcritureComptableDto OK
     * @throws ApiError
     */
    public static validateEcriture(
        id: string,
        user?: string,
    ): CancelablePromise<ApiResponseWrapperEcritureComptableDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/accounting/ecritures/{id}/validate',
            path: {
                'id': id,
            },
            query: {
                'user': user,
            },
        });
    }
    /**
     * Generate an entry from a comptable object
     * @param requestBody
     * @returns ApiResponseWrapperEcritureComptableDto OK
     * @throws ApiError
     */
    public static generate1(
        requestBody: ComptableObject,
    ): CancelablePromise<ApiResponseWrapperEcritureComptableDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/accounting/ecritures/generate',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Deactivate an accounting entry (soft delete)
     * @param id
     * @returns ApiResponseWrapperObject OK
     * @throws ApiError
     */
    public static deactivate(
        id: string,
    ): CancelablePromise<ApiResponseWrapperObject> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/accounting/ecritures/{id}/deactivate',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Cancel an accounting entry
     * @param id
     * @param user
     * @returns ApiResponseWrapperEcritureComptableDto OK
     * @throws ApiError
     */
    public static cancel(
        id: string,
        user?: string,
    ): CancelablePromise<ApiResponseWrapperEcritureComptableDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/accounting/ecritures/{id}/cancel',
            path: {
                'id': id,
            },
            query: {
                'user': user,
            },
        });
    }
    /**
     * Search entries by date range and journal
     * @param start
     * @param end
     * @param journalId
     * @returns ApiResponseWrapperListEcritureComptableDto OK
     * @throws ApiError
     */
    public static search(
        start?: string,
        end?: string,
        journalId?: string,
    ): CancelablePromise<ApiResponseWrapperListEcritureComptableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/ecritures/search',
            query: {
                'start': start,
                'end': end,
                'journalId': journalId,
            },
        });
    }
    /**
     * List all non-validated entries
     * @returns ApiResponseWrapperListEcritureComptableDto OK
     * @throws ApiError
     */
    public static getNonValidated(): CancelablePromise<ApiResponseWrapperListEcritureComptableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/ecritures/non-validated',
        });
    }
}
