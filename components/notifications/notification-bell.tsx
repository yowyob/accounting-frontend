"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { NotificationService, Notification } from "@/src/lib2/services/NotificationService";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isInitializing, setIsInitializing] = useState(true);

    // Fetch notifications on mount and set up polling
    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        const fetchNotifications = async () => {
            try {
                const response = await NotificationService.getUnreadNotifications();
                if (response.success) {
                    setNotifications(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            } finally {
                setIsInitializing(false);
            }
        };

        fetchNotifications();
        intervalId = setInterval(fetchNotifications, 60000); // Poll every minute

        return () => clearInterval(intervalId);
    }, []);

    const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
        e.preventDefault(); // prevent dropdown from closing immediately
        try {
            const response = await NotificationService.markAsRead(id);
            if (response.success) {
                setNotifications((prev) => prev.filter((n) => n.id !== id));
            }
        } catch (error) {
            toast.error("Échec de la mise à jour de la notification");
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative group">
                    <Bell className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                    {!isInitializing && notifications.length > 0 && (
                        <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-white"></span>
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 max-h-[80vh] overflow-y-auto">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    {notifications.length > 0 && (
                        <span className="text-xs font-normal text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full">
                            {notifications.length} non lues
                        </span>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {notifications.length === 0 ? (
                    <div className="py-6 text-center text-sm text-gray-500">
                        Aucune nouvelle notification
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <DropdownMenuItem key={notification.id} className="cursor-pointer gap-2 p-3 items-start flex-col">
                            <div className="flex w-full justify-between items-start gap-2">
                                <span className="font-semibold text-sm line-clamp-1">{notification.title}</span>
                                <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: fr })}
                                </span>
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2 mt-0.5 leading-relaxed">
                                {notification.message}
                            </p>
                            <div className="w-full flex justify-end mt-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-6 text-[10px] px-2"
                                    onClick={(e) => handleMarkAsRead(notification.id, e)}
                                >
                                    Marquer comme lu
                                </Button>
                            </div>
                        </DropdownMenuItem>
                    ))
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
