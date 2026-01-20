/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseMapStringObject } from '../models/ApiResponseMapStringObject';
import type { ApiResponseString } from '../models/ApiResponseString';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ClTureMensuelleService {
    /**
     * Clôturer une période mensuelle
     * Valide toutes les écritures et génère les écritures de clôture
     * @param periodeId
     * @returns ApiResponseMapStringObject Période clôturée avec succès
     * @throws ApiError
     */
    public static cloturerPeriode(
        periodeId: string,
    ): CancelablePromise<ApiResponseMapStringObject> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/comptable/cloture/mensuelle/{periodeId}',
            path: {
                'periodeId': periodeId,
            },
            errors: {
                400: `Période non éligible à la clôture`,
                401: `Non authentifié`,
                403: `Accès refusé`,
                404: `Période non trouvée`,
            },
        });
    }
    /**
     * Annuler une clôture
     * Réouvre une période clôturée (réservé aux administrateurs)
     * @param periodeId
     * @returns ApiResponseString Clôture annulée
     * @throws ApiError
     */
    public static annulerCloture(
        periodeId: string,
    ): CancelablePromise<ApiResponseString> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/comptable/cloture/annuler/{periodeId}',
            path: {
                'periodeId': periodeId,
            },
            errors: {
                401: `Non authentifié`,
                403: `Accès refusé - Admin uniquement`,
                404: `Période non trouvée`,
            },
        });
    }
    /**
     * Vérifier l'éligibilité à la clôture
     * Vérifie si une période peut être clôturée (toutes les écritures validées, etc.)
     * @param periodeId
     * @returns ApiResponseMapStringObject Statut récupéré
     * @throws ApiError
     */
    public static verifierEligibilite(
        periodeId: string,
    ): CancelablePromise<ApiResponseMapStringObject> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/comptable/cloture/status/{periodeId}',
            path: {
                'periodeId': periodeId,
            },
            errors: {
                401: `Non authentifié`,
                404: `Période non trouvée`,
            },
        });
    }
}
