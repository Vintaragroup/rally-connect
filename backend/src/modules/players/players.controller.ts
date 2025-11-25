import { Controller, Get, Param } from '@nestjs/common';
import { PlayersService } from './players.service';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  getAllPlayers() {
    return this.playersService.getAllPlayers();
  }

  @Get(':id')
  getPlayerById(@Param('id') id: string) {
    return this.playersService.getPlayerById(id);
  }
}
