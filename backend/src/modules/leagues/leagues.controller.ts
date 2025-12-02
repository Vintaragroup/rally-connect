import { Controller, Get, Param, BadRequestException } from '@nestjs/common';
import { LeaguesService } from './leagues.service';

@Controller('leagues')
export class LeaguesController {
  constructor(private readonly leaguesService: LeaguesService) {}

  @Get()
  getAllLeagues() {
    return this.leaguesService.getAllLeagues();
  }

  @Get(':id')
  getLeagueById(@Param('id') id: string) {
    return this.leaguesService.getLeagueById(id);
  }

  /**
   * GET /leagues/:leagueId/teams-looking
   * Get teams looking for players in a league
   * 
   * @param leagueId - League ID
   * @returns Array of teams with player count info
   */
  @Get(':leagueId/teams-looking')
  async getTeamsLookingForPlayers(@Param('leagueId') leagueId: string) {
    if (!leagueId) {
      throw new BadRequestException('leagueId is required');
    }

    return this.leaguesService.getTeamsLookingForPlayers(leagueId);
  }
}
