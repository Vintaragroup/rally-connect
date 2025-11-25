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

  async getUserWithOnboardingStatus(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
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
          onboardingCompleted: false,
        };
      }

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        onboardingCompleted: (user as any).onboardingCompleted ?? false,
      };
    } catch (error) {
      console.error('❌ Error getting user with onboarding status:', error);
      throw error;
    }
  }

  async markOnboardingComplete(userId: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        // Cast to any to bypass Prisma type checking until client is regenerated
        ...(({ onboardingCompleted: true } as any)),
      },
    });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      onboardingCompleted: (user as any).onboardingCompleted ?? true,
    };
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
          // Cast to any to bypass Prisma type checking
          ...(({ onboardingCompleted: false } as any)),
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
}
