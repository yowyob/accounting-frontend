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
     * @returns ApiResponseWrapperListMapStringObject Fichier uploadé et parsé
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
            errors: {
                400: `Fichier invalide ou format non reconnu`,
                401: `Non authentifié`,
                403: `Accès refusé`,
            },
        });
    }
    /**
     * Importer un relevé en écritures
     * Convertit les transactions d'un relevé en écritures comptables
     * @param releveId
     * @returns ApiResponseWrapperMapStringObject Relevé importé avec succès
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
            errors: {
                400: `Relevé déjà importé ou invalide`,
                401: `Non authentifié`,
                403: `Accès refusé`,
                404: `Relevé non trouvé`,
            },
        });
    }
    /**
     * Liste des relevés importés
     * Retourne la liste des relevés bancaires uploadés pour le tenant
     * @returns ApiResponseWrapperListMapStringObject Liste récupérée
     * @throws ApiError
     */
    public static getListeReleves(): CancelablePromise<ApiResponseWrapperListMapStringObject> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/comptable/releve/list',
            errors: {
                401: `Non authentifié`,
            },
        });
    }
}
