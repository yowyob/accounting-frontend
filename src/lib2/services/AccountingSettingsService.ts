/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccountingSettingDto } from '../models/AccountingSettingDto';
import type { ApiResponseWrapperAccountingSettingDto } from '../models/ApiResponseWrapperAccountingSettingDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AccountingSettingsService {
    /**
     * Get all accounting settings
     * @returns AccountingSettingDto OK
     * @throws ApiError
     */
    public static getAllSettings(): CancelablePromise<Array<AccountingSettingDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/settings',
        });
    }
    /**
     * Update or create an accounting setting
     * @param requestBody
     * @returns ApiResponseWrapperAccountingSettingDto OK
     * @throws ApiError
     */
    public static updateSetting(
        requestBody: AccountingSettingDto,
    ): CancelablePromise<ApiResponseWrapperAccountingSettingDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/accounting/settings',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get setting for a specific type and optional journal
     * @param type
     * @param journalId
     * @returns AccountingSettingDto OK
     * @throws ApiError
     */
    public static getSetting(
        type: 'FACTURE_CLIENT' | 'FACTURE_FOURNISSEUR' | 'MOUVEMENT_STOCK' | 'MOUVEMENT_CAISSE' | 'OPERATION_BANCAIRE' | 'AUTRE',
        journalId?: string,
    ): CancelablePromise<AccountingSettingDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/settings/{type}',
            path: {
                'type': type,
            },
            query: {
                'journalId': journalId,
            },
        });
    }
}
