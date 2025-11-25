import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';

@Injectable()
export class PlayersService {
  constructor(private prisma: PrismaService) {}

  async getAllPlayers() {
    return this.prisma.player.findMany({
      include: {
        user: true,
        sport: true,
        teams: true,
        stats: true,
      },
    });
  }

  async getPlayerById(id: string) {
    return this.prisma.player.findUnique({
      where: { id },
      include: {
        user: true,
        sport: true,
        teams: true,
        stats: true,
        availability: true,
      },
    });
  }
}
