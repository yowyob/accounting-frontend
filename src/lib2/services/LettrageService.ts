/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseInteger } from '../models/ApiResponseInteger';
import type { ApiResponseString } from '../models/ApiResponseString';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LettrageService {
    /**
     * Lancer le lettrage automatique
     * Rapproche automatiquement les écritures débit/crédit avec le même compte et montant
     * @returns ApiResponseInteger Lettrage effectué avec succès
     * @throws ApiError
     */
    public static lancerLettrageAutomatique(): CancelablePromise<ApiResponseInteger> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/comptable/lettrage/auto',
            errors: {
                401: `Non authentifié`,
                403: `Accès refusé`,
            },
        });
    }
    /**
     * Obtenir le statut du lettrage
     * Retourne les statistiques de lettrage pour le tenant
     * @returns ApiResponseString Statut récupéré
     * @throws ApiError
     */
    public static getStatutLettrage(): CancelablePromise<ApiResponseString> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/comptable/lettrage/status',
            errors: {
                401: `Non authentifié`,
            },
        });
    }
}
