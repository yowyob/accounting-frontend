/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseWrapperListOrganizationDto } from '../models/ApiResponseWrapperListOrganizationDto';
import type { ApiResponseWrapperOrganizationDto } from '../models/ApiResponseWrapperOrganizationDto';
import type { ApiResponseWrapperVoid } from '../models/ApiResponseWrapperVoid';
import type { OrganizationDto } from '../models/OrganizationDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AccountingOrganizationsService {
    /**
     * Get organization by ID
     * @param id
     * @returns ApiResponseWrapperOrganizationDto OK
     * @throws ApiError
     */
    public static getOrganization(
        id: string,
    ): CancelablePromise<ApiResponseWrapperOrganizationDto> {
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
     * @returns ApiResponseWrapperOrganizationDto OK
     * @throws ApiError
     */
    public static updateOrganization(
        id: string,
        requestBody: OrganizationDto,
    ): CancelablePromise<ApiResponseWrapperOrganizationDto> {
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
     * @returns ApiResponseWrapperVoid OK
     * @throws ApiError
     */
    public static deleteOrganization(
        id: string,
    ): CancelablePromise<ApiResponseWrapperVoid> {
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
     * @returns ApiResponseWrapperListOrganizationDto OK
     * @throws ApiError
     */
    public static getAllOrganizations(): CancelablePromise<ApiResponseWrapperListOrganizationDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/organizations',
        });
    }
    /**
     * Create a new organization
     * @param requestBody
     * @returns ApiResponseWrapperOrganizationDto OK
     * @throws ApiError
     */
    public static createOrganization(
        requestBody: OrganizationDto,
    ): CancelablePromise<ApiResponseWrapperOrganizationDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/accounting/organizations',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
