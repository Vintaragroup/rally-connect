import { useStackApp } from "@/lib/stack";
import { useEffect, useState, useCallback } from "react";

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: {
    id: string;
    email: string;
    displayName: string;
  } | null;
  onboardingCompleted: boolean;
}

// Global ref to store refetch function so markOnboardingComplete can call it
let refetchAuthState: (() => Promise<void>) | null = null;

/**
 * Hook to manage authentication state
 * Returns user info and onboarding completion status
 * Fetches onboarding status from backend API
 */
export function useAuth(): AuthState {
  const stackApp = useStackApp();
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    onboardingCompleted: false,
  });

  const loadAuthState = useCallback(async () => {
    try {
      const user = await stackApp.getUser();

      if (user) {
        // First, sync user to backend database
        let onboardingStatus = false;
        try {
          // Determine API URL - works in both dev and Docker environments
          // In browser, backend is at localhost:4800
          // In Docker internal network, it would be rally-backend:4000 but we can't reach that from browser
          const getApiUrl = () => {
            const envUrl = import.meta.env.VITE_API_URL;
            // If env var is set, use it (for dev/build-time config)
            if (envUrl && envUrl !== "http://rally-backend:4000") {
              return envUrl;
            }
            // Otherwise, derive from current location (works in browser)
            // Browser always needs localhost:4800 to reach the backend
            return "http://localhost:4800";
          };

          const apiUrl = getApiUrl();
          const syncResponse = await fetch(
            `${apiUrl}/auth/sync-user`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                stackUserId: user.id,
                email: user.primaryEmail,
                displayName: user.displayName,
              }),
            }
          );

          // Check if response contains onboarding status
          if (syncResponse.ok) {
            const syncData = await syncResponse.json();
            onboardingStatus = syncData.onboardingCompleted ?? false;
          }
        } catch (syncErr) {
          console.warn("Failed to sync user to backend:", syncErr);
        }

        // User is authenticated via Stack Auth
        setState({
          isAuthenticated: true,
          isLoading: false,
          user: {
            id: user.id || "",
            email: user.primaryEmail || "",
            displayName: user.displayName || "",
          },
          onboardingCompleted: onboardingStatus,
        });
      } else {
        setState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          onboardingCompleted: false,
        });
      }
    } catch (error) {
      console.warn("Auth state load error:", error);
      setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        onboardingCompleted: false,
      });
    }
  }, [stackApp]);

  // Store the refetch function globally so markOnboardingComplete can call it
  useEffect(() => {
    refetchAuthState = loadAuthState;
  }, [loadAuthState]);

  useEffect(() => {
    loadAuthState();
  }, [loadAuthState]);

  return state;
}

/**
 * Mark onboarding as complete on the backend
 * After API succeeds, refetches auth state to update onboardingCompleted flag
 */
export async function markOnboardingComplete(userId: string): Promise<void> {
  // Determine API URL - works in both dev and Docker environments
  const getApiUrl = () => {
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl && envUrl !== "http://rally-backend:4000") {
      return envUrl;
    }
    return "http://localhost:4800";
  };

  const apiUrl = getApiUrl();
  const response = await fetch(
    `${apiUrl}/auth/complete-onboarding`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to mark onboarding as complete");
  }

  // After API succeeds, refetch auth state so React re-renders with updated onboardingCompleted
  if (refetchAuthState) {
    await refetchAuthState();
  }
}
