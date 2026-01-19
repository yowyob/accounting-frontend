/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseWrapperJournalComptableDto } from '../models/ApiResponseWrapperJournalComptableDto';
import type { ApiResponseWrapperListJournalComptableDto } from '../models/ApiResponseWrapperListJournalComptableDto';
import type { ApiResponseWrapperString } from '../models/ApiResponseWrapperString';
import type { JournalComptableDto } from '../models/JournalComptableDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AccountingJournalsService {
    /**
     * Retrieve an accounting journal
     * Returns the full details of an accounting journal by its ID.
     * @param id
     * @returns ApiResponseWrapperJournalComptableDto OK
     * @throws ApiError
     */
    public static getJournalComptable(
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
     * Update an accounting journal
     * Updates the information of an existing journal.
     * @param id
     * @param requestBody
     * @returns ApiResponseWrapperJournalComptableDto OK
     * @throws ApiError
     */
    public static updateJournalComptable(
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
     * Delete an accounting journal
     * Deletes an accounting journal by its ID.
     * @param id
     * @returns ApiResponseWrapperString OK
     * @throws ApiError
     */
    public static deleteJournalComptable(
        id: string,
    ): CancelablePromise<ApiResponseWrapperString> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/accounting/journals/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * List all journals
     * Complete list of accounting journals for the current tenant.
     * @returns ApiResponseWrapperListJournalComptableDto OK
     * @throws ApiError
     */
    public static getAllJournalComptables(): CancelablePromise<ApiResponseWrapperListJournalComptableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/journals',
        });
    }
    /**
     * Create an accounting journal
     * Adds a new accounting journal for the current tenant.
     * @param requestBody
     * @returns JournalComptableDto Journal created successfully
     * @throws ApiError
     */
    public static createJournalComptable(
        requestBody: JournalComptableDto,
    ): CancelablePromise<JournalComptableDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/accounting/journals',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid data`,
            },
        });
    }
    /**
     * List active journals
     * Retrieves all active accounting journals.
     * @returns ApiResponseWrapperListJournalComptableDto OK
     * @throws ApiError
     */
    public static getActiveJournalComptables(): CancelablePromise<ApiResponseWrapperListJournalComptableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/journals/active',
        });
    }
}
