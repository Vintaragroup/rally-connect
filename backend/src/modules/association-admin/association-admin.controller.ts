import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { AssociationAdminService } from './association-admin.service';

@Controller('association-admin')
export class AssociationAdminController {
  constructor(private readonly service: AssociationAdminService) {}

  // ============================================================================
  // User Admin Status
  // ============================================================================

  @Post('check-admin-status')
  checkAdminStatus(@Body() body: { userId: string }) {
    return this.service.getUserAdminStatus(body.userId);
  }

  // ============================================================================
  // Association Admin Management
  // ============================================================================

  @Get('leagues/:leagueId/admins')
  getLeagueAdmins(@Param('leagueId') leagueId: string) {
    return this.service.getLeagueAdmins(leagueId);
  }

  @Post('promote')
  async promoteToAdmin(
    @Body() body: { userId?: string; email?: string; leagueId: string; role?: string; leagueName?: string },
  ) {
    return this.service.promoteUserToAdmin(body.userId, body.leagueId, body.role, body.email, body.leagueName);
  }

  @Post(':adminId/remove')
  removeAdminRole(@Param('adminId') adminId: string, @Body() body: { userId: string; leagueId: string }) {
    return this.service.removeAdminRole(body.userId, body.leagueId);
  }

  // ============================================================================
  // Captain Request Management
  // ============================================================================

  @Post('captain-requests/request')
  requestToBeCaptain(
    @Body() body: { playerId: string; leagueId: string; message?: string },
  ) {
    return this.service.requestToBeCaptain(body.playerId, body.leagueId, body.message);
  }

  @Get('captain-requests')
  getCaptainRequests(@Query('leagueId') leagueId: string, @Query('status') status?: string) {
    return this.service.getCaptainRequests(leagueId, status);
  }

  @Post('captain-requests/:requestId/approve')
  approveCaptainRequest(
    @Param('requestId') requestId: string,
    @Body() body: { adminId: string },
  ) {
    return this.service.approveCaptainRequest(requestId, body.adminId);
  }

  @Post('captain-requests/:requestId/reject')
  rejectCaptainRequest(
    @Param('requestId') requestId: string,
    @Body() body: { reason?: string },
  ) {
    return this.service.rejectCaptainRequest(requestId, body.reason);
  }

  // ============================================================================
  // Captain Invitation Management (Deprecated - Use CaptainRequest instead)
  // ============================================================================

  // These endpoints are commented out - use CaptainRequest endpoints above instead
  /*
  @Post('captain-invitations/invite')
  invitePlayerToBeCaptain(
    @Body() body: { playerId: string; leagueId: string; sentByAdminId: string; invitationMessage?: string; expiresInDays?: number },
  ) {
    return this.service.invitePlayerToBeCaptain(
      body.playerId,
      body.leagueId,
      body.sentByAdminId,
      body.invitationMessage,
      body.expiresInDays,
    );
  }

  @Get('captain-invitations/pending/:playerId')
  getPendingCaptainInvitations(@Param('playerId') playerId: string) {
    return this.service.getPendingCaptainInvitations(playerId);
  }

  @Post('captain-invitations/:invitationId/accept')
  acceptCaptainInvitation(
    @Param('invitationId') invitationId: string,
    @Body() body: { playerId: string },
  ) {
    return this.service.acceptCaptainInvitation(invitationId, body.playerId);
  }

  @Post('captain-invitations/:invitationId/reject')
  rejectCaptainInvitation(
    @Param('invitationId') invitationId: string,
    @Body() body: { playerId: string },
  ) {
    return this.service.rejectCaptainInvitation(invitationId, body.playerId);
  }
  */

  // ============================================================================
  // League Rules Management
  // ============================================================================

  @Post('leagues/:leagueId/rules')
  setLeagueRules(
    @Param('leagueId') leagueId: string,
    @Body() rules: any,
  ) {
    return this.service.setLeagueRules(leagueId, rules);
  }

  @Get('leagues/:leagueId/rules')
  getLeagueRules(@Param('leagueId') leagueId: string) {
    return this.service.getLeagueRules(leagueId);
  }
}
