import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class CaptainRequestService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Send captain request to a player (admin only)
   */
  async sendCaptainRequest(data: {
    playerId: string;
    teamId: string;
    leagueId: string;
    requestedByAdminId: string;
    message?: string;
  }): Promise<{ success: boolean; requestId: string }> {
    try {
      // Verify player exists
      const player = await this.prisma.user.findUnique({
        where: { id: data.playerId },
      });

      if (!player) {
        throw new NotFoundException('Player not found');
      }

      // Verify team exists
      const team = await this.prisma.team.findUnique({
        where: { id: data.teamId },
      });

      if (!team) {
        throw new NotFoundException('Team not found');
      }

      // Verify league exists
      const league = await this.prisma.league.findUnique({
        where: { id: data.leagueId },
      });

      if (!league) {
        throw new NotFoundException('League not found');
      }

      // Create captain request
      const request = await this.prisma.captainRequest.create({
        data: {
          playerId: data.playerId,
          teamId: data.teamId,
          leagueId: data.leagueId,
          approvedByAdminId: data.requestedByAdminId,
          source: 'ADMIN',
          status: 'PENDING',
          requestMessage: data.message,
        },
      });

      console.log(
        `✓ Captain request sent to ${data.playerId} for team ${data.teamId}`
      );

      return {
        success: true,
        requestId: request.id,
      };
    } catch (error) {
      console.error('❌ Error sending captain request:', error);
      throw error;
    }
  }

  /**
   * Player accepts captain request
   */
  async acceptCaptainRequest(requestId: string): Promise<{ success: boolean }> {
    try {
      // Find request
      const request = await this.prisma.captainRequest.findUnique({
        where: { id: requestId },
      });

      if (!request) {
        throw new NotFoundException('Captain request not found');
      }

      if (request.status !== 'PENDING') {
        throw new BadRequestException('Request is no longer pending');
      }

      // Update request status
      await this.prisma.captainRequest.update({
        where: { id: requestId },
        data: {
          status: 'APPROVED',
          approvedAt: new Date(),
        },
      });

      // Update user role to CAPTAIN
      await this.prisma.user.update({
        where: { id: request.playerId },
        data: {
          role: 'CAPTAIN',
        },
      });

      console.log(`✓ Captain request accepted by ${request.playerId}`);

      return { success: true };
    } catch (error) {
      console.error('❌ Error accepting captain request:', error);
      throw error;
    }
  }

  /**
   * Player declines captain request
   */
  async declineCaptainRequest(
    requestId: string,
    reason?: string
  ): Promise<{ success: boolean }> {
    try {
      // Find request
      const request = await this.prisma.captainRequest.findUnique({
        where: { id: requestId },
      });

      if (!request) {
        throw new NotFoundException('Captain request not found');
      }

      if (request.status !== 'PENDING') {
        throw new BadRequestException('Request is no longer pending');
      }

      // Update request status
      await this.prisma.captainRequest.update({
        where: { id: requestId },
        data: {
          status: 'REJECTED',
          rejectionReason: reason,
        },
      });

      console.log(`✓ Captain request declined by ${request.playerId}`);

      return { success: true };
    } catch (error) {
      console.error('❌ Error declining captain request:', error);
      throw error;
    }
  }

  /**
   * Get all pending captain requests for a player
   */
  async getPendingRequestsForPlayer(
    playerId: string
  ): Promise<any[]> {
    try {
      const requests = await this.prisma.captainRequest.findMany({
        where: {
          playerId,
          status: 'PENDING',
        },
        include: {
          team: {
            select: {
              id: true,
              name: true,
              sport: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          league: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return requests;
    } catch (error) {
      console.error('❌ Error getting pending captain requests:', error);
      throw error;
    }
  }

  /**
   * Get all captain requests for a team (admin view)
   */
  async getRequestsForTeam(teamId: string): Promise<any[]> {
    try {
      const requests = await this.prisma.captainRequest.findMany({
        where: { teamId },
        include: {
          team: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return requests;
    } catch (error) {
      console.error('❌ Error getting captain requests for team:', error);
      throw error;
    }
  }
}
