/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseWrapperExerciceComptableDto } from '../models/ApiResponseWrapperExerciceComptableDto';
import type { ApiResponseWrapperListExerciceComptableDto } from '../models/ApiResponseWrapperListExerciceComptableDto';
import type { ApiResponseWrapperObject } from '../models/ApiResponseWrapperObject';
import type { ExerciceComptableDto } from '../models/ExerciceComptableDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AccountingFiscalYearsService {
    /**
     * Get fiscal year by ID
     * @param id
     * @returns ApiResponseWrapperExerciceComptableDto OK
     * @throws ApiError
     */
    public static getExercice(
        id: string,
    ): CancelablePromise<ApiResponseWrapperExerciceComptableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/exercices/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update a fiscal year
     * @param id
     * @param requestBody
     * @returns ApiResponseWrapperExerciceComptableDto OK
     * @throws ApiError
     */
    public static updateExercice(
        id: string,
        requestBody: ExerciceComptableDto,
    ): CancelablePromise<ApiResponseWrapperExerciceComptableDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/accounting/exercices/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete a fiscal year
     * @param id
     * @returns ApiResponseWrapperObject OK
     * @throws ApiError
     */
    public static deleteExercice(
        id: string,
    ): CancelablePromise<ApiResponseWrapperObject> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/accounting/exercices/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Get all fiscal years for current tenant
     * @returns ApiResponseWrapperListExerciceComptableDto OK
     * @throws ApiError
     */
    public static getAllExercices(): CancelablePromise<ApiResponseWrapperListExerciceComptableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/exercices',
        });
    }
    /**
     * Create a new fiscal year
     * @param requestBody
     * @returns ApiResponseWrapperExerciceComptableDto OK
     * @throws ApiError
     */
    public static createExercice(
        requestBody: ExerciceComptableDto,
    ): CancelablePromise<ApiResponseWrapperExerciceComptableDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/accounting/exercices',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Close a fiscal year
     * @param id
     * @returns ApiResponseWrapperObject OK
     * @throws ApiError
     */
    public static closeExercice(
        id: string,
    ): CancelablePromise<ApiResponseWrapperObject> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/accounting/exercices/{id}/close',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Get active fiscal year for a given date
     * @param date
     * @returns ApiResponseWrapperExerciceComptableDto OK
     * @throws ApiError
     */
    public static getActiveExercice(
        date: string,
    ): CancelablePromise<ApiResponseWrapperExerciceComptableDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/exercices/active',
            query: {
                'date': date,
            },
        });
    }
}
