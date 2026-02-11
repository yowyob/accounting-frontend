/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AgenceDto } from '../models/AgenceDto';
import type { ApiResponseWrapperAgenceDto } from '../models/ApiResponseWrapperAgenceDto';
import type { ApiResponseWrapperListAgenceDto } from '../models/ApiResponseWrapperListAgenceDto';
import type { ApiResponseWrapperVoid } from '../models/ApiResponseWrapperVoid';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AccountingAgencesService {
    /**
     * Get agency by ID
     * @param id
     * @returns ApiResponseWrapperAgenceDto OK
     * @throws ApiError
     */
    public static getAgence(
        id: string,
    ): CancelablePromise<ApiResponseWrapperAgenceDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/agences/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update an agency
     * @param id
     * @param requestBody
     * @returns ApiResponseWrapperAgenceDto OK
     * @throws ApiError
     */
    public static updateAgence(
        id: string,
        requestBody: AgenceDto,
    ): CancelablePromise<ApiResponseWrapperAgenceDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/accounting/agences/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete an agency
     * @param id
     * @returns ApiResponseWrapperVoid OK
     * @throws ApiError
     */
    public static deleteAgence(
        id: string,
    ): CancelablePromise<ApiResponseWrapperVoid> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/accounting/agences/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Get all agencies for current organization
     * @returns ApiResponseWrapperListAgenceDto OK
     * @throws ApiError
     */
    public static getAllAgences(): CancelablePromise<ApiResponseWrapperListAgenceDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/agences',
        });
    }
    /**
     * Create a new agency
     * @param requestBody
     * @returns ApiResponseWrapperAgenceDto OK
     * @throws ApiError
     */
    public static createAgence(
        requestBody: AgenceDto,
    ): CancelablePromise<ApiResponseWrapperAgenceDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/accounting/agences',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
