import { useState } from 'react';
import { FilterBar } from '../../components/admin/FilterBar';
import { DataTable, Column } from '../../components/admin/DataTable';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { Modal } from '../../components/admin/Modal';
import { Match } from '../../types/admin';
import { adminMatches, adminTeams } from '../../data/adminMockData';
import { Plus, MapPin } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ScheduleProps {
  onMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export function Schedule({ onMenuToggle, isMobileMenuOpen }: ScheduleProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [leagueFilter, setLeagueFilter] = useState('');

  // New match form
  const [newMatch, setNewMatch] = useState({
    homeTeamId: '',
    awayTeamId: '',
    date: '',
    time: '',
    location: '',
  });

  const handleScheduleMatch = () => {
    const homeTeam = adminTeams.find(t => t.id === newMatch.homeTeamId);
    const awayTeam = adminTeams.find(t => t.id === newMatch.awayTeamId);
    toast.success(`Match scheduled: ${homeTeam?.name} vs ${awayTeam?.name}`);
    setShowCreateModal(false);
    setNewMatch({ homeTeamId: '', awayTeamId: '', date: '', time: '', location: '' });
  };

  const filteredMatches = adminMatches.filter((match) => {
    const matchesSearch =
      match.homeTeamName.toLowerCase().includes(searchValue.toLowerCase()) ||
      match.awayTeamName.toLowerCase().includes(searchValue.toLowerCase());
    const matchesLeague = !leagueFilter || match.leagueId === leagueFilter;

    return matchesSearch && matchesLeague;
  });

  const columns: Column<Match>[] = [
    {
      key: 'teams',
      header: 'Match',
      render: (match) => (
        <div>
          <p className="text-gray-900">
            {match.homeTeamName} vs {match.awayTeamName}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {match.divisionName} • {match.seasonName}
          </p>
        </div>
      ),
    },
    {
      key: 'league',
      header: 'League',
      render: (match) => <span className="text-gray-900">{match.leagueName}</span>,
    },
    {
      key: 'dateTime',
      header: 'Date & Time',
      render: (match) => (
        <div>
          <p className="text-gray-900">{match.date.toLocaleDateString()}</p>
          <p className="text-xs text-gray-500">{match.time}</p>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      render: (match) =>
        match.location ? (
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            {match.location}
          </div>
        ) : (
          <span className="text-sm text-gray-400">TBD</span>
        ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (match) => <StatusBadge status={match.status} />,
    },
    {
      key: 'score',
      header: 'Score',
      render: (match) =>
        match.status === 'completed' && match.homeScore !== undefined ? (
          <div className="text-center">
            <p className="text-gray-900">
              {match.homeScore} - {match.awayScore}
            </p>
          </div>
        ) : (
          <span className="text-sm text-gray-400">-</span>
        ),
    },
  ];

  const uniqueLeagues = Array.from(
    new Set(adminMatches.map((m) => m.leagueName))
  ).map((name) => ({
    label: name,
    value: adminMatches.find((m) => m.leagueName === name)?.leagueId || '',
  }));

  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-w-0">
      <main className="flex-1 p-4 md:p-8 max-w-full overflow-x-hidden">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl text-gray-900 mb-2">Match Schedule</h1>
            <p className="text-sm md:text-base text-gray-600">
              View and manage all matches across leagues
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Schedule Match
          </button>
        </div>

        <FilterBar
          searchPlaceholder="Search by team name..."
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
          data={filteredMatches}
          emptyMessage="No matches found"
        />
      </main>

      {/* Schedule Match Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Schedule New Match"
          footer={
            <>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleMatch}
                disabled={!newMatch.homeTeamId || !newMatch.awayTeamId || !newMatch.date || !newMatch.time}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Schedule Match
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Home Team *
              </label>
              <select
                value={newMatch.homeTeamId}
                onChange={(e) => setNewMatch({ ...newMatch, homeTeamId: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select home team...</option>
                {adminTeams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name} - {team.divisionName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Away Team *
              </label>
              <select
                value={newMatch.awayTeamId}
                onChange={(e) => setNewMatch({ ...newMatch, awayTeamId: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select away team...</option>
                {adminTeams
                  .filter(t => t.id !== newMatch.homeTeamId)
                  .map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name} - {team.divisionName}
                    </option>
                  ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={newMatch.date}
                  onChange={(e) => setNewMatch({ ...newMatch, date: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Time *
                </label>
                <input
                  type="time"
                  value={newMatch.time}
                  onChange={(e) => setNewMatch({ ...newMatch, time: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={newMatch.location}
                onChange={(e) => setNewMatch({ ...newMatch, location: e.target.value })}
                placeholder="e.g., Merion Cricket Club"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
