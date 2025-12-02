import { useState } from 'react';
import { Loader, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/Modal';

interface RequestJoinModalProps {
  isOpen: boolean;
  teamName: string;
  onSubmit: (message: string) => Promise<void>;
  onClose: () => void;
}

export function RequestJoinModal({
  isOpen,
  teamName,
  onSubmit,
  onClose,
}: RequestJoinModalProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await onSubmit(message);
      setMessage('');
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit request';
      console.error('❌ Error submitting request:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request to Join Team"
      maxWidth="max-w-sm"
    >
      <p className="text-sm text-[var(--color-text-secondary)] mb-6">
        Request to join <span className="font-medium text-[var(--color-text)]">{teamName}</span>
      </p>

      {error && (
        <div className="mb-4 flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Message (optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setError(null);
            }}
            placeholder="Tell the captain why you'd like to join..."
            className="w-full h-24 p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            disabled={isLoading}
          />
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            {message.length}/500 characters
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Requesting...
              </>
            ) : (
              'Send Request'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
