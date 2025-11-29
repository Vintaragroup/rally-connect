import { useState, useEffect } from 'react';
import { FilterBar } from '../../components/admin/FilterBar';
import { DataTable, Column } from '../../components/admin/DataTable';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { Modal } from '../../components/admin/Modal';
import { AvatarGroup } from '../../components/admin/AvatarGroup';
import { Team } from '../../types/admin';
import { Plus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { apiService } from '../../services/api';

export function Teams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [leagueFilter, setLeagueFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New team form
  const [newTeam, setNewTeam] = useState({
    name: '',
    divisionId: '',
    divisionName: '',
  });

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const response = await apiService.getTeams();
        if (response.data) {
          const transformedTeams = (response.data as any[]).map((team) => ({
            id: team.id,
            name: team.name,
            leagueId: team.division?.season?.league?.id || '',
            leagueName: team.division?.season?.league?.name || 'Unknown',
            divisionName: team.division?.name || 'Unknown Division',
            members: team.members?.length || 0,
            status: 'active',
            created: new Date(team.createdAt).toLocaleDateString(),
          }));
          setTeams(transformedTeams);
          setError(null);
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching teams');
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const handleCreateTeam = () => {
    toast.success(`Team "${newTeam.name}" created successfully!`);
    setShowCreateModal(false);
    setNewTeam({ name: '', divisionId: '', divisionName: '' });
  };

  const filteredTeams = teams.filter((team) => {
    const matchesSearch = team.name
      .toLowerCase()
      .includes(searchValue.toLowerCase());
    const matchesLeague = !leagueFilter || team.leagueId === leagueFilter;

    return matchesSearch && matchesLeague;
  });

  const columns: Column<Team>[] = [
    {
      key: 'name',
      header: 'Team Name',
      render: (team) => (
        <div>
          <p className="font-medium text-gray-900">{team.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">{team.divisionName}</p>
        </div>
      ),
    },
    {
      key: 'league',
      header: 'League / Season',
      render: (team) => (
        <div>
          <p className="text-gray-900">{team.leagueName}</p>
          <p className="text-xs text-gray-500">{team.seasonName}</p>
        </div>
      ),
    },
    {
      key: 'captains',
      header: 'Captains',
      render: (team) =>
        team.captains.length > 0 ? (
          <AvatarGroup avatars={team.captains} max={2} />
        ) : (
          <span className="text-sm text-gray-400">No captain</span>
        ),
    },
    {
      key: 'playerCount',
      header: 'Players',
      render: (team) => (
        <span className="text-gray-900">{team.playerCount}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (team) => <StatusBadge status={team.status} />,
    },
  ];

  const uniqueLeagues = Array.from(
    new Set(teams.map((t) => t.leagueName))
  ).map((name) => ({
    label: name,
    value: teams.find((t) => t.leagueName === name)?.leagueId || '',
  }));

  const uniqueDivisions = Array.from(
    new Set(teams.map((t) => t.divisionName))
  ).map((name) => ({
    label: name,
    value: teams.find((t) => t.divisionName === name)?.divisionId || '',
  }));

  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-w-0">
      <main className="flex-1 p-4 md:p-8 max-w-full overflow-x-hidden">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl text-gray-900 mb-2">Teams</h1>
            <p className="text-sm md:text-base text-gray-600">
              Manage teams, rosters, and captains across all leagues
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Team
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading teams...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600">Error: {error}</p>
          </div>
        ) : (
          <>
            <FilterBar
              searchPlaceholder="Search teams..."
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              filters={[
                {
                  label: 'League',
                  options: uniqueLeagues,
                  value: leagueFilter,
                  onChange: setLeagueFilter,
                },
              ]}
            />

            <DataTable
              columns={columns}
              data={filteredTeams}
              emptyMessage="No teams found"
            />
          </>
        )}
      </main>

      {/* Create Team Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Team"
          footer={
            <>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTeam}
                disabled={!newTeam.name || !newTeam.divisionId}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Team
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Team Name *
              </label>
              <input
                type="text"
                value={newTeam.name}
                onChange={(e) =>
                  setNewTeam({ ...newTeam, name: e.target.value })
                }
                placeholder="e.g., Radnor Rollers"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Division *</label>
              <select
                value={newTeam.divisionId}
                onChange={(e) => {
                  const divisionId = e.target.value;
                  const division = uniqueDivisions.find((d) => d.value === divisionId);
                  setNewTeam({
                    ...newTeam,
                    divisionId,
                    divisionName: division?.label || '',
                  });
                }}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a division...</option>
                {uniqueDivisions.map((division) => (
                  <option key={division.value} value={division.value}>
                    {division.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> After creating the team, you can assign captains and add players from the team detail page.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
