import { Search, Filter, Mail, Trophy, TrendingUp, Users, MapPin, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { toast } from "sonner@2.0.3";
import { apiService } from "../services/api";

interface PlayerDirectoryScreenProps {
  onBack: () => void;
}

interface Player {
  id: string;
  name: string;
  initials: string;
  rating: number;
  sport: "bocce" | "pickleball" | "padel";
  team: string;
  location: string;
  wins: number;
  losses: number;
  winRate: number;
  isAvailable: boolean;
  isCaptain: boolean;
}

export function PlayerDirectoryScreen({ onBack }: PlayerDirectoryScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState<"all" | "bocce" | "pickleball" | "padel">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const response = await apiService.getPlayers();
        if (response.data) {
          // Transform API response to component format
          const transformedPlayers = (response.data as any[]).map((player) => ({
            id: player.id,
            name: player.user?.name || 'Unknown',
            initials: (player.user?.name || 'U').split(' ').map((n: string) => n[0]).join('').toUpperCase(),
            rating: player.rating || 0,
            sport: (player.primarySport?.name || 'bocce').toLowerCase(),
            team: player.teams?.[0]?.name || 'Unassigned',
            location: 'TBD',
            wins: player.wins || 0,
            losses: player.losses || 0,
            winRate: (player.wins || 0) + (player.losses || 0) > 0 ? ((player.wins || 0) / ((player.wins || 0) + (player.losses || 0)) * 100) : 0,
            isAvailable: true,
            isCaptain: player.role === 'CAPTAIN',
          }));
          setPlayers(transformedPlayers);
          setError(null);
        } else {
          setError(response.error || 'Failed to fetch players');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching players');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          player.team.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport = selectedSport === "all" || player.sport === selectedSport;
    return matchesSearch && matchesSport;
  });

  const sortedPlayers = [...filteredPlayers].sort((a, b) => b.rating - a.rating);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-[var(--color-text-secondary)]">Loading players...</p>
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
            <h1 className="mb-1">Player Directory</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Find and connect with players
            </p>
          </div>
          <Users className="w-6 h-6 text-[var(--color-accent)]" />
        </div>

        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-tertiary)]" />
          <Input
            type="text"
            placeholder="Search players or teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>

        {/* Sport Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { value: "all", label: "All Sports" },
            { value: "bocce", label: "Bocce" },
            { value: "pickleball", label: "Pickleball" },
            { value: "padel", label: "Padel" },
          ].map((sport) => (
            <button
              key={sport.value}
              onClick={() => setSelectedSport(sport.value as any)}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                selectedSport === sport.value
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-gray-100 text-[var(--color-text-secondary)]"
              }`}
            >
              {sport.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-[var(--color-text-secondary)]">
            {sortedPlayers.length} {sortedPlayers.length === 1 ? "player" : "players"} found
          </p>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-sm text-[var(--color-primary)] flex items-center gap-1"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Player Cards */}
        {sortedPlayers.length === 0 ? (
          <div className="bg-[var(--color-bg-elevated)] rounded-2xl p-8 text-center">
            <Users className="w-12 h-12 text-[var(--color-text-tertiary)] mx-auto mb-3" />
            <p className="text-[var(--color-text-secondary)]">No players found</p>
            <p className="text-sm text-[var(--color-text-tertiary)] mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedPlayers.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="bg-[var(--color-bg-elevated)] rounded-2xl p-4 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3 mb-3">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white font-medium flex-shrink-0">
                    {player.initials}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{player.name}</h3>
                      {player.isCaptain && (
                        <Badge className="bg-amber-100 text-amber-700 text-xs">
                          ⭐ Captain
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-[var(--color-text-secondary)] mb-1">
                      {player.team}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[var(--color-text-tertiary)]">
                      <MapPin className="w-3 h-3" />
                      {player.location}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-amber-600 mb-1">
                      <Trophy className="w-4 h-4" />
                      <span className="font-bold">{player.rating}</span>
                    </div>
                    <Badge className="bg-gray-100 text-gray-700 text-xs capitalize">
                      {player.sport}
                    </Badge>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-3 py-2 border-y border-[var(--color-border)]">
                  <div className="flex-1 text-center">
                    <div className="text-sm font-semibold">{player.wins}W</div>
                    <div className="text-xs text-[var(--color-text-secondary)]">Wins</div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="text-sm font-semibold">{player.losses}L</div>
                    <div className="text-xs text-[var(--color-text-secondary)]">Losses</div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="text-sm font-semibold text-green-600">{player.winRate}%</div>
                    <div className="text-xs text-[var(--color-text-secondary)]">Win Rate</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => toast.success(`Message sent to ${player.name}!`)}
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    Message
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => toast.info(`Viewing ${player.name}'s profile...`)}
                  >
                    View Profile
                  </Button>
                </div>

                {/* Availability Badge */}
                {player.isAvailable && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Available for matches
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-50 border border-blue-200 rounded-2xl p-4"
        >
          <div className="flex items-start gap-3">
            <Star className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium mb-1 text-blue-900">
                Connect with Players
              </h3>
              <p className="text-sm text-blue-700">
                Message players to organize practice sessions, find substitutes, or just connect with the community.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
