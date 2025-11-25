import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { SportIcon } from "../SportIcon";

interface SportSelectionScreenProps {
  onNext: (sports: string[]) => void;
}

export function SportSelectionScreen({ onNext }: SportSelectionScreenProps) {
  const [selectedSports, setSelectedSports] = useState<string[]>([]);

  const sports = [
    { id: "bocce", name: "Bocce", description: "Traditional Italian ball sport" },
    { id: "pickleball", name: "Pickleball", description: "Fast-paced paddle sport" },
    { id: "padel", name: "Padel", description: "Team-based racket sport" },
  ];

  const toggleSport = (sportId: string) => {
    if (selectedSports.includes(sportId)) {
      setSelectedSports(selectedSports.filter((s) => s !== sportId));
    } else {
      setSelectedSports([...selectedSports, sportId]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] max-w-[390px] mx-auto">
      {/* Progress */}
      <div className="p-4">
        <div className="flex gap-2">
          <div className="h-1 flex-1 rounded-full bg-[var(--color-primary)]" />
          <div className="h-1 flex-1 rounded-full bg-gray-200" />
          <div className="h-1 flex-1 rounded-full bg-gray-200" />
        </div>
      </div>

      <div className="flex-1 flex flex-col p-6">
        <div className="mb-8">
          <h1 className="mb-2">Which sports?</h1>
          <p className="text-[var(--color-text-secondary)]">
            Select all sports you want to play or manage
          </p>
        </div>

        <div className="space-y-3 flex-1">
          {sports.map((sport) => {
            const isSelected = selectedSports.includes(sport.id);
            return (
              <button
                key={sport.id}
                onClick={() => toggleSport(sport.id)}
                className={`w-full bg-[var(--color-bg-elevated)] rounded-2xl p-5 text-left transition-all ${
                  isSelected
                    ? "ring-2 ring-[var(--color-primary)] shadow-lg"
                    : "shadow-sm hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-4">
                  <SportIcon sport={sport.id as any} size={48} />
                  <div className="flex-1">
                    <h3 className="text-lg mb-1">{sport.name}</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {sport.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M13.3333 4L6 11.3333L2.66667 8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <Button
          onClick={() => onNext(selectedSports)}
          disabled={selectedSports.length === 0}
          className="w-full mt-6"
          size="lg"
        >
          Continue
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
