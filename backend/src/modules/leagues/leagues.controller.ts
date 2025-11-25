import { Controller, Get, Param } from '@nestjs/common';
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
}
