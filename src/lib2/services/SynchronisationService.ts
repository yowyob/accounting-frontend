/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseMapStringObject } from '../models/ApiResponseMapStringObject';
import type { ApiResponseString } from '../models/ApiResponseString';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SynchronisationService {
    /**
     * Vider le cache Redis
     * Supprime tous les caches Redis du tenant (Admin uniquement)
     * @returns ApiResponseString Cache vidé
     * @throws ApiError
     */
    public static clearRedisCache(): CancelablePromise<ApiResponseString> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/comptable/sync/redis/clear',
            errors: {
                401: `Non authentifié`,
                403: `Accès refusé - Admin uniquement`,
            },
        });
    }
    /**
     * Forcer la synchronisation Elasticsearch
     * Réindexe toutes les écritures comptables dans Elasticsearch (Admin uniquement)
     * @returns ApiResponseMapStringObject Synchronisation effectuée
     * @throws ApiError
     */
    public static syncElasticsearch(): CancelablePromise<ApiResponseMapStringObject> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/comptable/sync/elasticsearch',
            errors: {
                401: `Non authentifié`,
                403: `Accès refusé - Admin uniquement`,
            },
        });
    }
    /**
     * Statut de la synchronisation
     * Retourne les statistiques de synchronisation Elasticsearch et Redis
     * @returns ApiResponseMapStringObject Statut récupéré
     * @throws ApiError
     */
    public static getSyncStatus(): CancelablePromise<ApiResponseMapStringObject> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/comptable/sync/status',
            errors: {
                401: `Non authentifié`,
            },
        });
    }
}
