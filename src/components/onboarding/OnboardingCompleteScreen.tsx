import { CheckCircle2, Trophy } from "lucide-react";
import { Button } from "../ui/button";

interface OnboardingCompleteScreenProps {
  role: "player" | "captain" | "member";
  teamName: string;
  onComplete: () => void;
  isReturningUser?: boolean;
}

export function OnboardingCompleteScreen({ role, teamName, onComplete, isReturningUser = false }: OnboardingCompleteScreenProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] max-w-[390px] mx-auto">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        {/* Success Animation */}
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center">
            <CheckCircle2 className="w-16 h-16 text-white" />
          </div>
          <div className="absolute -top-2 -right-2">
            <div className="w-12 h-12 rounded-full bg-[var(--color-accent)] flex items-center justify-center animate-bounce">
              <Trophy className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <h1 className="mb-3">
          {isReturningUser 
            ? "Welcome back! 🎉" 
            : role === "captain" 
              ? "Team created! 🎉" 
              : "You're all set! 🎉"}
        </h1>
        
        <p className="text-[var(--color-text-secondary)] text-lg mb-2">
          {isReturningUser
            ? `Ready for the new season!`
            : role === "captain" 
              ? `${teamName} is ready to compete!` 
              : `Welcome to ${teamName}!`}
        </p>

        <p className="text-[var(--color-text-secondary)] max-w-sm mb-8">
          {isReturningUser
            ? `You're all set as a ${role} for this season. Your preferences have been updated.`
            : role === "captain"
              ? "Your team has been created. You can now manage your lineup, schedule matches, and track your team's progress."
              : "You've successfully joined the team. Check your schedule, set your availability, and get ready to play!"}
        </p>

        {/* Quick Tips */}
        <div className="w-full max-w-sm bg-[var(--color-bg-elevated)] rounded-2xl p-5 mb-8 text-left">
          <h3 className="text-base mb-3">Quick tips to get started:</h3>
          <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
            {role === "captain" ? (
              <>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] mt-1.5 flex-shrink-0" />
                  <span>Invite players using your team code</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] mt-1.5 flex-shrink-0" />
                  <span>Set up your first match lineup</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] mt-1.5 flex-shrink-0" />
                  <span>Track team performance in the Ratings tab</span>
                </li>
              </>
            ) : (
              <>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] mt-1.5 flex-shrink-0" />
                  <span>Check your upcoming matches</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] mt-1.5 flex-shrink-0" />
                  <span>Set your availability for matches</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] mt-1.5 flex-shrink-0" />
                  <span>View your rating and stats</span>
                </li>
              </>
            )}
          </ul>
        </div>

        <Button onClick={onComplete} className="w-full max-w-sm" size="lg">
          Let's Go!
        </Button>
      </div>
    </div>
  );
}