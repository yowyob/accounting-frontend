import { request } from '../core/request';
import { OpenAPI } from '../core/OpenAPI';

export interface AccountingSettingDto {
    id?: string;
    objetType: string;
    modeSaisie: 'AUTOMATIQUE' | 'SEMI_AUTOMATIQUE';
    montantSeuil?: number;
    journalId?: string;
    actif?: boolean;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

export class AccountingSettingService {
    /**
     * Get all accounting settings
     */
    public static getAllSettings(): Promise<AccountingSettingDto[]> {
        return request(OpenAPI, {
            method: 'GET',
            url: `/api/accounting/settings`,
        });
    }

    /**
     * Get setting for a specific type
     */
    public static getSetting(type: string, journalId?: string): Promise<AccountingSettingDto> {
        return request(OpenAPI, {
            method: 'GET',
            url: `/api/accounting/settings/${type}`,
            query: { journalId },
        });
    }

    /**
     * Update or create an accounting setting
     */
    public static updateSetting(data: AccountingSettingDto): Promise<{ success: boolean; data: AccountingSettingDto; message: string }> {
        return request(OpenAPI, {
            method: 'PUT',
            url: `/api/accounting/settings`,
            body: data,
        });
    }
}
