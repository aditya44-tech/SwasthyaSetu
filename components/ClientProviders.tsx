'use client';

import { useEffect, useState } from 'react';


export default function ClientProviders({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);

        if ('serviceWorker' in navigator) {
            if (process.env.NODE_ENV === 'production') {
                window.addEventListener('load', function () {
                    navigator.serviceWorker.register('/sw.js').then(
                        function (registration) {
                            console.log('Service Worker registration successful with scope: ', registration.scope);
                        },
                        function (err) {
                            console.log('Service Worker registration failed: ', err);
                        }
                    );
                });
            } else {
                // In development, unregister any existing service workers to prevent caching issues
                navigator.serviceWorker.getRegistrations().then(function (registrations) {
                    for (const registration of registrations) {
                        registration.unregister();
                        console.log('Service Worker unregistered for development');
                    }
                });
            }
        }
    }, []);

    return (
        <>
            {children}
        </>
    );
}
