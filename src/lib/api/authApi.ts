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

    // TODO: Once backend is integrated, use this:
    // const response = await fetch('/api/auth/complete-onboarding', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${user.user_metadata.auth_token}`
    //   },
    //   body: JSON.stringify({
    //     sports: onboardingData.sports,
    //     role: onboardingData.role,
    //     teamId: onboardingData.teamId,
    //   })
    // });

    // For now, update user metadata locally
    const { error } = await supabase.auth.updateUser({
      data: {
        onboarding_completed: true,
        sports: onboardingData.sports,
        role: onboardingData.role,
        team_id: onboardingData.teamId,
      }
    });

    if (error) {
      throw error;
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

    // TODO: Once backend is integrated, use this:
    // const response = await fetch('/api/users/profile', {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${user.user_metadata.auth_token}`
    //   },
    //   body: JSON.stringify(profileData)
    // });
    // return response.json();

    // For now, update user metadata
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: profileData.full_name,
        phone: profileData.phone,
        sports: profileData.sports,
        role: profileData.role,
      }
    });

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error syncing user profile:', error);
    throw error;
  }
}
