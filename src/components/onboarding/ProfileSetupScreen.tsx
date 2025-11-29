import { useState } from "react";
import { ChevronRight, Camera, User, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { validateRequired, validatePhone, ValidationError } from "@/lib/validation/forms";

interface ProfileSetupScreenProps {
  role: "player" | "captain";
  onNext: (profile: { name: string; phone: string; photo?: string }) => void;
  onBack: () => void;
}

export function ProfileSetupScreen({ role, onNext, onBack }: ProfileSetupScreenProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors([]);

    // Validate name
    const nameValidation = validateRequired(name, 'Full Name');
    if (!nameValidation.isValid) {
      setValidationErrors(nameValidation.errors);
      return;
    }

    // Validate phone
    const phoneValidation = validatePhone(phone);
    if (!phoneValidation.isValid) {
      setValidationErrors(phoneValidation.errors);
      return;
    }

    onNext({ name, phone });
  };

  const progressStep = role === "captain" ? 2 : 3;
  const totalSteps = role === "captain" ? 5 : 4;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] max-w-[390px] mx-auto">
      {/* Progress */}
      <div className="p-4">
        <div className="flex gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i < progressStep ? "bg-[var(--color-primary)]" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col p-6">
        <div className="mb-8">
          <h1 className="mb-2">Set up your profile</h1>
          <p className="text-[var(--color-text-secondary)]">
            This helps your teammates recognize you
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
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
          {/* Photo Upload */}
          <div className="flex justify-center mb-8">
            <button
              type="button"
              className="relative w-28 h-28 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white hover:shadow-lg transition-shadow"
            >
              <User className="w-12 h-12" />
              <div className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[var(--color-bg-elevated)] border-2 border-[var(--color-bg)] flex items-center justify-center shadow-md">
                <Camera className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
            </button>
          </div>

          <div className="space-y-4 flex-1">
            <div>
              <label className="block text-sm mb-2">Full Name *</label>
              <Input
                type="text"
                placeholder="Alex Rodriguez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={`h-12 ${validationErrors.some(e => e.field === 'Full Name') ? 'border-red-500 focus:ring-red-500' : ''}`}
                aria-invalid={validationErrors.some(e => e.field === 'Full Name')}
              />
              {validationErrors.find(e => e.field === 'Full Name') && (
                <p className="text-xs text-red-600 mt-1 flex gap-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                  {validationErrors.find(e => e.field === 'Full Name')?.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-2">Phone Number *</label>
              <Input
                type="tel"
                placeholder="(555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className={`h-12 ${validationErrors.some(e => e.field === 'phone') ? 'border-red-500 focus:ring-red-500' : ''}`}
                aria-invalid={validationErrors.some(e => e.field === 'phone')}
              />
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                Used for team communication only
              </p>
              {validationErrors.find(e => e.field === 'phone') && (
                <p className="text-xs text-red-600 mt-1 flex gap-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                  {validationErrors.find(e => e.field === 'phone')?.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3 mt-6">
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={!name || !phone}
            >
              Continue
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button onClick={onBack} variant="ghost" className="w-full">
              Back
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
