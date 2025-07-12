import React, { useState } from 'react';
import { Bell, BellOff, Check, CheckCheck } from 'lucide-react';
import { useRealtimeNotifications } from '../hooks/useRealtimeNotifications';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { cn } from '../lib/utils';

export const NotificationBell = () => {
    const {
        notifications,
        unreadCount,
        isConnected,
        isLoading,
        markAsRead,
        markAllAsRead
    } = useRealtimeNotifications();

    const [isOpen, setIsOpen] = useState(false);

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffInMinutes < 1) return 'Baru saja';
        if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} jam yang lalu`;
        return date.toLocaleDateString('id-ID');
    };

    const handleNotificationClick = (notification) => {
        if (!notification.read_at) {
            markAsRead(notification.id);
        }

        // Navigate to screening detail
        window.location.href = `/dashboard/paramedis/screenings`;
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    onClick={() => setIsOpen(!isOpen)}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    ) : isConnected ? (
                        <Bell className="h-5 w-5" />
                    ) : (
                        <BellOff className="h-5 w-5 text-muted-foreground" />
                    )}

                    {!isLoading && unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center text-white font-semibold"
                        >
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifikasi</span>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllAsRead}
                            className="h-6 px-2 text-xs"
                        >
                            Tandai semua dibaca
                        </Button>
                    )}
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                        <BellOff className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Tidak ada notifikasi baru</p>
                    </div>
                ) : (
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className={cn(
                                    "flex items-start gap-3 p-3 cursor-pointer",
                                    !notification.read_at && "bg-muted/50"
                                )}
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <div className="flex-shrink-0">
                                    {notification.read_at ? (
                                        <Check className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <div className="h-4 w-4 rounded-full bg-primary" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className={cn(
                                        "text-sm font-medium",
                                        !notification.read_at && "font-semibold"
                                    )}>
                                        {notification.title || 'Screening Baru'}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {notification.message}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {formatTime(notification.created_at)}
                                    </p>
                                </div>
                            </DropdownMenuItem>
                        ))}
                    </div>
                )}

                {notifications.length > 0 && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-center text-primary cursor-pointer"
                            onClick={() => window.location.href = '/dashboard/paramedis/screenings'}
                        >
                            Lihat semua screening
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}; 