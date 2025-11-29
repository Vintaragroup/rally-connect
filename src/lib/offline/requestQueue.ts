/**
 * Request Queue Management
 * Queues failed API requests when offline and retries when connection is restored
 * Provides robust offline-first experience with automatic sync
 */

export interface QueuedRequest {
  id: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: Record<string, any>;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

const QUEUE_KEY = 'offline_request_queue';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

/**
 * Request queue service
 */
export const requestQueue = {
  /**
   * Add request to queue
   */
  add(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', body?: Record<string, any>): string {
    try {
      const id = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const queue = this.getAll();

      const request: QueuedRequest = {
        id,
        endpoint,
        method,
        body,
        timestamp: Date.now(),
        retryCount: 0,
        maxRetries: MAX_RETRIES,
      };

      queue.push(request);
      localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));

      console.log(`📤 Request queued (${method} ${endpoint}): ${id}`);
      return id;
    } catch (error) {
      console.warn('Failed to queue request:', error);
      return '';
    }
  },

  /**
   * Get all queued requests
   */
  getAll(): QueuedRequest[] {
    try {
      const queued = localStorage.getItem(QUEUE_KEY);
      return queued ? JSON.parse(queued) : [];
    } catch (error) {
      console.warn('Failed to retrieve request queue:', error);
      return [];
    }
  },

  /**
   * Get specific queued request
   */
  get(id: string): QueuedRequest | null {
    const queue = this.getAll();
    return queue.find((req) => req.id === id) || null;
  },

  /**
   * Remove request from queue
   */
  remove(id: string): void {
    try {
      const queue = this.getAll();
      const filtered = queue.filter((req) => req.id !== id);
      localStorage.setItem(QUEUE_KEY, JSON.stringify(filtered));
      console.log(`✅ Request removed from queue: ${id}`);
    } catch (error) {
      console.warn('Failed to remove request from queue:', error);
    }
  },

  /**
   * Update request retry count
   */
  incrementRetry(id: string): boolean {
    try {
      const queue = this.getAll();
      const request = queue.find((req) => req.id === id);

      if (!request) return false;

      request.retryCount += 1;

      if (request.retryCount > request.maxRetries) {
        this.remove(id);
        console.warn(`❌ Request exceeded max retries: ${id}`);
        return false;
      }

      localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
      return true;
    } catch (error) {
      console.warn('Failed to increment retry count:', error);
      return false;
    }
  },

  /**
   * Clear entire queue
   */
  clear(): void {
    try {
      localStorage.removeItem(QUEUE_KEY);
      console.log('🗑️  Request queue cleared');
    } catch (error) {
      console.warn('Failed to clear request queue:', error);
    }
  },

  /**
   * Get queue status for debugging
   */
  getStatus(): {
    count: number;
    oldest?: {
      endpoint: string;
      age: number;
    };
  } {
    const queue = this.getAll();
    const oldest = queue[0];

    return {
      count: queue.length,
      oldest: oldest
        ? {
            endpoint: oldest.endpoint,
            age: Date.now() - oldest.timestamp,
          }
        : undefined,
    };
  },
};

/**
 * Retry handler for processing queued requests
 */
export async function retryQueuedRequests(apiRequest: (endpoint: string, options: RequestInit) => Promise<any>): Promise<void> {
  const queue = requestQueue.getAll();

  if (queue.length === 0) {
    return;
  }

  console.log(`🔄 Processing ${queue.length} queued requests...`);

  for (const request of queue) {
    try {
      const options: RequestInit = {
        method: request.method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (request.body) {
        options.body = JSON.stringify(request.body);
      }

      const response = await apiRequest(request.endpoint, options);

      if (response.status === 200 || response.status === 201) {
        requestQueue.remove(request.id);
        console.log(`✅ Queued request succeeded: ${request.method} ${request.endpoint}`);
      } else {
        const shouldRetry = requestQueue.incrementRetry(request.id);
        if (shouldRetry) {
          console.log(`🔁 Retrying request (${request.retryCount}/${request.maxRetries}): ${request.endpoint}`);
        }
      }
    } catch (error) {
      const shouldRetry = requestQueue.incrementRetry(request.id);
      if (shouldRetry) {
        console.log(`⚠️  Request retry failed, will try again: ${request.endpoint}`);
      } else {
        console.error(`❌ Request permanently failed: ${request.endpoint}`);
      }
    }

    // Add small delay between retries to avoid overwhelming server
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
  }

  console.log('✅ Queued request processing complete');
}
