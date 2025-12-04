import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Creating test data...');

  // Clean up existing data (only core entities, not user-created teams)
  await prisma.associationAdmin.deleteMany();
  await prisma.season.deleteMany();
  await prisma.division.deleteMany();
  await prisma.league.deleteMany();
  await prisma.sport.deleteMany();

  // Create sport
  const bocce = await prisma.sport.create({
    data: {
      name: 'Bocce',
      description: 'Bocce ball game',
      icon: '🎱',
    },
  });
  console.log(`✓ Created sport: ${bocce.name}`);

  // Create a league
  const league = await prisma.league.create({
    data: {
      name: 'Fall Bocce League',
      description: 'Test bocce league',
      sportId: bocce.id,
    },
  });
  console.log(`✓ Created league: ${league.name}`);

  // Create a season for the league
  const season = await prisma.season.create({
    data: {
      name: 'Fall 2025',
      league: { connect: { id: league.id } },
      startDate: new Date('2025-09-01'),
      endDate: new Date('2025-11-30'),
    } as any,
  });
  console.log(`✓ Created season: ${season.name}`);

  // Create a division within the season
  const division = await prisma.division.create({
    data: {
      name: 'Competitive',
      season: { connect: { id: season.id } },
    } as any,
  });
  console.log(`✓ Created division: ${division.name}`);

  // Get or create the admin user's captain and player records
  const userId = '709304d7-61a3-49d8-b9e9-36ba9020af3e';
  let captain = await prisma.captain.findUnique({ where: { userId } });
  if (!captain) {
    captain = await prisma.captain.create({
      data: { userId },
    });
    console.log(`✓ Created captain record for ${userId}`);
  }

  let player = await prisma.player.findUnique({ where: { userId } });
  if (!player) {
    player = await prisma.player.create({
      data: {
        userId,
        sportId: bocce.id,
      },
    });
    console.log(`✓ Created player record for ${userId}`);
  }

  // Create a demo team
  const team = await prisma.team.create({
    data: {
      name: 'Demo Team',
      description: 'Test team for development',
      sport: { connect: { id: bocce.id } },
      league: { connect: { id: league.id } },
      division: { connect: { id: division.id } },
      wins: 0,
      losses: 0,
    } as any,
  });
  console.log(`✓ Created team: ${team.name}`);

  // Create TeamCaptain association
  const teamCaptain = await prisma.teamCaptain.upsert({
    where: { 
      teamId_playerId: { teamId: team.id, playerId: player.id }
    },
    update: {},
    create: {
      teamId: team.id,
      playerId: player.id,
      captainId: captain.id,
    },
  });
  console.log(`✓ Linked captain to demo team`);

  // Create TeamPlayer association
  const teamPlayer = await prisma.teamPlayer.upsert({
    where: {
      teamId_playerId: { teamId: team.id, playerId: player.id }
    },
    update: {},
    create: {
      teamId: team.id,
      playerId: player.id,
    },
  });
  console.log(`✓ Linked player to demo team`);

  // Promote your user as admin for this league
  const admin = await prisma.associationAdmin.create({
    data: {
      userId,
      leagueId: league.id,
      role: 'admin',
      permissions: ['manage_teams', 'manage_players', 'manage_captains', 'set_rules'],
    },
  });
  console.log(`✓ Promoted ryan@vintaragroup.com as admin for ${league.name}`);

  // Create test notifications
  await prisma.notification.deleteMany({ where: { userId } });
  
  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        userId,
        type: 'team',
        title: 'Team Invitation',
        message: 'You\'ve been invited to join the Bocce A Team!',
        read: false,
        actionUrl: '/teams/bocce-a',
      },
    }),
    prisma.notification.create({
      data: {
        userId,
        type: 'match',
        title: 'Upcoming Match',
        message: 'Your Bocce match is scheduled for tomorrow at 2 PM',
        read: false,
        actionUrl: '/matches/upcoming',
      },
    }),
    prisma.notification.create({
      data: {
        userId,
        type: 'achievement',
        title: 'Achievement Unlocked!',
        message: 'You\'ve earned the "Rising Star" achievement',
        read: false,
        actionUrl: '/achievements',
      },
    }),
    prisma.notification.create({
      data: {
        userId,
        type: 'alert',
        title: 'Request Pending',
        message: 'Your team captain transfer request is awaiting approval',
        read: true, // Mark as read
        actionUrl: '/notifications',
      },
    }),
  ]);
  console.log(`✓ Created ${notifications.length} test notifications (3 unread)`);

  console.log('\n✅ Seed completed!');
}

seed()
  .catch(e => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

