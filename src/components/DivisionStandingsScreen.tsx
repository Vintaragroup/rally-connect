import { useState } from "react";
import { StandingsCard } from "./StandingsCard";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { TeamComparisonModal } from "./TeamComparisonModal";
import { LayoutGrid, LayoutList, Download, ArrowUpDown, Scale } from "lucide-react";

interface DivisionStandingsScreenProps {
  onTeamClick: (teamId: string) => void;
  onBack: () => void;
}

type SortField = "rank" | "wins" | "netPoints" | "gameWinPercent";

export function DivisionStandingsScreen({ onTeamClick, onBack }: DivisionStandingsScreenProps) {
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [selectedSeason, setSelectedSeason] = useState("winter-24-25");
  const [selectedDivision, setSelectedDivision] = useState("division-1");
  const [sortField, setSortField] = useState<SortField>("rank");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Mock data - in production this would come from API
  const teams: any[] = [];

  // Calculate derived stats
  const teamsWithStats = teams.map((team, index) => {
    const totalMatches = team.wins + team.losses;
    const totalGames = team.gamesWon + team.gamesLost;
    const matchWinPercent = totalMatches > 0 ? Math.round((team.wins / totalMatches) * 100) : 0;
    const gameWinPercent = totalGames > 0 ? Math.round((team.gamesWon / totalGames) * 100) : 0;
    const netPoints = team.pointsScored - team.pointsAgainst;

    return {
      ...team,
      rank: index + 1,
      matchWinPercent,
      gameWinPercent,
      netPoints
    };
  });

  // Sort teams based on the selected field and order
  const sortedTeams = [...teamsWithStats].sort((a, b) => {
    if (sortField === "rank") {
      return sortOrder === "asc" ? a.rank - b.rank : b.rank - a.rank;
    } else if (sortField === "wins") {
      return sortOrder === "asc" ? a.wins - b.wins : b.wins - a.wins;
    } else if (sortField === "netPoints") {
      return sortOrder === "asc" ? a.netPoints - b.netPoints : b.netPoints - a.netPoints;
    } else if (sortField === "gameWinPercent") {
      return sortOrder === "asc" ? a.gameWinPercent - b.gameWinPercent : b.gameWinPercent - a.gameWinPercent;
    }
    return 0;
  });

  const seasons = [
    { id: "winter-24-25", label: "Winter 24–25" },
    { id: "fall-24", label: "Fall 2024" },
    { id: "summer-24", label: "Summer 2024" }
  ];

  const divisions = [
    { id: "division-1", label: "Division 1" },
    { id: "division-2", label: "Division 2" },
    { id: "division-3", label: "Division 3" }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)] p-3 sm:p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
            ← Back
          </button>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center">
              <span className="text-white text-lg sm:text-xl">🎾</span>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl">Division Standings</h1>
              <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
                Bocce • {divisions.find(d => d.id === selectedDivision)?.label}
              </p>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-[var(--color-bg)] rounded-lg p-1">
            <button
              onClick={() => setViewMode("cards")}
              className={`p-2 rounded transition-colors ${
                viewMode === "cards" 
                  ? "bg-[var(--color-bg-elevated)] text-[var(--color-primary)] shadow-sm" 
                  : "text-[var(--color-text-secondary)]"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded transition-colors ${
                viewMode === "table" 
                  ? "bg-[var(--color-bg-elevated)] text-[var(--color-primary)] shadow-sm" 
                  : "text-[var(--color-text-secondary)]"
              }`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-2">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {seasons.map((season) => (
              <button
                key={season.id}
                onClick={() => setSelectedSeason(season.id)}
                className={`px-3 py-1.5 rounded-full text-xs sm:text-sm whitespace-nowrap transition-all ${
                  selectedSeason === season.id
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-bg)] text-[var(--color-text-secondary)]"
                }`}
              >
                {season.label}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {divisions.map((division) => (
              <button
                key={division.id}
                onClick={() => setSelectedDivision(division.id)}
                className={`px-3 py-1.5 rounded-full text-xs sm:text-sm whitespace-nowrap transition-all ${
                  selectedDivision === division.id
                    ? "bg-[var(--color-accent)] text-[var(--color-text-primary)]"
                    : "bg-[var(--color-bg)] text-[var(--color-text-secondary)]"
                }`}
              >
                {division.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        {/* Export Button */}
        <div className="mb-4">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto"
            onClick={() => window.print()}
          >
            <Download className="w-4 h-4 mr-2" />
            Export as PDF
          </Button>
        </div>

        {/* Cards View */}
        {viewMode === "cards" && (
          <div className="space-y-3">
            {sortedTeams.map((team, idx) => (
              <StandingsCard
                key={team.id}
                rank={team.rank}
                teamName={team.name}
                wins={team.wins}
                losses={team.losses}
                matchWinPercent={team.matchWinPercent}
                gamesWon={team.gamesWon}
                gamesLost={team.gamesLost}
                gameWinPercent={team.gameWinPercent}
                netPoints={team.netPoints}
                recentForm={team.recentForm}
                winStreak={team.winStreak}
                index={idx}
                onClick={() => onTeamClick(team.id)}
              />
            ))}
          </div>
        )}

        {/* Table View */}
        {viewMode === "table" && (
          <div className="bg-[var(--color-bg-elevated)] rounded-xl sm:rounded-2xl shadow-sm border border-[var(--color-border)] overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead className="text-center">W</TableHead>
                  <TableHead className="text-center">L</TableHead>
                  <TableHead className="text-center">Match%</TableHead>
                  <TableHead className="text-center">GW</TableHead>
                  <TableHead className="text-center">GL</TableHead>
                  <TableHead className="text-center">Game%</TableHead>
                  <TableHead className="text-center">PF</TableHead>
                  <TableHead className="text-center">PA</TableHead>
                  <TableHead className="text-center">Net</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTeams.map((team) => (
                  <TableRow 
                    key={team.id}
                    onClick={() => onTeamClick(team.id)}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    <TableCell className="font-medium">{team.rank}</TableCell>
                    <TableCell className="font-medium">{team.name}</TableCell>
                    <TableCell className="text-center">{team.wins}</TableCell>
                    <TableCell className="text-center">{team.losses}</TableCell>
                    <TableCell className="text-center">{team.matchWinPercent}%</TableCell>
                    <TableCell className="text-center">{team.gamesWon}</TableCell>
                    <TableCell className="text-center">{team.gamesLost}</TableCell>
                    <TableCell className="text-center">{team.gameWinPercent}%</TableCell>
                    <TableCell className="text-center">{team.pointsScored}</TableCell>
                    <TableCell className="text-center">{team.pointsAgainst}</TableCell>
                    <TableCell className={`text-center font-medium ${
                      team.netPoints > 0 ? "text-green-600" : 
                      team.netPoints < 0 ? "text-red-600" : "text-gray-600"
                    }`}>
                      {team.netPoints > 0 ? '+' : ''}{team.netPoints}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}