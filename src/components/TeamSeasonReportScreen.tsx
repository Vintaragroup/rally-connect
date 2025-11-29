import { StatTile } from "./StatTile";
import { MiniTrendChart } from "./MiniTrendChart";
import { CountUpNumber } from "./CountUpNumber";
import { Button } from "./ui/button";
import { Download, Share2, TrendingUp } from "lucide-react";
import { Badge } from "./ui/badge";
import { useEffect } from "react";
import { ConfettiEffect } from "./ConfettiEffect";

interface TeamSeasonReportScreenProps {
  onBack: () => void;
}

export function TeamSeasonReportScreen({ onBack }: TeamSeasonReportScreenProps) {
  // Mock data
  const teamData = null;

  if (!teamData) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] pb-6">
        <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-soft)] text-white p-4 sm:p-6">
          <button onClick={onBack} className="text-white/80 hover:text-white mb-3">
            ← Back
          </button>
          <h1 className="text-xl sm:text-2xl font-bold">Team Season Report</h1>
        </div>
        <div className="p-4">
          <div className="bg-[var(--color-bg-elevated)] rounded-2xl p-8 text-center">
            <TrendingUp className="w-12 h-12 text-[var(--color-text-tertiary)] mx-auto mb-3" />
            <p className="text-[var(--color-text-secondary)]">No team data available</p>
            <p className="text-sm text-[var(--color-text-tertiary)] mt-1">
              Join a team to view season report
            </p>
          </div>
        </div>
      </div>
    );
  }

  const totalMatches = teamData.wins + teamData.losses;
  const matchWinPercent = totalMatches > 0 ? Math.round((teamData.wins / totalMatches) * 100) : 0;
  const totalGames = teamData.gamesWon + teamData.gamesLost;
  const gameWinPercent = totalGames > 0 ? Math.round((teamData.gamesWon / totalGames) * 100) : 0;
  const netPoints = teamData.pointsScored - teamData.pointsAgainst;

  const handleExportPDF = () => {
    window.print();
  };

  useEffect(() => {
    if (teamData && teamData.rank === 1) {
      const confettiEffect = new ConfettiEffect();
      confettiEffect.start();
    }
  }, [teamData?.rank]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-soft)] text-white p-4 sm:p-6">
        <div className="mb-4">
          <button onClick={onBack} className="text-white/80 hover:text-white mb-3">
            ← Back
          </button>
        </div>

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl sm:text-3xl">
              🎾
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold mb-1">{teamData.name}</h1>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-white/20 text-white border-white/30">
                  {teamData.division}
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30">
                  {teamData.season}
                </Badge>
                <Badge className="bg-[var(--color-accent)] text-[var(--color-text-primary)] border-[var(--color-accent)]">
                  #{teamData.rank} Rank
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white/70 text-xs sm:text-sm mb-1">Overall Record</div>
              <div className="text-2xl sm:text-3xl font-bold">
                {teamData.wins}–{teamData.losses}
              </div>
            </div>
            <div className="text-right">
              <div className="text-white/70 text-xs sm:text-sm mb-1">Match Win Rate</div>
              <div className="text-2xl sm:text-3xl font-bold">{matchWinPercent}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-3 sm:p-4 flex gap-2 sm:gap-3">
        <Button 
          onClick={handleExportPDF}
          className="flex-1 bg-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]"
        >
          <Download className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
        <Button variant="outline" className="flex-1">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>

      {/* Key Stats Grid */}
      <div className="px-3 sm:px-4 mb-6">
        <h2 className="mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Season Statistics
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <StatTile
            label="Match Record"
            value={`${teamData.wins}–${teamData.losses}`}
            sublabel={`${matchWinPercent}% win rate`}
            variant="primary"
          />
          <StatTile
            label="Game Record"
            value={`${teamData.gamesWon}–${teamData.gamesLost}`}
            sublabel={`${gameWinPercent}% win rate`}
            variant="primary"
          />
          <StatTile
            label="Points Scored"
            value={teamData.pointsScored}
            sublabel={`Avg ${(teamData.pointsScored / totalMatches).toFixed(1)} per match`}
            color="success"
          />
          <StatTile
            label="Points Against"
            value={teamData.pointsAgainst}
            sublabel={`Avg ${(teamData.pointsAgainst / totalMatches).toFixed(1)} per match`}
            color="error"
          />
        </div>

        {/* Net Points Highlight */}
        <div className="mt-3 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl sm:rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-green-700 mb-1">Total Net Points</div>
              <div className="text-3xl sm:text-4xl font-bold text-green-700">
                +{netPoints}
              </div>
              <div className="text-xs text-green-600 mt-1">
                {teamData.pointsScored} For / {teamData.pointsAgainst} Against
              </div>
            </div>
            <div className="text-5xl">🏆</div>
          </div>
        </div>
      </div>

      {/* Performance Trend */}
      <div className="px-3 sm:px-4 mb-6">
        <h2 className="mb-3">Performance Trend</h2>
        <div className="bg-[var(--color-bg-elevated)] rounded-xl sm:rounded-2xl p-4 shadow-sm border border-[var(--color-border)]">
          <MiniTrendChart
            data={teamData.weeklyNetPoints}
            label="Net Points per Week"
            color="success"
            height={60}
          />

          {/* Weekly Results */}
          <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
            <div className="text-sm text-[var(--color-text-secondary)] mb-3">Weekly Results</div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {teamData.weeklyResults.map((result) => (
                <div
                  key={result.week}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg border-2 ${
                    result.result === "W"
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="text-xs text-gray-600 mb-1">Week {result.week}</div>
                  <div className="font-semibold text-sm">
                    {result.result} {result.score}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown Table */}
      <div className="px-3 sm:px-4 mb-6">
        <h2 className="mb-3">Complete Statistics</h2>
        <div className="bg-[var(--color-bg-elevated)] rounded-xl sm:rounded-2xl p-4 shadow-sm border border-[var(--color-border)] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left pb-3 text-[var(--color-text-secondary)] font-medium">Stat</th>
                <th className="text-right pb-3 text-[var(--color-text-secondary)] font-medium">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              <tr>
                <td className="py-3">Wins</td>
                <td className="py-3 text-right font-medium">{teamData.wins}</td>
              </tr>
              <tr>
                <td className="py-3">Losses</td>
                <td className="py-3 text-right font-medium">{teamData.losses}</td>
              </tr>
              <tr className="bg-blue-50">
                <td className="py-3 font-medium">Match Win %</td>
                <td className="py-3 text-right font-bold text-[var(--color-primary)]">{matchWinPercent}%</td>
              </tr>
              <tr>
                <td className="py-3">Games Won</td>
                <td className="py-3 text-right font-medium">{teamData.gamesWon}</td>
              </tr>
              <tr>
                <td className="py-3">Games Lost</td>
                <td className="py-3 text-right font-medium">{teamData.gamesLost}</td>
              </tr>
              <tr className="bg-lime-50">
                <td className="py-3 font-medium">Game Win %</td>
                <td className="py-3 text-right font-bold text-green-600">{gameWinPercent}%</td>
              </tr>
              <tr>
                <td className="py-3">Points Scored</td>
                <td className="py-3 text-right font-medium">{teamData.pointsScored}</td>
              </tr>
              <tr>
                <td className="py-3">Points Against</td>
                <td className="py-3 text-right font-medium">{teamData.pointsAgainst}</td>
              </tr>
              <tr className="bg-green-50">
                <td className="py-3 font-medium">Net Points</td>
                <td className="py-3 text-right font-bold text-green-700">+{netPoints}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: white !important;
          }
          button {
            display: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}