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
     * Advanced search for audit logs
     * @param organizationId
     * @param utilisateur
     * @param action
     * @param debut
     * @param fin
     * @returns ApiResponseWrapperListJournalAuditDto OK
     * @throws ApiError
     */
    public static rechercher(
        organizationId: string,
        utilisateur?: string,
        action?: string,
        debut?: string,
        fin?: string,
    ): CancelablePromise<ApiResponseWrapperListJournalAuditDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/audit/rechercher',
            query: {
                'organizationId': organizationId,
                'utilisateur': utilisateur,
                'action': action,
                'debut': debut,
                'fin': fin,
            },
        });
    }
    /**
     * Get all audits for a organization
     * @param organizationId
     * @param limit
     * @returns ApiResponseWrapperListJournalAuditDto OK
     * @throws ApiError
     */
    public static getAllByOrganization(
        organizationId: string,
        limit: number = 100,
    ): CancelablePromise<ApiResponseWrapperListJournalAuditDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/audit/organization/{organizationId}',
            path: {
                'organizationId': organizationId,
            },
            query: {
                'limit': limit,
            },
        });
    }
    /**
     * Get audits by user
     * @param organizationId
     * @param utilisateur
     * @returns ApiResponseWrapperListJournalAuditDto OK
     * @throws ApiError
     */
    public static getByUtilisateur(
        organizationId: string,
        utilisateur: string,
    ): CancelablePromise<ApiResponseWrapperListJournalAuditDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/audit/organization/{organizationId}/utilisateur/{utilisateur}',
            path: {
                'organizationId': organizationId,
                'utilisateur': utilisateur,
            },
        });
    }
    /**
     * Get audits by time period
     * @param organizationId
     * @param debut
     * @param fin
     * @returns ApiResponseWrapperListJournalAuditDto OK
     * @throws ApiError
     */
    public static getByPeriode(
        organizationId: string,
        debut: string,
        fin: string,
    ): CancelablePromise<ApiResponseWrapperListJournalAuditDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/audit/organization/{organizationId}/periode',
            path: {
                'organizationId': organizationId,
            },
            query: {
                'debut': debut,
                'fin': fin,
            },
        });
    }
    /**
     * Get audits by accounting entry ID
     * @param organizationId
     * @param ecritureId
     * @returns ApiResponseWrapperListJournalAuditDto OK
     * @throws ApiError
     */
    public static getByEcriture(
        organizationId: string,
        ecritureId: string,
    ): CancelablePromise<ApiResponseWrapperListJournalAuditDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/audit/organization/{organizationId}/ecriture/{ecritureId}',
            path: {
                'organizationId': organizationId,
                'ecritureId': ecritureId,
            },
        });
    }
    /**
     * Get audits by action type
     * @param organizationId
     * @param action
     * @returns ApiResponseWrapperListJournalAuditDto OK
     * @throws ApiError
     */
    public static getByAction(
        organizationId: string,
        action: string,
    ): CancelablePromise<ApiResponseWrapperListJournalAuditDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/audit/organization/{organizationId}/action/{action}',
            path: {
                'organizationId': organizationId,
                'action': action,
            },
        });
    }
}
