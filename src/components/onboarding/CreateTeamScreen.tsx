import { useState } from "react";
import { ChevronRight, Camera, Users, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { SportIcon } from "../SportIcon";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";
import { validateTeamCreation, ValidationError } from "@/lib/validation/forms";

interface CreateTeamScreenProps {
  selectedSports: string[];
  onNext: (team: { name: string; sport: string; club: string; id?: string }) => void;
  onBack: () => void;
}

export function CreateTeamScreen({ selectedSports, onNext, onBack }: CreateTeamScreenProps) {
  const { user } = useAuth();
  const [teamName, setTeamName] = useState("");
  const [selectedSport, setSelectedSport] = useState(selectedSports[0] || "");
  const [club, setClub] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setValidationErrors([]);
    setError(null);
    
    // Validate form data
    const validationResult = validateTeamCreation({
      teamName,
      location: club,
      sport: selectedSport,
    });
    
    if (!validationResult.isValid) {
      setValidationErrors(validationResult.errors);
      return;
    }
    
    if (!user?.id) {
      setError("User not authenticated");
      return;
    }

    setIsLoading(true);

    try {
      // Create team via API
      const response = await apiService.createTeam({
        name: teamName,
        sport: selectedSport,
        club,
        userId: user.id,
      });

      if (response.error) {
        setError(response.error);
        return;
      }

      // Pass team data to parent, including the ID from response
      const createdTeam = response.data as any;
      onNext({
        name: teamName,
        sport: selectedSport,
        club,
        id: createdTeam?.id,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create team";
      setError(errorMessage);
      console.error("Error creating team:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const sportNames: Record<string, string> = {
    bocce: "Bocce",
    pickleball: "Pickleball",
    padel: "Padel",
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] max-w-[390px] mx-auto">
      {/* Progress */}
      <div className="p-4">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i <= 3 ? "bg-[var(--color-primary)]" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col p-6">
        <div className="mb-8">
          <h1 className="mb-2">Create your team</h1>
          <p className="text-[var(--color-text-secondary)]">
            Set up your team details and you'll be ready to invite players
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm flex gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              {validationErrors.map((err, idx) => (
                <div key={idx} className="flex gap-2 text-red-700 text-sm mb-1 last:mb-0">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{err.message}</span>
                </div>
              ))}
            </div>
          )}

          {/* Team Logo */}
          <div className="flex justify-center mb-8">
            <button
              type="button"
              className="relative w-28 h-28 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white hover:shadow-lg transition-shadow"
            >
              <Users className="w-12 h-12" />
              <div className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[var(--color-bg-elevated)] border-2 border-[var(--color-bg)] flex items-center justify-center shadow-md">
                <Camera className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
            </button>
          </div>

          <div className="space-y-4 flex-1">
            <div>
              <label className="block text-sm mb-2">Team Name *</label>
              <Input
                type="text"
                placeholder="Merion Bocce Club"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
                className={`h-12 ${validationErrors.some(e => e.field === 'teamName') ? 'border-red-500 focus:ring-red-500' : ''}`}
                aria-invalid={validationErrors.some(e => e.field === 'teamName')}
              />
              {validationErrors.find(e => e.field === 'teamName') && (
                <p className="text-xs text-red-600 mt-1 flex gap-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                  {validationErrors.find(e => e.field === 'teamName')?.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-3">Sport *</label>
              <div className="flex gap-3">
                {selectedSports.map((sport) => (
                  <button
                    key={sport}
                    type="button"
                    onClick={() => setSelectedSport(sport)}
                    className={`flex-1 bg-[var(--color-bg-elevated)] rounded-xl p-4 transition-all ${
                      selectedSport === sport
                        ? "ring-2 ring-[var(--color-primary)] shadow-md"
                        : "shadow-sm"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <SportIcon sport={sport as any} size={32} />
                      <span className="text-sm">{sportNames[sport]}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">Club/Location *</label>
              <Input
                type="text"
                placeholder="Merion Cricket Club"
                value={club}
                onChange={(e) => setClub(e.target.value)}
                required
                className={`h-12 ${validationErrors.some(e => e.field === 'location') ? 'border-red-500 focus:ring-red-500' : ''}`}
                aria-invalid={validationErrors.some(e => e.field === 'location')}
              />
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                Where does your team play?
              </p>
              {validationErrors.find(e => e.field === 'location') && (
                <p className="text-xs text-red-600 mt-1 flex gap-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                  {validationErrors.find(e => e.field === 'location')?.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3 mt-6">
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={!teamName || !selectedSport || !club || isLoading}
            >
              {isLoading ? "Creating team..." : "Continue"}
              {!isLoading && <ChevronRight className="w-5 h-5 ml-2" />}
            </Button>
            <Button onClick={onBack} variant="ghost" className="w-full" disabled={isLoading}>
              Back
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
