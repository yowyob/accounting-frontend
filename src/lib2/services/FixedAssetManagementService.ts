/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseWrapperVoid } from '../models/ApiResponseWrapperVoid';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FixedAssetManagementService {
    /**
     * Generate depreciation schedule for an asset
     * @param id
     * @returns ApiResponseWrapperVoid OK
     * @throws ApiError
     */
    public static generateSchedule(
        id: string,
    ): CancelablePromise<ApiResponseWrapperVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/accounting/immobilisations/{id}/generate-schedule',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Post all pending depreciation entries for a fiscal year
     * @param exerciceId
     * @returns ApiResponseWrapperVoid OK
     * @throws ApiError
     */
    public static postDepreciation(
        exerciceId: string,
    ): CancelablePromise<ApiResponseWrapperVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/accounting/immobilisations/post-depreciation',
            query: {
                'exerciceId': exerciceId,
            },
        });
    }
}
