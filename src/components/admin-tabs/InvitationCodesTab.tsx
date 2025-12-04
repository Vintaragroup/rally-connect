import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Copy, Plus, Trash2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface InvitationCodesTabProps {
  leagueId: string;
  userId: string;
}

interface InvitationCode {
  id: string;
  code: string;
  sport: string;
  createdAt: string;
  expiresAt?: string;
  usedBy: string[];
}

const InvitationCodesTab: React.FC<InvitationCodesTabProps> = ({ leagueId, userId }) => {
  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  const [codes, setCodes] = useState<InvitationCode[]>([]);
  const [sports, setSports] = useState<{ id: string; name: string }[]>([]);
  const [selectedSportId, setSelectedSportId] = useState('');
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Fetch codes and sports on mount
  React.useEffect(() => {
    fetchCodes();
    fetchSports();
  }, [leagueId]);

  const fetchCodes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/auth/admin/invitation-codes/${leagueId}`);
      if (!response.ok) throw new Error('Failed to fetch codes');
      const data = await response.json();
      setCodes(data || []);
    } catch (err) {
      console.error('Error fetching codes:', err);
      toast.error('Failed to load invitation codes');
    } finally {
      setLoading(false);
    }
  };

  const fetchSports = async () => {
    try {
      const response = await fetch(`${apiUrl}/sports`);
      if (!response.ok) throw new Error('Failed to fetch sports');
      const data = await response.json();
      setSports(data || []);
    } catch (err) {
      console.error('Error fetching sports:', err);
    }
  };

  const generateCode = async () => {
    if (!selectedSportId) {
      toast.error('Please select a sport');
      return;
    }

    try {
      setGenerating(true);
      const response = await fetch(`${apiUrl}/auth/admin/invitation-codes/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: leagueId,
          sportId: selectedSportId,
          createdBy: userId,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        }),
      });

      if (!response.ok) throw new Error('Failed to generate code');
      
      const data = await response.json();
      
      // Add new code to list
      const sportName = sports.find(s => s.id === selectedSportId)?.name || 'Unknown';
      setCodes([
        {
          id: data.code,
          code: data.code,
          sport: sportName,
          createdAt: new Date().toISOString(),
          usedBy: [],
        },
        ...codes,
      ]);

      toast.success(`Code generated: ${data.code}`);
      setShowForm(false);
      setSelectedSportId('');
    } catch (err) {
      console.error('Error generating code:', err);
      toast.error('Failed to generate invitation code');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const revokeCode = async (codeId: string) => {
    if (!confirm('Are you sure you want to revoke this code? Players won\'t be able to use it anymore.')) {
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/auth/admin/invitation-codes/${codeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to revoke code');

      setCodes(codes.filter(c => c.id !== codeId));
      toast.success('Code revoked');
    } catch (err) {
      console.error('Error revoking code:', err);
      toast.error('Failed to revoke code');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Invitation Codes</CardTitle>
          <CardDescription>
            Generate codes to invite new players to your organization and sport
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showForm ? (
            <Button
              onClick={() => setShowForm(true)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Generate New Code
            </Button>
          ) : (
            <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
              <div>
                <label className="text-sm font-medium">Select Sport</label>
                <select
                  value={selectedSportId}
                  onChange={(e) => setSelectedSportId(e.target.value)}
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">-- Choose a sport --</option>
                  {sports.map(sport => (
                    <option key={sport.id} value={sport.id}>
                      {sport.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedSportId('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={generateCode}
                  disabled={generating || !selectedSportId}
                >
                  {generating ? 'Generating...' : 'Generate Code'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Codes</CardTitle>
          <CardDescription>
            {codes.length} code{codes.length !== 1 ? 's' : ''} generated
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-gray-500">Loading codes...</p>
          ) : codes.length === 0 ? (
            <p className="text-sm text-gray-500">No invitation codes yet. Create one to get started!</p>
          ) : (
            <div className="space-y-3">
              {codes.map((code) => (
                <div
                  key={code.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="font-mono font-bold text-lg">{code.code}</code>
                      <button
                        onClick={() => copyToClipboard(code.code)}
                        className="text-slate-500 hover:text-slate-700 transition-colors"
                        title="Copy code"
                      >
                        {copiedCode === code.code ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <div className="text-sm text-slate-600">
                      <span className="font-medium">{code.sport}</span>
                      {' • '}
                      <span>{code.usedBy?.length || 0} used</span>
                      {code.expiresAt && (
                        <>
                          {' • '}
                          <span>Expires {new Date(code.expiresAt).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => revokeCode(code.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Revoke code"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvitationCodesTab;
