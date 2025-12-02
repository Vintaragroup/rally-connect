import { Trophy, TrendingUp, TrendingDown, Minus, ChevronRight } from "lucide-react";
import { Badge } from "./ui/badge";
import { SportIcon } from "./SportIcon";
import { useState, useEffect } from "react";
import { apiService } from "../services/api";

interface StandingsScreenProps {
  onBack: () => void;
  onViewTeam?: () => void;
}

interface TeamStanding {
  rank: number;
  prevRank: number;
  team: string;
  sport: "bocce" | "pickleball" | "padel";
  played: number;
  wins: number;
  losses: number;
  winRate: number;
  points: number;
  streak: string;
}

export function StandingsScreen({ onBack, onViewTeam }: StandingsScreenProps) {
  const [selectedDivision, setSelectedDivision] = useState("div-1");
  const [selectedSport, setSelectedSport] = useState<"all" | "bocce" | "pickleball" | "padel">("all");
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [divisions, setDivisions] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        setLoading(true);
        const response = await apiService.getStandings();
        if (response.data) {
          // Transform API response to component format
          const transformedStandings = (response.data as any[]).map((standing, index) => ({
            rank: index + 1,
            prevRank: index + 1,
            team: standing.team?.name || 'Unknown',
            sport: (standing.sport?.name || 'bocce').toLowerCase(),
            played: standing.gamesPlayed || 0,
            wins: standing.wins || 0,
            losses: standing.losses || 0,
            winRate: standing.gamesPlayed ? (standing.wins / standing.gamesPlayed * 100) : 0,
            points: standing.points || 0,
            streak: `${standing.wins > standing.losses ? 'W' : 'L'}${Math.abs(standing.wins - standing.losses)}`,
          }));
          setStandings(transformedStandings);
          setError(null);
        } else {
          setError(response.error || 'Failed to fetch standings');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching standings');
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, []);

  const getRankChange = (rank: number, prevRank: number) => {
    if (rank < prevRank) {
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    } else if (rank > prevRank) {
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    } else {
      return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStreakColor = (streak: string) => {
    if (streak.startsWith("W")) {
      return "bg-green-100 text-green-700";
    } else {
      return "bg-red-100 text-red-700";
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)] p-4 sticky top-0 z-20">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="text-[var(--color-text-secondary)]">
            ← Back
          </button>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="mb-1">Standings</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Current Season
            </p>
          </div>
          <Trophy className="w-6 h-6 text-[var(--color-accent)]" />
        </div>

        {loading ? (
          <p className="text-sm text-[var(--color-text-secondary)]">Loading standings...</p>
        ) : error ? (
          <p className="text-sm text-red-500">Error: {error}</p>
        ) : (
          <>
            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedSport("all")}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                  selectedSport === "all"
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-gray-100 text-[var(--color-text-secondary)]"
                }`}
              >
                All Sports
              </button>
              <button
                onClick={() => setSelectedSport("bocce")}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                  selectedSport === "bocce"
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-gray-100 text-[var(--color-text-secondary)]"
                }`}
              >
                Bocce
              </button>
              <button
                onClick={() => setSelectedSport("pickleball")}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                  selectedSport === "pickleball"
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-gray-100 text-[var(--color-text-secondary)]"
                }`}
              >
                Pickleball
              </button>
              <button
                onClick={() => setSelectedSport("padel")}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                  selectedSport === "padel"
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-gray-100 text-[var(--color-text-secondary)]"
                }`}
              >
                Padel
              </button>
            </div>
          </>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Legend */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Rank Up
            </span>
            <span className="flex items-center gap-1">
              <TrendingDown className="w-3 h-3" /> Rank Down
            </span>
            <span className="flex items-center gap-1">
              <Minus className="w-3 h-3" /> No Change
            </span>
          </div>
        </div>

        {/* Standings Table */}
        <div className="space-y-2">
          {standings.map((team, index) => {
            const isTop3 = team.rank <= 3;
            const isCurrentTeam = false; // Will be set to true when we fetch actual current user's team

            return (
              <button
                key={team.rank}
                onClick={() => onViewTeam?.()}
                className={`w-full bg-[var(--color-bg-elevated)] rounded-2xl p-4 shadow-sm hover:shadow-md transition-all text-left ${
                  isCurrentTeam ? "ring-2 ring-[var(--color-primary)]" : ""
                } ${isTop3 ? "border-l-4 border-[var(--color-accent)]" : ""}`}
              >
                <div className="flex items-center gap-3">
                  {/* Rank */}
                  <div className="flex flex-col items-center min-w-[40px]">
                    <div className={`text-xl ${isTop3 ? "font-bold" : ""}`}>
                      {team.rank}
                    </div>
                    {getRankChange(team.rank, team.prevRank)}
                  </div>

                  {/* Team Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-medium truncate">{team.team}</div>
                      {isCurrentTeam && (
                        <Badge className="bg-[var(--color-primary)] text-xs">You</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)]">
                      <span>{team.wins}W - {team.losses}L</span>
                      <span>•</span>
                      <span>{team.winRate}% Win</span>
                      <span>•</span>
                      <Badge className={`${getStreakColor(team.streak)} text-xs`}>
                        {team.streak}
                      </Badge>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="text-right min-w-[50px]">
                    <div className="text-xl font-bold">{team.points}</div>
                    <div className="text-xs text-[var(--color-text-secondary)]">pts</div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-[var(--color-text-secondary)]" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Playoff Line */}
        <div className="flex items-center gap-3">
          <div className="flex-1 border-t-2 border-dashed border-green-300"></div>
          <span className="text-xs text-green-600 font-medium px-2 py-1 bg-green-50 rounded-full">
            Playoff Line
          </span>
          <div className="flex-1 border-t-2 border-dashed border-green-300"></div>
        </div>

        {/* Info Card */}
        <div className="bg-[var(--color-bg-elevated)] rounded-2xl p-4 text-sm text-[var(--color-text-secondary)]">
          <p className="mb-2">
            <strong>Playoff Format:</strong> Top 4 teams advance to playoffs
          </p>
          <p>
            <strong>Points:</strong> 3 pts for a win, 0 pts for a loss
          </p>
        </div>
      </div>
    </div>
  );
}
