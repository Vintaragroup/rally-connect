import { useState } from 'react';
import { FilterBar } from '../../components/admin/FilterBar';
import { DataTable, Column } from '../../components/admin/DataTable';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { Modal } from '../../components/admin/Modal';
import { Check, X, User } from 'lucide-react';

interface CaptainRequest {
  id: string;
  playerName: string;
  playerEmail: string;
  playerAvatar?: string;
  team: string;
  teamName?: string;
  leagueId: string;
  leagueName: string;
  seasonName?: string;
  requestedDate: Date;
  submittedDate?: Date;
  status: 'pending' | 'approved' | 'rejected';
  source?: string;
  notes?: string;
  reviewedBy?: string;
  reviewedDate?: Date;
}

export function CaptainRequests() {
  const [requests, setRequests] = useState<CaptainRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<CaptainRequest | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [leagueFilter, setLeagueFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Filter requests
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.playerName.toLowerCase().includes(searchValue.toLowerCase()) ||
      request.playerEmail.toLowerCase().includes(searchValue.toLowerCase());
    const matchesLeague = !leagueFilter || request.leagueId === leagueFilter;
    const matchesStatus = !statusFilter || request.status === statusFilter;

    return matchesSearch && matchesLeague && matchesStatus;
  });

  const handleApprove = (requestId: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'approved' as const,
              reviewedBy: 'Admin',
              reviewedDate: new Date(),
            }
          : r
      )
    );
    setSelectedRequest(null);
  };

  const handleReject = (requestId: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'rejected' as const,
              reviewedBy: 'Admin',
              reviewedDate: new Date(),
            }
          : r
      )
    );
    setSelectedRequest(null);
  };

  const columns: Column<CaptainRequest>[] = [
    {
      key: 'playerName',
      header: 'Player',
      render: (request) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-sm font-medium overflow-hidden flex-shrink-0">
            {request.playerAvatar ? (
              <img
                src={request.playerAvatar}
                alt={request.playerName}
                className="w-full h-full object-cover"
              />
            ) : (
              request.playerName
                .split(' ')
                .map((n: string) => n[0])
                .join('')
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">{request.playerName}</p>
            <p className="text-xs text-gray-500">{request.playerEmail}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'team',
      header: 'Team / League',
      render: (request) => (
        <div>
          <p className="text-gray-900">{request.teamName}</p>
          <p className="text-xs text-gray-500">{request.leagueName}</p>
        </div>
      ),
    },
    {
      key: 'season',
      header: 'Season',
      render: (request) => <span>{request.seasonName}</span>,
    },
    {
      key: 'source',
      header: 'Source',
      render: (request) => (
        <StatusBadge status={request.source || 'pending'} type="role" />
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (request) => <StatusBadge status={request.status} />,
    },
    {
      key: 'submittedDate',
      header: 'Submitted',
      render: (request) => (
        <span className="text-sm text-gray-600">
          {request.submittedDate?.toLocaleDateString() || new Date().toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (request) =>
        request.status === 'pending' ? (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleApprove(request.id);
              }}
              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
              title="Approve"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleReject(request.id);
              }}
              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
              title="Reject"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <span className="text-xs text-gray-500">
            {request.reviewedDate?.toLocaleDateString()}
          </span>
        ),
    },
  ];

  const uniqueLeagues = Array.from(
    new Set(requests.map((r) => r.leagueName))
  ).map((name) => ({
    label: name,
    value: requests.find((r) => r.leagueName === name)?.leagueId || '',
  }));

  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-w-0">
      <main className="flex-1 p-4 md:p-8 max-w-full overflow-x-hidden">
        <div className="mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl text-gray-900 mb-2">Captain Requests</h1>
          <p className="text-gray-600">
            Review and manage captain role requests from players
          </p>
        </div>

        <FilterBar
          searchPlaceholder="Search by player name or email..."
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
                { label: 'Pending', value: 'pending' },
                { label: 'Approved', value: 'approved' },
                { label: 'Rejected', value: 'rejected' },
              ],
              value: statusFilter,
              onChange: setStatusFilter,
            },
          ]}
        />

        <DataTable
          columns={columns}
          data={filteredRequests}
          onRowClick={setSelectedRequest}
          emptyMessage="No captain requests found"
        />
      </main>

      {/* Detail Modal */}
      {selectedRequest && (
        <Modal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          title="Captain Request Details"
          footer={
            selectedRequest.status === 'pending' ? (
              <>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(selectedRequest.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(selectedRequest.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  Approve
                </button>
              </>
            ) : (
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            )
          }
        >
          <div className="space-y-6">
            {/* Player Info */}
            <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-xl font-medium overflow-hidden">
                {selectedRequest.playerAvatar ? (
                  <img
                    src={selectedRequest.playerAvatar}
                    alt={selectedRequest.playerName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8" />
                )}
              </div>
              <div>
                <h4 className="text-xl text-gray-900 mb-1">
                  {selectedRequest.playerName}
                </h4>
                <p className="text-gray-600">{selectedRequest.playerEmail}</p>
              </div>
            </div>

            {/* Request Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Team</p>
                <p className="text-gray-900">{selectedRequest.teamName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">League</p>
                <p className="text-gray-900">{selectedRequest.leagueName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Season</p>
                <p className="text-gray-900">{selectedRequest.seasonName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Source</p>
                <StatusBadge status={selectedRequest.source || 'pending'} type="role" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <StatusBadge status={selectedRequest.status} />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Submitted Date</p>
                <p className="text-gray-900">
                  {selectedRequest.submittedDate?.toLocaleDateString() || new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Notes */}
            {selectedRequest.notes && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Player Notes</p>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-900">{selectedRequest.notes}</p>
                </div>
              </div>
            )}

            {/* Review Info */}
            {selectedRequest.reviewedBy && (
              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Review Information</p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-900">
                    Reviewed by: {selectedRequest.reviewedBy}
                  </p>
                  <p className="text-sm text-gray-900">
                    Date: {selectedRequest.reviewedDate?.toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}