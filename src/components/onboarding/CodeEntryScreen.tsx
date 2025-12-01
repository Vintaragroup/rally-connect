import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

interface CodeEntryScreenProps {
  onCodeSubmit: (code: string) => void;
  onSkip: () => void;
}

export function CodeEntryScreen({ onCodeSubmit, onSkip }: CodeEntryScreenProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError('Please enter a code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4802';
      const response = await fetch(`${apiUrl}/auth/code-validation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          userId: 'temp', // Will be replaced with actual userId after auth
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Invalid code');
        return;
      }

      onCodeSubmit(code.trim().toUpperCase());
    } catch (err) {
      setError('Failed to validate code. Please try again.');
      console.error('Error validating code:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)] p-4"
    >
      <div className="w-full max-w-md">
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-lg shadow-xl p-8 space-y-6"
        >
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Join an Organization</h1>
            <p className="text-gray-600">
              Do you have an organization code? Enter it below to get started.
            </p>
          </div>

          {/* Code Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Organization Code
            </label>
            <Input
              type="text"
              placeholder="e.g., BOCCE2025ABC"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError(null);
              }}
              className="w-full px-4 py-3 text-lg tracking-widest uppercase"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
            />
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-600 mt-2"
              >
                ❌ {error}
              </motion.p>
            )}
            <p className="text-xs text-gray-500">
              Your organization admin provided this code
            </p>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !code.trim()}
            className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-gray-900 font-semibold py-3"
          >
            {isLoading ? 'Verifying...' : 'Submit Code'}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Skip Button */}
          <Button
            onClick={onSkip}
            variant="outline"
            className="w-full py-3"
          >
            I Don't Have a Code
          </Button>

          {/* Footer */}
          <p className="text-xs text-gray-500 text-center">
            Don't worry! You can still join an organization after selecting one manually.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
