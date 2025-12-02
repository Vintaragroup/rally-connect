import { useState, useEffect } from 'react';
import { AlertCircle, Loader, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPendingJoinRequests, approveJoinRequest, declineJoinRequest } from '@/lib/api/teamsApi';

interface JoinRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  message?: string;
  createdAt: string;
  status: 'PENDING' | 'APPROVED' | 'DECLINED';
}

interface PendingJoinRequestsProps {
  teamId: string;
  onRequestsChange?: (count: number) => void;
}

export function PendingJoinRequests({
  teamId,
  onRequestsChange,
}: PendingJoinRequestsProps) {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, [teamId]);

  useEffect(() => {
    const pendingCount = requests.filter((r) => r.status === 'PENDING').length;
    onRequestsChange?.(pendingCount);
  }, [requests, onRequestsChange]);

  const loadRequests = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getPendingJoinRequests(teamId);
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load requests';
      console.error('❌ Error loading requests:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    setProcessingId(requestId);

    try {
      await approveJoinRequest(teamId, requestId);
      console.log(`✓ Approved request ${requestId}`);
      
      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId ? { ...r, status: 'APPROVED' } : r
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to approve request';
      console.error('❌ Error approving request:', errorMessage);
      setError(errorMessage);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (requestId: string) => {
    setProcessingId(requestId);

    try {
      await declineJoinRequest(teamId, requestId);
      console.log(`✓ Declined request ${requestId}`);
      
      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId ? { ...r, status: 'DECLINED' } : r
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to decline request';
      console.error('❌ Error declining request:', errorMessage);
      setError(errorMessage);
    } finally {
      setProcessingId(null);
    }
  };

  const pendingRequests = requests.filter((r) => r.status === 'PENDING');
  const processedRequests = requests.filter((r) => r.status !== 'PENDING');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="w-6 h-6 text-[var(--color-primary)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Pending Requests */}
      {pendingRequests.length > 0 ? (
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Pending Requests ({pendingRequests.length})
          </h3>
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="bg-[var(--color-bg-elevated)] rounded-xl p-4 border border-[var(--color-border)]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium">{request.userName}</h4>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {request.userEmail}
                    </p>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {request.message && (
                  <div className="mb-3 p-3 bg-[var(--color-bg)] rounded-lg">
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {request.message}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApprove(request.id)}
                    disabled={processingId === request.id}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    {processingId === request.id ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Approving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => handleDecline(request.id)}
                    disabled={processingId === request.id}
                    variant="outline"
                    className="flex-1"
                    size="sm"
                  >
                    {processingId === request.id ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Declining...
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 mr-2" />
                        Decline
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-[var(--color-text-secondary)]">
            No pending join requests
          </p>
        </div>
      )}

      {/* Processed Requests */}
      {processedRequests.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3">
            Previous Requests
          </h3>
          <div className="space-y-2">
            {processedRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-3 bg-[var(--color-bg-elevated)] rounded-lg opacity-60"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{request.userName}</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded ${
                    request.status === 'APPROVED'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {request.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
