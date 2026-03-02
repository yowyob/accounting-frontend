import { request } from '../core/request';
import { OpenAPI } from '../core/OpenAPI';

export interface Notification {
    id: string;
    organizationId: string;
    userId: string;
    title: string;
    message: string;
    linkUrl?: string;
    entityType?: string;
    entityId?: string;
    createdAt: string;
    readAt?: string;
}

export class NotificationService {
    /**
     * Get current user's unread notifications
     */
    public static getUnreadNotifications(): Promise<{ success: boolean; data: Notification[]; message: string }> {
        return request(OpenAPI, {
            method: 'GET',
            url: `/api/accounting/notifications/unread`,
        });
    }

    /**
     * Mark a notification as read
     */
    public static markAsRead(id: string): Promise<{ success: boolean; data: Notification; message: string }> {
        return request(OpenAPI, {
            method: 'POST',
            url: `/api/accounting/notifications/${id}/read`,
        });
    }
}
