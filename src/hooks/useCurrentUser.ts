import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export type UserRole = 'admin' | 'captain' | 'player';

export interface CurrentUser {
  id: string;
  email: string;
  displayName: string;
  roles: UserRole[];
  isAdmin: boolean;
  isCaptain: boolean;
  isPlayer: boolean;
  onboardingCompleted: boolean;
}

interface UseCurrentUserResult {
  user: CurrentUser | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

let userCache: CurrentUser | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Clear the user cache to force a refetch on next request
 * Use this after operations that change user state (e.g., onboarding completion)
 */
export function clearUserCache(): void {
  userCache = null;
  cacheTimestamp = 0;
  console.log('✓ User cache cleared');
}

/**
 * Hook to fetch current user with roles from backend
 * Caches result to avoid repeated API calls
 */
export function useCurrentUser(): UseCurrentUserResult {
  const { user: authUser, isLoading: authLoading } = useAuth();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    if (!authUser?.id || authLoading) {
      setLoading(false);
      return;
    }

    // Check cache validity
    const now = Date.now();
    if (userCache && now - cacheTimestamp < CACHE_DURATION) {
      console.log('✓ Using cached user data');
      setUser(userCache);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${apiUrl}/auth/me`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: authUser.id }),
      });

      if (response.ok) {
        const data = await response.json();
        
        console.log('📊 Raw API response from /auth/me:', {
          status: response.status,
          data: data,
          onboardingCompleted: data.onboardingCompleted,
        });
        
        // Transform backend response to CurrentUser
        const currentUser: CurrentUser = {
          id: authUser.id,
          email: authUser.email || '',
          displayName: data.displayName || authUser.user_metadata?.full_name || 'User',
          roles: data.roles || [],
          isAdmin: data.roles?.includes('admin') ?? false,
          isCaptain: data.roles?.includes('captain') ?? false,
          isPlayer: data.roles?.includes('player') ?? false,
          onboardingCompleted: data.onboardingCompleted ?? false,
        };

        console.log('✓ Fetched current user:', currentUser);
        userCache = currentUser;
        cacheTimestamp = now;
        setUser(currentUser);
      } else if (response.status === 404) {
        console.warn('⚠️ User not found in backend (404)');
        setUser(null);
        setError('User not found');
      } else {
        const errorText = await response.text();
        console.warn('⚠️ Failed to fetch user:', response.status, errorText);
        setError(`Failed to fetch user (${response.status})`);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('⚠️ Error fetching current user:', err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [authUser?.id, authLoading]);

  return { user, loading, error, refetch: fetchUser };
}
