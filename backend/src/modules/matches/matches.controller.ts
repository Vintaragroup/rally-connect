import { Controller, Get, Param } from '@nestjs/common';
import { MatchesService } from './matches.service';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  getAllMatches() {
    return this.matchesService.getAllMatches();
  }

  @Get(':id')
  getMatchById(@Param('id') id: string) {
    return this.matchesService.getMatchById(id);
  }
}
