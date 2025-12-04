import { Controller, Get, Post, Param, Query, Body, Headers, BadRequestException, NotFoundException } from '@nestjs/common';
import { TeamsService } from './teams.service';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  getAllTeams(@Query('userId') userId?: string) {
    // If userId provided, return only user's teams
    if (userId) {
      return this.teamsService.getUserTeams(userId);
    }
    // TODO: Add @UseGuards(JwtAuthGuard) when auth is fully integrated
    return this.teamsService.getAllTeams();
  }

  @Get(':id')
  getTeamById(@Param('id') id: string) {
    // TODO: Add @UseGuards(JwtAuthGuard) when auth is fully integrated
    return this.teamsService.getTeamById(id);
  }

  @Post()
  createTeam(
    @Body() createTeamDto: { name: string; sport: string; club?: string; userId: string }
  ) {
    return this.teamsService.createTeam(createTeamDto);
  }

  /**
   * POST /teams/join-by-code
   * Join a team using an invitation code
   * 
   * @param code - Team invitation code
   * @param userId - User ID
   * @returns { teamId, leagueId, teamName, success }
   */
  @Post('join-by-code')
  async joinByCode(@Body() body: { code: string; userId: string }) {
    if (!body.code || !body.userId) {
      throw new BadRequestException('code and userId are required');
    }
    return this.teamsService.joinByCode({
      code: body.code,
      userId: body.userId,
    });
  }

  /**
   * POST /teams/:teamId/generate-code
   * Generate a team-specific invitation code (admin only)
   * 
   * @param teamId - Team ID
   * @param createdBy - User ID of admin creating code
   * @param expiresAt - Optional expiration date
   * @returns { code, success }
   */
  @Post(':teamId/generate-code')
  async generateTeamCode(
    @Param('teamId') teamId: string,
    @Body() body: { createdBy: string; expiresAt?: string }
  ) {
    if (!teamId || !body.createdBy) {
      throw new BadRequestException('teamId and createdBy are required');
    }

    return this.teamsService.generateTeamCode({
      teamId,
      createdBy: body.createdBy,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
    });
  }

  /**
   * POST /teams/:teamId/request-join
   * Request to join a team (pending captain approval)
   * 
   * @param teamId - Team ID
   * @param userId - User ID requesting
   * @param message - Optional message to captain
   * @returns { requestId, teamName, status, success }
   */
  @Post(':teamId/request-join')
  async requestJoinTeam(
    @Param('teamId') teamId: string,
    @Body() body: { userId: string; message?: string }
  ) {
    if (!teamId || !body.userId) {
      throw new BadRequestException('teamId and userId are required');
    }

    return this.teamsService.requestJoinTeam({
      userId: body.userId,
      teamId,
      message: body.message,
    });
  }

  /**
   * GET /teams/:teamId/pending-joins
   * Get pending join requests for a team (admin/captain only)
   * 
   * @param teamId - Team ID
   * @returns Array of pending requests with user details
   */
  @Get(':teamId/pending-joins')
  async getPendingJoinRequests(@Param('teamId') teamId: string) {
    if (!teamId) {
      throw new BadRequestException('teamId is required');
    }

    return this.teamsService.getPendingJoinRequests(teamId);
  }

  /**
   * POST /teams/:teamId/approve-join/:requestId
   * Approve a join request (admin/captain only)
   * 
   * @param teamId - Team ID
   * @param requestId - Request ID
   * @returns { teamId, leagueId, userId, success }
   */
  @Post(':teamId/approve-join/:requestId')
  async approveJoinRequest(
    @Param('teamId') teamId: string,
    @Param('requestId') requestId: string
  ) {
    if (!teamId || !requestId) {
      throw new BadRequestException('teamId and requestId are required');
    }

    return this.teamsService.approveJoinRequest({
      requestId,
      teamId,
    });
  }

  /**
   * POST /teams/:teamId/decline-join/:requestId
   * Decline a join request (admin/captain only)
   * 
   * @param teamId - Team ID
   * @param requestId - Request ID
   * @returns { success }
   */
  @Post(':teamId/decline-join/:requestId')
  async declineJoinRequest(
    @Param('teamId') teamId: string,
    @Param('requestId') requestId: string
  ) {
    if (!teamId || !requestId) {
      throw new BadRequestException('teamId and requestId are required');
    }

    return this.teamsService.declineJoinRequest(requestId);
  }

  /**
   * POST /teams/:teamId/looking-for-players
   * Update team's recruitment status (captain only)
   * Marks team as open/closed for recruitment in team discovery
   * 
   * @param teamId - Team ID
   * @param isLookingForPlayers - Whether team is looking for players
   * @param userId - Captain ID (for validation)
   * @returns { teamId, teamName, isLookingForPlayers, success }
   */
  @Post(':teamId/looking-for-players')
  async updateTeamLookingStatus(
    @Param('teamId') teamId: string,
    @Body() body: { isLookingForPlayers: boolean; userId: string }
  ) {
    if (!teamId || body.isLookingForPlayers === undefined || !body.userId) {
      throw new BadRequestException(
        'teamId, isLookingForPlayers, and userId are required'
      );
    }

    return this.teamsService.updateTeamLookingStatus({
      teamId,
      isLookingForPlayers: body.isLookingForPlayers,
      userId: body.userId,
    });
  }
}