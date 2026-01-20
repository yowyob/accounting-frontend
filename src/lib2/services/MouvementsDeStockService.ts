/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseListMapStringObject } from '../models/ApiResponseListMapStringObject';
import type { ApiResponseMapStringObject } from '../models/ApiResponseMapStringObject';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MouvementsDeStockService {
    /**
     * Créer un mouvement de stock
     * Enregistre un mouvement de stock (entrée, sortie, transfert) et génère l'impact comptable
     * @param requestBody
     * @returns ApiResponseMapStringObject Mouvement créé avec succès
     * @throws ApiError
     */
    public static creerMouvement(
        requestBody: Record<string, Record<string, any>>,
    ): CancelablePromise<ApiResponseMapStringObject> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/comptable/stock/mouvement',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Données invalides`,
                401: `Non authentifié`,
                403: `Accès refusé`,
            },
        });
    }
    /**
     * Liste des mouvements de stock
     * Retourne tous les mouvements de stock du tenant
     * @param type
     * @param produitId
     * @returns ApiResponseListMapStringObject Liste récupérée
     * @throws ApiError
     */
    public static getMouvements(
        type?: string,
        produitId?: string,
    ): CancelablePromise<ApiResponseListMapStringObject> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/comptable/stock/mouvements',
            query: {
                'type': type,
                'produit_id': produitId,
            },
            errors: {
                401: `Non authentifié`,
            },
        });
    }
    /**
     * Impact comptable d'un mouvement
     * Retourne les écritures comptables générées par un mouvement de stock
     * @param mouvementId
     * @returns ApiResponseMapStringObject Impact récupéré
     * @throws ApiError
     */
    public static getImpactComptable(
        mouvementId: string,
    ): CancelablePromise<ApiResponseMapStringObject> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/comptable/stock/impact-comptable/{mouvementId}',
            path: {
                'mouvementId': mouvementId,
            },
            errors: {
                401: `Non authentifié`,
                404: `Mouvement non trouvé`,
            },
        });
    }
}
