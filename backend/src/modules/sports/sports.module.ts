import { Module } from '@nestjs/common';
import { PrismaModule } from '@common/prisma/prisma.module';
import { SportsController } from './sports.controller';
import { SportsService } from './sports.service';

@Module({
  imports: [PrismaModule],
  controllers: [SportsController],
  providers: [SportsService],
  exports: [SportsService],
})
export class SportsModule {}
