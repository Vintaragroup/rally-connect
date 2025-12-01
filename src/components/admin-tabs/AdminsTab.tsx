import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';

interface Admin {
  id: string;
  userId: string;
  role: string;
  permissions: string[];
  user: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

interface AdminsTabProps {
  leagueId: string;
  userId: string;
}

const AdminsTab: React.FC<AdminsTabProps> = ({ leagueId, userId }) => {
  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, [leagueId]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/association-admin/leagues/${leagueId}/admins`);
      if (!response.ok) throw new Error('Failed to fetch admins');
      const data = await response.json();
      setAdmins(data);
    } catch (err) {
      setError('Failed to load league admins');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (email: string) => {
    if (!email) return;

    try {
      setIsSubmitting(true);
      
      // First, find the user by email
      const playersResponse = await fetch(`${apiUrl}/players`);
      if (!playersResponse.ok) throw new Error('Failed to find user');
      
      const players = await playersResponse.json();
      const targetUser = players.find((p: any) => p.user.email === email)?.user;

      if (!targetUser) {
        setError('User not found');
        return;
      }

      // Then promote them to admin
      const promoteResponse = await fetch(`${apiUrl}/association-admin/promote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: targetUser.id,
          leagueId,
          role: 'ADMIN',
        }),
      });

      if (!promoteResponse.ok) {
        const errorData = await promoteResponse.json();
        throw new Error(errorData.message || 'Failed to promote user');
      }

      // Refresh admins list
      await fetchAdmins();
      setShowAddDialog(false);
      setSearchTerm('');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add admin');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveAdmin = async (adminId: string) => {
    if (!window.confirm('Are you sure you want to remove this admin?')) return;

    try {
      const response = await fetch(`${apiUrl}/association-admin/${adminId}/remove`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (!response.ok) throw new Error('Failed to remove admin');
      
      // Refresh admins list
      await fetchAdmins();
    } catch (err) {
      setError('Failed to remove admin');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>League Admins</CardTitle>
          <CardDescription>Manage league administrators</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading admins...</p>
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
              <CardTitle>League Admins</CardTitle>
              <CardDescription>Manage league administrators</CardDescription>
            </div>
            <Button onClick={() => setShowAddDialog(true)}>
              Add Admin
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          {admins.length === 0 ? (
            <p className="text-muted-foreground">No admins assigned yet</p>
          ) : (
            <div className="space-y-3">
              {admins.map(admin => (
                <div key={admin.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <p className="font-medium">
                      {admin.user.firstName} {admin.user.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">{admin.user.email}</p>
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {admin.permissions.map(perm => (
                        <Badge key={perm} variant="secondary" className="text-xs">
                          {perm.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {admin.userId !== userId && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveAdmin(admin.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Admin Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add League Admin</DialogTitle>
            <DialogDescription>
              Enter the email address of the user you want to make an admin
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input
                type="email"
                placeholder="admin@example.com"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddAdmin(searchTerm);
                  }
                }}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddDialog(false);
                  setSearchTerm('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleAddAdmin(searchTerm)}
                disabled={!searchTerm || isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add Admin'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminsTab;
