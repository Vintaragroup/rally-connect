import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✓ Database connected');
    } catch (error) {
      console.error('⚠️ Database connection failed:', error instanceof Error ? error.message : error);
      console.log('⚠️ Continuing without database - API will run in read-only mode');
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
    } catch (error) {
      console.log('Database already disconnected');
    }
  }
}
