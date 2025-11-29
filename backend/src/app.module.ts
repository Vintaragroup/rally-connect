import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { SportsModule } from './modules/sports/sports.module';
import { LeaguesModule } from './modules/leagues/leagues.module';
import { TeamsModule } from './modules/teams/teams.module';
import { PlayersModule } from './modules/players/players.module';
import { MatchesModule } from './modules/matches/matches.module';
import { StandingsModule } from './modules/standings/standings.module';
import { AuthModule } from './modules/auth/auth.module';
import { AssociationAdminModule } from './modules/association-admin/association-admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development',
    }),
    PrismaModule,
    HealthModule,
    SportsModule,
    LeaguesModule,
    TeamsModule,
    PlayersModule,
    MatchesModule,
    StandingsModule,
    AuthModule,
    AssociationAdminModule,
  ],
})
export class AppModule {}

