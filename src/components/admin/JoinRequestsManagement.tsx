import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { PendingJoinRequests } from '@/components/joining/PendingJoinRequests';
import { AlertCircle, Users } from 'lucide-react';

interface UserTeam {
  id: string;
  name: string;
}

export function JoinRequestsManagement() {
  const { user } = useAuth();
  const [userTeams, setUserTeams] = useState<UserTeam[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserTeams = async () => {
      if (!user?.id) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await apiService.getUserTeams(user.id);
        if (response.data && Array.isArray(response.data)) {
          const teams = (response.data as any[]).map((team) => ({
            id: team.id,
            name: team.name,
          }));
          setUserTeams(teams);
          
          // Auto-select first team if available
          if (teams.length > 0) {
            setSelectedTeamId(teams[0].id);
          }
        } else {
          setError('Failed to load teams');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error fetching teams';
        console.error('❌ Error fetching teams:', errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserTeams();
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-600">Loading your teams...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-900">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (userTeams.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Teams</h3>
        <p className="text-gray-600">You don't have any teams yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Team Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select a Team
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {userTeams.map((team) => (
            <button
              key={team.id}
              onClick={() => setSelectedTeamId(team.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedTeamId === team.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <h3 className={`font-medium ${
                selectedTeamId === team.id
                  ? 'text-blue-900'
                  : 'text-gray-900'
              }`}>
                {team.name}
              </h3>
            </button>
          ))}
        </div>
      </div>

      {/* Join Requests for Selected Team */}
      {selectedTeamId && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-6">Join Requests</h2>
          <PendingJoinRequests teamId={selectedTeamId} />
        </div>
      )}
    </div>
  );
}
