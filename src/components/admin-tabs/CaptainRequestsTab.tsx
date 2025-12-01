import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';

interface CaptainRequest {
  id: string;
  playerId: string;
  leagueId: string;
  status: 'pending' | 'approved' | 'rejected';
  requestMessage?: string;
  createdAt: string;
  player: {
    user: {
      email: string;
      firstName: string;
      lastName: string;
    };
  };
}

interface CaptainRequestsTabProps {
  leagueId: string;
  userId: string;
}

const CaptainRequestsTab: React.FC<CaptainRequestsTabProps> = ({ leagueId, userId }) => {
  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  const [requests, setRequests] = useState<CaptainRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<CaptainRequest | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, [leagueId]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/association-admin/captain-requests?leagueId=${leagueId}&status=pending`);
      if (!response.ok) throw new Error('Failed to fetch requests');
      const data = await response.json();
      setRequests(data);
    } catch (err) {
      setError('Failed to load captain requests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    try {
      setProcessingId(requestId);
      const response = await fetch(`${apiUrl}/association-admin/captain-requests/${requestId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvedByAdminId: userId }),
      });

      if (!response.ok) throw new Error('Failed to approve request');
      
      // Update local state
      setRequests(requests.filter(r => r.id !== requestId));
    } catch (err) {
      setError('Failed to approve request');
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;

    try {
      setProcessingId(selectedRequest.id);
      const response = await fetch(`${apiUrl}/association-admin/captain-requests/${selectedRequest.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          rejectionReason: rejectionReason || 'Request rejected by admin'
        }),
      });

      if (!response.ok) throw new Error('Failed to reject request');
      
      // Update local state
      setRequests(requests.filter(r => r.id !== selectedRequest.id));
      setShowRejectDialog(false);
      setRejectionReason('');
      setSelectedRequest(null);
    } catch (err) {
      setError('Failed to reject request');
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Captain Requests</CardTitle>
          <CardDescription>Players requesting captain promotion</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading requests...</p>
        </CardContent>
      </Card>
    );
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Captain Requests</CardTitle>
          <CardDescription>Players requesting captain promotion</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No pending captain requests</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Captain Requests</CardTitle>
          <CardDescription>Players requesting captain promotion</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}
          <div className="space-y-3">
            {requests.map(request => (
              <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <p className="font-medium">
                    {request.player.user.firstName} {request.player.user.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{request.player.user.email}</p>
                  {request.requestMessage && (
                    <p className="text-sm mt-2 italic">{request.requestMessage}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Requested {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(request.id)}
                    disabled={processingId === request.id}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {processingId === request.id ? 'Approving...' : 'Approve'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedRequest(request);
                      setShowRejectDialog(true);
                    }}
                    disabled={processingId === request.id}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rejection Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Captain Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this captain request?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <label className="text-sm font-medium">Rejection Reason (optional)</label>
            <textarea
              className="mt-2 w-full px-3 py-2 border rounded-md text-sm"
              placeholder="Explain why you're rejecting this request..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={processingId !== null}
              className="bg-red-600 hover:bg-red-700"
            >
              {processingId ? 'Rejecting...' : 'Reject'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CaptainRequestsTab;
