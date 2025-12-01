import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface Organization {
  id: string;
  name: string;
  description?: string;
}

interface OrganizationSelectionScreenProps {
  onSelect: (orgId: string) => void;
  onBack: () => void;
}

export function OrganizationSelectionScreen({
  onSelect,
  onBack,
}: OrganizationSelectionScreenProps) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Fetch organizations from backend
    // For now, mock data
    const mockOrgs: Organization[] = [
      {
        id: 'org-1',
        name: 'Merion Bocce Club',
        description: 'Premier bocce club with multiple teams',
      },
      {
        id: 'org-2',
        name: 'Riverside Pickleball Association',
        description: 'Community pickleball league',
      },
      {
        id: 'org-3',
        name: 'Downtown Padel Club',
        description: 'Professional padel facility',
      },
    ];
    setOrganizations(mockOrgs);
    setIsLoading(false);
  }, []);

  const handleSubmit = () => {
    if (!selectedOrgId) {
      setError('Please select an organization');
      return;
    }
    onSelect(selectedOrgId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)]">
        <div className="text-white">Loading organizations...</div>
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
            <h1 className="text-3xl font-bold text-gray-900">Select Your Organization</h1>
            <p className="text-gray-600">
              Choose the club or organization you're part of
            </p>
          </div>

          {/* Organization List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {organizations.map((org) => (
              <motion.button
                key={org.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => {
                  setSelectedOrgId(org.id);
                  setError(null);
                }}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  selectedOrgId === org.id
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedOrgId === org.id
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent)]'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedOrgId === org.id && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{org.name}</h3>
                    {org.description && (
                      <p className="text-sm text-gray-600">{org.description}</p>
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
              disabled={!selectedOrgId}
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
