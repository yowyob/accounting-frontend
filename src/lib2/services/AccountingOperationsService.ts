/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseWrapperListOperationComptableDto } from '../models/ApiResponseWrapperListOperationComptableDto';
import type { ApiResponseWrapperOperationComptableDto } from '../models/ApiResponseWrapperOperationComptableDto';
import type { ApiResponseWrapperString } from '../models/ApiResponseWrapperString';
import type { OperationComptableDto } from '../models/OperationComptableDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AccountingOperationsService {
    /**
     * Retrieve an accounting operation by ID
     * @param id
     * @returns ApiResponseWrapperOperationComptableDto Operation found
     * @throws ApiError
     */
    public static getOperationComptable(
        id: string,
    ): CancelablePromise<ApiResponseWrapperOperationComptableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/operations/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Operation not found`,
            },
        });
    }
    /**
     * Update an accounting operation
     * @param id
     * @param requestBody
     * @returns ApiResponseWrapperOperationComptableDto OK
     * @throws ApiError
     */
    public static updateOperationComptable(
        id: string,
        requestBody: OperationComptableDto,
    ): CancelablePromise<ApiResponseWrapperOperationComptableDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/accounting/operations/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete an accounting operation
     * Deletes an existing accounting operation by ID.
     * @param id
     * @returns ApiResponseWrapperString OK
     * @throws ApiError
     */
    public static deleteOperationComptable(
        id: string,
    ): CancelablePromise<ApiResponseWrapperString> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/accounting/operations/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * List all accounting operations
     * @returns ApiResponseWrapperListOperationComptableDto OK
     * @throws ApiError
     */
    public static getAllOperationsComptables(): CancelablePromise<ApiResponseWrapperListOperationComptableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/operations',
        });
    }
    /**
     * Create an accounting operation
     * Creates a new accounting operation for the current tenant.
     * @param requestBody
     * @returns OperationComptableDto Operation created successfully
     * @throws ApiError
     */
    public static createOperationComptable(
        requestBody: OperationComptableDto,
    ): CancelablePromise<OperationComptableDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/accounting/operations',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid data validation failure`,
            },
        });
    }
    /**
     * Search operation by type and settlement mode
     * @param typeOperation
     * @param modeReglement
     * @returns ApiResponseWrapperOperationComptableDto OK
     * @throws ApiError
     */
    public static getOperationByTypeAndMode(
        typeOperation: string,
        modeReglement: string,
    ): CancelablePromise<ApiResponseWrapperOperationComptableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/operations/search',
            query: {
                'type_operation': typeOperation,
                'mode_reglement': modeReglement,
            },
        });
    }
    /**
     * Retrieve accounting operations by principal account
     * @param noCompte
     * @returns ApiResponseWrapperListOperationComptableDto OK
     * @throws ApiError
     */
    public static getOperationsByNoCompte(
        noCompte: string,
    ): CancelablePromise<ApiResponseWrapperListOperationComptableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/operations/by-no-compte',
            query: {
                'no_compte': noCompte,
            },
        });
    }
}
