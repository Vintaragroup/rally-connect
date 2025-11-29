import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function makeAdmin() {
  try {
    console.log('🔧 Making ryan@test.com an admin...');

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: 'ryan@test.com' },
    });

    if (!user) {
      console.error('❌ User not found: ryan@test.com');
      process.exit(1);
    }

    console.log(`✓ Found user: ${user.email} (ID: ${user.id})`);

    // Update user role to ADMIN
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { role: 'ADMIN' },
    });

    console.log(`✓ Updated user role to: ${updatedUser.role}`);

    // Find or create a sport first
    let sport = await prisma.sport.findFirst({
      take: 1,
    });

    if (!sport) {
      console.log('🏆 No sport found, creating Pickleball...');
      sport = await prisma.sport.create({
        data: {
          name: 'Pickleball',
          description: 'Pickleball sport',
          icon: '🏓',
        },
      });
      console.log(`✓ Created sport: ${sport.name} (ID: ${sport.id})`);
    } else {
      console.log(`✓ Using existing sport: ${sport.name} (ID: ${sport.id})`);
    }

    // Find or create a league for the admin
    let league = await prisma.league.findFirst({
      take: 1,
    });

    if (!league) {
      console.log('📋 No league found, creating default league...');
      league = await prisma.league.create({
        data: {
          name: 'Default League',
          description: 'Default league for admin testing',
          sportId: sport.id,
        },
      });
      console.log(`✓ Created league: ${league.name} (ID: ${league.id})`);
    } else {
      console.log(`✓ Using existing league: ${league.name} (ID: ${league.id})`);
    }

    // Create AssociationAdmin record if it doesn't exist
    const existingAdmin = await prisma.associationAdmin.findUnique({
      where: { 
        userId_leagueId: {
          userId: user.id,
          leagueId: league.id,
        }
      },
    });

    if (!existingAdmin) {
      const admin = await prisma.associationAdmin.create({
        data: {
          userId: user.id,
          leagueId: league.id,
          role: 'admin',
          permissions: ['manage_teams', 'manage_players', 'manage_captains', 'set_rules'],
        },
      });
      console.log(`✓ Created AssociationAdmin record (ID: ${admin.id})`);
    } else {
      console.log(`✓ AssociationAdmin record already exists`);
    }

    console.log('✅ ryan@test.com is now an admin!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

makeAdmin();
