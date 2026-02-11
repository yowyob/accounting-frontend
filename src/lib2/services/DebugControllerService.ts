/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseWrapperMapStringObject } from '../models/ApiResponseWrapperMapStringObject';
import type { ApiResponseWrapperObject } from '../models/ApiResponseWrapperObject';
import type { ApiResponseWrapperString } from '../models/ApiResponseWrapperString';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DebugControllerService {
    /**
     * @returns ApiResponseWrapperString OK
     * @throws ApiError
     */
    public static testSync(): CancelablePromise<ApiResponseWrapperString> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/debug/sync/test',
        });
    }
    /**
     * @returns ApiResponseWrapperObject OK
     * @throws ApiError
     */
    public static getRedisTest(): CancelablePromise<ApiResponseWrapperObject> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/debug/redis/test',
        });
    }
    /**
     * @param requestBody
     * @returns ApiResponseWrapperString OK
     * @throws ApiError
     */
    public static testRedis(
        requestBody: Record<string, Record<string, any>>,
    ): CancelablePromise<ApiResponseWrapperString> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/debug/redis/test',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns ApiResponseWrapperString OK
     * @throws ApiError
     */
    public static testKafka(
        requestBody: Record<string, Record<string, any>>,
    ): CancelablePromise<ApiResponseWrapperString> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/debug/kafka/test',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns ApiResponseWrapperMapStringObject OK
     * @throws ApiError
     */
    public static getOrganizationInfo(): CancelablePromise<ApiResponseWrapperMapStringObject> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/debug/organization/info',
        });
    }
    /**
     * @param key
     * @returns ApiResponseWrapperString OK
     * @throws ApiError
     */
    public static clearRedisKey(
        key: string,
    ): CancelablePromise<ApiResponseWrapperString> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/debug/redis/clear/{key}',
            path: {
                'key': key,
            },
        });
    }
}
