import { Injectable, BadRequestException } from '@nestjs/common';
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
        captains: true,
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
        captains: true,
        standings: true,
      },
    });
  }

  async getUserTeams(userId: string) {
    // Get teams where user is captain OR player
    const [captainTeams, playerTeams] = await Promise.all([
      this.prisma.team.findMany({
        where: {
          captains: {
            some: {
              captain: {
                userId: userId,
              },
            },
          },
        },
        include: {
          sport: true,
          league: true,
          division: true,
          captains: true,
          players: true,
          standings: true,
        },
      }),
      this.prisma.team.findMany({
        where: {
          players: {
            some: {
              player: {
                userId: userId,
              },
            },
          },
        },
        include: {
          sport: true,
          league: true,
          division: true,
          captains: true,
          players: true,
          standings: true,
        },
      }),
    ]);

    // Combine and remove duplicates
    const teamMap = new Map();
    [...captainTeams, ...playerTeams].forEach(team => {
      teamMap.set(team.id, team);
    });
    return Array.from(teamMap.values());
  }

  async createTeam(data: {
    name: string;
    sport: string;
    club?: string;
    userId: string;
  }) {
    // Validate required data
    if (!data.name || !data.sport || !data.userId) {
      throw new BadRequestException('Missing required fields: name, sport, userId');
    }

    // Verify user exists
    const userExists = await this.prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!userExists) {
      throw new BadRequestException('User does not exist. Please complete onboarding first.');
    }

    // Get first available league (no specific filter)
    const league = await this.prisma.league.findFirst();

    // Get first available division (no specific filter)
    const division = await this.prisma.division.findFirst();

    if (!league || !division) {
      throw new BadRequestException('No leagues or divisions available in the system');
    }

    // Get sport by name or ID
    const sport = await this.prisma.sport.findFirst({
      where: {
        OR: [
          { id: data.sport },
          { name: { contains: data.sport, mode: 'insensitive' } },
        ],
      },
    });

    if (!sport) {
      throw new BadRequestException(`Sport "${data.sport}" not found`);
    }

    // Get club if provided
    let club = null;
    if (data.club) {
      club = await this.prisma.club.findFirst({
        where: {
          OR: [
            { id: data.club },
            { name: { contains: data.club, mode: 'insensitive' } },
          ],
        },
      });
      // If club not found, that's OK - it's optional
    }

    // Check if user already has a captain record
    let captain = await this.prisma.captain.findUnique({
      where: { userId: data.userId },
    });

    // Create captain record if it doesn't exist
    if (!captain) {
      captain = await this.prisma.captain.create({
        data: { userId: data.userId },
      });
    }

    // Check if user already has a player record
    let player = await this.prisma.player.findUnique({
      where: { userId: data.userId },
    });

    // Create player record if it doesn't exist
    if (!player) {
      player = await this.prisma.player.create({
        data: {
          userId: data.userId,
          sportId: sport.id,
        },
      });
    }

    // Create team
    const team = await this.prisma.team.create({
      data: {
        name: data.name,
        sportId: sport.id,
        leagueId: league.id,
        divisionId: division.id,
        clubId: club?.id,
      },
      include: {
        sport: true,
        league: true,
        division: true,
        captains: true,
      },
    });

    // Create TeamCaptain join record to link the captain to the team
    // This establishes the captain as both a captain and a player on the team
    await this.prisma.teamCaptain.create({
      data: {
        teamId: team.id,
        playerId: player.id,
        captainId: captain.id,
      },
    });

    return team;
  }
}

