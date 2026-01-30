/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseWrapperListJournalAuditDto } from '../models/ApiResponseWrapperListJournalAuditDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AccountingAuditService {
    /**
     * Get all audits for a tenant
     * @param tenantId
     * @param limit
     * @returns ApiResponseWrapperListJournalAuditDto OK
     * @throws ApiError
     */
    public static getAllByTenant(
        tenantId: string,
        limit: number = 100,
    ): CancelablePromise<ApiResponseWrapperListJournalAuditDto> {
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
     * Get audits by user
     * @param tenantId
     * @param utilisateur
     * @returns ApiResponseWrapperListJournalAuditDto OK
     * @throws ApiError
     */
    public static getByUtilisateur(
        tenantId: string,
        utilisateur: string,
    ): CancelablePromise<ApiResponseWrapperListJournalAuditDto> {
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
     * Get audits by time period
     * @param tenantId
     * @param debut
     * @param fin
     * @returns ApiResponseWrapperListJournalAuditDto OK
     * @throws ApiError
     */
    public static getByPeriode(
        tenantId: string,
        debut: string,
        fin: string,
    ): CancelablePromise<ApiResponseWrapperListJournalAuditDto> {
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
     * Get audits by accounting entry ID
     * @param tenantId
     * @param ecritureId
     * @returns ApiResponseWrapperListJournalAuditDto OK
     * @throws ApiError
     */
    public static getByEcriture(
        tenantId: string,
        ecritureId: string,
    ): CancelablePromise<ApiResponseWrapperListJournalAuditDto> {
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
     * Get audits by action type
     * @param tenantId
     * @param action
     * @returns ApiResponseWrapperListJournalAuditDto OK
     * @throws ApiError
     */
    public static getByAction(
        tenantId: string,
        action: string,
    ): CancelablePromise<ApiResponseWrapperListJournalAuditDto> {
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
     * Advanced search for audit logs
     * @param tenantId
     * @param utilisateur
     * @param action
     * @param debut
     * @param fin
     * @returns ApiResponseWrapperListJournalAuditDto OK
     * @throws ApiError
     */
    public static rechercher(
        tenantId: string,
        utilisateur?: string,
        action?: string,
        debut?: string,
        fin?: string,
    ): CancelablePromise<ApiResponseWrapperListJournalAuditDto> {
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
