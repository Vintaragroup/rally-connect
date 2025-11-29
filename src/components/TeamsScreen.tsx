import { useState, useEffect } from "react";
import { ChevronRight, Trophy, Users, MessageCircle } from "lucide-react";
import { SportIcon } from "./SportIcon";
import { apiService } from "../services/api";

interface TeamsScreenProps {
  onViewTeam: () => void;
  onOpenChat?: () => void;
  isCaptain?: boolean;
  showChatIcon?: boolean;
}

interface Team {
  id: string;
  name: string;
  sport: "bocce" | "pickleball" | "padel";
  division: string;
  isYourTeam?: boolean;
  standing: string;
  record: string;
  points: number;
  players: Array<{ id: string; name: string }>;
}

export function TeamsScreen({ onViewTeam, onOpenChat, isCaptain = false, showChatIcon = true }: TeamsScreenProps) {
  const [selectedSport, setSelectedSport] = useState<"all" | "bocce" | "pickleball" | "padel">("all");
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const response = await apiService.getTeams();
        if (response.data) {
          // Transform API response to component format
          const transformedTeams = (response.data as any[]).map((team) => ({
            id: team.id,
            name: team.name,
            sport: (team.sport?.name || 'bocce').toLowerCase(),
            division: team.division?.name || 'Unknown Division',
            isYourTeam: false, // Will need to check current user
            standing: `${team.ranking || '-'} place`,
            record: `${team.wins || 0}-${team.losses || 0}`,
            points: team.points || 0,
            players: (team.members || []).slice(0, 5).map((m: any) => ({
              id: m.id,
              name: m.user?.name || 'Unknown',
            })),
          }));
          setTeams(transformedTeams);
          setError(null);
        } else {
          setError(response.error || 'Failed to fetch teams');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching teams');
        setTeams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const sports = [
    { id: "all", label: "All Sports" },
    { id: "bocce", label: "Bocce" },
    { id: "pickleball", label: "Pickleball" },
    { id: "padel", label: "Padel" },
  ];

  const filteredTeams = selectedSport === "all" 
    ? teams 
    : teams.filter(team => team.sport === selectedSport);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-[var(--color-text-secondary)]">Loading teams...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)] p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <h1>Teams</h1>
          {showChatIcon && (
            <button
              onClick={onOpenChat}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
              title="Team Chat"
            >
              <MessageCircle className="w-5 h-5 text-[var(--color-primary)]" />
              <span className="text-[var(--color-text-primary)]">Chat</span>
            </button>
          )}
        </div>
        
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