import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { randomBytes } from 'crypto';

@Injectable()
export class InvitationCodeService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generate a new invitation code for organization + sport
   */
  async generateCode(data: {
    organizationId: string;
    sportId: string;
    createdBy: string;
    expiresAt?: Date;
  }): Promise<{ code: string; success: boolean }> {
    try {
      // Verify organization exists
      const org = await this.prisma.league.findUnique({
        where: { id: data.organizationId },
      });

      if (!org) {
        throw new NotFoundException('Organization not found');
      }

      // Verify sport exists
      const sport = await this.prisma.sport.findUnique({
        where: { id: data.sportId },
      });

      if (!sport) {
        throw new NotFoundException('Sport not found');
      }

      // Generate unique code
      const code = this.generateRandomCode();

      // Create invitation code
      const invitationCode = await this.prisma.invitationCode.create({
        data: {
          code,
          organizationId: data.organizationId,
          sportId: data.sportId,
          createdBy: data.createdBy,
          expiresAt: data.expiresAt,
        },
      });

      console.log(`✓ Invitation code generated: ${code} for org ${data.organizationId}`);

      return {
        code: invitationCode.code,
        success: true,
      };
    } catch (error) {
      console.error('❌ Error generating invitation code:', error);
      throw error;
    }
  }

  /**
   * Validate and redeem invitation code
   */
  async validateAndRedeemCode(code: string, userId: string): Promise<{
    organizationId: string;
    sportId: string;
    success: boolean;
  }> {
    try {
      // Find and validate code
      const invitationCode = await this.prisma.invitationCode.findUnique({
        where: { code },
      });

      if (!invitationCode) {
        throw new BadRequestException('Invalid invitation code');
      }

      // Check if code is expired
      if (invitationCode.expiresAt && new Date() > invitationCode.expiresAt) {
        throw new BadRequestException('Invitation code has expired');
      }

      // Check if code is already used (for single-use codes)
      if (invitationCode.isUsed) {
        throw new BadRequestException('Invitation code has already been used');
      }

      // Check usage limit
      if (invitationCode.usedBy.length >= invitationCode.usageLimit) {
        throw new BadRequestException('Invitation code usage limit reached');
      }

      // Redeem code - add user to usedBy array
      const updatedCode = await this.prisma.invitationCode.update({
        where: { code },
        data: {
          usedBy: {
            push: userId,
          },
          isUsed: invitationCode.usageLimit === 1, // Mark as used if single-use
        },
      });

      // Update user's organization
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          currentOrganizationId: invitationCode.organizationId,
        },
      });

      console.log(
        `✓ Code redeemed: ${code} by user ${userId} for org ${invitationCode.organizationId}`
      );

      return {
        organizationId: invitationCode.organizationId,
        sportId: invitationCode.sportId,
        success: true,
      };
    } catch (error) {
      console.error('❌ Error validating code:', error);
      throw error;
    }
  }

  /**
   * Get all invitation codes for organization (admin only)
   */
  async getCodesForOrganization(organizationId: string): Promise<any[]> {
    try {
      const codes = await this.prisma.invitationCode.findMany({
        where: {
          organizationId,
        },
      });

      return codes;
    } catch (error) {
      console.error('❌ Error getting codes for organization:', error);
      throw error;
    }
  }

  /**
   * Revoke an invitation code
   */
  async revokeCode(codeId: string): Promise<{ success: boolean }> {
    try {
      await this.prisma.invitationCode.delete({
        where: { id: codeId },
      });

      console.log(`✓ Invitation code revoked: ${codeId}`);

      return { success: true };
    } catch (error) {
      console.error('❌ Error revoking code:', error);
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
}
