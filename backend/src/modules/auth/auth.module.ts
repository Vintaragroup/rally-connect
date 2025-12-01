import { Module } from '@nestjs/common';
import { PrismaModule } from '@/common/prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { InvitationCodeService } from './invitation-code.service';
import { CaptainRequestService } from './captain-request.service';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, InvitationCodeService, CaptainRequestService],
  exports: [AuthService, InvitationCodeService, CaptainRequestService],
})
export class AuthModule {}
