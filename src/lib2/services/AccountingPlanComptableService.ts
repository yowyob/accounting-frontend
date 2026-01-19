/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseWrapperListPlanComptableDto } from '../models/ApiResponseWrapperListPlanComptableDto';
import type { ApiResponseWrapperPlanComptableDto } from '../models/ApiResponseWrapperPlanComptableDto';
import type { ApiResponseWrapperString } from '../models/ApiResponseWrapperString';
import type { PlanComptableDto } from '../models/PlanComptableDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AccountingPlanComptableService {
    /**
     * Get an accounting account by ID
     * @param id
     * @returns ApiResponseWrapperPlanComptableDto OK
     * @throws ApiError
     */
    public static getAccountById(
        id: string,
    ): CancelablePromise<ApiResponseWrapperPlanComptableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/plan-comptable/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update an accounting account
     * @param id
     * @param requestBody
     * @returns ApiResponseWrapperPlanComptableDto OK
     * @throws ApiError
     */
    public static updatePlanComptable(
        id: string,
        requestBody: PlanComptableDto,
    ): CancelablePromise<ApiResponseWrapperPlanComptableDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/accounting/plan-comptable/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Deactivate an accounting account
     * Deactivates an account instead of deleting it.
     * @param id
     * @returns ApiResponseWrapperString OK
     * @throws ApiError
     */
    public static deactivatePlanComptable(
        id: string,
    ): CancelablePromise<ApiResponseWrapperString> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/accounting/plan-comptable/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * List all accounting accounts
     * @returns ApiResponseWrapperListPlanComptableDto OK
     * @throws ApiError
     */
    public static getAllPlanComptables(): CancelablePromise<ApiResponseWrapperListPlanComptableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/plan-comptable',
        });
    }
    /**
     * Create an accounting account
     * Creates a new account for the current tenant.
     * @param requestBody
     * @returns PlanComptableDto Account created successfully
     * @throws ApiError
     */
    public static createPlanComptable(
        requestBody: PlanComptableDto,
    ): CancelablePromise<PlanComptableDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/accounting/plan-comptable',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error or account already exists`,
            },
        });
    }
    /**
     * Initialize accounting plan
     * Creates a default set of accounts for the given tenant.
     * @param tenantId
     * @returns string Plan initialized successfully
     * @throws ApiError
     */
    public static initPlanComptable(
        tenantId: string,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/accounting/plan-comptable/admin/tenants/{tenantId}/plan-comptable/init-ohada-2025',
            path: {
                'tenantId': tenantId,
            },
            errors: {
                400: `Validation error or tenant already initialized`,
            },
        });
    }
    /**
     * List accounts by prefix
     * @param prefix
     * @returns ApiResponseWrapperListPlanComptableDto OK
     * @throws ApiError
     */
    public static getPlanComptablesByPrefix(
        prefix: string,
    ): CancelablePromise<ApiResponseWrapperListPlanComptableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/plan-comptable/prefix/{prefix}',
            path: {
                'prefix': prefix,
            },
        });
    }
    /**
     * List accounts by class
     * @param classe
     * @returns ApiResponseWrapperListPlanComptableDto OK
     * @throws ApiError
     */
    public static getPlanComptablesByClasse(
        classe: number,
    ): CancelablePromise<ApiResponseWrapperListPlanComptableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/plan-comptable/classe/{classe}',
            path: {
                'classe': classe,
            },
        });
    }
    /**
     * List all active accounts
     * @returns ApiResponseWrapperListPlanComptableDto OK
     * @throws ApiError
     */
    public static getActifPlanComptables(): CancelablePromise<ApiResponseWrapperListPlanComptableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/plan-comptable/actifs',
        });
    }
}
