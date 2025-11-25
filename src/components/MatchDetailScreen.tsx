import { useState } from "react";
import { MapPin, MessageSquare, Edit, ChevronDown, ChevronUp } from "lucide-react";
import { StatusChip } from "./StatusChip";
import { SportIcon } from "./SportIcon";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface MatchDetailScreenProps {
  isCaptain?: boolean;
}

export function MatchDetailScreen({ isCaptain = true }: MatchDetailScreenProps) {
  const [availability, setAvailability] = useState<"available" | "maybe" | "unavailable" | null>(null);
  const [note, setNote] = useState("");
  const [expandedLines, setExpandedLines] = useState<number[]>([0]);

  const toggleLine = (lineIndex: number) => {
    setExpandedLines((prev) =>
      prev.includes(lineIndex)
        ? prev.filter((i) => i !== lineIndex)
        : [...prev, lineIndex]
    );
  };

  const lines = [
    {
      lineNumber: 1,
      homePlayers: [
        { name: "Alex Rivera", rating: 4.2, isYou: true },
        { name: "Jordan Chen", rating: 4.0 },
      ],
      awayPlayers: [
        { name: "Taylor Morgan", rating: 4.1 },
        { name: "Casey Williams", rating: 3.9 },
      ],
    },
    {
      lineNumber: 2,
      homePlayers: [
        { name: "Sam Patel", rating: 3.8 },
        { name: "Riley Thompson", rating: 3.7 },
      ],
      awayPlayers: [
        { name: "Drew Martinez", rating: 3.8 },
        { name: "Blake Anderson", rating: 3.6 },
      ],
    },
    {
      lineNumber: 3,
      homePlayers: [
        { name: "Morgan Lee", rating: 3.5 },
        { name: "Cameron Smith", rating: 3.4 },
      ],
      awayPlayers: [
        { name: "Avery Johnson", rating: 3.6 },
        { name: "Quinn Davis", rating: 3.3 },
      ],
    },
  ];

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)] p-4">
        <div className="flex items-start justify-between mb-3">
          <SportIcon sport="bocce" size={40} />
          <StatusChip status="scheduled" />
        </div>
        <h1 className="mb-2">Merion Bocce Club vs Radnor Rollers</h1>
        <p className="text-[var(--color-text-secondary)] text-sm">
          Division 2 • Winter 24–25
        </p>
      </div>

      {/* Match Info Card */}
      <div className="p-4">
        <div className="bg-[var(--color-bg-elevated)] rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                📅
              </div>
              <div>
                <div className="font-medium">Today, Nov 20</div>
                <div className="text-[var(--color-text-secondary)] text-sm">7:30 PM</div>
              </div>
            </div>
          </div>
          
          <div className="h-px bg-[var(--color-border)]" />
          
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[var(--color-text-secondary)] mt-0.5" />
              <div>
                <div className="font-medium">Merion Cricket Club</div>
                <div className="text-[var(--color-text-secondary)] text-sm">
                  325 Montgomery Ave, Haverford
                </div>
              </div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full border-[var(--color-border)]"
            onClick={() => {
              // Open Google Maps with the location
              const address = "325 Montgomery Ave, Haverford, PA";
              const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
              window.open(mapUrl, '_blank');
            }}
          >
            <MapPin className="w-4 h-4 mr-2" />
            View on map
          </Button>
        </div>
      </div>

      {/* Availability Section (Player View) */}
      <div className="px-4 pb-4">
        <h2 className="mb-3">Your Availability</h2>
        <div className="bg-[var(--color-bg-elevated)] rounded-2xl p-4 shadow-sm">
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { value: "available", label: "Available", emoji: "✅" },
              { value: "maybe", label: "Maybe", emoji: "❓" },
              { value: "unavailable", label: "Can't Play", emoji: "❌" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setAvailability(option.value as any)}
                className={`py-3 rounded-xl text-sm transition-all ${
                  availability === option.value
                    ? "bg-[var(--color-primary)] text-white shadow-md"
                    : "bg-[var(--color-bg)] text-[var(--color-text-secondary)]"
                }`}
              >
                <div className="text-lg mb-1">{option.emoji}</div>
                <div>{option.label}</div>
              </button>
            ))}
          </div>
          
          <Textarea
            placeholder="Add a note for your captain (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </div>
      </div>

      {/* Lines & Lineups */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2>Lines & Lineups</h2>
          {isCaptain && (
            <Button variant="ghost" size="sm" className="text-[var(--color-primary)]">
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          )}
        </div>
        
        <div className="space-y-3">
          {lines.map((line, index) => {
            const isExpanded = expandedLines.includes(index);
            
            return (
              <div
                key={index}
                className="bg-[var(--color-bg-elevated)] rounded-2xl shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleLine(index)}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-sm">
                      {line.lineNumber}
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Line {line.lineNumber}</div>
                      <div className="text-[var(--color-text-secondary)] text-sm">
                        {line.homePlayers[0].name} & {line.homePlayers[1].name}
                      </div>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-[var(--color-text-secondary)]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[var(--color-text-secondary)]" />
                  )}
                </button>
                
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-4">
                    <div className="pt-2 border-t border-[var(--color-border)]">
                      <div className="text-sm text-[var(--color-text-secondary)] mb-2">
                        Merion Bocce Club
                      </div>
                      {line.homePlayers.map((player, playerIndex) => (
                        <div
                          key={playerIndex}
                          className={`flex items-center justify-between py-2 ${
                            player.isYou ? "bg-[var(--color-accent)]/10 -mx-4 px-4 rounded-lg" : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm">
                              {player.name.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {player.name}
                                {player.isYou && (
                                  <span className="text-xs bg-[var(--color-accent)] text-[var(--color-text-primary)] px-2 py-0.5 rounded-full">
                                    You
                                  </span>
                                )}
                              </div>
                              <div className="text-[var(--color-text-secondary)] text-sm">
                                Rating: {player.rating}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-center text-[var(--color-text-secondary)] text-sm py-1">
                      vs
                    </div>
                    
                    <div>
                      <div className="text-sm text-[var(--color-text-secondary)] mb-2">
                        Radnor Rollers
                      </div>
                      {line.awayPlayers.map((player, playerIndex) => (
                        <div
                          key={playerIndex}
                          className="flex items-center justify-between py-2"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white text-sm">
                              {player.name.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <div>
                              <div className="font-medium">{player.name}</div>
                              <div className="text-[var(--color-text-secondary)] text-sm">
                                Rating: {player.rating}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Captain Actions */}
      {isCaptain && (
        <div className="px-4 mt-6">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">⭐</span>
              <h3 className="text-base">Captain Tools</h3>
            </div>
            <div className="space-y-2">
              <Button className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]">
                <MessageSquare className="w-4 h-4 mr-2" />
                Message Team
              </Button>
              <Button variant="outline" className="w-full border-[var(--color-border)]">
                View Availability Responses
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}