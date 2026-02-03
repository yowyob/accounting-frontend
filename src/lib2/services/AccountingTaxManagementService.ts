/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseWrapperListTaxeDto } from '../models/ApiResponseWrapperListTaxeDto';
import type { ApiResponseWrapperTaxeDto } from '../models/ApiResponseWrapperTaxeDto';
import type { ApiResponseWrapperVoid } from '../models/ApiResponseWrapperVoid';
import type { TaxeDto } from '../models/TaxeDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AccountingTaxManagementService {
    /**
     * Get tax by ID
     * @param id
     * @returns ApiResponseWrapperTaxeDto OK
     * @throws ApiError
     */
    public static getTaxe(
        id: string,
    ): CancelablePromise<ApiResponseWrapperTaxeDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/taxes/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update an existing tax
     * @param id
     * @param requestBody
     * @returns ApiResponseWrapperTaxeDto OK
     * @throws ApiError
     */
    public static updateTaxe(
        id: string,
        requestBody: TaxeDto,
    ): CancelablePromise<ApiResponseWrapperTaxeDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/accounting/taxes/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete a tax
     * @param id
     * @returns ApiResponseWrapperVoid OK
     * @throws ApiError
     */
    public static deleteTaxe(
        id: string,
    ): CancelablePromise<ApiResponseWrapperVoid> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/accounting/taxes/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * List all taxes for the current tenant
     * @param onlyActive
     * @returns ApiResponseWrapperListTaxeDto OK
     * @throws ApiError
     */
    public static getAllTaxes(
        onlyActive: boolean = false,
    ): CancelablePromise<ApiResponseWrapperListTaxeDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/taxes',
            query: {
                'onlyActive': onlyActive,
            },
        });
    }
    /**
     * Create a new tax
     * @param requestBody
     * @returns ApiResponseWrapperTaxeDto OK
     * @throws ApiError
     */
    public static createTaxe(
        requestBody: TaxeDto,
    ): CancelablePromise<ApiResponseWrapperTaxeDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/accounting/taxes',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
