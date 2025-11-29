import { useState, useEffect } from 'react';
import { FilterBar } from '../../components/admin/FilterBar';
import { DataTable, Column } from '../../components/admin/DataTable';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { Modal } from '../../components/admin/Modal';
import { Player } from '../../types/admin';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { apiService } from '../../services/api';

export function Players() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New player form
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const response = await apiService.getPlayers();
        if (response.data) {
          const transformedPlayers = (response.data as any[]).map((player) => ({
            id: player.id,
            name: player.user?.name || 'Unknown',
            email: player.user?.email || 'N/A',
            avatar: player.user?.avatar || '',
            team: player.teams?.[0]?.name || 'Unassigned',
            roles: [player.role || 'PLAYER'],
            sports: player.teams?.map((t: any) => t.sport?.name || '').filter(Boolean) || [],
            rating: player.rating || 0,
            joinDate: new Date(player.createdAt).toLocaleDateString(),
            status: 'active',
          }));
          setPlayers(transformedPlayers);
          setError(null);
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching players');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const handleAddPlayer = () => {
    toast.success(`Player "${newPlayer.name}" added successfully!`);
    setShowCreateModal(false);
    setNewPlayer({ name: '', email: '', phone: '' });
  };

  const filteredPlayers = players.filter((player) => {
    const matchesSearch =
      player.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      player.email.toLowerCase().includes(searchValue.toLowerCase());
    const matchesRole = !roleFilter || player.roles.includes(roleFilter as any);

    return matchesSearch && matchesRole;
  });

  const columns: Column<Player>[] = [
    {
      key: 'name',
      header: 'Player',
      render: (player) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-sm font-medium overflow-hidden flex-shrink-0">
            {player.avatar ? (
              <img
                src={player.avatar}
                alt={player.name}
                className="w-full h-full object-cover"
              />
            ) : (
              player.name
                .split(' ')
                .map((n) => n[0])
                .join('')
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">{player.name}</p>
            <p className="text-xs text-gray-500">{player.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'teams',
      header: 'Teams',
      render: (player) =>
        player.teams.length > 0 ? (
          <div className="space-y-1">
            {player.teams.slice(0, 2).map((team) => (
              <div key={team.id}>
                <p className="text-sm text-gray-900">{team.name}</p>
                <p className="text-xs text-gray-500">{team.seasonName}</p>
              </div>
            ))}
            {player.teams.length > 2 && (
              <p className="text-xs text-gray-500">
                +{player.teams.length - 2} more
              </p>
            )}
          </div>
        ) : (
          <span className="text-sm text-gray-400">No teams</span>
        ),
    },
    {
      key: 'roles',
      header: 'Roles',
      render: (player) => (
        <div className="flex flex-wrap gap-1">
          {player.roles.map((role) => (
            <StatusBadge key={role} status={role} type="role" />
          ))}
        </div>
      ),
    },
    {
      key: 'matchesPlayed',
      header: 'Matches',
      render: (player) => (
        <div>
          {player.matchesPlayed !== undefined ? (
            <>
              <p className="text-gray-900">{player.matchesPlayed}</p>
              {player.winLossRecord && (
                <p className="text-xs text-gray-500">
                  {player.winLossRecord.wins}W - {player.winLossRecord.losses}L
                </p>
              )}
            </>
          ) : (
            <span className="text-sm text-gray-400">-</span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (player) => <StatusBadge status={player.status} />,
    },
    {
      key: 'joinedDate',
      header: 'Joined',
      render: (player) => (
        <span className="text-sm text-gray-600">
          {typeof player.joinDate === 'string' ? player.joinDate : player.joinDate?.toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-w-0">
      <main className="flex-1 p-4 md:p-8 max-w-full overflow-x-hidden">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl text-gray-900 mb-2">Players</h1>
            <p className="text-sm md:text-base text-gray-600">
              Manage player profiles, teams, and roles
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-5 h-5" />
            Add Player
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading players...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600">Error: {error}</p>
          </div>
        ) : (
          <>
            <FilterBar
                searchPlaceholder="Search by name or email..."
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                filters={[
            {
              label: 'Role',
              options: [
                { label: 'Player', value: 'player' },
                { label: 'Captain', value: 'captain' },
                { label: 'Admin', value: 'admin' },
              ],
              value: roleFilter,
              onChange: setRoleFilter,
            },
            ]}
            />

            <DataTable
              columns={columns}
              data={filteredPlayers}
              emptyMessage="No players found"
            />
          </>
        )}
      </main>      {/* Create Player Modal */}
      {showCreateModal && (
        <Modal
          title="Add New Player"
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          footer={
            <>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPlayer}
                disabled={!newPlayer.name || !newPlayer.email}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Player
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                value={newPlayer.name}
                onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                placeholder="e.g., John Smith"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={newPlayer.email}
                onChange={(e) => setNewPlayer({ ...newPlayer, email: e.target.value })}
                placeholder="john.smith@example.com"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={newPlayer.phone}
                onChange={(e) => setNewPlayer({ ...newPlayer, phone: e.target.value })}
                placeholder="(555) 123-4567"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> An invitation email will be sent to the player to complete their profile.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}