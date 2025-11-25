import { useState } from "react";
import { Calendar, Clock, MapPin, Filter, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface CourtBookingScreenProps {
  onBack: () => void;
  onConfirm: () => void;
}

type CourtStatus = "available" | "reserved" | "blocked";

interface Court {
  id: string;
  name: string;
  type: "indoor" | "outdoor";
  lights: boolean;
  status: CourtStatus;
  surface: string;
}

export function CourtBookingScreen({ onBack, onConfirm }: CourtBookingScreenProps) {
  const [selectedDate, setSelectedDate] = useState("2024-12-15");
  const [selectedTime, setSelectedTime] = useState("6:00 PM");
  const [selectedCourt, setSelectedCourt] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<"all" | "indoor" | "outdoor">("all");
  const [filterLights, setFilterLights] = useState(false);

  const courts: Court[] = [
    { id: "c1", name: "Court 1", type: "indoor", lights: true, status: "available", surface: "Hard" },
    { id: "c2", name: "Court 2", type: "indoor", lights: true, status: "reserved", surface: "Hard" },
    { id: "c3", name: "Court 3", type: "outdoor", lights: true, status: "available", surface: "Clay" },
    { id: "c4", name: "Court 4", type: "outdoor", lights: true, status: "available", surface: "Clay" },
    { id: "c5", name: "Court 5", type: "outdoor", lights: false, status: "available", surface: "Clay" },
    { id: "c6", name: "Court 6", type: "outdoor", lights: false, status: "blocked", surface: "Hard" },
    { id: "c7", name: "Court 7", type: "indoor", lights: true, status: "available", surface: "Hard" },
    { id: "c8", name: "Court 8", type: "indoor", lights: true, status: "reserved", surface: "Hard" },
  ];

  const filteredCourts = courts.filter(court => {
    if (filterType !== "all" && court.type !== filterType) return false;
    if (filterLights && !court.lights) return false;
    return true;
  });

  const getCourtStatusColor = (status: CourtStatus) => {
    switch (status) {
      case "available":
        return "bg-green-50 border-green-200 hover:bg-green-100";
      case "reserved":
        return "bg-gray-50 border-gray-300 cursor-not-allowed opacity-60";
      case "blocked":
        return "bg-red-50 border-red-200 cursor-not-allowed opacity-60";
    }
  };

  const selectedCourtData = courts.find(c => c.id === selectedCourt);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)] p-4 sticky top-0 z-20">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="text-[var(--color-text-secondary)]">
            ← Back
          </button>
        </div>
        <h1 className="mb-1">Book a Court</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Merion Bocce Club
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* Date & Time Selection */}
        <div className="bg-[var(--color-bg-elevated)] rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-[var(--color-text-secondary)]" />
            <div className="flex-1">
              <label className="text-sm text-[var(--color-text-secondary)]">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-[var(--color-border)] rounded-lg"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-[var(--color-text-secondary)]" />
            <div className="flex-1">
              <label className="text-sm text-[var(--color-text-secondary)]">Time</label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-[var(--color-border)] rounded-lg"
              >
                <option>5:00 PM</option>
                <option>6:00 PM</option>
                <option>7:00 PM</option>
                <option>8:00 PM</option>
                <option>9:00 PM</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[var(--color-bg-elevated)] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-[var(--color-text-secondary)]" />
            <span className="text-sm">Filters</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                filterType === "all"
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-gray-100 text-[var(--color-text-secondary)]"
              }`}
            >
              All Courts
            </button>
            <button
              onClick={() => setFilterType("indoor")}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                filterType === "indoor"
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-gray-100 text-[var(--color-text-secondary)]"
              }`}
            >
              Indoor
            </button>
            <button
              onClick={() => setFilterType("outdoor")}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                filterType === "outdoor"
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-gray-100 text-[var(--color-text-secondary)]"
              }`}
            >
              Outdoor
            </button>
            <button
              onClick={() => setFilterLights(!filterLights)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                filterLights
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-gray-100 text-[var(--color-text-secondary)]"
              }`}
            >
              💡 Lights Only
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 px-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-200 border border-green-300" />
            <span className="text-xs text-[var(--color-text-secondary)]">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-200 border border-gray-300" />
            <span className="text-xs text-[var(--color-text-secondary)]">Reserved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-200 border border-red-300" />
            <span className="text-xs text-[var(--color-text-secondary)]">Blocked</span>
          </div>
        </div>

        {/* Court Grid */}
        <div>
          <h2 className="mb-3">Select a Court</h2>
          <div className="grid grid-cols-2 gap-3">
            {filteredCourts.map((court) => (
              <button
                key={court.id}
                onClick={() => court.status === "available" && setSelectedCourt(court.id)}
                disabled={court.status !== "available"}
                className={`relative p-4 rounded-2xl border-2 transition-all ${getCourtStatusColor(
                  court.status
                )} ${
                  selectedCourt === court.id
                    ? "ring-2 ring-[var(--color-primary)] border-[var(--color-primary)]"
                    : ""
                }`}
              >
                {selectedCourt === court.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}

                <div className="text-left">
                  <div className="font-medium mb-2">{court.name}</div>
                  <div className="space-y-1">
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        court.type === "indoor" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                      }`}
                    >
                      {court.type === "indoor" ? "🏠 Indoor" : "🌤️ Outdoor"}
                    </Badge>
                    {court.lights && (
                      <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700 ml-1">
                        💡
                      </Badge>
                    )}
                    <div className="text-xs text-[var(--color-text-secondary)] mt-1">
                      {court.surface}
                    </div>
                  </div>

                  {court.status === "reserved" && (
                    <div className="text-xs text-[var(--color-text-secondary)] mt-2">
                      Reserved
                    </div>
                  )}
                  {court.status === "blocked" && (
                    <div className="text-xs text-red-600 mt-2">
                      Maintenance
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Court Summary */}
        {selectedCourtData && (
          <div className="bg-[var(--color-accent)] bg-opacity-10 border border-[var(--color-accent)] rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-base mb-1">Booking Summary</h3>
                <div className="space-y-1 text-sm text-[var(--color-text-secondary)]">
                  <div>{selectedCourtData.name} • {selectedCourtData.type} • {selectedCourtData.surface}</div>
                  <div>{selectedDate} at {selectedTime}</div>
                  <div>Merion Bocce Club</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2 pb-6">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={!selectedCourt}
            className="flex-1"
          >
            Confirm Booking
          </Button>
        </div>
      </div>
    </div>
  );
}
