/**
 * Offline Service
 * Coordinates offline caching, request queuing, and real-time feature management
 * Provides a unified interface for offline-first application behavior
 */

import { offlineCache } from './cache';
import { requestQueue } from './requestQueue';

/**
 * Offline service status
 */
export interface OfflineStatus {
  isOnline: boolean;
  hasCache: boolean;
  queuedRequests: number;
  cacheStatus: {
    matches: boolean;
    standings: boolean;
    teams: boolean;
    players: boolean;
    leagues: boolean;
    sports: boolean;
  };
}

/**
 * Features that should be disabled when offline
 */
export interface DisabledFeatures {
  realtime: boolean;
  liveScores: boolean;
  instantMessages: boolean;
  matchCreation: boolean;
  teamManagement: boolean;
}

/**
 * Offline service
 */
export const offlineService = {
  /**
   * Get current offline status
   */
  getStatus(isOnline: boolean): OfflineStatus {
    const queueStatus = requestQueue.getStatus();
    const cacheStatus = offlineCache.getStatus();

    return {
      isOnline,
      hasCache: Object.values(cacheStatus).some((v) => v),
      queuedRequests: queueStatus.count,
      cacheStatus,
    };
  },

  /**
   * Get disabled features based on offline status
   */
  getDisabledFeatures(isOnline: boolean): DisabledFeatures {
    return {
      realtime: !isOnline,
      liveScores: !isOnline,
      instantMessages: !isOnline,
      matchCreation: !isOnline,
      teamManagement: !isOnline,
    };
  },

  /**
   * Check if a specific feature is available
   */
  isFeatureAvailable(feature: keyof DisabledFeatures, isOnline: boolean): boolean {
    const disabled = this.getDisabledFeatures(isOnline);
    return !disabled[feature];
  },

  /**
   * Get user-friendly offline message
   */
  getOfflineMessage(context?: string): string {
    const baseMessage = 'You are currently offline';

    const messages: Record<string, string> = {
      matches: `${baseMessage}. Showing cached matches. New matches will sync when online.`,
      standings: `${baseMessage}. Showing cached standings. Standings will update when online.`,
      teams: `${baseMessage}. Showing cached teams. Team changes will sync when online.`,
      messages: `${baseMessage}. Messages will send when connection is restored.`,
      matches_create: `${baseMessage}. You can't create matches while offline.`,
      general: `${baseMessage}. Some features are limited. Changes will sync when online.`,
    };

    return messages[context || 'general'] || baseMessage;
  },

  /**
   * Clear all offline data (for logout or cache reset)
   */
  clearAll(): void {
    offlineCache.clearAll();
    requestQueue.clear();
    console.log('🗑️  All offline data cleared');
  },

  /**
   * Get debug information
   */
  getDebugInfo(isOnline: boolean): string {
    const status = this.getStatus(isOnline);
    const queueStatus = requestQueue.getStatus();

    return `
╔════════════════════════════════════╗
║       OFFLINE DEBUG INFO           ║
╠════════════════════════════════════╣
║ Online Status: ${isOnline ? '🟢' : '🔴'} ${isOnline ? 'Online' : 'Offline'}
║ Has Cache: ${status.hasCache ? '✅' : '❌'}
║ Queued Requests: ${status.queuedRequests}
║ Cache Status:
║   - Matches: ${status.cacheStatus.matches ? '✅' : '❌'}
║   - Standings: ${status.cacheStatus.standings ? '✅' : '❌'}
║   - Teams: ${status.cacheStatus.teams ? '✅' : '❌'}
║   - Players: ${status.cacheStatus.players ? '✅' : '❌'}
║   - Leagues: ${status.cacheStatus.leagues ? '✅' : '❌'}
║   - Sports: ${status.cacheStatus.sports ? '✅' : '❌'}
║ Request Queue: ${status.queuedRequests} requests
${
  queueStatus.oldest
    ? `║ Oldest Request: ${queueStatus.oldest.endpoint} (${Math.round(queueStatus.oldest.age / 1000)}s ago)
`
    : ''
}║ Disabled Features:
║   - Realtime: ${!this.isFeatureAvailable('realtime', isOnline) ? '❌' : '✅'}
║   - Live Scores: ${!this.isFeatureAvailable('liveScores', isOnline) ? '❌' : '✅'}
║   - Messages: ${!this.isFeatureAvailable('instantMessages', isOnline) ? '❌' : '✅'}
║   - Match Creation: ${!this.isFeatureAvailable('matchCreation', isOnline) ? '❌' : '✅'}
║   - Team Management: ${!this.isFeatureAvailable('teamManagement', isOnline) ? '❌' : '✅'}
╚════════════════════════════════════╝
    `.trim();
  },
};

// Log debug info when offline
if (typeof window !== 'undefined') {
  window.addEventListener('offline', () => {
    console.log(offlineService.getDebugInfo(false));
  });
}
