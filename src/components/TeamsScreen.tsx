import { useState } from "react";
import { ChevronRight, Trophy, Users } from "lucide-react";
import { SportIcon } from "./SportIcon";

interface TeamsScreenProps {
  onViewTeam: () => void;
  isCaptain?: boolean;
}

export function TeamsScreen({ onViewTeam, isCaptain = false }: TeamsScreenProps) {
  const [selectedSport, setSelectedSport] = useState<"all" | "bocce" | "pickleball" | "padel">("all");

  const teams = [
    {
      id: 1,
      name: "Merion Bocce Club",
      sport: "bocce" as const,
      division: "Division 2",
      record: "7–2",
      standing: "2nd of 8",
      points: 21,
      players: ["AR", "JC", "SP", "RT"],
      isYourTeam: true,
    },
    {
      id: 2,
      name: "Your Pickleball Squad",
      sport: "pickleball" as const,
      division: "Division 3",
      record: "5–4",
      standing: "4th of 10",
      points: 15,
      players: ["AR", "MB", "TK", "LC"],
      isYourTeam: true,
    },
    {
      id: 3,
      name: "Aronimink Padel",
      sport: "padel" as const,
      division: "Division 1",
      record: "8–1",
      standing: "1st of 6",
      points: 24,
      players: ["AR", "DM", "KS", "NP"],
      isYourTeam: true,
    },
    {
      id: 4,
      name: "Radnor Rollers",
      sport: "bocce" as const,
      division: "Division 2",
      record: "6–3",
      standing: "3rd of 8",
      points: 18,
      players: ["TM", "CW", "BL", "JK"],
      isYourTeam: false,
    },
  ];

  const sports = [
    { id: "all", label: "All Sports" },
    { id: "bocce", label: "Bocce" },
    { id: "pickleball", label: "Pickleball" },
    { id: "padel", label: "Padel" },
  ];

  const filteredTeams = selectedSport === "all" 
    ? teams 
    : teams.filter(team => team.sport === selectedSport);

  return (
    <div>
      {/* Header */}
      <div className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)] p-4 sticky top-0 z-10">
        <h1 className="mb-4">Teams</h1>
        
        {/* Sport Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {sports.map((sport) => (
            <button
              key={sport.id}
              onClick={() => setSelectedSport(sport.id as any)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                selectedSport === sport.id
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-bg)] text-[var(--color-text-secondary)] hover:bg-gray-200"
              }`}
            >
              {sport.label}
            </button>
          ))}
        </div>
      </div>

      {/* Teams List */}
      <div className="p-4 space-y-3">
        {filteredTeams.map((team) => (
          <button
            key={team.id}
            onClick={onViewTeam}
            className="w-full bg-[var(--color-bg-elevated)] rounded-2xl p-4 shadow-sm hover:shadow-md transition-all text-left"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 flex-1">
                <SportIcon sport={team.sport} size={40} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base">{team.name}</h3>
                    {team.isYourTeam && (
                      <span className="text-xs bg-[var(--color-accent)] text-[var(--color-text-primary)] px-2 py-0.5 rounded-full">
                        Your Team
                      </span>
                    )}
                  </div>
                  <p className="text-[var(--color-text-secondary)] text-sm">
                    {team.division} • Winter 24–25
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--color-text-secondary)] flex-shrink-0" />
            </div>

            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[var(--color-text-secondary)]" />
                <span className="text-sm text-[var(--color-text-secondary)]">
                  {team.standing}
                </span>
              </div>
              <div className="w-px h-4 bg-[var(--color-border)]" />
              <div className="text-sm">
                <span className="font-medium">{team.record}</span>
                <span className="text-[var(--color-text-secondary)] ml-1">
                  ({team.points} pts)
                </span>
              </div>
            </div>

            {/* Player Avatars */}
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[var(--color-text-secondary)]" />
              <div className="flex -space-x-2">
                {team.players.map((player, index) => (
                  <div
                    key={index}
                    className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center text-white text-xs"
                  >
                    {player}
                  </div>
                ))}
              </div>
              <span className="text-xs text-[var(--color-text-secondary)] ml-1">
                {team.players.length} players
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}