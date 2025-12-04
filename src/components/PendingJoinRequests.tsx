import { useState, useEffect } from "react";
import { X, Clock, CheckCircle, XCircle, AlertCircle, Users } from "lucide-react";
import { toast } from "sonner";
import { apiService } from "../services/api";

interface PendingRequest {
  id: string;
  playerName: string;
  playerEmail: string;
  message?: string;
  requestedAt: string;
  status: "PENDING" | "APPROVED" | "DECLINED";
}

interface PendingJoinRequestsProps {
  teamId: string;
  teamName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PendingJoinRequests({
  teamId,
  teamName,
  onClose,
  onSuccess,
}: PendingJoinRequestsProps) {
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await apiService.getPendingJoinRequests(teamId);
        if (response.data) {
          setRequests((response.data as any) || []);
          setError(null);
        } else {
          setError("Failed to load requests");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [teamId]);

  const handleApprove = async (requestId: string) => {
    try {
      setProcessingId(requestId);
      const response = await apiService.approveJoinRequest(teamId, requestId);
      if ((response.data as any)?.success) {
        const approvedRequest = requests.find((r) => r.id === requestId);
        setRequests((prev) =>
          prev.map((req) =>
            req.id === requestId ? { ...req, status: "APPROVED" } : req
          )
        );
        toast.success("Request approved", {
          description: `${approvedRequest?.playerName || "Player"} has been added to the team`,
        });
        onSuccess?.();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to approve request";
      toast.error("Approval failed", {
        description: errorMessage,
      });
      setError(errorMessage);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (requestId: string) => {
    try {
      setProcessingId(requestId);
      const response = await apiService.declineJoinRequest(teamId, requestId);
      if ((response.data as any)?.success) {
        const declinedRequest = requests.find((r) => r.id === requestId);
        setRequests((prev) =>
          prev.map((req) =>
            req.id === requestId ? { ...req, status: "DECLINED" } : req
          )
        );
        toast.success("Request declined", {
          description: `${declinedRequest?.playerName || "Player"}'s request has been declined`,
        });
        onSuccess?.();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to decline request";
      toast.error("Decline failed", {
        description: errorMessage,
      });
      setError(errorMessage);
    } finally {
      setProcessingId(null);
    }
  };

  const pendingRequests = requests.filter((r) => r.status === "PENDING");
  const approvedRequests = requests.filter((r) => r.status === "APPROVED");
  const declinedRequests = requests.filter((r) => r.status === "DECLINED");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white flex items-center justify-between sticky top-0">
          <div>
            <h2 className="text-xl font-bold">Join Requests</h2>
            <p className="text-purple-100 text-sm mt-1">{teamName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Error Message */}
          {error && (
            <div className="m-4 bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="p-8 text-center">
              <p className="text-gray-600">Loading requests...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && requests.length === 0 && (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No join requests yet</p>
              <p className="text-gray-500 text-sm mt-1">
                When players request to join, they'll appear here.
              </p>
            </div>
          )}

          {/* Pending Requests */}
          {!loading && pendingRequests.length > 0 && (
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                Pending Requests ({pendingRequests.length})
              </h3>
              <div className="space-y-3">
                {pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-amber-50 border border-amber-200 rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {request.playerName}
                        </p>
                        <p className="text-xs text-gray-600">{request.playerEmail}</p>
                        {request.message && (
                          <p className="text-sm text-gray-700 mt-2 p-2 bg-white rounded border border-amber-100">
                            "{request.message}"
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
                        {new Date(request.requestedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(request.id)}
                        disabled={processingId === request.id}
                        className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                      >
                        {processingId === request.id ? "Approving..." : "Approve"}
                      </button>
                      <button
                        onClick={() => handleDecline(request.id)}
                        disabled={processingId === request.id}
                        className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                      >
                        {processingId === request.id ? "Declining..." : "Decline"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Approved Requests */}
          {!loading && approvedRequests.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Approved ({approvedRequests.length})
              </h3>
              <div className="space-y-2">
                {approvedRequests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {request.playerName}
                      </p>
                      <p className="text-xs text-gray-600">{request.playerEmail}</p>
                    </div>
                    <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
                      Approved
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Declined Requests */}
          {!loading && declinedRequests.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-600" />
                Declined ({declinedRequests.length})
              </h3>
              <div className="space-y-2">
                {declinedRequests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {request.playerName}
                      </p>
                      <p className="text-xs text-gray-600">{request.playerEmail}</p>
                    </div>
                    <span className="text-xs text-red-700 bg-red-100 px-2 py-1 rounded-full">
                      Declined
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-gray-900 font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
