import { Controller, Get, Param } from '@nestjs/common';
import { StandingsService } from './standings.service';

@Controller('standings')
export class StandingsController {
  constructor(private readonly standingsService: StandingsService) {}

  @Get()
  getAllStandings() {
    return this.standingsService.getAllStandings();
  }

  @Get('division/:divisionId')
  getStandingsByDivision(@Param('divisionId') divisionId: string) {
    return this.standingsService.getStandingsByDivision(divisionId);
  }
}
