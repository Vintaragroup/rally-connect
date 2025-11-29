import { useState } from 'react';
import { FilterBar } from '../../components/admin/FilterBar';
import { DataTable, Column } from '../../components/admin/DataTable';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { Modal } from '../../components/admin/Modal';
import { Division } from '../../types/admin';
import { divisions as initialDivisions } from '../../data/adminMockData';
import { Plus } from 'lucide-react';

interface DivisionsProps {
  onMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export function Divisions({ onMenuToggle, isMobileMenuOpen }: DivisionsProps) {
  const [divisions, setDivisions] = useState(initialDivisions);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [leagueFilter, setLeagueFilter] = useState('');
  const [seasonFilter, setSeasonFilter] = useState('');

  // New division form
  const [newDivision, setNewDivision] = useState({
    name: '',
    seasonId: '',
    seasonName: '',
    leagueId: '',
    leagueName: '',
    minTeams: '',
    maxTeams: '',
  });

  const handleCreateDivision = () => {
    const division: Division = {
      id: `d${divisions.length + 1}`,
      name: newDivision.name,
      seasonId: newDivision.seasonId,
      seasonName: newDivision.seasonName,
      leagueId: newDivision.leagueId,
      leagueName: newDivision.leagueName,
      teamCount: 0,
      status: 'active',
      minTeams: parseInt(newDivision.minTeams) || undefined,
      maxTeams: parseInt(newDivision.maxTeams) || undefined,
    };
    setDivisions([...divisions, division]);
    setShowCreateModal(false);
    setNewDivision({
      name: '',
      seasonId: '',
      seasonName: '',
      leagueId: '',
      leagueName: '',
      minTeams: '',
      maxTeams: '',
    });
  };

  const filteredDivisions = divisions.filter((division) => {
    const matchesSearch = division.name
      .toLowerCase()
      .includes(searchValue.toLowerCase());
    const matchesLeague = !leagueFilter || division.leagueId === leagueFilter;
    const matchesSeason = !seasonFilter || division.seasonId === seasonFilter;

    return matchesSearch && matchesLeague && matchesSeason;
  });

  const columns: Column<Division>[] = [
    {
      key: 'name',
      header: 'Division Name',
      render: (division) => (
        <div>
          <p className="font-medium text-gray-900">{division.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">{division.seasonName}</p>
        </div>
      ),
    },
    {
      key: 'league',
      header: 'League',
      render: (division) => (
        <span className="text-gray-900">{division.leagueName}</span>
      ),
    },
    {
      key: 'teamCount',
      header: 'Teams',
      render: (division) => (
        <div>
          <p className="text-gray-900">{division.teamCount}</p>
          {division.minTeams && division.maxTeams && (
            <p className="text-xs text-gray-500">
              Min: {division.minTeams}, Max: {division.maxTeams}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (division) => <StatusBadge status={division.status} />,
    },
  ];

  const uniqueLeagues = Array.from(
    new Set(divisions.map((d) => d.leagueName))
  ).map((name) => ({
    label: name,
    value: divisions.find((d) => d.leagueName === name)?.leagueId || '',
  }));

  const uniqueSeasons = Array.from(
    new Set(divisions.map((d) => d.seasonName))
  ).map((name) => ({
    label: name,
    value: divisions.find((d) => d.seasonName === name)?.seasonId || '',
  }));

  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-w-0">
      <main className="flex-1 p-4 md:p-8 max-w-full overflow-x-hidden">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl text-gray-900 mb-2">Divisions</h1>
            <p className="text-sm md:text-base text-gray-600">
              Organize teams into divisions within seasons
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Division
          </button>
        </div>

        <FilterBar
          searchPlaceholder="Search divisions..."
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
              label: 'Season',
              options: uniqueSeasons,
              value: seasonFilter,
              onChange: setSeasonFilter,
            },
          ]}
        />

        <DataTable
          columns={columns}
          data={filteredDivisions}
          emptyMessage="No divisions found"
        />
      </main>

      {/* Create Division Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Division"
          footer={
            <>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDivision}
                disabled={!newDivision.name || !newDivision.seasonId}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Division
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Division Name *
              </label>
              <input
                type="text"
                value={newDivision.name}
                onChange={(e) =>
                  setNewDivision({ ...newDivision, name: e.target.value })
                }
                placeholder="e.g., Division A"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Season *</label>
              <select
                value={newDivision.seasonId}
                onChange={(e) => {
                  const seasonId = e.target.value;
                  const season = uniqueSeasons.find((s) => s.value === seasonId);
                  setNewDivision({
                    ...newDivision,
                    seasonId,
                    seasonName: season?.label || '',
                  });
                }}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a season...</option>
                {uniqueSeasons.map((season) => (
                  <option key={season.value} value={season.value}>
                    {season.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Min Teams
                </label>
                <input
                  type="number"
                  value={newDivision.minTeams}
                  onChange={(e) =>
                    setNewDivision({ ...newDivision, minTeams: e.target.value })
                  }
                  placeholder="e.g., 4"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Max Teams
                </label>
                <input
                  type="number"
                  value={newDivision.maxTeams}
                  onChange={(e) =>
                    setNewDivision({ ...newDivision, maxTeams: e.target.value })
                  }
                  placeholder="e.g., 8"
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