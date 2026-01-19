/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseWrapperMapStringObject } from '../models/ApiResponseWrapperMapStringObject';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AccountingFinancialReportsService {
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
}
