import { supabase } from '@/lib/supabase/client';

/**
 * Get current user's auth status and onboarding completion
 */
export async function fetchCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }

    // TODO: Once backend is integrated, fetch from /auth/me endpoint
    // const response = await fetch('/api/auth/me', {
    //   headers: { 'Authorization': `Bearer ${user.user_metadata.auth_token}` }
    // });
    // return response.json();

    // For now, return user with default onboarding status
    return {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || '',
      onboardingCompleted: user.user_metadata?.onboarding_completed ?? false,
      role: user.user_metadata?.role || 'player',
      isCaptain: user.user_metadata?.role === 'captain',
      isAdmin: user.user_metadata?.is_admin ?? false,
    };
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

/**
 * Mark onboarding as complete for current user
 */
export async function completeOnboarding(onboardingData: {
  sports: string[];
  role: 'player' | 'captain';
  teamId?: string;
  teamName?: string;
}) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('Not authenticated');
    }

    // Call backend to mark onboarding as complete
    const response = await fetch(`/api/auth/complete-onboarding`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        sports: onboardingData.sports,
        role: onboardingData.role,
        teamId: onboardingData.teamId,
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to complete onboarding');
    }

    // Also update user metadata in Supabase for local caching
    const { error } = await supabase.auth.updateUser({
      data: {
        onboarding_completed: true,
        sports: onboardingData.sports,
        role: onboardingData.role,
        team_id: onboardingData.teamId,
      }
    });

    if (error) {
      console.warn('Warning: Could not update Supabase metadata:', error);
      // Don't throw - backend update succeeded even if metadata update failed
    }

    console.log('✅ Onboarding marked as complete');
    return true;
  } catch (error) {
    console.error('Error completing onboarding:', error);
    throw error;
  }
}

/**
 * Sync user profile with backend database
 * This creates/updates the User record in the database
 */
export async function syncUserProfile(profileData: {
  full_name: string;
  phone?: string;
  sports: string[];
  role: 'player' | 'captain';
}) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('Not authenticated');
    }

    // Call backend to sync user to database
    const response = await fetch(`/api/auth/sync-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        email: user.email,
        fullName: profileData.full_name,
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to sync user');
    }

    const result = await response.json();
    console.log('✅ User synced with backend:', result);

    // Also update user metadata in Supabase for local caching
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: profileData.full_name,
        phone: profileData.phone,
        sports: profileData.sports,
        role: profileData.role,
      }
    });

    if (error) {
      console.warn('Warning: Could not update Supabase metadata:', error);
      // Don't throw - backend sync succeeded even if metadata update failed
    }

    return result;
  } catch (error) {
    console.error('Error syncing user profile:', error);
    throw error;
  }
}
