import { AlertCircle, Wifi, CheckCircle } from 'lucide-react';
import { useOnline } from '@/hooks/useOnline';
import { useEffect, useState } from 'react';
import { requestQueue } from '@/lib/offline/requestQueue';

export function OfflineBanner() {
  const isOnline = useOnline();
  const [queuedCount, setQueuedCount] = useState(0);

  useEffect(() => {
    // Update queued request count
    const updateQueue = () => {
      const queue = requestQueue.getStatus();
      setQueuedCount(queue.count);
    };

    updateQueue();
    const interval = setInterval(updateQueue, 500);

    return () => clearInterval(interval);
  }, []);

  if (isOnline && queuedCount === 0) return null;

  if (!isOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-amber-50 border-b border-amber-200 px-4 py-3">
        <div className="flex items-center gap-3 max-w-6xl mx-auto">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-900">
              You're currently offline - some features may be limited
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              We'll reconnect automatically when your connection is restored
            </p>
          </div>
          <Wifi className="w-4 h-4 text-amber-600 flex-shrink-0 animate-pulse" />
        </div>
      </div>
    );
  }

  // Show syncing status when reconnected with queued requests
  if (isOnline && queuedCount > 0) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-blue-50 border-b border-blue-200 px-4 py-3">
        <div className="flex items-center gap-3 max-w-6xl mx-auto">
          <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 animate-pulse" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900">
              Syncing {queuedCount} {queuedCount === 1 ? 'change' : 'changes'}...
            </p>
            <p className="text-xs text-blue-700 mt-0.5">
              Your changes are being saved to the server
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

