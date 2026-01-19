/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JournalAuditDto } from '../models/JournalAuditDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AccountingAuditService {
    /**
     * @param tenantId
     * @param limit
     * @returns JournalAuditDto OK
     * @throws ApiError
     */
    public static getAllByTenant(
        tenantId: string,
        limit: number = 100,
    ): CancelablePromise<Array<JournalAuditDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/audit/tenant/{tenantId}',
            path: {
                'tenantId': tenantId,
            },
            query: {
                'limit': limit,
            },
        });
    }
    /**
     * @param tenantId
     * @param utilisateur
     * @returns JournalAuditDto OK
     * @throws ApiError
     */
    public static getByUtilisateur(
        tenantId: string,
        utilisateur: string,
    ): CancelablePromise<Array<JournalAuditDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/audit/tenant/{tenantId}/utilisateur/{utilisateur}',
            path: {
                'tenantId': tenantId,
                'utilisateur': utilisateur,
            },
        });
    }
    /**
     * @param tenantId
     * @param debut
     * @param fin
     * @returns JournalAuditDto OK
     * @throws ApiError
     */
    public static getByPeriode(
        tenantId: string,
        debut: string,
        fin: string,
    ): CancelablePromise<Array<JournalAuditDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/audit/tenant/{tenantId}/periode',
            path: {
                'tenantId': tenantId,
            },
            query: {
                'debut': debut,
                'fin': fin,
            },
        });
    }
    /**
     * @param tenantId
     * @param ecritureId
     * @returns JournalAuditDto OK
     * @throws ApiError
     */
    public static getByEcriture(
        tenantId: string,
        ecritureId: string,
    ): CancelablePromise<Array<JournalAuditDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/audit/tenant/{tenantId}/ecriture/{ecritureId}',
            path: {
                'tenantId': tenantId,
                'ecritureId': ecritureId,
            },
        });
    }
    /**
     * @param tenantId
     * @param action
     * @returns JournalAuditDto OK
     * @throws ApiError
     */
    public static getByAction(
        tenantId: string,
        action: string,
    ): CancelablePromise<Array<JournalAuditDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/audit/tenant/{tenantId}/action/{action}',
            path: {
                'tenantId': tenantId,
                'action': action,
            },
        });
    }
    /**
     * @param tenantId
     * @param utilisateur
     * @param action
     * @param debut
     * @param fin
     * @returns JournalAuditDto OK
     * @throws ApiError
     */
    public static rechercher(
        tenantId: string,
        utilisateur?: string,
        action?: string,
        debut?: string,
        fin?: string,
    ): CancelablePromise<Array<JournalAuditDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/audit/rechercher',
            query: {
                'tenantId': tenantId,
                'utilisateur': utilisateur,
                'action': action,
                'debut': debut,
                'fin': fin,
            },
        });
    }
}
