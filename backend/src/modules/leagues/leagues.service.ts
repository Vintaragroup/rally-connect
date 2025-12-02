import { Injectable, NotFoundException } from '@nestjs/common';
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

  /**
   * Get teams looking for players in a league
   * - Filters teams by isLookingForPlayers flag
   * - Includes player count vs minimum needed
   */
  async getTeamsLookingForPlayers(leagueId: string): Promise<any[]> {
    try {
      // Validate league exists
      const league = await this.prisma.league.findUnique({
        where: { id: leagueId },
      });

      if (!league) {
        throw new NotFoundException('League not found');
      }

      // Get teams looking for players with member count
      const teams = await this.prisma.team.findMany({
        where: {
          leagueId: leagueId,
          isLookingForPlayers: true,
        },
        include: {
          sport: true,
          _count: {
            select: { players: true },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });

      // Format response with player counts
      const formattedTeams = teams.map(team => ({
        id: team.id,
        name: team.name,
        sportId: team.sportId,
        sportName: team.sport.name,
        currentPlayerCount: team._count.players,
        minPlayersNeeded: team.minPlayersNeeded || 0,
        playersNeeded: Math.max(0, (team.minPlayersNeeded || 0) - team._count.players),
        description: team.description,
        logo: team.logo,
      }));

      return formattedTeams;
    } catch (error) {
      console.error('❌ Error getting teams looking for players:', error);
      throw error;
    }
  }
}
