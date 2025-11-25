import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private prisma: PrismaService) {}

  async getHealth() {
    try {
      // Try to query the database
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: 'connected',
      };
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: err.message,
      };
    }
  }
}
