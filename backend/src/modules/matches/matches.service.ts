import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';

@Injectable()
export class MatchesService {
  constructor(private prisma: PrismaService) {}

  async getAllMatches() {
    return this.prisma.match.findMany({
      include: {
        league: true,
        team1: true,
        players: true,
      },
      orderBy: { scheduledAt: 'desc' },
    });
  }

  async getMatchById(id: string) {
    return this.prisma.match.findUnique({
      where: { id },
      include: {
        league: true,
        team1: true,
        players: true,
      },
    });
  }
}
