import { useEffect, useState } from "react";

export function useCashierRealtimeNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isConnected, setIsConnected] = useState(false);

    // Fetch notifikasi dari API saat mount
    useEffect(() => {
        fetch("/dashboard/cashier/notifications", {
            headers: { "Accept": "application/json" },
            credentials: "same-origin"
        })
            .then(res => res.json())
            .then(data => {
                setNotifications(data || []);
                setUnreadCount((data || []).filter(n => !n.read_at).length);
            });
    }, []);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080/ws");
        ws.onopen = () => setIsConnected(true);
        ws.onclose = () => setIsConnected(false);
        ws.onerror = () => setIsConnected(false);
        ws.onmessage = (event) => {
            let data;
            try {
                data = JSON.parse(event.data);
            } catch {
                data = { message: event.data };
            }
            if (data.notification_type === "physical_exam_done") {
                setNotifications((prev) => [data, ...prev]);
                setUnreadCount((count) => count + 1);
                if (window.toast) {
                    window.toast.success(data.message || "Notifikasi baru", {
                        description: data.patient_name ? `Pasien: ${data.patient_name}` : undefined
                    });
                }
            }
        };
        return () => ws.close();
    }, []);

    const markAllAsRead = () => {
        const csrfToken = document.querySelector('meta[name=\"csrf-token\"]').getAttribute('content');
        fetch("/dashboard/cashier/notifications/mark-all-read", {
            method: "POST",
            headers: { "Accept": "application/json", "X-CSRF-TOKEN": csrfToken },
            credentials: "same-origin"
        }).then(() => {
            const now = new Date().toISOString();
            setNotifications((prev) => prev.map(n => ({ ...n, read_at: now })));
            setUnreadCount(0);
        });
    };

    return { notifications, unreadCount, isConnected, markAllAsRead };
} 