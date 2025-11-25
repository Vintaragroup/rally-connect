-- ============================================================================
-- Seed Test Data for Rally Connect Supabase Database
-- ============================================================================

-- ============================================================================
-- Sports
-- ============================================================================
INSERT INTO "Sport" ("id", "name", "description", "icon", "createdAt", "updatedAt") VALUES
('sport-1', 'Bocce', 'Bocce ball game', '🎱', NOW(), NOW()),
('sport-2', 'Pickleball', 'Fast-paced paddle sport', '🏓', NOW(), NOW()),
('sport-3', 'Padel', 'Tennis hybrid sport', '🎾', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Clubs
-- ============================================================================
INSERT INTO "Club" ("id", "name", "description", "logo", "city", "state", "createdAt", "updatedAt") VALUES
('club-1', 'Downtown Sports Club', 'Premier sports facility in downtown', '🏢', 'San Francisco', 'CA', NOW(), NOW()),
('club-2', 'Riverside Community Club', 'Community-focused sports club', '🏘️', 'Oakland', 'CA', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Facilities
-- ============================================================================
INSERT INTO "Facility" ("id", "name", "address", "city", "state", "zipCode", "sport", "createdAt", "updatedAt") VALUES
('fac-1', 'Downtown Courts', '123 Main St', 'San Francisco', 'CA', '94105', 'Bocce,Pickleball', NOW(), NOW()),
('fac-2', 'Riverside Venue', '456 Oak Ave', 'Oakland', 'CA', '94611', 'Padel', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Courts
-- ============================================================================
INSERT INTO "Court" ("id", "facilityId", "name", "courtNum") VALUES
('court-1', 'fac-1', 'Court A', 1),
('court-2', 'fac-1', 'Court B', 2),
('court-3', 'fac-2', 'Court 1', 1)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Achievements
-- ============================================================================
INSERT INTO "Achievement" ("id", "name", "description", "icon", "createdAt", "updatedAt") VALUES
('ach-1', 'First Victory', 'Win your first match', '🥇', NOW(), NOW()),
('ach-2', 'On Fire', 'Win 5 consecutive matches', '🔥', NOW(), NOW()),
('ach-3', 'Perfect Season', 'Win all matches in a season', '⭐', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Leagues
-- ============================================================================
INSERT INTO "League" ("id", "name", "description", "sportId", "createdAt", "updatedAt") VALUES
('league-1', 'Fall Bocce League', 'Fall season bocce championship', 'sport-1', NOW(), NOW()),
('league-2', 'Winter Pickleball', 'Winter season pickleball league', 'sport-2', NOW(), NOW()),
('league-3', 'Spring Padel Cup', 'Spring season padel tournament', 'sport-3', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Divisions
-- ============================================================================
INSERT INTO "Division" ("id", "name", "leagueId", "createdAt", "updatedAt") VALUES
('div-1', 'Competitive', 'league-1', NOW(), NOW()),
('div-2', 'Recreational', 'league-1', NOW(), NOW()),
('div-3', 'Advanced', 'league-2', NOW(), NOW()),
('div-4', 'Beginner', 'league-2', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Users (5 test players + 2 captains = 7 users)
-- ============================================================================
INSERT INTO "User" ("id", "email", "password", "firstName", "lastName", "phone", "avatar", "role", "onboardingCompleted", "createdAt", "updatedAt") VALUES
('user-1', 'captain1@rally.test', 'hashed_password_1', 'John', 'Smith', '555-0101', NULL, 'CAPTAIN', true, NOW(), NOW()),
('user-2', 'captain2@rally.test', 'hashed_password_2', 'Sarah', 'Johnson', '555-0102', NULL, 'CAPTAIN', true, NOW(), NOW()),
('user-3', 'player1@rally.test', 'hashed_password_3', 'Mike', 'Williams', '555-0103', NULL, 'PLAYER', true, NOW(), NOW()),
('user-4', 'player2@rally.test', 'hashed_password_4', 'Emma', 'Brown', '555-0104', NULL, 'PLAYER', true, NOW(), NOW()),
('user-5', 'player3@rally.test', 'hashed_password_5', 'Alex', 'Davis', '555-0105', NULL, 'PLAYER', true, NOW(), NOW()),
('user-6', 'player4@rally.test', 'hashed_password_6', 'Jordan', 'Miller', '555-0106', NULL, 'PLAYER', true, NOW(), NOW()),
('user-7', 'player5@rally.test', 'hashed_password_7', 'Casey', 'Wilson', '555-0107', NULL, 'PLAYER', true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Captains
-- ============================================================================
INSERT INTO "Captain" ("id", "userId", "createdAt", "updatedAt") VALUES
('capt-1', 'user-1', NOW(), NOW()),
('capt-2', 'user-2', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Players (all 7 users are players, including captains)
-- ============================================================================
INSERT INTO "Player" ("id", "userId", "sportId", "rating", "wins", "losses", "createdAt", "updatedAt") VALUES
('player-1', 'user-1', 'sport-1', 4.2, 8, 2, NOW(), NOW()),
('player-2', 'user-2', 'sport-1', 3.8, 6, 4, NOW(), NOW()),
('player-3', 'user-3', 'sport-2', 3.5, 5, 5, NOW(), NOW()),
('player-4', 'user-4', 'sport-2', 4.0, 7, 3, NOW(), NOW()),
('player-5', 'user-5', 'sport-3', 3.3, 4, 6, NOW(), NOW()),
('player-6', 'user-6', 'sport-1', 3.9, 7, 3, NOW(), NOW()),
('player-7', 'user-7', 'sport-2', 3.6, 5, 5, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Player Stats
-- ============================================================================
INSERT INTO "PlayerStats" ("id", "playerId", "gamesPlayed", "gamesWon", "gamesLost", "winPercentage", "pointsFor", "pointsAgainst", "streakWins", "streakType", "createdAt", "updatedAt") VALUES
('ps-1', 'player-1', 10, 8, 2, 80.0, 145, 98, 3, 'WINNING', NOW(), NOW()),
('ps-2', 'player-2', 10, 6, 4, 60.0, 132, 125, 2, 'WINNING', NOW(), NOW()),
('ps-3', 'player-3', 10, 5, 5, 50.0, 120, 118, 1, 'LOSING', NOW(), NOW()),
('ps-4', 'player-4', 10, 7, 3, 70.0, 142, 115, 4, 'WINNING', NOW(), NOW()),
('ps-5', 'player-5', 10, 4, 6, 40.0, 108, 135, 0, 'LOSING', NOW(), NOW()),
('ps-6', 'player-6', 10, 7, 3, 70.0, 138, 112, 2, 'WINNING', NOW(), NOW()),
('ps-7', 'player-7', 10, 5, 5, 50.0, 125, 128, 1, 'LOSING', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Player Ratings
-- ============================================================================
INSERT INTO "PlayerRating" ("id", "playerId", "sportId", "currentRating", "peakRating") VALUES
('pr-1', 'player-1', 'sport-1', 1650, 1720),
('pr-2', 'player-2', 'sport-1', 1580, 1600),
('pr-3', 'player-3', 'sport-2', 1550, 1570),
('pr-4', 'player-4', 'sport-2', 1620, 1680),
('pr-5', 'player-5', 'sport-3', 1480, 1520),
('pr-6', 'player-6', 'sport-1', 1600, 1650),
('pr-7', 'player-7', 'sport-2', 1520, 1560)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Teams (2 teams in different sports/divisions)
-- ============================================================================
INSERT INTO "Team" ("id", "name", "sportId", "leagueId", "divisionId", "clubId", "description", "logo", "wins", "losses", "captainId", "createdAt", "updatedAt") VALUES
('team-1', 'Champions United', 'sport-1', 'league-1', 'div-1', 'club-1', 'Top-tier bocce team', '🏆', 6, 1, 'capt-1', NOW(), NOW()),
('team-2', 'Victory Squad', 'sport-2', 'league-2', 'div-3', 'club-2', 'Advanced pickleball team', '⚡', 5, 2, 'capt-2', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Team Members (4 members in team-1, 4 members in team-2)
-- ============================================================================
INSERT INTO "TeamMember" ("id", "teamId", "userId", "role") VALUES
('tm-1', 'team-1', 'user-1', 'captain'),
('tm-2', 'team-1', 'user-3', 'player'),
('tm-3', 'team-1', 'user-6', 'player'),
('tm-4', 'team-1', 'user-5', 'player'),
('tm-5', 'team-2', 'user-2', 'captain'),
('tm-6', 'team-2', 'user-4', 'player'),
('tm-7', 'team-2', 'user-7', 'player'),
('tm-8', 'team-2', 'user-3', 'player')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Many-to-many: _TeamPlayers
-- ============================================================================
INSERT INTO "_TeamPlayers" ("A", "B") VALUES
('player-1', 'team-1'),
('player-3', 'team-1'),
('player-6', 'team-1'),
('player-5', 'team-1'),
('player-2', 'team-2'),
('player-4', 'team-2'),
('player-7', 'team-2'),
('player-3', 'team-2')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Standings
-- ============================================================================
INSERT INTO "Standing" ("id", "divisionId", "teamId", "wins", "losses", "winPercentage", "gamesBack", "pointsFor", "pointsAgainst", "createdAt", "updatedAt") VALUES
('stand-1', 'div-1', 'team-1', 6, 1, 85.7, 0.0, 425, 320, NOW(), NOW()),
('stand-2', 'div-3', 'team-2', 5, 2, 71.4, 0.0, 385, 350, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Matches (3 scheduled matches)
-- ============================================================================
INSERT INTO "Match" ("id", "leagueId", "team1Id", "team2Id", "team1Score", "team2Score", "status", "scheduledAt", "courtName", "createdAt", "updatedAt") VALUES
('match-1', 'league-1', 'team-1', 'team-2', NULL, NULL, 'SCHEDULED', NOW() + INTERVAL '2 days', 'Court A', NOW(), NOW()),
('match-2', 'league-2', 'team-2', 'team-1', 21, 19, 'COMPLETED', NOW() - INTERVAL '1 week', 'Court B', NOW(), NOW()),
('match-3', 'league-1', 'team-1', 'team-2', NULL, NULL, 'SCHEDULED', NOW() + INTERVAL '5 days', 'Court 1', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Many-to-many: _PlayerMatches
-- ============================================================================
INSERT INTO "_PlayerMatches" ("A", "B") VALUES
('match-1', 'player-1'),
('match-1', 'player-3'),
('match-1', 'player-6'),
('match-1', 'player-5'),
('match-1', 'player-2'),
('match-1', 'player-4'),
('match-1', 'player-7'),
('match-2', 'player-1'),
('match-2', 'player-3'),
('match-2', 'player-6'),
('match-2', 'player-5'),
('match-2', 'player-2'),
('match-2', 'player-4'),
('match-2', 'player-7')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Match Availability
-- ============================================================================
INSERT INTO "MatchAvailability" ("id", "matchId", "playerId", "status", "notes") VALUES
('ma-1', 'match-1', 'player-1', 'available', NULL),
('ma-2', 'match-1', 'player-3', 'available', NULL),
('ma-3', 'match-1', 'player-6', 'available', NULL),
('ma-4', 'match-1', 'player-5', 'unavailable', 'Work conflict'),
('ma-5', 'match-1', 'player-2', 'available', NULL),
('ma-6', 'match-1', 'player-4', 'available', NULL),
('ma-7', 'match-1', 'player-7', 'available', NULL)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Lineups (for completed match)
-- ============================================================================
INSERT INTO "Lineup" ("id", "matchId", "lineupNum", "homeTeam") VALUES
('lineup-1', 'match-2', 1, true),
('lineup-2', 'match-2', 1, false)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Lineup Assignments
-- ============================================================================
INSERT INTO "LineupAssignment" ("id", "lineupId", "playerId", "position") VALUES
('la-1', 'lineup-1', 'player-1', 1),
('la-2', 'lineup-1', 'player-3', 2),
('la-3', 'lineup-2', 'player-2', 1),
('la-4', 'lineup-2', 'player-4', 2)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Rating History
-- ============================================================================
INSERT INTO "RatingHistory" ("id", "playerId", "matchId", "ratingBefore", "ratingAfter", "ratingChange", "won") VALUES
('rh-1', 'player-1', 'match-2', 1620, 1650, 30, true),
('rh-2', 'player-3', 'match-2', 1540, 1560, 20, true),
('rh-3', 'player-2', 'match-2', 1560, 1540, -20, false),
('rh-4', 'player-4', 'match-2', 1600, 1620, 20, false)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Availability
-- ============================================================================
INSERT INTO "Availability" ("id", "playerId", "date", "available", "notes", "createdAt", "updatedAt") VALUES
('avail-1', 'player-1', DATE(NOW() + INTERVAL '1 day'), true, NULL, NOW(), NOW()),
('avail-2', 'player-2', DATE(NOW() + INTERVAL '1 day'), false, 'Team practice', NOW(), NOW()),
('avail-3', 'player-3', DATE(NOW() + INTERVAL '2 days'), true, NULL, NOW(), NOW()),
('avail-4', 'player-4', DATE(NOW() + INTERVAL '2 days'), true, NULL, NOW(), NOW()),
('avail-5', 'player-5', DATE(NOW() + INTERVAL '3 days'), false, 'Travel', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Notifications
-- ============================================================================
INSERT INTO "Notification" ("id", "userId", "type", "title", "message", "read", "actionUrl", "relatedTeamId", "relatedMatchId", "createdAt", "updatedAt") VALUES
('notif-1', 'user-1', 'MATCH_SCHEDULED', 'Match Scheduled', 'Your team has a match in 2 days', false, '/matches/match-1', 'team-1', 'match-1', NOW(), NOW()),
('notif-2', 'user-2', 'TEAM_INVITED', 'Team Invitation', 'You have been invited to join a team', true, '/teams/team-2', 'team-2', NULL, NOW() - INTERVAL '1 day', NOW()),
('notif-3', 'user-3', 'MATCH_RESULT', 'Match Result', 'Team victory! Check out the stats', true, '/matches/match-2', 'team-1', 'match-2', NOW() - INTERVAL '7 days', NOW())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Chat Messages
-- ============================================================================
INSERT INTO "ChatMessage" ("id", "teamId", "userId", "message", "deleted", "createdAt", "updatedAt") VALUES
('msg-1', 'team-1', 'user-1', 'Great game everyone! See you next match.', false, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour'),
('msg-2', 'team-1', 'user-3', 'Thanks captain! Keep up the momentum.', false, NOW() - INTERVAL '45 minutes', NOW() - INTERVAL '45 minutes'),
('msg-3', 'team-2', 'user-2', 'Practice on Thursday at 6pm. Confirm if you can make it.', false, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),
('msg-4', 'team-2', 'user-4', 'I can make it!', false, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Dues Payments
-- ============================================================================
INSERT INTO "DuesPayment" ("id", "teamId", "playerId", "amount", "currency", "status", "dueDate", "paidDate", "paymentMethod", "createdAt", "updatedAt") VALUES
('due-1', 'team-1', 'player-1', 50.00, 'USD', 'paid', NOW() + INTERVAL '30 days', NOW(), 'credit_card', NOW(), NOW()),
('due-2', 'team-1', 'player-3', 50.00, 'USD', 'pending', NOW() + INTERVAL '30 days', NULL, NULL, NOW(), NOW()),
('due-3', 'team-2', 'player-2', 60.00, 'USD', 'paid', NOW() + INTERVAL '15 days', NOW() - INTERVAL '5 days', 'credit_card', NOW(), NOW()),
('due-4', 'team-2', 'player-4', 60.00, 'USD', 'pending', NOW() + INTERVAL '15 days', NULL, NULL, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Court Bookings
-- ============================================================================
INSERT INTO "CourtBooking" ("id", "courtId", "bookedBy", "startTime", "endTime", "teamId", "status", "notes", "createdAt", "updatedAt") VALUES
('cb-1', 'court-1', 'user-1', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days 1 hour', 'team-1', 'confirmed', 'Team practice', NOW(), NOW()),
('cb-2', 'court-2', 'user-2', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days 1 hour', 'team-2', 'confirmed', 'League match', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Waitlist Entries
-- ============================================================================
INSERT INTO "WaitlistEntry" ("id", "matchId", "playerId", "position") VALUES
('wait-1', 'match-1', 'player-6', 1)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Player Achievements
-- ============================================================================
INSERT INTO "PlayerAchievement" ("id", "playerId", "achievementId") VALUES
('pa-1', 'player-1', 'ach-1'),
('pa-2', 'player-1', 'ach-2'),
('pa-3', 'player-4', 'ach-1'),
('pa-4', 'player-2', 'ach-1')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Team Invitations
-- ============================================================================
INSERT INTO "TeamInvitation" ("id", "teamId", "invitedEmail", "invitedByUserId", "status", "expiresAt", "createdAt", "updatedAt") VALUES
('ti-1', 'team-1', 'newplayer1@rally.test', 'user-1', 'pending', NOW() + INTERVAL '7 days', NOW(), NOW()),
('ti-2', 'team-2', 'newplayer2@rally.test', 'user-2', 'accepted', NOW() + INTERVAL '30 days', NOW() - INTERVAL '5 days', NOW())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Summary
-- ============================================================================
-- Successfully seeded:
-- - 3 Sports (Bocce, Pickleball, Padel)
-- - 2 Clubs
-- - 2 Facilities with 3 Courts
-- - 3 Achievements
-- - 3 Leagues with 4 Divisions
-- - 7 Users (2 captains + 5 players)
-- - 7 Players with stats and ratings
-- - 2 Teams
-- - 8 Team Members
-- - 2 Standings
-- - 3 Matches with availability and lineups
-- - 4 Rating histories
-- - 5 Availability entries
-- - 3 Notifications
-- - 4 Chat messages
-- - 4 Dues payments
-- - 2 Court bookings
-- - 1 Waitlist entry
-- - 4 Player achievements
-- - 2 Team invitations
-- ============================================================================
