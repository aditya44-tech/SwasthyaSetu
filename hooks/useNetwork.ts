'use client';

import { useState, useEffect, useCallback } from 'react';
import { syncPendingActions, getPendingCount } from '@/lib/offlineDB';

export function useNetwork() {
    const [isOnline, setIsOnline] = useState(true);
    const [pendingCount, setPendingCount] = useState(0);
    const [syncing, setSyncing] = useState(false);

    const refreshPending = useCallback(async () => {
        try {
            const count = await getPendingCount();
            setPendingCount(count);
        } catch { /* ignore */ }
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        setIsOnline(navigator.onLine);

        const goOnline = async () => {
            setIsOnline(true);
            // Auto-sync when we come back online
            setSyncing(true);
            try {
                await syncPendingActions();
                await refreshPending();
            } catch { /* ignore */ }
            setSyncing(false);
        };

        const goOffline = () => setIsOnline(false);

        window.addEventListener('online', goOnline);
        window.addEventListener('offline', goOffline);
        refreshPending();

        return () => {
            window.removeEventListener('online', goOnline);
            window.removeEventListener('offline', goOffline);
        };
    }, [refreshPending]);

    return { isOnline, pendingCount, syncing, refreshPending };
}
