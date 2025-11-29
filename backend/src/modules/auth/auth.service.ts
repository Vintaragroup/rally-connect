import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  private supabase: any;

  constructor(private readonly prisma: PrismaService) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (supabaseUrl && supabaseServiceKey) {
      this.supabase = createClient(supabaseUrl, supabaseServiceKey);
    }
  }

  /**
   * Get user profile with onboarding status
   */
  async getUserProfile(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        onboardingCompleted: (user as any).onboardingCompleted ?? false,
      };
    } catch (error) {
      console.error('❌ Error getting user profile:', error);
      return null;
    }
  }

  async getUserWithOnboardingStatus(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          associationAdmin: true,
          captain: true,
          player: true,
        },
      });

      if (!user) {
        // User not found - return default incomplete onboarding status
        // This handles the case where sync might not have completed yet
        console.warn(`⚠️ User ${userId} not found in database, returning default incomplete status`);
        return {
          user: {
            id: userId,
            email: 'unknown',
            firstName: 'User',
            lastName: '',
            role: 'PLAYER',
          },
          roles: [],
          displayName: 'User',
          onboardingCompleted: false,
        };
      }

      // Determine roles based on relations and UserRole
      const roles: string[] = [];
      
      // Check if user is an admin
      if (user.associationAdmin || user.role === 'ADMIN') {
        roles.push('admin');
      }
      
      // Check if user is a captain
      if (user.captain || user.role === 'CAPTAIN') {
        roles.push('captain');
      }
      
      // Check if user is a player
      if (user.player || user.role === 'PLAYER') {
        roles.push('player');
      }
      
      // Ensure at least 'player' role if no others
      if (roles.length === 0) {
        roles.push('player');
      }

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        roles,
        displayName: `${user.firstName} ${user.lastName}`.trim() || user.email,
        onboardingCompleted: (user as any).onboardingCompleted ?? false,
      };
    } catch (error) {
      console.error('❌ Error getting user with onboarding status:', error);
      throw error;
    }
  }

  async markOnboardingComplete(userId: string, data?: any) {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: {
          onboardingCompleted: true,
          // Store additional onboarding data if provided
          ...(data?.sports && { sports: data.sports }),
          ...(data?.role && { role: data.role.toUpperCase() }),
        },
      });

      // TODO: Create corresponding Player or Captain record based on role
      // if (data?.role === 'captain' && data?.teamId) {
      //   await this.prisma.captain.create({
      //     data: {
      //       userId: user.id,
      //       teamId: data.teamId,
      //     },
      //   });
      // } else if (data?.role === 'player') {
      //   await this.prisma.player.create({
      //     data: {
      //       userId: user.id,
      //     },
      //   });
      // }

      // TODO: Emit analytics event
      // this.analyticsService.trackOnboardingComplete(user.id);

      console.log(`✓ Onboarding completed for user: ${userId}`);

      return {
        success: true,
        message: 'Onboarding completed',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          onboardingCompleted: user.onboardingCompleted,
        },
      };
    } catch (error) {
      console.error('❌ Error marking onboarding complete:', error);
      throw error;
    }
  }

  /**
   * Get or create user from Supabase OAuth token
   */
  async syncStackAuthUser(stackUserId: string, email: string, displayName: string) {
    const [firstName, lastName] = displayName.split(' ');

    try {
      // First, check if user exists by email (from previous auth attempts)
      const existingUserByEmail = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUserByEmail) {
        // User exists with this email - update their ID to match Supabase ID
        const user = await this.prisma.user.update({
          where: { email },
          data: {
            id: stackUserId,
            firstName: firstName || displayName,
            lastName: lastName || '',
          },
        });

        console.log(`✓ User synced (existing email): ${stackUserId} (${email})`);

        return {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
          onboardingCompleted: (user as any).onboardingCompleted ?? false,
        };
      }

      // No existing user, create new one
      const user = await this.prisma.user.create({
        data: {
          id: stackUserId,
          email,
          firstName: firstName || displayName,
          lastName: lastName || '',
          password: '', // OAuth users don't have local passwords
          onboardingCompleted: false,
        },
      });

      console.log(`✓ User synced (new): ${stackUserId} (${email})`);

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        onboardingCompleted: (user as any).onboardingCompleted ?? false,
      };
    } catch (error) {
      console.error('❌ Error syncing user:', error);
      throw error;
    }
  }

  /**
   * Confirm user email in Supabase
   * This allows users to sign in without email verification
   */
  async confirmUserEmail(email: string) {
    if (!this.supabase) {
      console.warn('⚠️ Supabase admin client not configured');
      return { success: false, message: 'Supabase not configured' };
    }

    try {
      // First, find the user by email
      const { data: { users }, error: listError } = await this.supabase.auth.admin.listUsers();
      
      if (listError) {
        console.warn(`⚠️ Failed to list users:`, listError);
        return { success: false, message: listError.message };
      }

      const user = users.find((u: any) => u.email === email);
      if (!user) {
        console.warn(`⚠️ User not found with email: ${email}`);
        return { success: false, message: 'User not found' };
      }

      // Now update the user to confirm email
      const { data, error } = await this.supabase.auth.admin.updateUserById(user.id, {
        email_confirm: true
      });

      if (error) {
        console.warn(`⚠️ Failed to confirm email for ${email}:`, error);
        return { success: false, message: error.message };
      }

      console.log(`✓ Email confirmed for ${email}`);
      return { success: true, message: 'Email confirmed', userId: user.id };
    } catch (err) {
      console.error('❌ Error confirming email:', err);
      return { success: false, message: String(err) };
    }
  }

  async findUserByEmail(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      };
    } catch (error) {
      console.error('❌ Error finding user by email:', error);
      return null;
    }
  }

  /**
   * Update user profile data (called after onboarding)
   */
  async updateUserProfile(userId: string, data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    sports?: string[];
    role?: string;
  }) {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: {
          firstName: data.firstName || undefined,
          lastName: data.lastName || undefined,
          // Store additional profile fields if schema supports them
          ...(data.sports && { sports: data.sports }),
          ...(data.role && { role: data.role.toUpperCase() }),
        },
      });

      console.log(`✓ User profile updated: ${userId}`);

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      };
    } catch (error) {
      console.error('❌ Error updating user profile:', error);
      throw error;
    }
  }
}