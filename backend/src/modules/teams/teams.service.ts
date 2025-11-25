import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async getAllTeams() {
    return this.prisma.team.findMany({
      include: {
        sport: true,
        league: true,
        division: true,
        captain: { include: { user: true } },
        players: { include: { user: true } },
      },
    });
  }

  async getTeamById(id: string) {
    return this.prisma.team.findUnique({
      where: { id },
      include: {
        sport: true,
        league: true,
        division: true,
        captain: { include: { user: true } },
        players: { include: { user: true } },
        standings: true,
      },
    });
  }
}
