import { useEffect, useState } from "react";

interface OnboardingStatusResponse {
  onboardingCompleted: boolean;
  userId: string;
  email?: string;
}

/**
 * Service for backend authentication endpoints
 * Handles communication with /auth/me and /auth/complete-onboarding
 */

export const authApi = {
  /**
   * Check if user has completed onboarding
   * GET /api/auth/me
   */
  async getAuthStatus(): Promise<OnboardingStatusResponse | null> {
    try {
      // TODO: Wire this to actual backend endpoint
      // const response = await fetch('/api/auth/me', {
      //   headers: {
      //     'Authorization': `Bearer ${supabaseToken}`,
      //   },
      // });
      
      // For now, return null to indicate endpoint not yet available
      console.warn("⚠️ /api/auth/me endpoint not yet available");
      return null;
    } catch (err) {
      console.error("Failed to fetch auth status:", err);
      return null;
    }
  },

  /**
   * Mark onboarding as complete
   * POST /api/auth/complete-onboarding
   */
  async completeOnboarding(data: {
    userId: string;
    sports: string[];
    role: "player" | "captain";
    teamId?: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      // TODO: Wire this to actual backend endpoint
      // const response = await fetch('/api/auth/complete-onboarding', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${supabaseToken}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(data),
      // });

      // For now, mock the response
      console.warn("⚠️ /api/auth/complete-onboarding endpoint not yet wired");
      
      // Store in localStorage as fallback until backend is ready
      localStorage.setItem("onboardingCompleted", JSON.stringify({
        timestamp: new Date().toISOString(),
        data,
      }));

      return { success: true };
    } catch (err) {
      console.error("Failed to complete onboarding:", err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : "Unknown error" 
      };
    }
  },
};

/**
 * Hook to check onboarding status on mount
 * Will integrate with backend /auth/me once available
 */
export function useOnboardingStatus() {
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        // TODO: Replace with actual backend call
        // const status = await authApi.getAuthStatus();
        // if (status) {
        //   setOnboardingCompleted(status.onboardingCompleted);
        // }

        // For now, check localStorage as fallback
        const stored = localStorage.getItem("onboardingCompleted");
        if (stored) {
          setOnboardingCompleted(true);
        }
      } catch (err) {
        console.error("Error checking onboarding status:", err);
      } finally {
        setIsChecking(false);
      }
    };

    checkStatus();
  }, []);

  return { onboardingCompleted, isChecking };
}
