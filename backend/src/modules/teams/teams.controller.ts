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
}
