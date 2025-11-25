/// <reference types="node" />
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.playerAchievement.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.waitlistEntry.deleteMany();
  await prisma.duesPayment.deleteMany();
  await prisma.courtBooking.deleteMany();
  await prisma.court.deleteMany();
  await prisma.facility.deleteMany();
  await prisma.ratingHistory.deleteMany();
  await prisma.playerRating.deleteMany();
  await prisma.matchAvailability.deleteMany();
  await prisma.lineupAssignment.deleteMany();
  await prisma.lineup.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.standing.deleteMany();
  await prisma.match.deleteMany();
  await prisma.playerStats.deleteMany();
  await prisma.player.deleteMany();
  await prisma.teamInvitation.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.captain.deleteMany();
  await prisma.division.deleteMany();
  await prisma.league.deleteMany();
  await prisma.club.deleteMany();
  await prisma.sport.deleteMany();
  await prisma.user.deleteMany();

  console.log('✓ Cleaned existing data');

  // Create Sports
  const pickleball = await prisma.sport.create({
    data: {
      name: 'Pickleball',
      description: 'The fastest growing sport in America',
      icon: '🏓',
    },
  });

  const tennis = await prisma.sport.create({
    data: {
      name: 'Tennis',
      description: 'Classic racket sport',
      icon: '🎾',
    },
  });

  const racquetball = await prisma.sport.create({
    data: {
      name: 'Racquetball',
      description: 'Fast-paced indoor sport',
      icon: '⚡',
    },
  });

  console.log('✓ Created 3 sports');

  // Create Clubs
  const club1 = await prisma.club.create({
    data: {
      name: 'Downtown Sports Complex',
      description: 'Premier facility with 10 courts',
      city: 'Denver',
      state: 'CO',
    },
  });

  const club2 = await prisma.club.create({
    data: {
      name: 'Westside Courts',
      description: 'Community-focused venue',
      city: 'Denver',
      state: 'CO',
    },
  });

  console.log('✓ Created 2 clubs');

  // Create Leagues
  const pickleballLeague = await prisma.league.create({
    data: {
      name: 'Denver Pickleball Pro League',
      description: 'Competitive pickleball league',
      sportId: pickleball.id,
    },
  });

  const tennisLeague = await prisma.league.create({
    data: {
      name: 'Denver Tennis League',
      description: 'Community tennis league',
      sportId: tennis.id,
    },
  });

  console.log('✓ Created 2 leagues');

  // Create Divisions
  const div1 = await prisma.division.create({
    data: {
      name: 'Premier',
      leagueId: pickleballLeague.id,
    },
  });

  const div2 = await prisma.division.create({
    data: {
      name: 'Intermediate',
      leagueId: pickleballLeague.id,
    },
  });

  const div3 = await prisma.division.create({
    data: {
      name: 'Beginner',
      leagueId: pickleballLeague.id,
    },
  });

  const tenDiv1 = await prisma.division.create({
    data: {
      name: 'Open',
      leagueId: tennisLeague.id,
    },
  });

  console.log('✓ Created 4 divisions');

  // Create Users and Teams
  const users = [];
  for (let i = 1; i <= 20; i++) {
    const user = await prisma.user.create({
      data: {
        email: `player${i}@rally.local`,
        password: 'hashed_password', // In production, these would be hashed
        firstName: `Player`,
        lastName: `${i}`,
        role: i <= 2 ? 'CAPTAIN' : 'PLAYER',
      },
    });
    users.push(user);
  }

  console.log('✓ Created 20 users');

  // Create Captains and Teams
  const captain1 = await prisma.captain.create({
    data: { userId: users[0].id },
  });

  const captain2 = await prisma.captain.create({
    data: { userId: users[1].id },
  });

  const captain3 = await prisma.captain.create({
    data: { userId: users[2].id },
  });

  console.log('✓ Created 3 captains');

  const team1 = await prisma.team.create({
    data: {
      name: 'Smash & Bash',
      description: 'High-energy competitive team',
      sportId: pickleball.id,
      leagueId: pickleballLeague.id,
      divisionId: div1.id,
      clubId: club1.id,
      captainId: captain1.id,
      wins: 12,
      losses: 3,
    },
  });

  const team2 = await prisma.team.create({
    data: {
      name: 'Court Kings',
      description: 'Experienced tournament players',
      sportId: pickleball.id,
      leagueId: pickleballLeague.id,
      divisionId: div1.id,
      clubId: club1.id,
      captainId: captain2.id,
      wins: 10,
      losses: 5,
    },
  });

  const team3 = await prisma.team.create({
    data: {
      name: 'Intermediate Warriors',
      sportId: pickleball.id,
      leagueId: pickleballLeague.id,
      divisionId: div2.id,
      clubId: club2.id,
      captainId: captain3.id,
      wins: 6,
      losses: 8,
    },
  });

  console.log('✓ Created 3 teams');

  // Create Players
  const players = [];
  for (let i = 3; i < 20; i++) {
    const player = await prisma.player.create({
      data: {
        userId: users[i].id,
        sportId: pickleball.id,
        rating: 3.0 + Math.random() * 2,
        wins: Math.floor(Math.random() * 50),
        losses: Math.floor(Math.random() * 30),
      },
    });
    players.push(player);

    // Assign players to teams
    if (i < 9) {
      await prisma.team.update({
        where: { id: team1.id },
        data: { players: { connect: { id: player.id } } },
      });
    } else if (i < 14) {
      await prisma.team.update({
        where: { id: team2.id },
        data: { players: { connect: { id: player.id } } },
      });
    } else {
      await prisma.team.update({
        where: { id: team3.id },
        data: { players: { connect: { id: player.id } } },
      });
    }
  }

  console.log('✓ Created 17 players and assigned to teams');

  // Create PlayerStats
  for (const player of players) {
    const gamesPlayed = player.wins + player.losses;
    const winPercentage = gamesPlayed > 0 ? (player.wins / gamesPlayed) * 100 : 0;

    await prisma.playerStats.create({
      data: {
        playerId: player.id,
        gamesPlayed,
        gamesWon: player.wins,
        gamesLost: player.losses,
        winPercentage,
        pointsFor: Math.floor(Math.random() * 500),
        pointsAgainst: Math.floor(Math.random() * 500),
        streakWins: Math.floor(Math.random() * 5),
        streakType: 'win',
      },
    });
  }

  console.log('✓ Created player statistics');

  // Create Standings
  await prisma.standing.create({
    data: {
      divisionId: div1.id,
      teamId: team1.id,
      wins: 12,
      losses: 3,
      winPercentage: 0.8,
      pointsFor: 250,
      pointsAgainst: 180,
    },
  });

  await prisma.standing.create({
    data: {
      divisionId: div1.id,
      teamId: team2.id,
      wins: 10,
      losses: 5,
      winPercentage: 0.667,
      pointsFor: 230,
      pointsAgainst: 200,
    },
  });

  await prisma.standing.create({
    data: {
      divisionId: div2.id,
      teamId: team3.id,
      wins: 6,
      losses: 8,
      winPercentage: 0.429,
      pointsFor: 200,
      pointsAgainst: 220,
    },
  });

  console.log('✓ Created standings');

  // Create Matches
  const match1 = await prisma.match.create({
    data: {
      leagueId: pickleballLeague.id,
      team1Id: team1.id,
      team2Id: team2.id,
      team1Score: 11,
      team2Score: 9,
      status: 'COMPLETED',
      scheduledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      courtName: 'Court 1 - Downtown Complex',
    },
  });

  const match2 = await prisma.match.create({
    data: {
      leagueId: pickleballLeague.id,
      team1Id: team1.id,
      team2Id: team3.id,
      team1Score: null,
      team2Score: null,
      status: 'SCHEDULED',
      scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      courtName: 'Court 3 - Westside Courts',
    },
  });

  console.log('✓ Created 2 matches');

  // Create Achievements
  const achiev1 = await prisma.achievement.create({
    data: {
      name: 'First Win',
      description: 'Win your first match',
      icon: '🎉',
    },
  });

  const achiev2 = await prisma.achievement.create({
    data: {
      name: 'Streak Master',
      description: 'Win 5 matches in a row',
      icon: '🔥',
    },
  });

  const achiev3 = await prisma.achievement.create({
    data: {
      name: 'Rating Champion',
      description: 'Reach a 4.5+ rating',
      icon: '⭐',
    },
  });

  console.log('✓ Created 3 achievements');

  // Assign achievements to players
  if (players.length > 0) {
    await prisma.playerAchievement.create({
      data: {
        playerId: players[0].id,
        achievementId: achiev1.id,
      },
    });

    await prisma.playerAchievement.create({
      data: {
        playerId: players[1].id,
        achievementId: achiev2.id,
      },
    });
  }

  console.log('✓ Assigned achievements to players');

  console.log('\n✅ Database seeded successfully!');
  console.log(`
  Stats:
  - Sports: 3
  - Clubs: 2
  - Leagues: 2
  - Divisions: 4
  - Users: 20
  - Captains: 2
  - Teams: 3
  - Players: 18
  - Matches: 2
  - Achievements: 3
  `);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
