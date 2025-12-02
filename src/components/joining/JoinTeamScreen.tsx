import { useState } from 'react';
import { Hash, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { JoinByCodeForm } from './JoinByCodeForm';
import { TeamDiscovery } from './TeamDiscovery';

interface JoinTeamScreenProps {
  userId: string;
  leagueId: string;
  onComplete: (team: { id: string; name: string } | null) => void;
  onBack: () => void;
}

type JoinMode = 'code' | 'discover';

export function JoinTeamScreen({
  userId,
  leagueId,
  onComplete,
  onBack,
}: JoinTeamScreenProps) {
  const [joinMode, setJoinMode] = useState<JoinMode>('code');

  const handleJoinByCode = (data: { teamId: string; teamName: string }) => {
    console.log('✓ Team join by code completed:', data);
    onComplete({ id: data.teamId, name: data.teamName });
  };

  const handleTeamDiscovered = (team: any) => {
    console.log('✓ Join request submitted for team:', team.name);
    onComplete({ id: team.id, name: team.name });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] max-w-[390px] mx-auto">
      {/* Progress */}
      <div className="p-4">
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i <= 3 ? 'bg-[var(--color-primary)]' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col p-6">
        <div className="mb-6">
          <h1 className="mb-2 text-2xl font-bold">Join a team</h1>
          <p className="text-[var(--color-text-secondary)]">
            Use an invite code or discover teams looking for players
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="bg-[var(--color-bg-elevated)] rounded-xl p-1 flex gap-1 mb-6">
          <button
            onClick={() => setJoinMode('code')}
            className={`flex-1 py-2 rounded-lg text-sm transition-all ${
              joinMode === 'code'
                ? 'bg-[var(--color-bg)] shadow-sm'
                : 'text-[var(--color-text-secondary)]'
            }`}
          >
            <Hash className="w-4 h-4 inline mr-1" />
            Enter Code
          </button>
          <button
            onClick={() => setJoinMode('discover')}
            className={`flex-1 py-2 rounded-lg text-sm transition-all ${
              joinMode === 'discover'
                ? 'bg-[var(--color-bg)] shadow-sm'
                : 'text-[var(--color-text-secondary)]'
            }`}
          >
            <Search className="w-4 h-4 inline mr-1" />
            Discover
          </button>
        </div>

        {/* Content */}
        {joinMode === 'code' && (
          <JoinByCodeForm
            userId={userId}
            onSuccess={handleJoinByCode}
            onError={(error) => console.error('Join error:', error)}
          />
        )}

        {joinMode === 'discover' && (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto mb-6">
              <TeamDiscovery
                leagueId={leagueId}
                userId={userId}
                onTeamSelected={handleTeamDiscovered}
                onError={(error) => console.error('Discovery error:', error)}
              />
            </div>

            <div className="space-y-3 border-t border-[var(--color-border)] pt-4 mt-4">
              <Button
                onClick={() => onComplete(null)}
                variant="outline"
                className="w-full"
              >
                Skip for Now
              </Button>
            </div>
          </div>
        )}

        {/* Footer - Visible for Code Mode */}
        {joinMode === 'code' && (
          <div className="space-y-3 mt-6 border-t border-[var(--color-border)] pt-4">
            <Button onClick={() => onComplete(null)} variant="outline" className="w-full">
              Skip for Now
            </Button>
            <Button onClick={onBack} variant="ghost" className="w-full">
              Back
            </Button>
          </div>
        )}

        {/* Footer - Visible for Discover Mode */}
        {joinMode === 'discover' && (
          <Button onClick={onBack} variant="ghost" className="w-full">
            Back
          </Button>
        )}
      </div>
    </div>
  );
}
