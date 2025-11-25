import { Controller, Get, Post, Body, Headers, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Get current user's auth status and onboarding status
   * Uses Stack Auth user ID from request body
   * TODO: Replace with JWT guard validation
   */
  @Post('me')
  async getCurrentUser(@Body() body: { userId: string }) {
    if (!body.userId) {
      throw new BadRequestException('userId is required');
    }
    return this.authService.getUserWithOnboardingStatus(body.userId);
  }

  /**
   * Sync user from Stack Auth to local database
   */
  @Post('sync-user')
  async syncUser(@Body() body: { stackUserId: string; email: string; displayName: string }) {
    if (!body.stackUserId || !body.email) {
      throw new BadRequestException('stackUserId and email are required');
    }
    return this.authService.syncStackAuthUser(body.stackUserId, body.email, body.displayName || body.email);
  }

  /**
   * Mark onboarding as complete for a user
   * TODO: Replace with JWT guard validation
   */
  @Post('complete-onboarding')
  async completeOnboarding(@Body() body: { userId: string }) {
    if (!body.userId) {
      throw new BadRequestException('userId is required');
    }
    return this.authService.markOnboardingComplete(body.userId);
  }

  /**
   * Confirm user email in Supabase
   */
  @Post('confirm-email')
  async confirmEmail(@Body() body: { email: string }) {
    if (!body.email) {
      throw new BadRequestException('email is required');
    }
    return this.authService.confirmUserEmail(body.email);
  }
}
