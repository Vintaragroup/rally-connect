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

  /**
   * Request to join a team
   * - Creates TeamJoinRequest record
   * - Awaits captain/admin approval
   */
  async requestJoinTeam(data: {
    userId: string;
    teamId: string;
    message?: string;
  }): Promise<{
    requestId: string;
    teamName: string;
    status: string;
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

      // Validate team exists
      const team = await this.prisma.team.findUnique({
        where: { id: data.teamId },
        include: {
          league: true,
        },
      });

      if (!team) {
        throw new NotFoundException('Team not found');
      }

      // Check if user is already on team
      const player = await this.prisma.player.findUnique({
        where: { userId: data.userId },
        select: { id: true },
      });

      if (player) {
        const existingMember = await this.prisma.teamPlayer.findUnique({
          where: {
            teamId_playerId: {
              teamId: team.id,
              playerId: player.id,
            },
          },
        });

        if (existingMember) {
          throw new BadRequestException('User is already a member of this team');
        }
      }

      // Check if user already has pending request
      const existingRequest = await this.prisma.teamJoinRequest.findUnique({
        where: {
          userId_teamId: {
            userId: data.userId,
            teamId: data.teamId,
          },
        },
      });

      if (existingRequest && existingRequest.status === 'PENDING') {
        throw new BadRequestException('User already has a pending request for this team');
      }

      // Rate limiting: Check if user has made more than 5 join requests in the last 24 hours
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      
      const recentRequests = await this.prisma.teamJoinRequest.count({
        where: {
          userId: data.userId,
          requestedAt: {
            gte: oneDayAgo,
          },
        },
      });

      if (recentRequests >= 5) {
        throw new BadRequestException(
          'You have reached the maximum number of join requests (5 per 24 hours). Please try again later.'
        );
      }

      // Create request
      const request = await this.prisma.teamJoinRequest.create({
        data: {
          userId: data.userId,
          teamId: data.teamId,
          message: data.message,
          status: 'PENDING',
        },
      });

      console.log(
        `✓ User ${data.userId} requested to join team ${data.teamId}`
      );

      return {
        requestId: request.id,
        teamName: team.name,
        status: request.status,
        success: true,
      };
    } catch (error) {
      console.error('❌ Error requesting to join team:', error);
      throw error;
    }
  }

  /**
   * Get pending join requests for a team (admin/captain only)
   * Auto-declines requests older than 30 days
   */
  async getPendingJoinRequests(teamId: string): Promise<any[]> {
    try {
      // Validate team exists
      const team = await this.prisma.team.findUnique({
        where: { id: teamId },
      });

      if (!team) {
        throw new NotFoundException('Team not found');
      }

      // Get all requests and filter in memory
      const requests = await this.prisma.teamJoinRequest.findMany({
        where: {
          teamId: teamId,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: {
          requestedAt: 'asc',
        },
      });

      // Filter for pending requests and auto-decline stale ones (>30 days)
      const pendingRequests = requests.filter((r: any) => r.status === 'PENDING');
      
      // Auto-decline requests older than 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const staleRequests = pendingRequests.filter((r: any) => r.requestedAt < thirtyDaysAgo);
      
      if (staleRequests.length > 0) {
        await Promise.all(
          staleRequests.map((r: any) =>
            this.prisma.teamJoinRequest.update({
              where: { id: r.id },
              data: {
                status: 'DECLINED',
                respondedAt: new Date(),
              },
            })
          )
        );
        console.log(`✓ Auto-declined ${staleRequests.length} stale requests (>30 days)`);
      }
      
      // Return only recent pending requests
      return pendingRequests.filter((r: any) => r.requestedAt >= thirtyDaysAgo);
    } catch (error) {
      console.error('❌ Error getting pending join requests:', error);
      throw error;
    }
  }

  /**
   * Approve a join request
   * - Adds user to team + league
   * - Deletes the request
   */
  async approveJoinRequest(data: {
    requestId: string;
    teamId: string;
  }): Promise<{
    teamId: string;
    leagueId: string;
    userId: string;
    success: boolean;
  }> {
    try {
      // Get the request
      const request = await this.prisma.teamJoinRequest.findUnique({
        where: { id: data.requestId },
      });

      if (!request) {
        throw new NotFoundException('Join request not found');
      }

      if (request.teamId !== data.teamId) {
        throw new BadRequestException('Request does not belong to this team');
      }

      // Validate team exists
      const team = await this.prisma.team.findUnique({
        where: { id: data.teamId },
        include: {
          league: true,
        },
      });

      if (!team) {
        throw new NotFoundException('Team not found');
      }

      // Get or create player record
      let player = await this.prisma.player.findUnique({
        where: { userId: request.userId },
      });

      if (!player) {
        player = await this.prisma.player.create({
          data: {
            userId: request.userId,
            sportId: team.sportId,
          },
        });
      }

      // Create or find LeagueMember
      let leagueMember = await this.prisma.leagueMember.findUnique({
        where: {
          userId_leagueId: {
            userId: request.userId,
            leagueId: team.leagueId,
          },
        },
      });

      if (!leagueMember) {
        leagueMember = await this.prisma.leagueMember.create({
          data: {
            userId: request.userId,
            leagueId: team.leagueId,
          },
        });
      }

      // Add user to team
      await this.prisma.teamPlayer.create({
        data: {
          teamId: team.id,
          playerId: player.id,
        },
      });

      // Mark request as approved
      await this.prisma.teamJoinRequest.update({
        where: { id: data.requestId },
        data: {
          status: 'APPROVED',
          respondedAt: new Date(),
        },
      });

      // Update user's organization
      await this.prisma.user.update({
        where: { id: request.userId },
        data: {
          currentOrganizationId: team.leagueId,
        },
      });

      console.log(
        `✓ Join request ${data.requestId} approved for user ${request.userId} to team ${data.teamId}`
      );

      return {
        teamId: team.id,
        leagueId: team.leagueId,
        userId: request.userId,
        success: true,
      };
    } catch (error) {
      console.error('❌ Error approving join request:', error);
      throw error;
    }
  }

  /**
   * Decline a join request
   */
  async declineJoinRequest(requestId: string): Promise<{ success: boolean }> {
    try {
      // Get the request
      const request = await this.prisma.teamJoinRequest.findUnique({
        where: { id: requestId },
      });

      if (!request) {
        throw new NotFoundException('Join request not found');
      }

      // Mark as declined
      await this.prisma.teamJoinRequest.update({
        where: { id: requestId },
        data: {
          status: 'DECLINED',
          respondedAt: new Date(),
        },
      });

      console.log(`✓ Join request ${requestId} declined`);

      return { success: true };
    } catch (error) {
      console.error('❌ Error declining join request:', error);
      throw error;
    }
  }

  /**
   * Update team's "looking for players" status
   * Used by captains to mark team as open/closed for recruitment
   */
  async updateTeamLookingStatus(data: {
    teamId: string;
    isLookingForPlayers: boolean;
    userId: string; // Captain ID for validation
  }): Promise<{
    teamId: string;
    teamName: string;
    isLookingForPlayers: boolean;
    success: boolean;
  }> {
    try {
      // Verify team exists
      const team = await this.prisma.team.findUnique({
        where: { id: data.teamId },
      });

      if (!team) {
        throw new NotFoundException('Team not found');
      }

      // Verify user is a captain of this team
      const isCaptain = await this.prisma.teamCaptain.findFirst({
        where: {
          teamId: data.teamId,
          captain: {
            userId: data.userId,
          },
        },
      });

      if (!isCaptain) {
        throw new BadRequestException('Only team captains can update this setting');
      }

      // Update team
      const updatedTeam = await this.prisma.team.update({
        where: { id: data.teamId },
        data: {
          isLookingForPlayers: data.isLookingForPlayers,
        },
      });

      const status = data.isLookingForPlayers ? 'open' : 'closed';
      console.log(
        `✓ Team ${updatedTeam.name} is now ${status} for recruitment`
      );

      return {
        teamId: updatedTeam.id,
        teamName: updatedTeam.name,
        isLookingForPlayers: updatedTeam.isLookingForPlayers,
        success: true,
      };
    } catch (error) {
      console.error('❌ Error updating team looking status:', error);
      throw error;
    }
  }
}