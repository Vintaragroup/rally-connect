import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { randomBytes } from 'crypto';

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

  /**
   * Join a team using an invitation code
   * - Validates code
   * - Adds user to team + league
   * - Creates LeagueMember record
   */
  async joinByCode(data: {
    code: string;
    userId: string;
  }): Promise<{
    teamId: string;
    leagueId: string;
    teamName: string;
    success: boolean;
  }> {
    try {
      // Validate user exists
      const user = await this.prisma.user.findUnique({
        where: { id: data.userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Find and validate code
      const invitationCode = await this.prisma.invitationCode.findUnique({
        where: { code: data.code },
      });

      if (!invitationCode) {
        throw new BadRequestException('Invalid invitation code');
      }

      // Check if code is expired
      if (invitationCode.expiresAt && new Date() > invitationCode.expiresAt) {
        throw new BadRequestException('Invitation code has expired');
      }

      // Check usage limit
      if (invitationCode.usedBy.length >= invitationCode.usageLimit) {
        throw new BadRequestException('Invitation code usage limit reached');
      }

      // Validate teamId exists in code
      if (!invitationCode.teamId) {
        throw new BadRequestException('This code is not associated with a team');
      }

      // Get the team
      const team = await this.prisma.team.findUnique({
        where: { id: invitationCode.teamId },
        include: {
          league: true,
        },
      });

      if (!team) {
        throw new NotFoundException('Team not found');
      }

      // Check if user is already on team
      const existingMember = await this.prisma.teamPlayer.findUnique({
        where: {
          teamId_playerId: {
            teamId: team.id,
            playerId: (await this.prisma.player.findUnique({
              where: { userId: data.userId },
              select: { id: true },
            }))?.id || '',
          },
        },
      });

      if (existingMember) {
        throw new BadRequestException('User is already a member of this team');
      }

      // Check if user is already in league
      let leagueMember = await this.prisma.leagueMember.findUnique({
        where: {
          userId_leagueId: {
            userId: data.userId,
            leagueId: team.leagueId,
          },
        },
      });

      // Create LeagueMember if doesn't exist
      if (!leagueMember) {
        leagueMember = await this.prisma.leagueMember.create({
          data: {
            userId: data.userId,
            leagueId: team.leagueId,
          },
        });
      }

      // Get or create player record
      let player = await this.prisma.player.findUnique({
        where: { userId: data.userId },
      });

      if (!player) {
        player = await this.prisma.player.create({
          data: {
            userId: data.userId,
            sportId: team.sportId,
          },
        });
      }

      // Add user to team as a player
      await this.prisma.teamPlayer.create({
        data: {
          teamId: team.id,
          playerId: player.id,
        },
      });

      // Redeem code - add user to usedBy array
      await this.prisma.invitationCode.update({
        where: { code: data.code },
        data: {
          usedBy: {
            push: data.userId,
          },
          isUsed: invitationCode.usageLimit === 1, // Mark as used if single-use
        },
      });

      // Update user's current organization
      await this.prisma.user.update({
        where: { id: data.userId },
        data: {
          currentOrganizationId: team.leagueId,
        },
      });

      console.log(
        `✓ User ${data.userId} joined team ${team.id} via code ${data.code}`
      );

      return {
        teamId: team.id,
        leagueId: team.leagueId,
        teamName: team.name,
        success: true,
      };
    } catch (error) {
      console.error('❌ Error joining by code:', error);
      throw error;
    }
  }

  /**
   * Generate a team-specific invitation code
   * - Admin creates code tied to specific team
   * - Can be shared to recruit players
   */
  async generateTeamCode(data: {
    teamId: string;
    createdBy: string;
    expiresAt?: Date;
  }): Promise<{ code: string; success: boolean }> {
    try {
      // Verify team exists
      const team = await this.prisma.team.findUnique({
        where: { id: data.teamId },
      });

      if (!team) {
        throw new NotFoundException('Team not found');
      }

      // Verify user is admin or team captain (simple check)
      // TODO: Add role-based authorization check

      // Generate unique code
      const code = this.generateRandomCode();

      // Create invitation code tied to team
      const invitationCode = await this.prisma.invitationCode.create({
        data: {
          code,
          organizationId: team.leagueId,
          sportId: team.sportId,
          teamId: data.teamId,
          createdBy: data.createdBy,
          expiresAt: data.expiresAt,
        },
      });

      console.log(`✓ Team invitation code generated: ${code} for team ${data.teamId}`);

      return {
        code: invitationCode.code,
        success: true,
      };
    } catch (error) {
      console.error('❌ Error generating team code:', error);
      throw error;
    }
  }

  /**
   * Generate random 12-character code
   */
  private generateRandomCode(): string {
    return randomBytes(9)
      .toString('hex')
      .substring(0, 12)
      .toUpperCase();
  }

