import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface Sport {
  id: string;
  name: string;
  icon?: string;
  description?: string;
}

interface SportSelectionScreenProps {
  organizationId: string;
  onComplete: (sports: string[]) => void;
  onBack: () => void;
}

export function SimpleSportSelectionScreen({
  organizationId,
  onComplete,
  onBack,
}: SportSelectionScreenProps) {
  const [sports, setSports] = useState<Sport[]>([]);
  const [selectedSportIds, setSelectedSportIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        setIsLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL || '/api';
        const response = await fetch(`${apiUrl}/sports`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch sports');
        }
        
        const data = await response.json();
        setSports(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching sports:', err);
        setError('Failed to load sports. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSports();
  }, [organizationId]);

  const handleToggleSport = (sportId: string) => {
    setSelectedSportIds((prev) =>
      prev.includes(sportId)
        ? prev.filter((id) => id !== sportId)
        : [...prev, sportId]
    );
    setError(null);
  };

  const handleSubmit = () => {
    if (selectedSportIds.length === 0) {
      setError('Please select at least one sport');
      return;
    }
    onComplete(selectedSportIds);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)]">
        <div className="text-white">Loading sports...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)] p-4"
    >
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-lg shadow-xl p-8 space-y-6"
        >
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">What Sports Interest You?</h1>
            <p className="text-gray-600">
              Select the sports you'd like to participate in
            </p>
          </div>

          {/* Sports Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sports.map((sport) => (
              <motion.button
                key={sport.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => handleToggleSport(sport.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedSportIds.includes(sport.id)
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center mt-1 flex-shrink-0 ${
                      selectedSportIds.includes(sport.id)
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent)]'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedSportIds.includes(sport.id) && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {sport.icon && <span className="text-2xl">{sport.icon}</span>}
                      <h3 className="font-semibold text-gray-900">{sport.name}</h3>
                    </div>
                    {sport.description && (
                      <p className="text-sm text-gray-600 mt-1">{sport.description}</p>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-600"
            >
              ❌ {error}
            </motion.p>
          )}

          {/* Selected Count */}
          {selectedSportIds.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-[var(--color-accent)] font-medium"
            >
              ✓ {selectedSportIds.length} sport{selectedSportIds.length !== 1 ? 's' : ''} selected
            </motion.p>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onBack}
              variant="outline"
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={selectedSportIds.length === 0}
              className="flex-1 bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-gray-900 font-semibold"
            >
              Continue
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
