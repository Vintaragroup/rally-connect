import { useState } from 'react';
import { ChevronRight, AlertCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { joinTeamByCode } from '@/lib/api/teamsApi';

interface JoinByCodeFormProps {
  userId: string;
  onSuccess: (data: { teamId: string; teamName: string; leagueId: string }) => void;
  onError?: (error: string) => void;
}

export function JoinByCodeForm({ userId, onSuccess, onError }: JoinByCodeFormProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!code.trim()) {
      setError('Please enter an invite code');
      return;
    }

    setIsLoading(true);

    try {
      const result = await joinTeamByCode(code, userId);
      console.log('✓ Joined team:', result);
      onSuccess(result as { teamId: string; teamName: string; leagueId: string });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to join team';
      console.error('❌ Error joining team:', errorMessage);
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
      <div className="flex-1">
        <label className="block text-sm font-medium mb-3">Team Invite Code</label>
        <Input
          type="text"
          placeholder="Enter code (e.g., TM_BOCCE_ABC123)"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setError(null);
          }}
          className="h-14 text-lg tracking-widest"
          disabled={isLoading}
          autoComplete="off"
        />
        <p className="text-xs text-[var(--color-text-secondary)] mt-2">
          Ask your team captain for the invite code
        </p>

        {error && (
          <div className="mt-4 flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>

      <div className="space-y-3 mt-6">
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={!code.trim() || isLoading}
        >
          {isLoading ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Joining...
            </>
          ) : (
            <>
              Join Team
              <ChevronRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
