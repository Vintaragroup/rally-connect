import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  try {
    // Get or create Ryan (vintaragroup)
    const ryanId = '709304d7-61a3-49d8-b9e9-36ba9020af3e';
    let ryan = await prisma.user.findUnique({ where: { id: ryanId } });
    
    if (!ryan) {
      ryan = await prisma.user.create({
        data: {
          id: ryanId,
          email: 'ryan@vintaragroup.com',
          password: '',
          firstName: 'Ryan',
          lastName: 'Morrow',
          role: 'ADMIN',
          onboardingCompleted: true,
        },
      });
      console.log('✓ Created Ryan user (ryan@vintaragroup.com)');
    }

    // Make ryan@test.com an admin too
    let ryanTest = await prisma.user.findUnique({ where: { email: 'ryan@test.com' } });
    if (ryanTest) {
      // Update to ADMIN role
      if (ryanTest.role !== 'ADMIN') {
        ryanTest = await prisma.user.update({
          where: { id: ryanTest.id },
          data: { role: 'ADMIN' },
        });
        console.log('✓ Made ryan@test.com an ADMIN');
      }
    } else {
      console.log('ℹ️  ryan@test.com not found in database (will be created on first signup)');
    }

    // Get or create Bocce sport
    let bocce = await prisma.sport.findFirst({ where: { name: 'Bocce' } });
    if (!bocce) {
      bocce = await prisma.sport.create({
        data: {
          name: 'Bocce',
          description: 'Bocce ball game',
          icon: '🎱',
        },
      });
      console.log('✓ Created Bocce sport');
    }

    // Get or create league
    let league = await prisma.league.findFirst({ where: { name: 'Fall Bocce League' } });
    if (!league) {
      league = await prisma.league.create({
        data: {
          name: 'Fall Bocce League',
          description: 'Test bocce league',
          sportId: bocce.id,
        },
      });
      console.log('✓ Created Fall Bocce League');
    }

    // Get or create season
    let season = await prisma.season.findFirst({ where: { name: 'Fall 2025' } });
    if (!season) {
      season = await prisma.season.create({
        data: {
          name: 'Fall 2025',
          leagueId: league.id,
          startDate: new Date('2025-09-01'),
          endDate: new Date('2025-11-30'),
        },
      });
      console.log('✓ Created Fall 2025 season');
    }

    // Get or create division
    let division = await prisma.division.findFirst({ where: { name: 'Competitive', seasonId: season.id } });
    if (!division) {
      division = await prisma.division.create({
        data: {
          name: 'Competitive',
          seasonId: season.id,
        },
      });
      console.log('✓ Created Competitive division');
    }

    // Get or create captain and player for Ryan
    let captain = await prisma.captain.findUnique({ where: { userId: ryanId } });
    if (!captain) {
      captain = await prisma.captain.create({
        data: { userId: ryanId },
      });
      console.log('✓ Created captain record for Ryan');
    }

    let player = await prisma.player.findUnique({ where: { userId: ryanId } });
    if (!player) {
      player = await prisma.player.create({
        data: {
          userId: ryanId,
          sportId: bocce.id,
        },
      });
      console.log('✓ Created player record for Ryan');
    }

    // Create or get Demo Team
    let demoTeam = await prisma.team.findFirst({ where: { name: 'Demo Team' } });
    if (!demoTeam) {
      demoTeam = await prisma.team.create({
        data: {
          name: 'Demo Team',
          description: 'Test team for development',
          sportId: bocce.id,
          leagueId: league.id,
          divisionId: division.id,
        },
      });
      console.log('✓ Created Demo Team');
    }

    // Link Ryan to Demo Team as captain and player
    const existingTeamCaptain = await prisma.teamCaptain.findUnique({
      where: { teamId_playerId: { teamId: demoTeam.id, playerId: player.id } }
    }).catch(() => null);

    if (!existingTeamCaptain) {
      await prisma.teamCaptain.create({
        data: {
          teamId: demoTeam.id,
          playerId: player.id,
          captainId: captain.id,
        },
      });
      console.log('✓ Linked Ryan as captain to Demo Team');
    }

    const existingTeamPlayer = await prisma.teamPlayer.findUnique({
      where: { teamId_playerId: { teamId: demoTeam.id, playerId: player.id } }
    }).catch(() => null);

    if (!existingTeamPlayer) {
      await prisma.teamPlayer.create({
        data: {
          teamId: demoTeam.id,
          playerId: player.id,
        },
      });
      console.log('✓ Linked Ryan as player to Demo Team');
    }

    // Get or create association admin for Ryan
    let admin = await prisma.associationAdmin.findUnique({
      where: { userId_leagueId: { userId: ryanId, leagueId: league.id } }
    }).catch(() => null);

    if (!admin) {
      admin = await prisma.associationAdmin.create({
        data: {
          userId: ryanId,
          leagueId: league.id,
          role: 'admin',
          permissions: ['manage_teams', 'manage_players', 'manage_captains', 'set_rules'],
        },
      });
      console.log('✓ Promoted Ryan as admin for Fall Bocce League');
    }

    // Make ryan@test.com an association admin too (if they exist)
    if (ryanTest) {
      const ryanTestAdmin = await prisma.associationAdmin.findUnique({
        where: { userId_leagueId: { userId: ryanTest.id, leagueId: league.id } }
      }).catch(() => null);

      if (!ryanTestAdmin) {
        await prisma.associationAdmin.create({
          data: {
            userId: ryanTest.id,
            leagueId: league.id,
            role: 'admin',
            permissions: ['manage_teams', 'manage_players', 'manage_captains', 'set_rules'],
          },
        });
        console.log('✓ Promoted ryan@test.com as admin for Fall Bocce League');
      }
    }

    // Create test notifications for Ryan
    await prisma.notification.deleteMany({ where: { userId: ryanId } });
    
    const notifications = await Promise.all([
      prisma.notification.create({
        data: {
          userId: ryanId,
          type: 'team',
          title: 'Team Invitation',
          message: 'You\'ve been invited to join the Bocce A Team!',
          read: false,
          actionUrl: '/teams/bocce-a',
        },
      }),
      prisma.notification.create({
        data: {
          userId: ryanId,
          type: 'match',
          title: 'Upcoming Match',
          message: 'Your Bocce match is scheduled for tomorrow at 2 PM',
          read: false,
          actionUrl: '/matches/upcoming',
        },
      }),
      prisma.notification.create({
        data: {
          userId: ryanId,
          type: 'achievement',
          title: 'Achievement Unlocked!',
          message: 'You\'ve earned the "Rising Star" achievement',
          read: false,
          actionUrl: '/achievements',
        },
      }),
      prisma.notification.create({
        data: {
          userId: ryanId,
          type: 'alert',
          title: 'Request Pending',
          message: 'Your team captain transfer request is awaiting approval',
          read: true, // Mark as read
          actionUrl: '/notifications',
        },
      }),
    ]);
    console.log(`✓ Created ${notifications.length} test notifications for Ryan (3 unread)`);

    console.log('\n✅ Seed completed!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
