/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseWrapperDeclarationFiscaleDto } from '../models/ApiResponseWrapperDeclarationFiscaleDto';
import type { ApiResponseWrapperListDeclarationFiscaleDto } from '../models/ApiResponseWrapperListDeclarationFiscaleDto';
import type { ApiResponseWrapperVoid } from '../models/ApiResponseWrapperVoid';
import type { DeclarationFiscaleDto } from '../models/DeclarationFiscaleDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AccountingTaxDeclarationsService {
    /**
     * List all tax declarations
     * @returns ApiResponseWrapperListDeclarationFiscaleDto OK
     * @throws ApiError
     */
    public static getAll(): CancelablePromise<ApiResponseWrapperListDeclarationFiscaleDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/tax-declarations',
        });
    }
    /**
     * Save or update a tax declaration
     * @param requestBody
     * @returns DeclarationFiscaleDto Declaration saved successfully
     * @throws ApiError
     */
    public static saveDeclaration(
        requestBody: DeclarationFiscaleDto,
    ): CancelablePromise<DeclarationFiscaleDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/accounting/tax-declarations',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid data provided`,
            },
        });
    }
    /**
     * Auto-generate a tax declaration for a period
     * @param type
     * @param start
     * @param end
     * @returns ApiResponseWrapperDeclarationFiscaleDto OK
     * @throws ApiError
     */
    public static generate(
        type: string,
        start: string,
        end: string,
    ): CancelablePromise<ApiResponseWrapperDeclarationFiscaleDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/accounting/tax-declarations/generate',
            query: {
                'type': type,
                'start': start,
                'end': end,
            },
        });
    }
    /**
     * Get a tax declaration by ID
     * @param id
     * @returns ApiResponseWrapperDeclarationFiscaleDto OK
     * @throws ApiError
     */
    public static getById(
        id: string,
    ): CancelablePromise<ApiResponseWrapperDeclarationFiscaleDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/tax-declarations/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Delete a tax declaration
     * @param id
     * @returns ApiResponseWrapperVoid OK
     * @throws ApiError
     */
    public static delete(
        id: string,
    ): CancelablePromise<ApiResponseWrapperVoid> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/accounting/tax-declarations/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Filter tax declarations by type
     * @param type
     * @returns ApiResponseWrapperListDeclarationFiscaleDto OK
     * @throws ApiError
     */
    public static getByType(
        type: string,
    ): CancelablePromise<ApiResponseWrapperListDeclarationFiscaleDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/tax-declarations/type/{type}',
            path: {
                'type': type,
            },
        });
    }
    /**
     * Search tax declarations by period range
     * @param start
     * @param end
     * @returns ApiResponseWrapperListDeclarationFiscaleDto OK
     * @throws ApiError
     */
    public static getByPeriodRange(
        start: string,
        end: string,
    ): CancelablePromise<ApiResponseWrapperListDeclarationFiscaleDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/tax-declarations/search',
            query: {
                'start': start,
                'end': end,
            },
        });
    }
}
