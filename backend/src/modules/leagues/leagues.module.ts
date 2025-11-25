import { Module } from '@nestjs/common';
import { PrismaModule } from '@common/prisma/prisma.module';
import { LeaguesController } from './leagues.controller';
import { LeaguesService } from './leagues.service';

@Module({
  imports: [PrismaModule],
  controllers: [LeaguesController],
  providers: [LeaguesService],
  exports: [LeaguesService],
})
export class LeaguesModule {}
