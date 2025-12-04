import { useState } from "react";
import { X, Users, AlertCircle } from "lucide-react";
import { apiService } from "../services/api";

interface TeamSettingsModalProps {
  teamId: string;
  teamName: string;
  currentPlayerCount: number;
  minPlayersNeeded: number;
  isLookingForPlayers: boolean;
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function TeamSettingsModal({
  teamId,
  teamName,
  currentPlayerCount,
  minPlayersNeeded,
  isLookingForPlayers,
  userId,
  onClose,
  onSuccess,
}: TeamSettingsModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localLooking, setLocalLooking] = useState(isLookingForPlayers);

  const playersNeeded = Math.max(0, minPlayersNeeded - currentPlayerCount);
  const canOpenTeam = currentPlayerCount > 0; // Need at least 1 player to open recruitment

  const handleToggleRecruitment = async () => {
    try {
      setLoading(true);
      setError(null);

      const newStatus = !localLooking;
      const response = await apiService.updateTeamLookingForPlayers(
        teamId,
        newStatus,
        userId
      );

      if (response.data && (response.data as any).success) {
        setLocalLooking(newStatus);
        onSuccess();
        setTimeout(() => onClose(), 1500); // Close after showing success
      } else {
        setError((response.data as any)?.message || "Failed to update team settings");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error updating team recruitment status:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white flex items-center justify-between sticky top-0">
          <h2 className="text-xl font-bold">Team Settings</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Team Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">{teamName}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Current Players</span>
                <span className="font-medium text-gray-900">{currentPlayerCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Minimum Required</span>
                <span className="font-medium text-gray-900">{minPlayersNeeded}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Players Needed</span>
                <span className={`font-medium ${playersNeeded > 0 ? "text-orange-600" : "text-green-600"}`}>
                  {playersNeeded > 0 ? `${playersNeeded} more` : "Full"}
                </span>
              </div>
            </div>
          </div>

          {/* Recruitment Toggle */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-2">
                  Open for Recruitment
                </h4>
                <p className="text-sm text-blue-700 mb-4">
                  {localLooking
                    ? "Your team is visible to players looking to join."
                    : "Your team is not accepting new players."}
                </p>
                <button
                  onClick={handleToggleRecruitment}
                  disabled={loading || (!canOpenTeam && !localLooking)}
                  className={`w-full px-4 py-2 rounded-lg font-medium transition-all ${
                    loading
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : localLooking
                      ? "bg-orange-600 text-white hover:bg-orange-700"
                      : canOpenTeam
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  {loading ? "Updating..." : localLooking ? "Close for Recruitment" : "Open for Recruitment"}
                </button>
              </div>
            </div>
          </div>

          {/* Info Message */}
          {!canOpenTeam && !localLooking && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                You need at least 1 player in your team to open for recruitment.
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}

          {/* Status */}
          {!error && !loading && (
            <div className={`p-3 rounded-xl text-sm font-medium text-center ${
              localLooking
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-gray-100 text-gray-700 border border-gray-300"
            }`}>
              {localLooking
                ? "✓ Team is open for recruitment"
                : "Team is closed for recruitment"}
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-gray-900 font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
