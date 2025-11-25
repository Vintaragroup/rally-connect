/**
 * Rally-connect API Service
 * Centralized API client for frontend communication with backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4800';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`API Request failed: ${endpoint}`, errorMessage);
      return { error: errorMessage, status: 0 };
    }
  }

  // Health Check
  async getHealth() {
    return this.request('/health');
  }

  // Sports
  async getSports() {
    return this.request('/sports');
  }

  // Leagues
  async getLeagues() {
    return this.request('/leagues');
  }

  async getLeague(id: string) {
    return this.request(`/leagues/${id}`);
  }

  // Teams
  async getTeams() {
    return this.request('/teams');
  }

  async getTeam(id: string) {
    return this.request(`/teams/${id}`);
  }

  // Players
  async getPlayers() {
    return this.request('/players');
  }

  async getPlayer(id: string) {
    return this.request(`/players/${id}`);
  }

  // Matches
  async getMatches() {
    return this.request('/matches');
  }

  async getMatch(id: string) {
    return this.request(`/matches/${id}`);
  }

  // Standings
  async getStandings() {
    return this.request('/standings');
  }

  async getStandingsByDivision(divisionId: string) {
    return this.request(`/standings/division/${divisionId}`);
  }
}

export const apiService = new ApiService();
