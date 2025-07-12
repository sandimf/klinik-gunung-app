import { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';

export const useRealtimeScreenings = (initialData = []) => {
    const [screenings, setScreenings] = useState(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const pollingIntervalRef = useRef(null);

    // Fetch latest screening data
    const fetchScreenings = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('/api/paramedis/screenings', {
                timeout: 10000,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });

            if (response.data && response.data.data) {
                setScreenings(response.data.data);
                setLastUpdate(new Date());
            }
        } catch (error) {
            console.error('Error fetching screenings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Start polling for realtime updates
    const startPolling = () => {
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
        }

        // Initial fetch
        fetchScreenings();

        // Poll every 30 seconds for new screenings
        pollingIntervalRef.current = setInterval(() => {
            fetchScreenings();
        }, 30000);
    };

    // Stop polling
    const stopPolling = () => {
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
        }
    };

    // Handle new screening notification
    const handleNewScreening = (newScreening) => {
        setScreenings(prev => {
            // Add new screening to the beginning of the list
            const updated = [newScreening, ...prev];
            // Keep only the latest 50 screenings to prevent memory issues
            return updated.slice(0, 50);
        });
        setLastUpdate(new Date());
    };

    // Refresh data manually
    const refreshData = () => {
        fetchScreenings();
    };

    useEffect(() => {
        // Start polling when component mounts
        startPolling();

        // Listen for new screening notifications
        const handleNotification = (event) => {
            if (event.detail && event.detail.type === 'new_screening') {
                handleNewScreening(event.detail.screening);
            }
        };

        // Custom event listener for new screenings
        window.addEventListener('new-screening', handleNotification);

        // Cleanup on unmount
        return () => {
            stopPolling();
            window.removeEventListener('new-screening', handleNotification);
        };
    }, []);

    return {
        screenings,
        isLoading,
        lastUpdate,
        refreshData,
        startPolling,
        stopPolling
    };
}; 