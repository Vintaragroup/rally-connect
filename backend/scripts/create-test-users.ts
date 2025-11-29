#!/usr/bin/env ts-node
/**
 * Create test users with different roles and teams for integration testing
 * Run with: npm run ts-node -- scripts/create-test-users.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧪 Creating test users...');

  // Get existing sports, leagues, divisions
  const bocce = await prisma.sport.findFirst({ where: { name: 'Bocce' } });
  const pickleball = await prisma.sport.findFirst({ where: { name: 'Pickleball' } });
  
  const league = await prisma.league.findFirst();
  const division = await prisma.division.findFirst();

  if (!bocce || !pickleball || !league || !division) {
    console.error('❌ Cannot find required sport, league, or division. Run prisma:seed first.');
    process.exit(1);
  }

  // Create Test User 1: Captain (Bocce)
  const captain1 = await prisma.user.create({
    data: {
      id: 'test-captain-1',
      email: 'captain1@test.local',
      firstName: 'Sarah',
      lastName: 'Johnson',
      password: 'test-password',
      role: 'CAPTAIN',
      onboardingCompleted: true,
    },
  });
  console.log(`✓ Created captain1: ${captain1.email} (${captain1.firstName} ${captain1.lastName})`);

  // Create Test User 2: Captain (Pickleball)
  const captain2 = await prisma.user.create({
    data: {
      id: 'test-captain-2',
      email: 'captain2@test.local',
      firstName: 'Michael',
      lastName: 'Chen',
      password: 'test-password',
      role: 'CAPTAIN',
      onboardingCompleted: true,
    },
  });
  console.log(`✓ Created captain2: ${captain2.email} (${captain2.firstName} ${captain2.lastName})`);

  // Create Test User 3: Player
  const player1 = await prisma.user.create({
    data: {
      id: 'test-player-1',
      email: 'player1@test.local',
      firstName: 'Emily',
      lastName: 'Rodriguez',
      password: 'test-password',
      role: 'PLAYER',
      onboardingCompleted: true,
    },
  });
  console.log(`✓ Created player1: ${player1.email} (${player1.firstName} ${player1.lastName})`);

  // Create Test User 4: Player
  const player2 = await prisma.user.create({
    data: {
      id: 'test-player-2',
      email: 'player2@test.local',
      firstName: 'James',
      lastName: 'Wilson',
      password: 'test-password',
      role: 'PLAYER',
      onboardingCompleted: true,
    },
  });
  console.log(`✓ Created player2: ${player2.email} (${player2.firstName} ${player2.lastName})`);

  // Create Captain records
  const captainRecord1 = await prisma.captain.create({
    data: { userId: captain1.id },
  });
  console.log(`✓ Created captain record for ${captain1.firstName}`);

  const captainRecord2 = await prisma.captain.create({
    data: { userId: captain2.id },
  });
  console.log(`✓ Created captain record for ${captain2.firstName}`);

  // Create Team 1: Sarah's Bocce Team
  const team1 = await prisma.team.create({
    data: {
      name: "Sarah's Bocce Squad",
      sportId: bocce.id,
      leagueId: league.id,
      divisionId: division.id,
      captainId: captainRecord1.id,
      wins: 8,
      losses: 2,
    },
  });
  console.log(`✓ Created team: ${team1.name}`);

  // Create Team 2: Michael's Pickleball Team
  const team2 = await prisma.team.create({
    data: {
      name: "Michael's Pickleball Club",
      sportId: pickleball.id,
      leagueId: league.id,
      divisionId: division.id,
      captainId: captainRecord2.id,
      wins: 6,
      losses: 4,
    },
  });
  console.log(`✓ Created team: ${team2.name}`);

  // Create Player records and add to teams
  const playerRecord1 = await prisma.player.create({
    data: {
      userId: player1.id,
      sportId: bocce.id,
      rating: 4.1,
      wins: 15,
      losses: 5,
    },
  });

  const playerRecord2 = await prisma.player.create({
    data: {
      userId: player2.id,
      sportId: pickleball.id,
      rating: 3.8,
      wins: 10,
      losses: 8,
    },
  });

  // Add players to teams
  await prisma.team.update({
    where: { id: team1.id },
    data: {
      players: {
        connect: [{ id: playerRecord1.id }],
      },
    },
  });
  console.log(`✓ Added ${player1.firstName} to ${team1.name}`);

  await prisma.team.update({
    where: { id: team2.id },
    data: {
      players: {
        connect: [{ id: playerRecord2.id }],
      },
    },
  });
  console.log(`✓ Added ${player2.firstName} to ${team2.name}`);

  // Create some matches
  const match1 = await prisma.match.create({
    data: {
      leagueId: league.id,
      team1Id: team1.id,
      team2Id: team2.id,
      scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      status: 'SCHEDULED',
    },
  });
  console.log(`✓ Created match 1`);

  const match2 = await prisma.match.create({
    data: {
      leagueId: league.id,
      team1Id: team2.id,
      team2Id: team1.id,
      scheduledAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
      status: 'SCHEDULED',
    },
  });
  console.log(`✓ Created match 2`);

  console.log('\n✅ Test users and teams created successfully!');
  console.log('\n📋 Test User IDs:');
  console.log(`  Captain 1: ${captain1.id} (${captain1.email})`);
  console.log(`  Captain 2: ${captain2.id} (${captain2.email})`);
  console.log(`  Player 1:  ${player1.id} (${player1.email})`);
  console.log(`  Player 2:  ${player2.id} (${player2.email})`);
  console.log('\n🏀 Teams:');
  console.log(`  Team 1: ${team1.id} - ${team1.name}`);
  console.log(`  Team 2: ${team2.id} - ${team2.name}`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
