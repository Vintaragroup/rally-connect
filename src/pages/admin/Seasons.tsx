import { useState, useEffect } from 'react';
import { FilterBar } from '../../components/admin/FilterBar';
import { DataTable, Column } from '../../components/admin/DataTable';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { Modal } from '../../components/admin/Modal';
import { Season } from '../../types/admin';
import { Plus } from 'lucide-react';

interface SeasonsProps {
  onMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export function Seasons({ onMenuToggle, isMobileMenuOpen }: SeasonsProps) {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [leagueFilter, setLeagueFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // New season form
  const [newSeason, setNewSeason] = useState({
    name: '',
    leagueId: '',
    leagueName: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '/api';
        const response = await fetch(`${apiUrl}/seasons`);
        if (response.status === 404) {
          // Endpoint doesn't exist yet, show empty state
          setSeasons([]);
        } else if (response.ok) {
          const data = await response.json();
          setSeasons(Array.isArray(data) ? data : []);
        } else {
          setSeasons([]);
        }
      } catch (err) {
        console.error('Error fetching seasons:', err);
        setSeasons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSeasons();
  }, []);

  const handleCreateSeason = async () => {
    // TODO: Call API to create season
    const season: Season = {
      id: `s${seasons.length + 1}`,
      name: newSeason.name,
      leagueId: newSeason.leagueId,
      leagueName: newSeason.leagueName,
      sport: 'bocce', // This should come from the league
      startDate: new Date(newSeason.startDate),
      endDate: new Date(newSeason.endDate),
      status: 'upcoming',
      divisionsCount: 0,
      teamsCount: 0,
    };
    setSeasons([...seasons, season]);
    setShowCreateModal(false);
    setNewSeason({ name: '', leagueId: '', leagueName: '', startDate: '', endDate: '' });
  };

  const filteredSeasons = seasons.filter((season) => {
    const matchesSearch = season.name
      .toLowerCase()
      .includes(searchValue.toLowerCase());
    const matchesLeague = !leagueFilter || season.leagueId === leagueFilter;
    const matchesStatus = !statusFilter || season.status === statusFilter;

    return matchesSearch && matchesLeague && matchesStatus;
  });

  const columns: Column<Season>[] = [
    {
      key: 'name',
      header: 'Season Name',
      render: (season) => (
        <div>
          <p className="font-medium text-gray-900">{season.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">{season.leagueName}</p>
        </div>
      ),
    },
    {
      key: 'sport',
      header: 'Sport',
      render: (season) => <StatusBadge status={season.sport} type="sport" />,
    },
    {
      key: 'dates',
      header: 'Season Dates',
      render: (season) => (
        <div>
          <p className="text-sm text-gray-900">
            {season.startDate.toLocaleDateString()} -{' '}
            {season.endDate.toLocaleDateString()}
          </p>
        </div>
      ),
    },
    {
      key: 'divisions',
      header: 'Divisions',
      render: (season) => (
        <span className="text-gray-900">{season.divisionsCount}</span>
      ),
    },
    {
      key: 'teams',
      header: 'Teams',
      render: (season) => (
        <span className="text-gray-900">{season.teamsCount}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (season) => <StatusBadge status={season.status} />,
    },
  ];

  const uniqueLeagues = Array.from(
    new Set(seasons.map((s) => s.leagueName))
  ).map((name) => ({
    label: name,
    value: seasons.find((s) => s.leagueName === name)?.leagueId || '',
  }));

  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-w-0">
      <main className="flex-1 p-4 md:p-8 max-w-full overflow-x-hidden">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl text-gray-900 mb-2">Seasons</h1>
            <p className="text-sm md:text-base text-gray-600">
              Manage seasons across all leagues and sports
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Season
          </button>
        </div>

        <FilterBar
          searchPlaceholder="Search seasons..."
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filters={[
            {
              label: 'League',
              options: uniqueLeagues,
              value: leagueFilter,
              onChange: setLeagueFilter,
            },
            {
              label: 'Status',
              options: [
                { label: 'Upcoming', value: 'upcoming' },
                { label: 'Active', value: 'active' },
                { label: 'Completed', value: 'completed' },
              ],
              value: statusFilter,
              onChange: setStatusFilter,
            },
          ]}
        />

        <DataTable
          columns={columns}
          data={filteredSeasons}
          emptyMessage="No seasons found"
        />
      </main>

      {/* Create Season Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Season"
          footer={
            <>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSeason}
                disabled={!newSeason.name || !newSeason.leagueId || !newSeason.startDate || !newSeason.endDate}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Season
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Season Name *
              </label>
              <input
                type="text"
                value={newSeason.name}
                onChange={(e) =>
                  setNewSeason({ ...newSeason, name: e.target.value })
                }
                placeholder="e.g., Spring 2024"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">League *</label>
              <select
                value={newSeason.leagueId}
                onChange={(e) => {
                  const leagueId = e.target.value;
                  const league = uniqueLeagues.find((l) => l.value === leagueId);
                  setNewSeason({
                    ...newSeason,
                    leagueId,
                    leagueName: league?.label || '',
                  });
                }}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a league...</option>
                {uniqueLeagues.map((league) => (
                  <option key={league.value} value={league.value}>
                    {league.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={newSeason.startDate}
                  onChange={(e) =>
                    setNewSeason({ ...newSeason, startDate: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  value={newSeason.endDate}
                  onChange={(e) =>
                    setNewSeason({ ...newSeason, endDate: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}