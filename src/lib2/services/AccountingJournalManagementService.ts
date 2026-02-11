/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseWrapperJournalComptableDto } from '../models/ApiResponseWrapperJournalComptableDto';
import type { ApiResponseWrapperListCompteDto } from '../models/ApiResponseWrapperListCompteDto';
import type { ApiResponseWrapperListJournalComptableDto } from '../models/ApiResponseWrapperListJournalComptableDto';
import type { ApiResponseWrapperObject } from '../models/ApiResponseWrapperObject';
import type { JournalComptableDto } from '../models/JournalComptableDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AccountingJournalManagementService {
    /**
     * Get journal by ID
     * @param id
     * @returns ApiResponseWrapperJournalComptableDto OK
     * @throws ApiError
     */
    public static getJournal(
        id: string,
    ): CancelablePromise<ApiResponseWrapperJournalComptableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/journals/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update an existing journal
     * @param id
     * @param requestBody
     * @returns ApiResponseWrapperJournalComptableDto OK
     * @throws ApiError
     */
    public static updateJournal(
        id: string,
        requestBody: JournalComptableDto,
    ): CancelablePromise<ApiResponseWrapperJournalComptableDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/accounting/journals/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete a journal
     * @param id
     * @returns ApiResponseWrapperObject OK
     * @throws ApiError
     */
    public static deleteJournal(
        id: string,
    ): CancelablePromise<ApiResponseWrapperObject> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/accounting/journals/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * List all journals for the current organization
     * @returns ApiResponseWrapperListJournalComptableDto OK
     * @throws ApiError
     */
    public static getAllJournals(): CancelablePromise<ApiResponseWrapperListJournalComptableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/journals',
        });
    }
    /**
     * Create a new journal
     * @param requestBody
     * @returns ApiResponseWrapperJournalComptableDto OK
     * @throws ApiError
     */
    public static createJournal(
        requestBody: JournalComptableDto,
    ): CancelablePromise<ApiResponseWrapperJournalComptableDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/accounting/journals',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get distinct accounts used in a journal
     * @param id
     * @returns ApiResponseWrapperListCompteDto OK
     * @throws ApiError
     */
    public static getComptes(
        id: string,
    ): CancelablePromise<ApiResponseWrapperListCompteDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/journals/{id}/comptes',
            path: {
                'id': id,
            },
        });
    }
    /**
     * List all active journals
     * @returns ApiResponseWrapperListJournalComptableDto OK
     * @throws ApiError
     */
    public static getActiveJournals(): CancelablePromise<ApiResponseWrapperListJournalComptableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/journals/active',
        });
    }
}
