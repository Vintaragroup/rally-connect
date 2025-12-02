import { Controller, Get, Post, Body, Headers, BadRequestException, UseGuards, Delete, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { InvitationCodeService } from './invitation-code.service';
import { CaptainRequestService } from './captain-request.service';

// TODO: Implement JWT Guard
// import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly invitationCodeService: InvitationCodeService,
    private readonly captainRequestService: CaptainRequestService,
  ) {}

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
    
    console.log('📝 POST /auth/sync-user called with:', {
      stackUserId,
      email: body.email,
      displayName,
      bodyKeys: Object.keys(body),
    });
    
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

  // ============================================
  // INVITATION CODE ENDPOINTS
  // ============================================

  /**
   * POST /auth/code-validation
   * Validate and redeem an invitation code
   * 
   * @param code - The invitation code (e.g., "ABC123XYZ456")
   * @param userId - The user ID redeeming the code
   * @returns { organizationId, sportId, success: true }
   */
  @Post('code-validation')
  async validateCode(@Body() body: { code: string; userId: string }) {
    if (!body.code || !body.userId) {
      throw new BadRequestException('code and userId are required');
    }
    return this.invitationCodeService.validateAndRedeemCode(body.code, body.userId);
  }

  /**
   * POST /admin/invitation-codes/generate
   * Generate a new invitation code (admin only)
   * 
   * @param organizationId - League/Organization ID
   * @param sportId - Sport ID
   * @param createdBy - Admin user ID
   * @param expiresAt - Optional expiration date
   * @returns { code: string, success: true }
   */
  @Post('admin/invitation-codes/generate')
  async generateInvitationCode(@Body() body: {
    organizationId: string;
    sportId: string;
    createdBy: string;
    expiresAt?: Date;
  }) {
    if (!body.organizationId || !body.sportId || !body.createdBy) {
      throw new BadRequestException('organizationId, sportId, and createdBy are required');
    }
    return this.invitationCodeService.generateCode(body);
  }

  /**
   * GET /admin/invitation-codes/:organizationId
   * Get all invitation codes for an organization (admin only)
   */
  @Get('admin/invitation-codes/:organizationId')
  async getInvitationCodes(@Param('organizationId') organizationId: string) {
    if (!organizationId) {
      throw new BadRequestException('organizationId is required');
    }
    return this.invitationCodeService.getCodesForOrganization(organizationId);
  }

  /**
   * DELETE /admin/invitation-codes/:codeId
   * Revoke an invitation code (admin only)
   */
  @Delete('admin/invitation-codes/:codeId')
  async revokeInvitationCode(@Param('codeId') codeId: string) {
    if (!codeId) {
      throw new BadRequestException('codeId is required');
    }
    return this.invitationCodeService.revokeCode(codeId);
  }

  // ============================================
  // CAPTAIN REQUEST ENDPOINTS
  // ============================================

  /**
   * POST /admin/captain-requests
   * Send captain request to a player (admin only)
   * 
   * @param playerId - Player user ID
   * @param teamId - Team ID
   * @param leagueId - League ID
   * @param requestedByAdminId - Admin user ID sending request
   * @param message - Optional message
   * @returns { success: true, requestId: string }
   */
  @Post('admin/captain-requests')
  async sendCaptainRequest(@Body() body: {
    playerId: string;
    teamId: string;
    leagueId: string;
    requestedByAdminId: string;
    message?: string;
  }) {
    if (!body.playerId || !body.teamId || !body.leagueId || !body.requestedByAdminId) {
      throw new BadRequestException(
        'playerId, teamId, leagueId, and requestedByAdminId are required'
      );
    }
    return this.captainRequestService.sendCaptainRequest(body);
  }

  /**
   * POST /member/captain-requests/:requestId/accept
   * Accept a captain request
   * 
   * @param requestId - Captain request ID
   * @returns { success: true }
   */
  @Post('member/captain-requests/:requestId/accept')
  async acceptCaptainRequest(@Param('requestId') requestId: string) {
    if (!requestId) {
      throw new BadRequestException('requestId is required');
    }
    return this.captainRequestService.acceptCaptainRequest(requestId);
  }

  /**
   * POST /member/captain-requests/:requestId/decline
   * Decline a captain request
   * 
   * @param requestId - Captain request ID
   * @param reason - Optional reason for decline
   * @returns { success: true }
   */
  @Post('member/captain-requests/:requestId/decline')
  async declineCaptainRequest(
    @Param('requestId') requestId: string,
    @Body() body?: { reason?: string }
  ) {
    if (!requestId) {
      throw new BadRequestException('requestId is required');
    }
    return this.captainRequestService.declineCaptainRequest(requestId, body?.reason);
  }

  /**
   * GET /member/captain-requests
   * Get pending captain requests for current user
   * 
   * @param userId - User ID
   * @returns Captain requests array
   */
  @Post('member/captain-requests')
  async getPendingCaptainRequests(@Body() body: { userId: string }) {
    if (!body.userId) {
      throw new BadRequestException('userId is required');
    }
    return this.captainRequestService.getPendingRequestsForPlayer(body.userId);
  }

  /**
   * GET /admin/captain-requests/:teamId
   * Get all captain requests for a team (admin only)
   */
  @Get('admin/captain-requests/:teamId')
  async getTeamCaptainRequests(@Param('teamId') teamId: string) {
    if (!teamId) {
      throw new BadRequestException('teamId is required');
    }
    return this.captainRequestService.getRequestsForTeam(teamId);
  }
}