import { X } from "lucide-react";
import { Button } from "./ui/button";

interface TeamStats {
  name: string;
  wins: number;
  losses: number;
  gamesWon: number;
  gamesLost: number;
  pointsScored: number;
  pointsAgainst: number;
}

interface TeamComparisonModalProps {
  team1: TeamStats;
  team2: TeamStats;
  onClose: () => void;
}

export function TeamComparisonModal({ team1, team2, onClose }: TeamComparisonModalProps) {
  const calculateStats = (team: TeamStats) => {
    const totalMatches = team.wins + team.losses;
    const totalGames = team.gamesWon + team.gamesLost;
    const matchWinPercent = totalMatches > 0 ? Math.round((team.wins / totalMatches) * 100) : 0;
    const gameWinPercent = totalGames > 0 ? Math.round((team.gamesWon / totalGames) * 100) : 0;
    const netPoints = team.pointsScored - team.pointsAgainst;
    
    return { matchWinPercent, gameWinPercent, netPoints };
  };

  const stats1 = calculateStats(team1);
  const stats2 = calculateStats(team2);

  const ComparisonRow = ({ 
    label, 
    value1, 
    value2, 
    isPercentage = false,
    higherIsBetter = true 
  }: { 
    label: string; 
    value1: number; 
    value2: number; 
    isPercentage?: boolean;
    higherIsBetter?: boolean;
  }) => {
    const team1Better = higherIsBetter ? value1 > value2 : value1 < value2;
    const team2Better = higherIsBetter ? value2 > value1 : value2 < value1;

    return (
      <div className="grid grid-cols-3 gap-4 py-3 border-b border-[var(--color-border)]">
        <div className={`text-center font-semibold ${team1Better ? "text-green-600" : ""}`}>
          {value1}{isPercentage ? "%" : ""}
        </div>
        <div className="text-center text-sm text-[var(--color-text-secondary)]">
          {label}
        </div>
        <div className={`text-center font-semibold ${team2Better ? "text-green-600" : ""}`}>
          {value2}{isPercentage ? "%" : ""}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--color-bg-elevated)] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] text-white p-4 sm:p-6 rounded-t-2xl">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-bold">Team Comparison</h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="text-center">
              <div className="font-bold text-lg sm:text-xl mb-1">{team1.name}</div>
            </div>
            <div className="text-center text-white/60 text-sm">VS</div>
            <div className="text-center">
              <div className="font-bold text-lg sm:text-xl mb-1">{team2.name}</div>
            </div>
          </div>
        </div>

        {/* Stats Comparison */}
        <div className="p-4 sm:p-6">
          <ComparisonRow label="Wins" value1={team1.wins} value2={team2.wins} />
          <ComparisonRow label="Losses" value1={team1.losses} value2={team2.losses} higherIsBetter={false} />
          <ComparisonRow label="Match Win %" value1={stats1.matchWinPercent} value2={stats2.matchWinPercent} isPercentage />
          <ComparisonRow label="Games Won" value1={team1.gamesWon} value2={team2.gamesWon} />
          <ComparisonRow label="Games Lost" value1={team1.gamesLost} value2={team2.gamesLost} higherIsBetter={false} />
          <ComparisonRow label="Game Win %" value1={stats1.gameWinPercent} value2={stats2.gameWinPercent} isPercentage />
          <ComparisonRow label="Points Scored" value1={team1.pointsScored} value2={team2.pointsScored} />
          <ComparisonRow label="Points Against" value1={team1.pointsAgainst} value2={team2.pointsAgainst} higherIsBetter={false} />
          <ComparisonRow label="Net Points" value1={stats1.netPoints} value2={stats2.netPoints} />

          {/* Summary */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <div className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">
              Head-to-Head Summary
            </div>
            {stats1.matchWinPercent > stats2.matchWinPercent ? (
              <div className="text-base font-semibold text-green-700">
                {team1.name} has a better record ({stats1.matchWinPercent}% vs {stats2.matchWinPercent}%)
              </div>
            ) : stats2.matchWinPercent > stats1.matchWinPercent ? (
              <div className="text-base font-semibold text-green-700">
                {team2.name} has a better record ({stats2.matchWinPercent}% vs {stats1.matchWinPercent}%)
              </div>
            ) : (
              <div className="text-base font-semibold text-gray-700">
                Both teams have identical win percentages
              </div>
            )}
          </div>

          <Button 
            onClick={onClose}
            className="w-full mt-6 bg-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]"
          >
            Close Comparison
          </Button>
        </div>
      </div>
    </div>
  );
}
