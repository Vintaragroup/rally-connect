import { Controller, Get, Post, Param, Query, Body, Headers } from '@nestjs/common';
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
}
