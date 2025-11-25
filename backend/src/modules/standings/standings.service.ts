import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';

@Injectable()
export class StandingsService {
  constructor(private prisma: PrismaService) {}

  async getAllStandings() {
    return this.prisma.standing.findMany({
      include: {
        division: { include: { league: true } },
        team: true,
      },
      orderBy: [{ division: { id: 'asc' } }, { wins: 'desc' }, { winPercentage: 'desc' }],
    });
  }

  async getStandingsByDivision(divisionId: string) {
    return this.prisma.standing.findMany({
      where: { divisionId },
      include: {
        division: { include: { league: true } },
        team: true,
      },
      orderBy: [{ wins: 'desc' }, { winPercentage: 'desc' }],
    });
  }
}
