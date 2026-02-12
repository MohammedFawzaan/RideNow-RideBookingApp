import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const NetworkStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            toast.success('You are back online!');
        };

        const handleOffline = () => {
            setIsOnline(false);
            toast.error('You are offline. Check your internet connection.');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (isOnline) return null;

    return (
        <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-center p-2 z-50 font-semibold shadow-md">
            You are currently offline. Some features may not work.
        </div>
    );
};

export default NetworkStatus;
