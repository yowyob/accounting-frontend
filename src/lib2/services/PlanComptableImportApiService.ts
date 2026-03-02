/* eslint-disable */
import type { ImportResult } from '../models/ImportResult';
import type { ApiResponseWrapper } from '../models/ApiResponseWrapper'; // Assumant l'existence du wrapper générique, on définit un type ad-hoc si absent
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export type ApiResponseWrapperImportResult = {
    success?: boolean;
    data?: ImportResult;
    message?: string;
    errors?: Array<string>;
};

export class PlanComptableImportApiService {
    /**
     * Importe un plan comptable depuis un fichier XLSX ou CSV.
     * @param formData Contient le fichier sous la clé 'file'
     * @returns ApiResponseWrapperImportResult
     * @throws ApiError
     */
    public static importPlanComptable(
        formData: FormData,
    ): Promise<ApiResponseWrapperImportResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/accounting/plan-comptable/import',
            body: formData,
            mediaType: 'multipart/form-data',
        });
    }
}
