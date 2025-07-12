import { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';

export const useRealtimeNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const eventSourceRef = useRef(null);
    const pollingIntervalRef = useRef(null);

    // Method 1: Server-Sent Events (SSE) - Free and Real-time
    const connectSSE = () => {
        try {
            const eventSource = new EventSource('/api/notifications/stream');

            eventSource.onopen = () => {
                setIsConnected(true);
                console.log('SSE Connected');
            };

            eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    // Handle different message types
                    if (data.type === 'connected') {
                        console.log('SSE Connected:', data.message);
                    } else if (data.type === 'notification') {
                        handleNewNotification(data.notification);
                    } else if (data.type === 'timeout') {
                        console.log('SSE Timeout, reconnecting...');
                        eventSource.close();
                        setTimeout(() => connectSSE(), 1000);
                    }
                } catch (parseError) {
                    console.error('Error parsing SSE data:', parseError);
                }
            };

            eventSource.onerror = (error) => {
                console.error('SSE Error:', error);
                setIsConnected(false);
                eventSource.close();
                // Fallback to polling after 5 seconds
                setTimeout(() => startPolling(), 5000);
            };

            eventSourceRef.current = eventSource;
        } catch (error) {
            console.error('SSE Connection failed:', error);
            startPolling();
        }
    };

    // Method 2: Polling - Simple and reliable
    const startPolling = () => {
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
        }

        // Initial fetch
        fetchNotifications();

        // Poll every 15 seconds (less aggressive)
        pollingIntervalRef.current = setInterval(() => {
            fetchNotifications();
        }, 15000);
    };

    // Method 3: WebSocket with Pusher (if available)
    const connectWebSocket = () => {
        // This would require Pusher setup
        // For now, we'll use SSE and polling
        connectSSE();
    };

    const fetchNotifications = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('/api/notifications', {
                timeout: 5000, // 5 second timeout
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            const { notifications, unread_count } = response.data;

            setNotifications(notifications);
            setUnreadCount(unread_count);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            // Don't show error for network issues
            if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
                console.log('Network error, will retry...');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewNotification = (notification) => {
        setNotifications(prev => [notification, ...prev.slice(0, 9)]);
        setUnreadCount(prev => prev + 1);

        // Show browser notification if permission granted
        if (Notification.permission === 'granted') {
            new Notification('Screening Baru', {
                body: notification.message,
                icon: '/favicon.ico',
                badge: '/favicon.ico'
            });
        }

        // Show toast notification
        showToastNotification(notification);

        // Trigger screening data refresh
        window.dispatchEvent(new CustomEvent('new-screening', {
            detail: {
                type: 'new_screening',
                screening: notification.data
            }
        }));
    };

    const showToastNotification = (notification) => {
        // You can use your existing toast system here
        // For example, if you're using sonner:
        if (window.toast) {
            window.toast.success(notification.message, {
                description: `Pasien: ${notification.patient_name}`,
                action: {
                    label: 'Lihat',
                    onClick: () => router.visit(`/dashboard/paramedis/screening/detail/${notification.id}`)
                }
            });
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            await axios.post('/api/notifications/mark-read', {
                notification_id: notificationId
            });

            setNotifications(prev =>
                prev.map(notif =>
                    notif.id === notificationId
                        ? { ...notif, read_at: new Date().toISOString() }
                        : notif
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.post('/api/notifications/mark-all-read');
            setNotifications(prev =>
                prev.map(notif => ({ ...notif, read_at: new Date().toISOString() }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const requestNotificationPermission = async () => {
        if ('Notification' in window && Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }
        return Notification.permission === 'granted';
    };

    useEffect(() => {
        // Request notification permission
        requestNotificationPermission();

        // Use polling only for now (more reliable)
        startPolling();

        // Cleanup on unmount
        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, []);

    return {
        notifications,
        unreadCount,
        isConnected,
        isLoading,
        markAsRead,
        markAllAsRead,
        fetchNotifications,
        requestNotificationPermission
    };
}; 