/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseListOrganizationDto } from '../models/ApiResponseListOrganizationDto';
import type { ApiResponseOrganizationDto } from '../models/ApiResponseOrganizationDto';
import type { ApiResponseVoid } from '../models/ApiResponseVoid';
import type { OrganizationDto } from '../models/OrganizationDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AccountingOrganizationsService {
    /**
     * Get organization by ID
     * @param id
     * @returns ApiResponseOrganizationDto OK
     * @throws ApiError
     */
    public static getOrganization(
        id: string,
    ): CancelablePromise<ApiResponseOrganizationDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/organizations/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update an organization
     * @param id
     * @param requestBody
     * @returns ApiResponseOrganizationDto OK
     * @throws ApiError
     */
    public static updateOrganization(
        id: string,
        requestBody: OrganizationDto,
    ): CancelablePromise<ApiResponseOrganizationDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/accounting/organizations/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete an organization
     * @param id
     * @returns ApiResponseVoid OK
     * @throws ApiError
     */
    public static deleteOrganization(
        id: string,
    ): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/accounting/organizations/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Get all organizations
     * @returns ApiResponseListOrganizationDto OK
     * @throws ApiError
     */
    public static getAllOrganizations(): CancelablePromise<ApiResponseListOrganizationDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/organizations',
        });
    }
    /**
     * Create a new organization
     * @param requestBody
     * @returns ApiResponseOrganizationDto OK
     * @throws ApiError
     */
    public static createOrganization(
        requestBody: OrganizationDto,
    ): CancelablePromise<ApiResponseOrganizationDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/accounting/organizations',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
