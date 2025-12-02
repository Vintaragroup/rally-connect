-- Add Phase 1 team joining system fields and models

-- Add fields to League table
ALTER TABLE "League" ADD COLUMN "isPubliclyVisible" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "League" ADD COLUMN "isEvent" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "League" ADD COLUMN "skillLevel" TEXT;
ALTER TABLE "League" ADD COLUMN "startDate" TIMESTAMP(3);
ALTER TABLE "League" ADD COLUMN "endDate" TIMESTAMP(3);

-- Add fields to Team table
ALTER TABLE "Team" ADD COLUMN "minPlayersNeeded" INTEGER;
ALTER TABLE "Team" ADD COLUMN "isLookingForPlayers" BOOLEAN NOT NULL DEFAULT false;

-- Create LeagueMember table
CREATE TABLE "LeagueMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LeagueMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE,
    CONSTRAINT "LeagueMember_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League" ("id") ON DELETE CASCADE
);

-- Create unique constraint for LeagueMember
CREATE UNIQUE INDEX "LeagueMember_userId_leagueId_key" ON "LeagueMember"("userId", "leagueId");
CREATE INDEX "LeagueMember_leagueId_idx" ON "LeagueMember"("leagueId");

-- Create TeamJoinRequest table
CREATE TABLE "TeamJoinRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),
    CONSTRAINT "TeamJoinRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE,
    CONSTRAINT "TeamJoinRequest_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE
);

-- Create unique constraint for TeamJoinRequest
CREATE UNIQUE INDEX "TeamJoinRequest_userId_teamId_key" ON "TeamJoinRequest"("userId", "teamId");
CREATE INDEX "TeamJoinRequest_teamId_status_idx" ON "TeamJoinRequest"("teamId", "status");
CREATE INDEX "TeamJoinRequest_userId_status_idx" ON "TeamJoinRequest"("userId", "status");

-- Add teamId field to InvitationCode table
ALTER TABLE "InvitationCode" ADD COLUMN "teamId" TEXT;
ALTER TABLE "InvitationCode" ADD CONSTRAINT "InvitationCode_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE SET NULL;
