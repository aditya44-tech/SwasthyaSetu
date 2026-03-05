'use client';

import { useNetwork } from '@/hooks/useNetwork';
import { Wifi, WifiOff, CloudUpload, Loader2 } from 'lucide-react';

export default function NetworkStatus() {
    const { isOnline, pendingCount, syncing } = useNetwork();

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold shadow-lg transition-all duration-300 ${isOnline
                        ? 'bg-[#34C759] text-white'
                        : 'bg-[#FF3B30] text-white'
                    }`}
            >
                {isOnline ? (
                    <>
                        {syncing ? (
                            <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                Syncing...
                            </>
                        ) : pendingCount > 0 ? (
                            <>
                                <CloudUpload className="w-3.5 h-3.5" />
                                {pendingCount} pending
                            </>
                        ) : (
                            <>
                                <Wifi className="w-3.5 h-3.5" />
                                Online
                            </>
                        )}
                    </>
                ) : (
                    <>
                        <WifiOff className="w-3.5 h-3.5" />
                        Offline Mode
                    </>
                )}
            </div>
        </div>
    );
}
