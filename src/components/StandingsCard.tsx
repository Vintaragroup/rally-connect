import { Trophy } from "lucide-react";
import { RecentFormIndicator } from "./RecentFormIndicator";
import { WinStreakBadge } from "./WinStreakBadge";

interface StandingsCardProps {
  rank: number;
  teamName: string;
  wins: number;
  losses: number;
  matchWinPercent: number;
  gamesWon: number;
  gamesLost: number;
  gameWinPercent: number;
  netPoints: number;
  onClick?: () => void;
  recentForm?: ("W" | "L")[];
  winStreak?: number;
  index?: number;
}

export function StandingsCard({
  rank,
  teamName,
  wins,
  losses,
  matchWinPercent,
  gamesWon,
  gamesLost,
  gameWinPercent,
  netPoints,
  onClick,
  recentForm,
  winStreak,
  index
}: StandingsCardProps) {
  const getRankBadge = () => {
    const badges = ["🥇", "🥈", "🥉"];
    return badges[rank - 1] || rank;
  };

  const getNetPointsColor = () => {
    if (netPoints > 0) return "bg-green-100 text-green-700 border-green-200";
    if (netPoints < 0) return "bg-red-100 text-red-700 border-red-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div
      onClick={onClick}
      className="bg-[var(--color-bg-elevated)] rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-[var(--color-border)] cursor-pointer hover:shadow-md transition-all hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-2 duration-300"
      style={{ animationDelay: `${(index || 0) * 50}ms` }}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Rank Badge */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-md">
            {getRankBadge()}
          </div>
        </div>

        {/* Team Info & Stats */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
            <div className="font-semibold text-sm sm:text-base truncate">
              {teamName}
            </div>
            {winStreak && winStreak >= 2 && (
              <WinStreakBadge streak={winStreak} type="win" />
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {/* Record */}
            <div>
              <div className="text-xs text-[var(--color-text-secondary)] mb-0.5">
                Match Record
              </div>
              <div className="font-medium text-sm sm:text-base">
                {wins}–{losses} <span className="text-xs text-[var(--color-text-tertiary)]">({matchWinPercent}%)</span>
              </div>
            </div>

            {/* Game Record */}
            <div>
              <div className="text-xs text-[var(--color-text-secondary)] mb-0.5">
                Game Record
              </div>
              <div className="font-medium text-sm sm:text-base">
                {gamesWon}–{gamesLost} <span className="text-xs text-[var(--color-text-tertiary)]">({gameWinPercent}%)</span>
              </div>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="mt-2 sm:mt-3 space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[var(--color-primary)] transition-all duration-1000 ease-out"
                  style={{ width: `${matchWinPercent}%` }}
                />
              </div>
              <span className="text-xs text-[var(--color-text-tertiary)] w-10 text-right">
                {matchWinPercent}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[var(--color-accent)] transition-all duration-1000 ease-out"
                  style={{ width: `${gameWinPercent}%` }}
                />
              </div>
              <span className="text-xs text-[var(--color-text-tertiary)] w-10 text-right">
                {gameWinPercent}%
              </span>
            </div>
          </div>

          {/* Recent Form */}
          {recentForm && recentForm.length > 0 && (
            <div className="mt-2 sm:mt-3">
              <RecentFormIndicator results={recentForm} />
            </div>
          )}
        </div>

        {/* Net Points */}
        <div className="flex-shrink-0">
          <div className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border font-semibold text-sm sm:text-base ${getNetPointsColor()}`}>
            {netPoints > 0 ? '+' : ''}{netPoints}
          </div>
          <div className="text-xs text-[var(--color-text-tertiary)] text-center mt-1">
            Net Pts
          </div>
        </div>
      </div>
    </div>
  );
}