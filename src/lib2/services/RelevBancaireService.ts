/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseWrapperListMapStringObject } from '../models/ApiResponseWrapperListMapStringObject';
import type { ApiResponseWrapperMapStringObject } from '../models/ApiResponseWrapperMapStringObject';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RelevBancaireService {
    /**
     * Upload d'un relevé bancaire CSV
     * Parse un fichier CSV de relevé bancaire et retourne les transactions détectées
     * @param compteBancaire
     * @param formData
     * @returns ApiResponseWrapperListMapStringObject OK
     * @throws ApiError
     */
    public static uploadReleve(
        compteBancaire: string,
        formData?: {
            file: Blob;
        },
    ): CancelablePromise<ApiResponseWrapperListMapStringObject> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/comptable/releve/upload',
            query: {
                'compteBancaire': compteBancaire,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * Importer un relevé en écritures
     * Convertit les transactions d'un relevé en écritures comptables
     * @param releveId
     * @returns ApiResponseWrapperMapStringObject OK
     * @throws ApiError
     */
    public static importerReleve(
        releveId: string,
    ): CancelablePromise<ApiResponseWrapperMapStringObject> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/comptable/releve/import/{releveId}',
            path: {
                'releveId': releveId,
            },
        });
    }
    /**
     * Liste des relevés importés
     * Retourne la liste des relevés bancaires uploadés pour le organization
     * @returns ApiResponseWrapperListMapStringObject OK
     * @throws ApiError
     */
    public static getListeReleves(): CancelablePromise<ApiResponseWrapperListMapStringObject> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/comptable/releve/list',
        });
    }
}
