import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';

@Injectable()
export class SportsService {
  constructor(private prisma: PrismaService) {}

  async getAllSports() {
    return this.prisma.sport.findMany();
  }

  async getSportById(id: string) {
    return this.prisma.sport.findUnique({ where: { id } });
  }

  async createSport(name: string, description: string, icon: string) {
    return this.prisma.sport.create({
      data: { name, description, icon },
    });
  }
}
