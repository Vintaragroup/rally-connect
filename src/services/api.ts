/**
 * Rally-connect API Service
 * Centralized API client for frontend communication with backend
 * Handles authentication via Supabase JWT tokens
 * Includes offline caching and request queuing for offline-first experience
 */

import { supabase } from '../lib/supabase/client';
import { offlineCache } from '../lib/offline/cache';
import { requestQueue, retryQueuedRequests } from '../lib/offline/requestQueue';

// Use relative path for API calls so it works from any domain/IP
// The backend is served through nginx at /api/
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

class ApiService {
  private baseUrl: string;
  private isOnline: boolean = navigator.onLine;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.setupOnlineStatusListener();
  }

  /**
   * Setup listener for online/offline status changes
   */
  private setupOnlineStatusListener(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('🟢 Connection restored, processing queued requests...');
      this.processQueuedRequests();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('🔴 Connection lost, requests will be queued');
    });
  }

  /**
   * Process queued requests when connection is restored
   */
  private async processQueuedRequests(): Promise<void> {
    await retryQueuedRequests((endpoint: string, options: RequestInit) =>
      this.request(endpoint, options)
    );
  }

  /**
   * Get current auth token from Supabase session
   */
  private async getAuthToken(): Promise<string | null> {
    const { data } = await supabase.auth.getSession();
    return data?.session?.access_token || null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      
      // Get auth token and add to headers
      const token = await this.getAuthToken();
      const headers = new Headers({
        'Content-Type': 'application/json',
      });
      
      if (options.headers) {
        if (options.headers instanceof Headers) {
          options.headers.forEach((value, key) => headers.set(key, value));
        } else if (typeof options.headers === 'object') {
          Object.entries(options.headers).forEach(([key, value]) => {
            if (typeof value === 'string') headers.set(key, value);
          });
        }
      }
      
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle 401 - token may be expired
      if (response.status === 401) {
        console.warn('API: Unauthorized (401) - token may have expired');
        // Could trigger re-login here if needed
      }

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorBody}`);
      }

      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`API Request failed: ${endpoint}`, errorMessage);

      // If offline and it's a GET request, try to use cached data
      if (!this.isOnline && options.method !== 'POST' && options.method !== 'PUT' && options.method !== 'DELETE') {
        return { error: errorMessage, status: 0 };
      }

      // For POST/PUT/DELETE requests when offline, queue the request
      if (!this.isOnline) {
        const method = (options.method || 'GET') as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
        requestQueue.add(endpoint, method, options.body ? JSON.parse(options.body as string) : undefined);
      }

      return { error: errorMessage, status: 0 };
    }
  }

  // Health Check
  async getHealth() {
    return this.request('/health');
  }

  // Sports
  async getSports() {
    const response = await this.request('/sports');
    if (response.data) {
      offlineCache.setSports(response.data);
      return response;
    }
    // If offline or error, try cached data
    const cached = offlineCache.getSports();
    if (cached.length > 0) {
      console.log('📦 Using cached sports data');
      return { data: cached, status: 200 };
    }
    return response;
  }

  // Leagues
  async getLeagues() {
    const response = await this.request('/leagues');
    if (response.data) {
      offlineCache.setLeagues(response.data);
      return response;
    }
    const cached = offlineCache.getLeagues();
    if (cached.length > 0) {
      console.log('📦 Using cached leagues data');
      return { data: cached, status: 200 };
    }
    return response;
  }

  async getLeague(id: string) {
    return this.request(`/leagues/${id}`);
  }

  // Auth
  async getUserProfile(userId: string) {
    return this.request('/auth/profile', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  // Teams
  async getTeams() {
    const response = await this.request('/teams');
    if (response.data) {
      offlineCache.setTeams(response.data);
      return response;
    }
    const cached = offlineCache.getTeams();
    if (cached.length > 0) {
      console.log('📦 Using cached teams data');
      return { data: cached, status: 200 };
    }
    return response;
  }

  async getUserTeams(userId: string) {
    const response = await this.request(`/teams?userId=${userId}`);
    if (response.data) {
      offlineCache.setUserTeams(userId, response.data);
      return response;
    }
    const cached = offlineCache.getUserTeams(userId);
    if (cached.length > 0) {
      console.log('📦 Using cached user teams data');
      return { data: cached, status: 200 };
    }
    return response;
  }

  async getTeam(id: string) {
    return this.request(`/teams/${id}`);
  }

  async createTeam(data: {
    name: string;
    sport: string;
    club?: string;
    userId: string;
  }) {
    return this.request('/teams', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Players
  async getPlayers() {
    const response = await this.request('/players');
    if (response.data) {
      offlineCache.setPlayers(response.data);
      return response;
    }
    const cached = offlineCache.getPlayers();
    if (cached.length > 0) {
      console.log('📦 Using cached players data');
      return { data: cached, status: 200 };
    }
    return response;
  }

  async getPlayer(id: string) {
    return this.request(`/players/${id}`);
  }

  // Matches
  async getMatches() {
    const response = await this.request('/matches');
    if (response.data) {
      offlineCache.setMatches(response.data);
      return response;
    }
    const cached = offlineCache.getMatches();
    if (cached.length > 0) {
      console.log('📦 Using cached matches data');
      return { data: cached, status: 200 };
    }
    return response;
  }

  async getMatch(id: string) {
    return this.request(`/matches/${id}`);
  }

  // Standings
  async getStandings() {
    const response = await this.request('/standings');
    if (response.data) {
      offlineCache.setStandings(response.data);
      return response;
    }
    const cached = offlineCache.getStandings();
    if (cached.length > 0) {
      console.log('📦 Using cached standings data');
      return { data: cached, status: 200 };
    }
    return response;
  }

  async getStandingsByDivision(divisionId: string) {
    return this.request(`/standings/division/${divisionId}`);
  }
}

export const apiService = new ApiService();
