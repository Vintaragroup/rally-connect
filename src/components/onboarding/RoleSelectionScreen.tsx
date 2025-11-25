import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

interface RoleSelectionScreenProps {
  onNext: (role: "player" | "captain") => void;
  onBack: () => void;
  isReturningUser?: boolean;
}

export function RoleSelectionScreen({ onNext, onBack, isReturningUser = false }: RoleSelectionScreenProps) {
  const [selectedRole, setSelectedRole] = useState<"player" | "captain" | null>(null);

  const roles = [
    {
      id: "player" as const,
      title: "Player",
      description: "Join a team, view schedules, and track your performance",
      emoji: "🎾",
      features: ["Join existing teams", "View match schedules", "Track your ratings"],
    },
    {
      id: "captain" as const,
      title: "Team Captain",
      description: "Create and manage your team, set lineups, and enter scores",
      emoji: "⭐",
      features: ["Create new team", "Manage lineups", "Invite players", "Enter match scores"],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] max-w-[390px] mx-auto">
      {/* Progress */}
      <div className="p-4">
        <div className="flex gap-2">
          <div className="h-1 flex-1 rounded-full bg-[var(--color-primary)]" />
          <div className="h-1 flex-1 rounded-full bg-[var(--color-primary)]" />
          <div className="h-1 flex-1 rounded-full bg-gray-200" />
        </div>
      </div>

      <div className="flex-1 flex flex-col p-6">
        <div className="mb-8">
          <h1 className="mb-2">
            {isReturningUser ? "What's your role this season?" : "What's your role?"}
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            {isReturningUser 
              ? "Are you playing or captaining this season?" 
              : "Are you joining as a player or creating a team as a captain?"}
          </p>
        </div>

        <div className="space-y-4 flex-1">
          {roles.map((role) => {
            const isSelected = selectedRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`w-full bg-[var(--color-bg-elevated)] rounded-2xl p-5 text-left transition-all ${
                  isSelected
                    ? "ring-2 ring-[var(--color-primary)] shadow-lg"
                    : "shadow-sm hover:shadow-md"
                }`}
              >
                <div className="flex items-start gap-4 mb-3">
                  <div className="text-4xl">{role.emoji}</div>
                  <div className="flex-1">
                    <h3 className="text-lg mb-1">{role.title}</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {role.description}
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
                <ul className="space-y-2 ml-16">
                  {role.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        <div className="space-y-3 mt-6">
          <Button
            onClick={() => selectedRole && onNext(selectedRole)}
            disabled={!selectedRole}
            className="w-full"
            size="lg"
          >
            Continue
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
          <Button onClick={onBack} variant="ghost" className="w-full">
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}