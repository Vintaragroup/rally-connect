import { useState, useEffect } from 'react';

/**
 * Hook to detect online/offline status
 */
export function useOnline() {
  const [isOnline, setIsOnline] = useState(() => {
    // Check initial state
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  useEffect(() => {
    const handleOnline = () => {
      console.log('📡 Connection restored');
      setIsOnline(true);
    };

    const handleOffline = () => {
      console.log('📵 Connection lost');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
