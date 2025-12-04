import { useState, useEffect } from 'react';
import { Users, AlertCircle, Loader, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { SportIcon } from '@/components/SportIcon';
import { getTeamsLookingForPlayers, requestJoinTeam } from '@/lib/api/teamsApi';

interface Team {
  id: string;
  name: string;
  sportId: string;
  sportName: string;
  currentPlayerCount: number;
  minPlayersNeeded: number;
  playersNeeded: number;
  description?: string;
  logo?: string;
}

interface TeamDiscoveryProps {
  leagueId: string;
  userId: string;
  onTeamSelected: (team: Team) => void;
  onError?: (error: string) => void;
}

export function TeamDiscovery({
  leagueId,
  userId,
  onTeamSelected,
  onError,
}: TeamDiscoveryProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestingTeamId, setRequestingTeamId] = useState<string | null>(null);

  useEffect(() => {
    loadTeams();
  }, [leagueId]);

  const loadTeams = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getTeamsLookingForPlayers(leagueId);
      setTeams(Array.isArray(data) ? data : []);

      if (!Array.isArray(data) || data.length === 0) {
        setError('No teams are currently looking for players');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load teams';
      console.error('❌ Error loading teams:', errorMessage);
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestJoin = async (team: Team) => {
    setRequestingTeamId(team.id);

    try {
      await requestJoinTeam(team.id, userId);
      console.log(`✓ Requested to join ${team.name}`);
      toast.success(`Request sent to ${team.name}`, {
        description: 'The captain will review your request shortly',
      });
      onTeamSelected(team);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request join';
      console.error('❌ Error requesting join:', errorMessage);
      
      // Check for specific error messages
      if (errorMessage.includes('already has a pending request')) {
        toast.error('Request already pending', {
          description: 'You already have a pending request for this team',
        });
      } else if (errorMessage.includes('already a member')) {
        toast.error('Already a member', {
          description: 'You are already a member of this team',
        });
      } else if (errorMessage.includes('maximum number of join requests')) {
        toast.error('Too many requests', {
          description: 'You can only submit 5 requests per 24 hours',
        });
      } else {
        toast.error('Request failed', {
          description: errorMessage,
        });
      }
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setRequestingTeamId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700">{error}</p>
        </div>
      )}

      {teams.length > 0 ? (
        <div className="space-y-3">
          {teams.map((team) => (
            <div
              key={team.id}
              className="bg-[var(--color-bg-elevated)] rounded-2xl p-4 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <SportIcon sport={team.sportName.toLowerCase() as any} size={48} />

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-medium">{team.name}</h3>
                    <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      Open for Recruitment
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)] mb-3">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {team.currentPlayerCount} / {team.minPlayersNeeded} players
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Need {team.playersNeeded} more
                    </span>
                  </div>

                  {team.description && (
                    <p className="text-xs text-[var(--color-text-secondary)] mb-2 line-clamp-2">
                      {team.description}
                    </p>
                  )}

                  <Button
                    onClick={() => handleRequestJoin(team)}
                    disabled={requestingTeamId === team.id}
                    className="w-full mt-2"
                    size="sm"
                  >
                    {requestingTeamId === team.id ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Requesting...
                      </>
                    ) : (
                      <>
                        Request to Join
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
