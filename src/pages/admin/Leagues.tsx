import { useState, useEffect } from 'react';
import { FilterBar } from '../../components/admin/FilterBar';
import { DataTable, Column } from '../../components/admin/DataTable';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { Modal } from '../../components/admin/Modal';
import { League } from '../../types/admin';
import { Plus } from 'lucide-react';
import { apiService } from '../../services/api';

export function Leagues() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [sportFilter, setSportFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New league form
  const [newLeague, setNewLeague] = useState({
    name: '',
    sport: 'bocce' as 'bocce' | 'pickleball' | 'padel',
    description: '',
  });

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        setLoading(true);
        const response = await apiService.getLeagues();
        if (response.data) {
          const transformedLeagues = (response.data as any[]).map((league) => ({
            id: league.id,
            name: league.name,
            sport: (league.sport?.name || 'bocce').toLowerCase(),
            description: league.description || '',
            status: 'active',
            activeSeasonsCount: league.seasons?.length || 0,
            createdDate: new Date(league.createdAt),
          }));
          setLeagues(transformedLeagues);
          setError(null);
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching leagues');
      } finally {
        setLoading(false);
      }
    };

    fetchLeagues();
  }, []);

  const filteredLeagues = leagues.filter((league) => {
    const matchesSearch = league.name
      .toLowerCase()
      .includes(searchValue.toLowerCase());
    const matchesSport = !sportFilter || league.sport === sportFilter;
    const matchesStatus = !statusFilter || league.status === statusFilter;

    return matchesSearch && matchesSport && matchesStatus;
  });

  const handleCreateLeague = () => {
    const league: League = {
      id: `l${leagues.length + 1}`,
      ...newLeague,
      status: 'active',
      activeSeasonsCount: 0,
      createdDate: new Date(),
    };
    setLeagues([...leagues, league]);
    setShowCreateModal(false);
    setNewLeague({ name: '', sport: 'bocce', description: '' });
  };

  const columns: Column<League>[] = [
    {
      key: 'name',
      header: 'League Name',
      render: (league) => (
        <div>
          <p className="font-medium text-gray-900">{league.name}</p>
          {league.description && (
            <p className="text-xs text-gray-500 mt-0.5">{league.description}</p>
          )}
        </div>
      ),
    },
    {
      key: 'sport',
      header: 'Sport',
      render: (league) => <StatusBadge status={league.sport} type="sport" />,
    },
    {
      key: 'activeSeasonsCount',
      header: 'Active Seasons',
      render: (league) => (
        <span className="text-gray-900">{league.activeSeasonsCount}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (league) => <StatusBadge status={league.status} />,
    },
    {
      key: 'createdDate',
      header: 'Created',
      render: (league) => (
        <span className="text-sm text-gray-600">
          {league.createdDate.toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-w-0">
      <main className="flex-1 p-4 md:p-8 max-w-full overflow-x-hidden">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl text-gray-900 mb-2">Leagues</h1>
            <p className="text-sm md:text-base text-gray-600">
              Manage all leagues across different sports
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create League
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading leagues...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600">Error: {error}</p>
          </div>
        ) : (
          <>
            <FilterBar
              searchPlaceholder="Search leagues..."
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              filters={[
                {
                  label: 'Sport',
                  options: [
                    { label: 'Bocce', value: 'bocce' },
                    { label: 'Pickleball', value: 'pickleball' },
                    { label: 'Padel', value: 'padel' },
                  ],
                  value: sportFilter,
                  onChange: setSportFilter,
                },
                {
                  label: 'Status',
                  options: [
                    { label: 'Active', value: 'active' },
                    { label: 'Archived', value: 'archived' },
                  ],
                  value: statusFilter,
                  onChange: setStatusFilter,
                },
              ]}
            />

            <DataTable
              columns={columns}
              data={filteredLeagues}
              onRowClick={setSelectedLeague}
              emptyMessage="No leagues found"
            />
          </>
        )}
      </main>

      {/* Create League Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New League"
          footer={
            <>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateLeague}
                disabled={!newLeague.name}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create League
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                League Name *
              </label>
              <input
                type="text"
                value={newLeague.name}
                onChange={(e) =>
                  setNewLeague({ ...newLeague, name: e.target.value })
                }
                placeholder="e.g., Main Line Bocce League"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Sport *</label>
              <select
                value={newLeague.sport}
                onChange={(e) =>
                  setNewLeague({
                    ...newLeague,
                    sport: e.target.value as 'bocce' | 'pickleball' | 'padel',
                  })
                }
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="bocce">Bocce</option>
                <option value="pickleball">Pickleball</option>
                <option value="padel">Padel</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={newLeague.description}
                onChange={(e) =>
                  setNewLeague({ ...newLeague, description: e.target.value })
                }
                placeholder="Brief description of the league..."
                rows={3}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* League Detail Modal */}
      {selectedLeague && !showCreateModal && (
        <Modal
          isOpen={!!selectedLeague}
          onClose={() => setSelectedLeague(null)}
          title={selectedLeague.name}
          maxWidth="max-w-3xl"
          footer={
            <button
              onClick={() => setSelectedLeague(null)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          }
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 pb-6 border-b border-gray-200">
              <div>
                <p className="text-sm text-gray-600 mb-1">Sport</p>
                <StatusBadge status={selectedLeague.sport} type="sport" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <StatusBadge status={selectedLeague.status} />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Seasons</p>
                <p className="text-gray-900">{selectedLeague.activeSeasonsCount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Created</p>
                <p className="text-gray-900">
                  {selectedLeague.createdDate.toLocaleDateString()}
                </p>
              </div>
            </div>

            {selectedLeague.description && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Description</p>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-900">{selectedLeague.description}</p>
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-gray-900">Seasons</h4>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                  <Plus className="w-4 h-4" />
                  Create Season
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center text-gray-500">
                Seasons will be displayed here
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}