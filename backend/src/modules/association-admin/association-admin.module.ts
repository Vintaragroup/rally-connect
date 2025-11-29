import { Module } from '@nestjs/common';
import { PrismaModule } from '@common/prisma/prisma.module';
import { AssociationAdminService } from './association-admin.service';
import { AssociationAdminController } from './association-admin.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AssociationAdminController],
  providers: [AssociationAdminService],
  exports: [AssociationAdminService],
})
export class AssociationAdminModule {}
