/**
 * Offline Cache Management
 * Persists API responses to localStorage for offline access
 * Provides fallback data when network is unavailable
 */

const CACHE_KEYS = {
  MATCHES: 'offline_matches',
  STANDINGS: 'offline_standings',
  TEAMS: 'offline_teams',
  PLAYERS: 'offline_players',
  LEAGUES: 'offline_leagues',
  SPORTS: 'offline_sports',
  USER_TEAMS: 'offline_user_teams',
  USER_PROFILE: 'offline_user_profile',
  TIMESTAMP: 'offline_cache_timestamp',
} as const;

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Cache entry with metadata
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * Check if cache entry is still valid
 */
function isCacheValid(timestamp: number): boolean {
  const now = Date.now();
  return now - timestamp < CACHE_DURATION;
}

/**
 * Offline cache service
 */
export const offlineCache = {
  /**
   * Matches
   */
  setMatches(data: any): void {
    try {
      const entry: CacheEntry<any> = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEYS.MATCHES, JSON.stringify(entry));
    } catch (error) {
      console.warn('Failed to cache matches:', error);
    }
  },

  getMatches(): any[] {
    try {
      const cached = localStorage.getItem(CACHE_KEYS.MATCHES);
      if (!cached) return [];

      const entry: CacheEntry<any> = JSON.parse(cached);
      if (!isCacheValid(entry.timestamp)) {
        localStorage.removeItem(CACHE_KEYS.MATCHES);
        return [];
      }

      return entry.data || [];
    } catch (error) {
      console.warn('Failed to retrieve matches from cache:', error);
      return [];
    }
  },

  /**
   * Standings / Leaderboard
   */
  setStandings(data: any): void {
    try {
      const entry: CacheEntry<any> = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEYS.STANDINGS, JSON.stringify(entry));
    } catch (error) {
      console.warn('Failed to cache standings:', error);
    }
  },

  getStandings(): any[] {
    try {
      const cached = localStorage.getItem(CACHE_KEYS.STANDINGS);
      if (!cached) return [];

      const entry: CacheEntry<any> = JSON.parse(cached);
      if (!isCacheValid(entry.timestamp)) {
        localStorage.removeItem(CACHE_KEYS.STANDINGS);
        return [];
      }

      return entry.data || [];
    } catch (error) {
      console.warn('Failed to retrieve standings from cache:', error);
      return [];
    }
  },

  /**
   * Teams
   */
  setTeams(data: any): void {
    try {
      const entry: CacheEntry<any> = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEYS.TEAMS, JSON.stringify(entry));
    } catch (error) {
      console.warn('Failed to cache teams:', error);
    }
  },

  getTeams(): any[] {
    try {
      const cached = localStorage.getItem(CACHE_KEYS.TEAMS);
      if (!cached) return [];

      const entry: CacheEntry<any> = JSON.parse(cached);
      if (!isCacheValid(entry.timestamp)) {
        localStorage.removeItem(CACHE_KEYS.TEAMS);
        return [];
      }

      return entry.data || [];
    } catch (error) {
      console.warn('Failed to retrieve teams from cache:', error);
      return [];
    }
  },

  /**
   * User's Teams
   */
  setUserTeams(userId: string, data: any): void {
    try {
      const entry: CacheEntry<any> = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(`${CACHE_KEYS.USER_TEAMS}_${userId}`, JSON.stringify(entry));
    } catch (error) {
      console.warn('Failed to cache user teams:', error);
    }
  },

  getUserTeams(userId: string): any[] {
    try {
      const cached = localStorage.getItem(`${CACHE_KEYS.USER_TEAMS}_${userId}`);
      if (!cached) return [];

      const entry: CacheEntry<any> = JSON.parse(cached);
      if (!isCacheValid(entry.timestamp)) {
        localStorage.removeItem(`${CACHE_KEYS.USER_TEAMS}_${userId}`);
        return [];
      }

      return entry.data || [];
    } catch (error) {
      console.warn('Failed to retrieve user teams from cache:', error);
      return [];
    }
  },

  /**
   * Players
   */
  setPlayers(data: any): void {
    try {
      const entry: CacheEntry<any> = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEYS.PLAYERS, JSON.stringify(entry));
    } catch (error) {
      console.warn('Failed to cache players:', error);
    }
  },

  getPlayers(): any[] {
    try {
      const cached = localStorage.getItem(CACHE_KEYS.PLAYERS);
      if (!cached) return [];

      const entry: CacheEntry<any> = JSON.parse(cached);
      if (!isCacheValid(entry.timestamp)) {
        localStorage.removeItem(CACHE_KEYS.PLAYERS);
        return [];
      }

      return entry.data || [];
    } catch (error) {
      console.warn('Failed to retrieve players from cache:', error);
      return [];
    }
  },

  /**
   * Leagues
   */
  setLeagues(data: any): void {
    try {
      const entry: CacheEntry<any> = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEYS.LEAGUES, JSON.stringify(entry));
    } catch (error) {
      console.warn('Failed to cache leagues:', error);
    }
  },

  getLeagues(): any[] {
    try {
      const cached = localStorage.getItem(CACHE_KEYS.LEAGUES);
      if (!cached) return [];

      const entry: CacheEntry<any> = JSON.parse(cached);
      if (!isCacheValid(entry.timestamp)) {
        localStorage.removeItem(CACHE_KEYS.LEAGUES);
        return [];
      }

      return entry.data || [];
    } catch (error) {
      console.warn('Failed to retrieve leagues from cache:', error);
      return [];
    }
  },

  /**
   * Sports
   */
  setSports(data: any): void {
    try {
      const entry: CacheEntry<any> = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEYS.SPORTS, JSON.stringify(entry));
    } catch (error) {
      console.warn('Failed to cache sports:', error);
    }
  },

  getSports(): any[] {
    try {
      const cached = localStorage.getItem(CACHE_KEYS.SPORTS);
      if (!cached) return [];

      const entry: CacheEntry<any> = JSON.parse(cached);
      if (!isCacheValid(entry.timestamp)) {
        localStorage.removeItem(CACHE_KEYS.SPORTS);
        return [];
      }

      return entry.data || [];
    } catch (error) {
      console.warn('Failed to retrieve sports from cache:', error);
      return [];
    }
  },

  /**
   * User Profile
   */
  setUserProfile(userId: string, data: any): void {
    try {
      const entry: CacheEntry<any> = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(`${CACHE_KEYS.USER_PROFILE}_${userId}`, JSON.stringify(entry));
    } catch (error) {
      console.warn('Failed to cache user profile:', error);
    }
  },

  getUserProfile(userId: string): any {
    try {
      const cached = localStorage.getItem(`${CACHE_KEYS.USER_PROFILE}_${userId}`);
      if (!cached) return null;

      const entry: CacheEntry<any> = JSON.parse(cached);
      if (!isCacheValid(entry.timestamp)) {
        localStorage.removeItem(`${CACHE_KEYS.USER_PROFILE}_${userId}`);
        return null;
      }

      return entry.data || null;
    } catch (error) {
      console.warn('Failed to retrieve user profile from cache:', error);
      return null;
    }
  },

  /**
   * Clear all offline cache
   */
  clearAll(): void {
    try {
      Object.values(CACHE_KEYS).forEach((key) => {
        if (key !== 'offline_cache_timestamp') {
          localStorage.removeItem(key);
        }
      });
      // Also clear any user-specific keys
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('offline_user_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear offline cache:', error);
    }
  },

  /**
   * Get cache status for debugging
   */
  getStatus(): {
    matches: boolean;
    standings: boolean;
    teams: boolean;
    players: boolean;
    leagues: boolean;
    sports: boolean;
  } {
    return {
      matches: !!localStorage.getItem(CACHE_KEYS.MATCHES),
      standings: !!localStorage.getItem(CACHE_KEYS.STANDINGS),
      teams: !!localStorage.getItem(CACHE_KEYS.TEAMS),
      players: !!localStorage.getItem(CACHE_KEYS.PLAYERS),
      leagues: !!localStorage.getItem(CACHE_KEYS.LEAGUES),
      sports: !!localStorage.getItem(CACHE_KEYS.SPORTS),
    };
  },
};
