/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseWrapperMapStringObject } from '../models/ApiResponseWrapperMapStringObject';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HealthControllerService {
    /**
     * @returns ApiResponseWrapperMapStringObject OK
     * @throws ApiError
     */
    public static info(): CancelablePromise<ApiResponseWrapperMapStringObject> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/info',
        });
    }
    /**
     * @returns ApiResponseWrapperMapStringObject OK
     * @throws ApiError
     */
    public static health(): CancelablePromise<ApiResponseWrapperMapStringObject> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/health',
        });
    }
}
