import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';

@Injectable()
export class AssociationAdminService {
  constructor(private prisma: PrismaService) {}

  // ============================================================================
  // User Admin Status
  // ============================================================================

  async getUserAdminStatus(userId: string) {
    const admins = await this.prisma.associationAdmin.findMany({
      where: { userId },
      include: { user: true, league: true },
    });

    return {
      isAdmin: admins.length > 0,
      adminCount: admins.length,
      leagues: admins,
    };
  }

  // ============================================================================
  // Association Admin Management
  // ============================================================================

  async getLeagueAdmins(leagueId: string) {
    return this.prisma.associationAdmin.findMany({
      where: { leagueId },
      include: { user: true, league: true },
    });
  }

  async promoteUserToAdmin(userId?: string, leagueId?: string, role: string = 'admin', email?: string, leagueName?: string) {
    // Resolve userId from email if needed
    let actualUserId = userId;
    let actualLeagueId = leagueId;

    if (!actualUserId && email) {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new BadRequestException(`User not found with email: ${email}`);
      }
      actualUserId = user.id;
    }

    if (!actualLeagueId && leagueName) {
      const league = await this.prisma.league.findFirst({ where: { name: leagueName } });
      if (!league) {
        throw new BadRequestException(`League not found with name: ${leagueName}`);
      }
      actualLeagueId = league.id;
    }

    if (!actualUserId || !actualLeagueId) {
      throw new BadRequestException('userId/email and leagueId/leagueName are required');
    }

    // Check if user exists
    const user = await this.prisma.user.findUnique({ where: { id: actualUserId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Check if already an admin
    const existingAdmin = await this.prisma.associationAdmin.findUnique({
      where: { userId_leagueId: { userId: actualUserId, leagueId: actualLeagueId } },
    });
    if (existingAdmin) {
      throw new BadRequestException('User is already an admin for this league');
    }

    // Create association admin
    const admin = await this.prisma.associationAdmin.create({
      data: {
        userId: actualUserId,
        leagueId: actualLeagueId,
        role,
        permissions: ['manage_teams', 'manage_players', 'manage_captains', 'set_rules'],
      },
      include: { user: true, league: true },
    });

    return admin;
  }

  async removeAdminRole(userId: string, leagueId: string) {
    const admin = await this.prisma.associationAdmin.findUnique({
      where: { userId_leagueId: { userId, leagueId } },
    });
    if (!admin) {
      throw new BadRequestException('Admin record not found');
    }

    return this.prisma.associationAdmin.delete({
      where: { id: admin.id },
    });
  }

  // ============================================================================
  // Captain Request Management
  // ============================================================================

  async requestToBeCaptain(playerId: string, leagueId: string, message?: string, teamId?: string) {
    // Check if player exists
    const player = await this.prisma.player.findUnique({ where: { id: playerId } });
    if (!player) {
      throw new BadRequestException('Player not found');
    }

    // Check if already a captain
    const existingCaptain = await this.prisma.captain.findUnique({
      where: { userId: player.userId },
    });
    if (existingCaptain) {
      throw new BadRequestException('Player is already a captain');
    }

    // Check if request already pending
    const existingRequest = await this.prisma.captainRequest.findFirst({
      where: {
        playerId,
        leagueId,
        status: 'PENDING',
      },
    });
    if (existingRequest) {
      throw new BadRequestException('Captain request already pending for this league');
    }

    // If teamId not provided, find a team from this league
    let actualTeamId = teamId;
    if (!actualTeamId) {
      const teams = await this.prisma.team.findMany({
        where: { leagueId },
        take: 1,
      });
      if (teams.length === 0) {
        throw new BadRequestException('No teams found in this league');
      }
      actualTeamId = teams[0].id;
    }

    const request = await this.prisma.captainRequest.create({
      data: {
        playerId,
        teamId: actualTeamId,
        leagueId,
        requestMessage: message,
        status: 'PENDING',
        source: 'PLAYER',
      },
      include: { player: { include: { user: true } }, league: true, team: true },
    });

    return request;
  }

  async approveCaptainRequest(requestId: string, adminId: string) {
    const request = await this.prisma.captainRequest.findUnique({
      where: { id: requestId },
      include: { player: true, league: true },
    });
    if (!request) {
      throw new BadRequestException('Captain request not found');
    }

    if (request.status !== 'PENDING') {
      throw new BadRequestException('Captain request is not pending');
    }

    // Create captain record for the user
    let captain = await this.prisma.captain.findUnique({
      where: { userId: request.player.userId },
    });
    if (!captain) {
      captain = await this.prisma.captain.create({
        data: { userId: request.player.userId },
      });
    }

    // Update request
    const updatedRequest = await this.prisma.captainRequest.update({
      where: { id: requestId },
      data: {
        status: 'APPROVED',
        approvedAt: new Date(),
        approvedByAdminId: adminId,
      },
      include: { player: { include: { user: true } }, league: true },
    });

    return updatedRequest;
  }

  async rejectCaptainRequest(requestId: string, reason?: string) {
    const request = await this.prisma.captainRequest.findUnique({
      where: { id: requestId },
    });
    if (!request) {
      throw new BadRequestException('Captain request not found');
    }

    if (request.status !== 'PENDING') {
      throw new BadRequestException('Captain request is not pending');
    }

    return this.prisma.captainRequest.update({
      where: { id: requestId },
      data: {
        status: 'REJECTED',
        rejectionReason: reason,
      },
      include: { player: { include: { user: true } }, league: true },
    });
  }

  async getCaptainRequests(leagueId: string, status?: string) {
    const where: any = { leagueId };
    if (status) where.status = status;

    return this.prisma.captainRequest.findMany({
      where,
      include: { player: { include: { user: true } }, league: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ============================================================================
  // Captain Invitation Management
  // ============================================================================

  async invitePlayerToBeCaptain(
    playerId: string,
    leagueId: string,
    adminId: string,
    message?: string,
    expiresInDays: number = 7,
  ) {
    const player = await this.prisma.player.findUnique({ where: { id: playerId } });
    if (!player) {
      throw new BadRequestException('Player not found');
    }

    // Check if already a captain
    const existingCaptain = await this.prisma.captain.findUnique({
      where: { userId: player.userId },
    });
    if (existingCaptain) {
      throw new BadRequestException('Player is already a captain');
    }

    // NOTE: Captain invitations are currently unused - using CaptainRequest instead
    // const invitation = await this.prisma.captainInvitation.create({
    //   data: {
    //     playerId,
    //     leagueId,
    //     sentByAdminId: adminId,
    //     invitationMessage: message,
    //     expiresAt,
    //     status: 'PENDING',
    //   },
    //   include: { player: { include: { user: true } }, league: true },
    // });
    // return invitation;
    
    throw new Error('Captain invitations are not currently implemented. Use CaptainRequest instead.');
  }

  // NOTE: These methods are commented out - using CaptainRequest model instead
  /*
  async acceptCaptainInvitation(invitationId: string, playerId: string) {
    const invitation = await this.prisma.captainInvitation.findUnique({
      where: { id: invitationId },
      include: { player: true },
    });
    if (!invitation) {
      throw new BadRequestException('Invitation not found');
    }

    if (invitation.playerId !== playerId) {
      throw new ForbiddenException('This invitation is not for you');
    }

    if (invitation.status !== 'PENDING') {
      throw new BadRequestException('Invitation is no longer pending');
    }

    if (new Date() > invitation.expiresAt) {
      throw new BadRequestException('Invitation has expired');
    }

    // Create captain record
    let captain = await this.prisma.captain.findUnique({
      where: { userId: invitation.player.userId },
    });
    if (!captain) {
      captain = await this.prisma.captain.create({
        data: { userId: invitation.player.userId },
      });
    }

    const updatedInvitation = await this.prisma.captainInvitation.update({
      where: { id: invitationId },
      data: {
        status: 'accepted',
        respondedAt: new Date(),
        response: 'accepted',
      },
      include: { player: { include: { user: true } }, league: true },
    });

    return updatedInvitation;
  }

  async rejectCaptainInvitation(invitationId: string, playerId: string) {
    const invitation = await this.prisma.captainInvitation.findUnique({
      where: { id: invitationId },
    });
    if (!invitation) {
      throw new BadRequestException('Invitation not found');
    }

    if (invitation.playerId !== playerId) {
      throw new ForbiddenException('This invitation is not for you');
    }

    if (invitation.status !== 'PENDING') {
      throw new BadRequestException('Invitation is no longer pending');
    }

    return this.prisma.captainInvitation.update({
      where: { id: invitationId },
      data: {
        status: 'REJECTED',
        respondedAt: new Date(),
        response: 'rejected',
      },
      include: { player: { include: { user: true } }, league: true },
    });
  }

  async getPendingCaptainInvitations(playerId: string) {
    return this.prisma.captainInvitation.findMany({
      where: {
        playerId,
        status: 'PENDING',
        expiresAt: { gt: new Date() },
      },
      include: { league: true },
      orderBy: { createdAt: 'desc' },
    });
  }
  */

  // ============================================================================
  // League Rules Management
  // ============================================================================

  async setLeagueRules(leagueId: string, rules: any) {
    const existingRules = await this.prisma.leagueRules.findUnique({
      where: { leagueId },
    });

    if (existingRules) {
      return this.prisma.leagueRules.update({
        where: { leagueId },
        data: rules,
      });
    }

    return this.prisma.leagueRules.create({
      data: {
        leagueId,
        ...rules,
      },
    });
  }

  async getLeagueRules(leagueId: string) {
    return this.prisma.leagueRules.findUnique({
      where: { leagueId },
    });
  }
}
