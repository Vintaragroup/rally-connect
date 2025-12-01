import { Controller, Get, Post, Body, Headers, BadRequestException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

// TODO: Implement JWT Guard
// import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * GET /auth/me
   * Get current user's profile and onboarding status
   * 
   * @returns { onboardingCompleted: boolean, userId: string, email: string }
   * 
   * PRODUCTION: Add @UseGuards(JwtAuthGuard) when JWT guard is implemented
   */
  @Post('me')
  async getCurrentUser(@Body() body: { userId: string }) {
    if (!body.userId) {
      throw new BadRequestException('userId is required');
    }
    return this.authService.getUserWithOnboardingStatus(body.userId);
  }

  /**
   * POST /auth/complete-onboarding
   * Mark onboarding as complete for a user
   * 
   * @param userId - Supabase user ID
   * @returns { success: boolean, message: string }
   * 
   * PRODUCTION CHECKLIST:
   * - [ ] Add @UseGuards(JwtAuthGuard) for authentication
   * - [ ] Validate userId matches authenticated user
   * - [ ] Store user sports selections
   * - [ ] Store user role (player/captain)
   * - [ ] Create corresponding Player or Captain record
   * - [ ] Emit event for analytics tracking
   * - [ ] Return 400 if user already completed onboarding
   */
  @Post('complete-onboarding')
  async completeOnboarding(@Body() body: { 
    userId: string;
    sports?: string[];
    role?: 'player' | 'captain';
    teamId?: string;
  }) {
    if (!body.userId) {
      throw new BadRequestException('userId is required');
    }
    return this.authService.markOnboardingComplete(body.userId, body);
  }

  /**
   * POST /auth/sync-user
   * Internal endpoint - sync Supabase user to local database
   * 
   * PRODUCTION: This should only be called by server-side functions or webhooks
   */
  @Post('sync-user')
  async syncUser(@Body() body: { stackUserId?: string; userId?: string; email: string; displayName?: string; fullName?: string }) {
    // Support both stackUserId and userId for backward compatibility
    const stackUserId = body.stackUserId || body.userId;
    const displayName = body.displayName || body.fullName;
    
    if (!stackUserId || !body.email) {
      throw new BadRequestException('stackUserId (or userId) and email are required');
    }
    return this.authService.syncStackAuthUser(stackUserId, body.email, displayName || '');
  }

  /**
   * POST /auth/profile
   * Get user profile by ID
   */
  @Post('profile')
  async getUserProfile(@Body() body: { userId: string }) {
    if (!body.userId) {
      throw new BadRequestException('userId is required');
    }
    return this.authService.getUserProfile(body.userId);
  }

  /**
   * POST /auth/confirm-email
   * Internal endpoint - confirm user email after signup
   * 
   * PRODUCTION: Only accessible via server-side, protected by API key
   */
  @Post('confirm-email')
  async confirmEmail(@Body() body: { email: string }) {
    if (!body.email) {
      throw new BadRequestException('email is required');
    }
    return this.authService.confirmUserEmail(body.email);
  }

  /**
   * POST /auth/find-by-email
   * Find user by email address
   */
  @Post('find-by-email')
  async findUserByEmail(@Body() body: { email: string }) {
    if (!body.email) {
      throw new BadRequestException('email is required');
    }
    return this.authService.findUserByEmail(body.email);
  }
}