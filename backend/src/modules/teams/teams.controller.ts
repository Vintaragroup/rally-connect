import { Controller, Get, Param } from '@nestjs/common';
import { TeamsService } from './teams.service';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  getAllTeams() {
    return this.teamsService.getAllTeams();
  }

  @Get(':id')
  getTeamById(@Param('id') id: string) {
    return this.teamsService.getTeamById(id);
  }
}
