import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';

interface CaptainInvitationsTabProps {
  leagueId: string;
  userId: string;
}

interface Player {
  id: string;
  user: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

const CaptainInvitationsTab: React.FC<CaptainInvitationsTabProps> = ({ leagueId, userId }) => {
  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [invitationMessage, setInvitationMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPlayers();
  }, [leagueId]);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/players`);
      if (!response.ok) throw new Error('Failed to fetch players');
      const data = await response.json();
      setPlayers(data);
    } catch (err) {
      setError('Failed to load players');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInvitePlayer = async () => {
    if (!selectedPlayer) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`${apiUrl}/association-admin/captain-invitations/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: selectedPlayer.id,
          leagueId,
          sentByAdminId: userId,
          invitationMessage: invitationMessage || `We would like you to be a captain for this league`,
          expiresInDays: 7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send invitation');
      }

      // Success - reset form
      setShowInviteDialog(false);
      setSelectedPlayer(null);
      setInvitationMessage('');
      setError(null);
      
      // Show success message
      alert(`Invitation sent to ${selectedPlayer.user.firstName} ${selectedPlayer.user.lastName}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invitation');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPlayers = players.filter(player =>
    `${player.user.firstName} ${player.user.lastName} ${player.user.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invite Captains</CardTitle>
          <CardDescription>Send captain invitations to players</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading players...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Invite Captains</CardTitle>
              <CardDescription>Send captain invitations to players</CardDescription>
            </div>
            <Button onClick={() => setShowInviteDialog(true)}>
              Send Invitation
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}
          <div className="text-muted-foreground text-sm">
            <p>Use the "Send Invitation" button to invite players to become captains for your league.</p>
            <p className="mt-2">Players will receive a 7-day invitation to accept or decline.</p>
          </div>
        </CardContent>
      </Card>

      {/* Invite Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Captain Invitation</DialogTitle>
            <DialogDescription>
              Select a player and send them a captain invitation
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Player Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Player</label>
              <Input
                placeholder="Type name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Player List */}
            {filteredPlayers.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Player</label>
                <div className="max-h-48 overflow-y-auto border rounded">
                  {filteredPlayers.map(player => (
                    <button
                      key={player.id}
                      onClick={() => setSelectedPlayer(player)}
                      className={`w-full text-left p-3 border-b hover:bg-gray-50 transition ${
                        selectedPlayer?.id === player.id ? 'bg-blue-50 border-l-2 border-l-blue-600' : ''
                      }`}
                    >
                      <p className="font-medium text-sm">
                        {player.user.firstName} {player.user.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">{player.user.email}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {filteredPlayers.length === 0 && searchTerm && (
              <div className="text-sm text-muted-foreground p-3 text-center">
                No players found
              </div>
            )}

            {/* Invitation Message */}
            {selectedPlayer && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Invitation Message (optional)</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  placeholder="Add a personal message to the invitation..."
                  value={invitationMessage}
                  onChange={(e) => setInvitationMessage(e.target.value)}
                  rows={3}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowInviteDialog(false);
                  setSelectedPlayer(null);
                  setInvitationMessage('');
                  setSearchTerm('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleInvitePlayer}
                disabled={!selectedPlayer || isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Invitation'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CaptainInvitationsTab;
