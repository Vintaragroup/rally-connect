import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';

@Injectable()
export class MatchesService {
  constructor(private prisma: PrismaService) {}

  async getAllMatches() {
    return this.prisma.match.findMany({
      include: {
        homeTeam: true,
        awayTeam: true,
        division: true,
        season: true,
      },
      orderBy: { startTime: 'desc' },
    });
  }

  async getMatchById(id: string) {
    return this.prisma.match.findUnique({
      where: { id },
      include: {
        homeTeam: true,
        awayTeam: true,
        division: true,
        season: true,
      },
    });
  }
}
