'use client';

import { useEffect, useState } from 'react';
import NetworkStatus from './NetworkStatus';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    return (
        <>
            {children}
            {mounted && <NetworkStatus />}
        </>
    );
}
