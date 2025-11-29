import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';

@Injectable()
export class LeaguesService {
  constructor(private prisma: PrismaService) {}

  async getAllLeagues() {
    return this.prisma.league.findMany({
      include: {
        sport: true,
        seasons: {
          include: {
            divisions: true,
          },
        },
      },
    });
  }

  async getLeagueById(id: string) {
    return this.prisma.league.findUnique({
      where: { id },
      include: {
        sport: true,
        seasons: {
          include: {
            divisions: {
              include: {
                teams: true,
              },
            },
          },
        },
      },
    });
  }
}
