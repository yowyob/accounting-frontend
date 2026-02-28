import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export interface AttachmentDto {
    id: string;
    originalFilename: string;
    contentType: string;
    size: number;
    url: string;
    uploadedAt: string;
}

export interface ApiResponseWrapperAttachmentDto {
    success: boolean;
    data?: AttachmentDto;
    message?: string;
}

export class AccountingAttachmentService {
    /**
     * Upload a generic file attachment
     * @param formData
     * @returns ApiResponseWrapperAttachmentDto OK
     * @throws ApiError
     */
    public static uploadAttachment(
        formData?: {
            file: Blob | File;
        },
    ): Promise<ApiResponseWrapperAttachmentDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/accounting/attachments/upload',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }

    /**
     * Get the download URL for a file
     * @param fileName
     * @returns string
     */
    public static getDownloadUrl(fileName: string): string {
        return `${OpenAPI.BASE || ''}/api/accounting/attachments/download/${fileName}`;
    }
}
