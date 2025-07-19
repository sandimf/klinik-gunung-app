import React, { useState } from "react";
import { Bell, BellOff, Check } from "lucide-react";
import { useCashierRealtimeNotifications } from "../hooks/useCashierRealtimeNotifications";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { cn } from "../lib/utils";

export const CashierNotificationBell = () => {
    const { notifications, unreadCount, isConnected, markAllAsRead } = useCashierRealtimeNotifications();
    const [isOpen, setIsOpen] = useState(false);

    const formatTime = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        if (diffInMinutes < 1) return 'Baru saja';
        if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} jam yang lalu`;
        return date.toLocaleDateString('id-ID');
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isConnected ? (
                        <Bell className="h-5 w-5" />
                    ) : (
                        <BellOff className="h-5 w-5 text-muted-foreground" />
                    )}
                    {unreadCount > 0 && (
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
                        {notifications.map((notif, idx) => (
                            <DropdownMenuItem
                                key={notif.id || idx}
                                className={cn(
                                    "flex items-start gap-3 p-3 cursor-pointer",
                                    !notif.read_at && "bg-muted/50"
                                )}
                            // onClick: bisa tambahkan aksi jika ingin
                            >
                                <div className="flex-shrink-0">
                                    {notif.read_at ? (
                                        <Check className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <div className="h-4 w-4 rounded-full bg-primary" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={cn(
                                        "text-sm font-medium",
                                        !notif.read_at && "font-semibold"
                                    )}>
                                        {notif.title || notif.message || 'Notifikasi baru'}
                                    </p>
                                    {notif.patient_name && (
                                        <p className="text-xs text-muted-foreground mt-1">Pasien: {notif.patient_name}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-1">{formatTime(notif.created_at)}</p>
                                </div>
                            </DropdownMenuItem>
                        ))}
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}; 