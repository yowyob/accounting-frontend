/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseWrapperBalanceDesComptesDto } from '../models/ApiResponseWrapperBalanceDesComptesDto';
import type { ApiResponseWrapperListGrandLivreDto } from '../models/ApiResponseWrapperListGrandLivreDto';
import type { ApiResponseWrapperMapStringObject } from '../models/ApiResponseWrapperMapStringObject';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AccountingFinancialReportsService {
    /**
     * Generate General Ledger
     * @param dateDebut
     * @param dateFin
     * @returns ApiResponseWrapperListGrandLivreDto OK
     * @throws ApiError
     */
    public static generateGrandLivre(
        dateDebut: string,
        dateFin: string,
    ): CancelablePromise<ApiResponseWrapperListGrandLivreDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/rapport/grand-livre',
            query: {
                'date_debut': dateDebut,
                'date_fin': dateFin,
            },
        });
    }
    /**
     * Export General Ledger to PDF
     * @param dateDebut
     * @param dateFin
     * @returns string OK
     * @throws ApiError
     */
    public static exportGrandLivrePdf(
        dateDebut: string,
        dateFin: string,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/rapport/grand-livre/export/pdf',
            query: {
                'date_debut': dateDebut,
                'date_fin': dateFin,
            },
        });
    }
    /**
     * Generate Income Statement
     * @param dateDebut
     * @param dateFin
     * @returns ApiResponseWrapperMapStringObject OK
     * @throws ApiError
     */
    public static generateCompteResultat(
        dateDebut: string,
        dateFin: string,
    ): CancelablePromise<ApiResponseWrapperMapStringObject> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/rapport/compte-resultat',
            query: {
                'date_debut': dateDebut,
                'date_fin': dateFin,
            },
        });
    }
    /**
     * Export Income Statement to PDF
     * @param dateDebut
     * @param dateFin
     * @returns string OK
     * @throws ApiError
     */
    public static exportCompteResultatPdf(
        dateDebut: string,
        dateFin: string,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/rapport/compte-resultat/export/pdf',
            query: {
                'date_debut': dateDebut,
                'date_fin': dateFin,
            },
        });
    }
    /**
     * Generate Balance Sheet
     * @param dateDebut
     * @param dateFin
     * @returns ApiResponseWrapperMapStringObject OK
     * @throws ApiError
     */
    public static generateBilan(
        dateDebut: string,
        dateFin: string,
    ): CancelablePromise<ApiResponseWrapperMapStringObject> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/rapport/bilan',
            query: {
                'date_debut': dateDebut,
                'date_fin': dateFin,
            },
        });
    }
    /**
     * Export Balance Sheet to PDF
     * @param dateDebut
     * @param dateFin
     * @returns string OK
     * @throws ApiError
     */
    public static exportBilanPdf(
        dateDebut: string,
        dateFin: string,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/rapport/bilan/export/pdf',
            query: {
                'date_debut': dateDebut,
                'date_fin': dateFin,
            },
        });
    }
    /**
     * Generate Trial Balance
     * @param dateDebut
     * @param dateFin
     * @returns ApiResponseWrapperBalanceDesComptesDto OK
     * @throws ApiError
     */
    public static generateBalance(
        dateDebut: string,
        dateFin: string,
    ): CancelablePromise<ApiResponseWrapperBalanceDesComptesDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/rapport/balance',
            query: {
                'date_debut': dateDebut,
                'date_fin': dateFin,
            },
        });
    }
    /**
     * Export Trial Balance to PDF
     * @param dateDebut
     * @param dateFin
     * @returns string OK
     * @throws ApiError
     */
    public static exportBalancePdf(
        dateDebut: string,
        dateFin: string,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/rapport/balance/export/pdf',
            query: {
                'date_debut': dateDebut,
                'date_fin': dateFin,
            },
        });
    }

    /**
     * Generate Cash Flow
     * @param dateDebut
     * @param dateFin
     * @returns ApiResponseWrapperMapStringObject OK
     * @throws ApiError
     */
    public static generateCashFlow(
        dateDebut: string,
        dateFin: string,
    ): CancelablePromise<ApiResponseWrapperMapStringObject> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/rapport/flux-tresorerie',
            query: {
                'date_debut': dateDebut,
                'date_fin': dateFin,
            },
        });
    }

    /**
     * Generate Executive Summary
     * @param dateDebut
     * @param dateFin
     * @returns ApiResponseWrapperMapStringObject OK
     * @throws ApiError
     */
    public static generateExecutiveSummary(
        dateDebut: string,
        dateFin: string,
    ): CancelablePromise<ApiResponseWrapperMapStringObject> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/rapport/resume-executif',
            query: {
                'date_debut': dateDebut,
                'date_fin': dateFin,
            },
        });
    }
}
