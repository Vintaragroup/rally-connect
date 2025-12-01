import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface LeagueRules {
  id: string;
  leagueId: string;
  teamNamePattern?: string;
  teamNameRequired: boolean;
  maxPlayersPerTeam?: number;
  minPlayersPerTeam?: number;
  allowCaptainTransfer: boolean;
  requireCaptainApproval: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LeagueRulesTabProps {
  leagueId: string;
}

const LeagueRulesTab: React.FC<LeagueRulesTabProps> = ({ leagueId }) => {
  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  const [rules, setRules] = useState<LeagueRules | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    teamNamePattern: '',
    teamNameRequired: false,
    maxPlayersPerTeam: '',
    minPlayersPerTeam: '',
    allowCaptainTransfer: false,
    requireCaptainApproval: true,
  });

  useEffect(() => {
    fetchRules();
  }, [leagueId]);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/association-admin/leagues/${leagueId}/rules`);
      
      if (response.status === 404) {
        // No rules exist yet, show empty form
        setRules(null);
        setFormData({
          teamNamePattern: '',
          teamNameRequired: false,
          maxPlayersPerTeam: '',
          minPlayersPerTeam: '',
          allowCaptainTransfer: false,
          requireCaptainApproval: true,
        });
      } else if (response.ok) {
        const data = await response.json();
        setRules(data);
        setFormData({
          teamNamePattern: data.teamNamePattern || '',
          teamNameRequired: data.teamNameRequired || false,
          maxPlayersPerTeam: data.maxPlayersPerTeam?.toString() || '',
          minPlayersPerTeam: data.minPlayersPerTeam?.toString() || '',
          allowCaptainTransfer: data.allowCaptainTransfer || false,
          requireCaptainApproval: data.requireCaptainApproval || true,
        });
      } else {
        throw new Error('Failed to fetch rules');
      }
    } catch (err) {
      setError('Failed to load league rules');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRules = async () => {
    try {
      setIsSaving(true);
      const response = await fetch(`${apiUrl}/association-admin/leagues/${leagueId}/rules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamNamePattern: formData.teamNamePattern || undefined,
          teamNameRequired: formData.teamNameRequired,
          maxPlayersPerTeam: formData.maxPlayersPerTeam ? parseInt(formData.maxPlayersPerTeam) : undefined,
          minPlayersPerTeam: formData.minPlayersPerTeam ? parseInt(formData.minPlayersPerTeam) : undefined,
          allowCaptainTransfer: formData.allowCaptainTransfer,
          requireCaptainApproval: formData.requireCaptainApproval,
        }),
      });

      if (!response.ok) throw new Error('Failed to save rules');
      
      const updatedRules = await response.json();
      setRules(updatedRules);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError('Failed to save league rules');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>League Rules</CardTitle>
          <CardDescription>Configure league-wide rules and settings</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading rules...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>League Rules</CardTitle>
            <CardDescription>Configure league-wide rules and settings</CardDescription>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>
              Edit Rules
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {isEditing ? (
          <div className="space-y-6">
            {/* Team Naming */}
            <div className="space-y-4 pb-4 border-b">
              <h3 className="font-semibold">Team Naming</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Team Name Theme (optional)</label>
                <select
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  value={formData.teamNamePattern}
                  onChange={(e) => setFormData({ ...formData, teamNamePattern: e.target.value })}
                >
                  <option value="">No specific theme</option>
                  <option value="colors">Colors</option>
                  <option value="cities">Cities</option>
                  <option value="colleges">Colleges</option>
                  <option value="animals">Animals</option>
                  <option value="custom">Custom</option>
                </select>
                <p className="text-xs text-muted-foreground">
                  Suggests naming conventions for teams (e.g., "Red Team", "Blue Team")
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="teamNameRequired"
                  checked={formData.teamNameRequired}
                  onChange={(e) => setFormData({ ...formData, teamNameRequired: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="teamNameRequired" className="text-sm font-medium">
                  Require team naming theme adherence
                </label>
              </div>
            </div>

            {/* Player Limits */}
            <div className="space-y-4 pb-4 border-b">
              <h3 className="font-semibold">Player Limits</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Min Players per Team</label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.minPlayersPerTeam}
                    onChange={(e) => setFormData({ ...formData, minPlayersPerTeam: e.target.value })}
                    placeholder="e.g., 3"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Max Players per Team</label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.maxPlayersPerTeam}
                    onChange={(e) => setFormData({ ...formData, maxPlayersPerTeam: e.target.value })}
                    placeholder="e.g., 12"
                  />
                </div>
              </div>
            </div>

            {/* Captain Rules */}
            <div className="space-y-4">
              <h3 className="font-semibold">Captain Rules</h3>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="allowCaptainTransfer"
                  checked={formData.allowCaptainTransfer}
                  onChange={(e) => setFormData({ ...formData, allowCaptainTransfer: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="allowCaptainTransfer" className="text-sm font-medium">
                  Allow captain transfers between teams
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="requireCaptainApproval"
                  checked={formData.requireCaptainApproval}
                  onChange={(e) => setFormData({ ...formData, requireCaptainApproval: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="requireCaptainApproval" className="text-sm font-medium">
                  Require admin approval for captain requests
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  fetchRules(); // Reset to original values
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveRules}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Rules'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {rules ? (
              <>
                <div>
                  <h4 className="font-medium text-sm mb-2">Team Naming Theme</h4>
                  <p className="text-sm text-muted-foreground">
                    {rules.teamNamePattern ? `${rules.teamNamePattern}${rules.teamNameRequired ? ' (Required)' : ''}` : 'No specific theme'}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Player Limits</h4>
                  <p className="text-sm text-muted-foreground">
                    {rules.minPlayersPerTeam && rules.maxPlayersPerTeam
                      ? `${rules.minPlayersPerTeam} - ${rules.maxPlayersPerTeam} players per team`
                      : 'No limits set'}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Captain Transfers</h4>
                  <p className="text-sm text-muted-foreground">
                    {rules.allowCaptainTransfer ? 'Allowed' : 'Not allowed'}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Captain Request Approval</h4>
                  <p className="text-sm text-muted-foreground">
                    {rules.requireCaptainApproval ? 'Admin approval required' : 'Automatic approval'}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">No rules configured yet</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeagueRulesTab;
