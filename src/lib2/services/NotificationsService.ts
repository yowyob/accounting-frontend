/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseWrapperListNotification } from '../models/ApiResponseWrapperListNotification';
import type { ApiResponseWrapperNotification } from '../models/ApiResponseWrapperNotification';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class NotificationsService {
    /**
     * Mark a notification as read
     * @param id
     * @returns ApiResponseWrapperNotification OK
     * @throws ApiError
     */
    public static markAsRead(
        id: string,
    ): CancelablePromise<ApiResponseWrapperNotification> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/accounting/notifications/{id}/read',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Get current user's unread notifications
     * @returns ApiResponseWrapperListNotification OK
     * @throws ApiError
     */
    public static getUnread(): CancelablePromise<ApiResponseWrapperListNotification> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/accounting/notifications/unread',
        });
    }
}
