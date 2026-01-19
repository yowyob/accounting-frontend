/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseWrapperCompteDto } from '../models/ApiResponseWrapperCompteDto';
import type { ApiResponseWrapperListCompteDto } from '../models/ApiResponseWrapperListCompteDto';
import type { ApiResponseWrapperString } from '../models/ApiResponseWrapperString';
import type { CompteDto } from '../models/CompteDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AccountingComptesService {
    /**
     * @param id
     * @returns ApiResponseWrapperCompteDto OK
     * @throws ApiError
     */
    public static getCompteById(
        id: string,
    ): CancelablePromise<ApiResponseWrapperCompteDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/comptes/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns ApiResponseWrapperCompteDto OK
     * @throws ApiError
     */
    public static updateCompte(
        id: string,
        requestBody: CompteDto,
    ): CancelablePromise<ApiResponseWrapperCompteDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/accounting/comptes/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns ApiResponseWrapperString OK
     * @throws ApiError
     */
    public static deleteCompte(
        id: string,
    ): CancelablePromise<ApiResponseWrapperString> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/accounting/comptes/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns ApiResponseWrapperListCompteDto OK
     * @throws ApiError
     */
    public static getAllComptes(): CancelablePromise<ApiResponseWrapperListCompteDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/comptes',
        });
    }
    /**
     * @param requestBody
     * @returns ApiResponseWrapperCompteDto OK
     * @throws ApiError
     */
    public static createCompte(
        requestBody: CompteDto,
    ): CancelablePromise<ApiResponseWrapperCompteDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/accounting/comptes',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param noCompte
     * @returns ApiResponseWrapperListCompteDto OK
     * @throws ApiError
     */
    public static findByNoCompte(
        noCompte: string,
    ): CancelablePromise<ApiResponseWrapperListCompteDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/comptes/search',
            query: {
                'no_compte': noCompte,
            },
        });
    }
}
