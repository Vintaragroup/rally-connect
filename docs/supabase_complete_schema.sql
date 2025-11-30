-- ============================================================================
-- Drop everything if exists (clean slate approach)
-- ============================================================================
DROP TABLE IF EXISTS "WaitlistEntry" CASCADE;
DROP TABLE IF EXISTS "DuesPayment" CASCADE;
DROP TABLE IF EXISTS "CourtBooking" CASCADE;
DROP TABLE IF EXISTS "Court" CASCADE;
DROP TABLE IF EXISTS "Facility" CASCADE;
DROP TABLE IF EXISTS "RatingHistory" CASCADE;
DROP TABLE IF EXISTS "PlayerRating" CASCADE;
DROP TABLE IF EXISTS "MatchAvailability" CASCADE;
DROP TABLE IF EXISTS "LineupAssignment" CASCADE;
DROP TABLE IF EXISTS "Lineup" CASCADE;
DROP TABLE IF EXISTS "TeamInvitation" CASCADE;
DROP TABLE IF EXISTS "TeamMember" CASCADE;
DROP TABLE IF EXISTS "PlayerAchievement" CASCADE;
DROP TABLE IF EXISTS "Achievement" CASCADE;
DROP TABLE IF EXISTS "ChatMessage" CASCADE;
DROP TABLE IF EXISTS "Notification" CASCADE;
DROP TABLE IF EXISTS "Availability" CASCADE;
DROP TABLE IF EXISTS "Standing" CASCADE;
DROP TABLE IF EXISTS "_PlayerMatches" CASCADE;
DROP TABLE IF EXISTS "_TeamPlayers" CASCADE;
DROP TABLE IF EXISTS "Match" CASCADE;
DROP TABLE IF EXISTS "PlayerStats" CASCADE;
DROP TABLE IF EXISTS "Player" CASCADE;
DROP TABLE IF EXISTS "Captain" CASCADE;
DROP TABLE IF EXISTS "Team" CASCADE;
DROP TABLE IF EXISTS "Division" CASCADE;
DROP TABLE IF EXISTS "League" CASCADE;
DROP TABLE IF EXISTS "Club" CASCADE;
DROP TABLE IF EXISTS "Sport" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- Drop enums
DROP TYPE IF EXISTS "UserRole" CASCADE;
DROP TYPE IF EXISTS "MatchStatus" CASCADE;

-- ============================================================================
-- Create Enums
-- ============================================================================
CREATE TYPE "UserRole" AS ENUM ('PLAYER', 'CAPTAIN', 'ADMIN');
CREATE TYPE "MatchStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- ============================================================================
-- Create Base Tables (No dependencies)
-- ============================================================================
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "avatar" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'PLAYER',
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Sport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "description" TEXT,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Club" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "description" TEXT,
    "logo" TEXT,
    "city" TEXT,
    "state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Facility" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "sport" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- ============================================================================
-- Create Tables with Foreign Keys
-- ============================================================================
CREATE TABLE "League" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sportId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("sportId") REFERENCES "Sport"("id") ON DELETE RESTRICT
);

CREATE UNIQUE INDEX "League_name_sportId_key" ON "League"("name", "sportId");

CREATE TABLE "Division" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE RESTRICT
);

CREATE UNIQUE INDEX "Division_name_leagueId_key" ON "Division"("name", "leagueId");

CREATE TABLE "Captain" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT
);

CREATE TABLE "Player" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE,
    "sportId" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 3.0,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT,
    FOREIGN KEY ("sportId") REFERENCES "Sport"("id") ON DELETE RESTRICT
);

CREATE TABLE "Team" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "sportId" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "divisionId" TEXT NOT NULL,
    "clubId" TEXT,
    "description" TEXT,
    "logo" TEXT,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "captainId" TEXT NOT NULL UNIQUE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("sportId") REFERENCES "Sport"("id") ON DELETE RESTRICT,
    FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE RESTRICT,
    FOREIGN KEY ("divisionId") REFERENCES "Division"("id") ON DELETE RESTRICT,
    FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE SET NULL,
    FOREIGN KEY ("captainId") REFERENCES "Captain"("id") ON DELETE RESTRICT
);

CREATE TABLE "Match" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leagueId" TEXT NOT NULL,
    "team1Id" TEXT NOT NULL,
    "team2Id" TEXT NOT NULL,
    "team1Score" INTEGER,
    "team2Score" INTEGER,
    "status" "MatchStatus" NOT NULL DEFAULT 'SCHEDULED',
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "courtName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE RESTRICT,
    FOREIGN KEY ("team1Id") REFERENCES "Team"("id") ON DELETE RESTRICT
);

CREATE INDEX "Match_leagueId_scheduledAt_idx" ON "Match"("leagueId", "scheduledAt");

CREATE TABLE "Standing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "divisionId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "winPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "gamesBack" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "pointsFor" INTEGER NOT NULL DEFAULT 0,
    "pointsAgainst" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("divisionId") REFERENCES "Division"("id") ON DELETE RESTRICT,
    FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT
);

CREATE UNIQUE INDEX "Standing_divisionId_teamId_key" ON "Standing"("divisionId", "teamId");

CREATE TABLE "PlayerStats" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL UNIQUE,
    "gamesPlayed" INTEGER NOT NULL DEFAULT 0,
    "gamesWon" INTEGER NOT NULL DEFAULT 0,
    "gamesLost" INTEGER NOT NULL DEFAULT 0,
    "winPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "pointsFor" INTEGER NOT NULL DEFAULT 0,
    "pointsAgainst" INTEGER NOT NULL DEFAULT 0,
    "streakWins" INTEGER NOT NULL DEFAULT 0,
    "streakType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT
);

CREATE TABLE "Availability" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "available" BOOLEAN NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT
);

CREATE UNIQUE INDEX "Availability_playerId_date_key" ON "Availability"("playerId", "date");

CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "actionUrl" TEXT,
    "readAt" TIMESTAMP(3),
    "relatedTeamId" TEXT,
    "relatedMatchId" TEXT,
    "relatedUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE INDEX "Notification_userId_read_createdAt_idx" ON "Notification"("userId", "read", "createdAt");

CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE
);

CREATE INDEX "ChatMessage_teamId_createdAt_idx" ON "ChatMessage"("teamId", "createdAt");

CREATE TABLE "Court" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "facilityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "courtNum" INTEGER NOT NULL,
    FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "Court_facilityId_courtNum_key" ON "Court"("facilityId", "courtNum");

CREATE TABLE "CourtBooking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courtId" TEXT NOT NULL,
    "bookedBy" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "teamId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("courtId") REFERENCES "Court"("id") ON DELETE CASCADE
);

CREATE INDEX "CourtBooking_courtId_startTime_idx" ON "CourtBooking"("courtId", "startTime");

CREATE TABLE "DuesPayment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teamId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidDate" TIMESTAMP(3),
    "paymentMethod" TEXT,
    "stripePaymentIntentId" TEXT,
    "invoiceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE INDEX "DuesPayment_teamId_status_idx" ON "DuesPayment"("teamId", "status");
CREATE INDEX "DuesPayment_playerId_dueDate_idx" ON "DuesPayment"("playerId", "dueDate");

CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'player',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "TeamMember_teamId_userId_key" ON "TeamMember"("teamId", "userId");

CREATE TABLE "TeamInvitation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teamId" TEXT NOT NULL,
    "invitedEmail" TEXT NOT NULL,
    "invitedByUserId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "TeamInvitation_teamId_invitedEmail_key" ON "TeamInvitation"("teamId", "invitedEmail");

CREATE TABLE "Lineup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "matchId" TEXT NOT NULL,
    "lineupNum" INTEGER NOT NULL,
    "homeTeam" BOOLEAN NOT NULL,
    FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "Lineup_matchId_lineupNum_homeTeam_key" ON "Lineup"("matchId", "lineupNum", "homeTeam");

CREATE TABLE "LineupAssignment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lineupId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    FOREIGN KEY ("lineupId") REFERENCES "Lineup"("id") ON DELETE CASCADE,
    FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "LineupAssignment_lineupId_position_key" ON "LineupAssignment"("lineupId", "position");

CREATE TABLE "MatchAvailability" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "matchId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'no_response',
    "notes" TEXT,
    FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE,
    FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "MatchAvailability_matchId_playerId_key" ON "MatchAvailability"("matchId", "playerId");

CREATE TABLE "PlayerRating" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "sportId" TEXT NOT NULL,
    "currentRating" DOUBLE PRECISION NOT NULL DEFAULT 1500,
    "peakRating" DOUBLE PRECISION NOT NULL DEFAULT 1500,
    FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE,
    FOREIGN KEY ("sportId") REFERENCES "Sport"("id") ON DELETE RESTRICT
);

CREATE UNIQUE INDEX "PlayerRating_playerId_sportId_key" ON "PlayerRating"("playerId", "sportId");

CREATE TABLE "RatingHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "ratingBefore" DOUBLE PRECISION NOT NULL,
    "ratingAfter" DOUBLE PRECISION NOT NULL,
    "ratingChange" DOUBLE PRECISION NOT NULL,
    "won" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE
);

CREATE INDEX "RatingHistory_playerId_createdAt_idx" ON "RatingHistory"("playerId", "createdAt");

CREATE TABLE "WaitlistEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "matchId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "position" INTEGER NOT NULL,
    FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE,
    FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "WaitlistEntry_matchId_playerId_key" ON "WaitlistEntry"("matchId", "playerId");
CREATE INDEX "WaitlistEntry_matchId_position_idx" ON "WaitlistEntry"("matchId", "position");

CREATE TABLE "PlayerAchievement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE,
    FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "PlayerAchievement_playerId_achievementId_key" ON "PlayerAchievement"("playerId", "achievementId");

-- Many-to-many junction tables
CREATE TABLE "_TeamPlayers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Player"("id") ON DELETE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Team"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "_TeamPlayers_AB_unique" ON "_TeamPlayers"("A", "B");
CREATE INDEX "_TeamPlayers_B_index" ON "_TeamPlayers"("B");

CREATE TABLE "_PlayerMatches" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Match"("id") ON DELETE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "_PlayerMatches_AB_unique" ON "_PlayerMatches"("A", "B");
CREATE INDEX "_PlayerMatches_B_index" ON "_PlayerMatches"("B");
