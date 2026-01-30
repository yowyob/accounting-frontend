/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseWrapperDeviseDto } from '../models/ApiResponseWrapperDeviseDto';
import type { ApiResponseWrapperListDeviseDto } from '../models/ApiResponseWrapperListDeviseDto';
import type { ApiResponseWrapperVoid } from '../models/ApiResponseWrapperVoid';
import type { DeviseDto } from '../models/DeviseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CurrencyManagementService {
    /**
     * Get currency by ID
     * @param id
     * @returns ApiResponseWrapperDeviseDto OK
     * @throws ApiError
     */
    public static getDevise(
        id: string,
    ): CancelablePromise<ApiResponseWrapperDeviseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/currencies/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update an existing currency
     * @param id
     * @param requestBody
     * @returns ApiResponseWrapperDeviseDto OK
     * @throws ApiError
     */
    public static updateDevise(
        id: string,
        requestBody: DeviseDto,
    ): CancelablePromise<ApiResponseWrapperDeviseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/accounting/currencies/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete a currency
     * @param id
     * @returns ApiResponseWrapperVoid OK
     * @throws ApiError
     */
    public static deleteDevise(
        id: string,
    ): CancelablePromise<ApiResponseWrapperVoid> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/accounting/currencies/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * List all currencies
     * @param onlyActive
     * @returns ApiResponseWrapperListDeviseDto OK
     * @throws ApiError
     */
    public static getAllDevises(
        onlyActive: boolean = false,
    ): CancelablePromise<ApiResponseWrapperListDeviseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/currencies',
            query: {
                'onlyActive': onlyActive,
            },
        });
    }
    /**
     * Create a new currency
     * @param requestBody
     * @returns ApiResponseWrapperDeviseDto OK
     * @throws ApiError
     */
    public static createDevise(
        requestBody: DeviseDto,
    ): CancelablePromise<ApiResponseWrapperDeviseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/accounting/currencies',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
