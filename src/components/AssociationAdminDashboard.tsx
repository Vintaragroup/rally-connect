import React, { useState, useEffect } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import CaptainRequestsTab from './admin-tabs/CaptainRequestsTab';
import CaptainInvitationsTab from './admin-tabs/CaptainInvitationsTab';
import LeagueRulesTab from './admin-tabs/LeagueRulesTab';
import AdminsTab from './admin-tabs/AdminsTab';
import InvitationCodesTab from './admin-tabs/InvitationCodesTab';

interface League {
  id: string;
  name: string;
  description: string;
}

interface AdminLeague {
  id: string;
  userId: string;
  leagueId: string;
  role: string;
  permissions: string[];
  league: League;
}

const AssociationAdminDashboard: React.FC<{ userId: string }> = ({ userId }) => {
  const [adminLeagues, setAdminLeagues] = useState<AdminLeague[]>([]);
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLeagueSelector, setShowLeagueSelector] = useState(false);

  useEffect(() => {
    fetchAdminLeagues();
  }, [userId]);

  const fetchAdminLeagues = async () => {
    try {
      setLoading(true);
      // Fetch admin status to get all leagues where user is admin
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${apiUrl}/association-admin/check-admin-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error('Failed to fetch admin status');
      
      const data = await response.json();
      console.log('Admin status:', data);
      
      if (data.isAdmin && data.leagues && data.leagues.length > 0) {
        setAdminLeagues(data.leagues);
        setSelectedLeagueId(data.leagues[0].leagueId);
      }
    } catch (err) {
      setError('Failed to load admin leagues');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading admin dashboard...</p>
      </div>
    );
  }

  if (adminLeagues.length === 0) {
    return (
      <Card className="m-4">
        <CardHeader>
          <CardTitle>No Leagues Available</CardTitle>
          <CardDescription>You are not an admin for any leagues yet</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const currentAdmin = adminLeagues.find(a => a.leagueId === selectedLeagueId);
  const currentLeague = currentAdmin?.league;

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">League Administration</h1>
            <p className="text-muted-foreground mt-1">Manage captains, rules, and league settings</p>
          </div>
          <Button 
            variant="outline"
            onClick={() => setShowLeagueSelector(!showLeagueSelector)}
          >
            {currentLeague?.name || 'Select League'}
          </Button>
        </div>

        {/* League Selector */}
        {showLeagueSelector && (
          <div className="flex flex-wrap gap-2">
            {adminLeagues.map(admin => (
              <Button
                key={admin.leagueId}
                variant={selectedLeagueId === admin.leagueId ? 'default' : 'outline'}
                onClick={() => {
                  setSelectedLeagueId(admin.leagueId);
                  setShowLeagueSelector(false);
                }}
                className="text-sm"
              >
                {admin.league.name}
              </Button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="captain-requests" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="captain-requests">Captain Requests</TabsTrigger>
          <TabsTrigger value="invitations">Invite Captains</TabsTrigger>
          <TabsTrigger value="codes">Invitation Codes</TabsTrigger>
          <TabsTrigger value="admins">League Admins</TabsTrigger>
          <TabsTrigger value="rules">League Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="captain-requests" className="space-y-4">
          <CaptainRequestsTab leagueId={selectedLeagueId} userId={userId} />
        </TabsContent>

        <TabsContent value="invitations" className="space-y-4">
          <CaptainInvitationsTab leagueId={selectedLeagueId} userId={userId} />
        </TabsContent>

        <TabsContent value="codes" className="space-y-4">
          <InvitationCodesTab leagueId={selectedLeagueId} userId={userId} />
        </TabsContent>

        <TabsContent value="admins" className="space-y-4">
          <AdminsTab leagueId={selectedLeagueId} userId={userId} />
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <LeagueRulesTab leagueId={selectedLeagueId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssociationAdminDashboard;
