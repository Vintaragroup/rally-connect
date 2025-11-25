import { StatTile } from "./StatTile";
import { Badge } from "./ui/badge";
import { Trophy, TrendingUp, Users } from "lucide-react";
import { Button } from "./ui/button";

interface MyStandingsScreenProps {
  onViewFullStandings: () => void;
  onViewTeamReport: () => void;
}

export function MyStandingsScreen({ onViewFullStandings, onViewTeamReport }: MyStandingsScreenProps) {
  // Mock data - player's team
  const myTeam = {
    name: "Merion Bocce Club",
    division: "Division 1",
    season: "Winter 24–25",
    rank: 1,
    totalTeams: 6,
    wins: 5,
    losses: 0,
    gamesWon: 12,
    gamesLost: 3,
    pointsScored: 126,
    pointsAgainst: 77
  };

  // Top teams in division
  const topTeams = [
    { rank: 1, name: "Merion Bocce Club", record: "5–0", netPoints: 49, isMyTeam: true },
    { rank: 2, name: "Radnor Rollers", record: "4–1", netPoints: 26, isMyTeam: false },
    { rank: 3, name: "Wayne Warriors", record: "3–2", netPoints: 7, isMyTeam: false },
    { rank: 4, name: "Bryn Mawr Ballers", record: "2–3", netPoints: -14, isMyTeam: false },
    { rank: 5, name: "Haverford Hawks", record: "1–4", netPoints: -37, isMyTeam: false }
  ];

  const totalMatches = myTeam.wins + myTeam.losses;
  const matchWinPercent = totalMatches > 0 ? Math.round((myTeam.wins / totalMatches) * 100) : 0;
  const totalGames = myTeam.gamesWon + myTeam.gamesLost;
  const gameWinPercent = totalGames > 0 ? Math.round((myTeam.gamesWon / totalGames) * 100) : 0;
  const netPoints = myTeam.pointsScored - myTeam.pointsAgainst;

  const getRankEmoji = () => {
    const emojis = ["🥇", "🥈", "🥉"];
    return emojis[myTeam.rank - 1] || `#${myTeam.rank}`;
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-soft)] text-white p-4 sm:p-6 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-8 h-8" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">My Standings</h1>
            <p className="text-white/80 text-sm">Track your team's performance</p>
          </div>
        </div>
      </div>

      {/* Current Team Standing Card */}
      <div className="px-3 sm:px-4 -mt-4 mb-6">
        <div className="bg-[var(--color-bg-elevated)] rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-[var(--color-accent)]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-xs sm:text-sm text-[var(--color-text-secondary)] mb-1">
                Your Team
              </div>
              <h2 className="text-lg sm:text-xl font-bold mb-2">{myTeam.name}</h2>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{myTeam.division}</Badge>
                <Badge variant="outline">{myTeam.season}</Badge>
              </div>
            </div>
            <div className="text-4xl sm:text-5xl">
              {getRankEmoji()}
            </div>
          </div>

          <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between text-white">
              <div>
                <div className="text-white/80 text-xs mb-1">Current Rank</div>
                <div className="text-2xl sm:text-3xl font-bold">
                  {myTeam.rank} of {myTeam.totalTeams}
                </div>
              </div>
              <div className="text-right">
                <div className="text-white/80 text-xs mb-1">Record</div>
                <div className="text-2xl sm:text-3xl font-bold">
                  {myTeam.wins}–{myTeam.losses}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
            <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg">
              <div className="text-lg sm:text-2xl font-bold text-[var(--color-primary)]">
                {matchWinPercent}%
              </div>
              <div className="text-xs text-[var(--color-text-secondary)]">
                Match Win %
              </div>
            </div>
            <div className="text-center p-2 sm:p-3 bg-lime-50 rounded-lg">
              <div className="text-lg sm:text-2xl font-bold text-green-600">
                {gameWinPercent}%
              </div>
              <div className="text-xs text-[var(--color-text-secondary)]">
                Game Win %
              </div>
            </div>
            <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg">
              <div className="text-lg sm:text-2xl font-bold text-green-700">
                +{netPoints}
              </div>
              <div className="text-xs text-[var(--color-text-secondary)]">
                Net Points
              </div>
            </div>
          </div>

          <Button 
            onClick={onViewTeamReport}
            className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            View Full Team Report
          </Button>
        </div>
      </div>

      {/* Stat Highlights */}
      <div className="px-3 sm:px-4 mb-6">
        <h2 className="mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Stat Highlights
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <StatTile
            label="Games Won"
            value={myTeam.gamesWon}
            sublabel={`Out of ${totalGames} games`}
            color="success"
          />
          <StatTile
            label="Games Lost"
            value={myTeam.gamesLost}
            sublabel={`${gameWinPercent}% win rate`}
            color="default"
          />
          <StatTile
            label="Points For"
            value={myTeam.pointsScored}
            sublabel={`Avg ${(myTeam.pointsScored / totalMatches).toFixed(1)}/match`}
            color="success"
          />
          <StatTile
            label="Points Against"
            value={myTeam.pointsAgainst}
            sublabel={`Avg ${(myTeam.pointsAgainst / totalMatches).toFixed(1)}/match`}
            color="error"
          />
        </div>
      </div>

      {/* Division Snapshot */}
      <div className="px-3 sm:px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Division Snapshot
          </h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onViewFullStandings}
            className="text-[var(--color-primary)]"
          >
            View All →
          </Button>
        </div>

        <div className="space-y-2">
          {topTeams.map((team) => (
            <div
              key={team.rank}
              className={`p-3 sm:p-4 rounded-xl transition-all ${
                team.isMyTeam
                  ? "bg-gradient-to-r from-[var(--color-accent)]/20 to-[var(--color-accent)]/10 border-2 border-[var(--color-accent)]"
                  : "bg-[var(--color-bg-elevated)] border border-[var(--color-border)]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                  team.rank <= 3
                    ? "bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] text-white"
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {team.rank}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-medium text-sm sm:text-base truncate">
                      {team.name}
                    </div>
                    {team.isMyTeam && (
                      <Badge className="bg-[var(--color-accent)] text-[var(--color-text-primary)] text-xs">
                        Your Team
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
                    {team.record}
                  </div>
                </div>

                <div className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-semibold text-sm ${
                  team.netPoints > 0
                    ? "bg-green-100 text-green-700"
                    : team.netPoints < 0
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}>
                  {team.netPoints > 0 ? "+" : ""}{team.netPoints}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action */}
      <div className="px-3 sm:px-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold">Keep It Up!</div>
              <div className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
                You're ranked #{myTeam.rank} in {myTeam.division}
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full border-[var(--color-primary)] text-[var(--color-primary)]"
            onClick={onViewFullStandings}
          >
            View Complete Standings
          </Button>
        </div>
      </div>
    </div>
  );
}
