import { Calendar, Clock, MapPin, Users, Plus, Edit, Trash2, CheckCircle, XCircle, Filter } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner@2.0.3";

interface PracticeSchedulerScreenProps {
  onBack: () => void;
  isCaptain?: boolean;
}

interface Practice {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  duration: string;
  sport: "bocce" | "pickleball" | "padel";
  organizer: string;
  attendees: number;
  maxAttendees?: number;
  status: "upcoming" | "past" | "cancelled";
  isGoing?: boolean;
  notes?: string;
}

export function PracticeSchedulerScreen({ onBack, isCaptain = false }: PracticeSchedulerScreenProps) {
  const [selectedTab, setSelectedTab] = useState<"upcoming" | "past">("upcoming");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const practices: Practice[] = [];

  const filteredPractices = practices.filter(p => p.status === selectedTab);

  const getSportColor = (sport: Practice["sport"]) => {
    switch (sport) {
      case "bocce": return "bg-blue-100 text-blue-700";
      case "pickleball": return "bg-green-100 text-green-700";
      case "padel": return "bg-purple-100 text-purple-700";
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-4 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="text-white/90">
            ← Back
          </button>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-white mb-1">Practice Scheduler</h1>
            <p className="text-sm text-white/80">
              {isCaptain ? "Organize and manage practices" : "View and join practices"}
            </p>
          </div>
          <Calendar className="w-8 h-8 text-white" />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 text-center">
            <div className="text-xl font-bold text-white">
              {filteredPractices.filter(p => p.status === "upcoming").length}
            </div>
            <div className="text-xs text-white/80">Upcoming</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 text-center">
            <div className="text-xl font-bold text-white">
              {practices.filter(p => p.isGoing).length}
            </div>
            <div className="text-xs text-white/80">Attending</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 text-center">
            <div className="text-xl font-bold text-white">
              {practices.filter(p => p.status === "past").length}
            </div>
            <div className="text-xs text-white/80">Completed</div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Tabs */}
        <div className="flex gap-2 bg-[var(--color-bg-elevated)] rounded-xl p-1">
          <button
            onClick={() => setSelectedTab("upcoming")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              selectedTab === "upcoming"
                ? "bg-[var(--color-primary)] text-white shadow-sm"
                : "text-[var(--color-text-secondary)]"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setSelectedTab("past")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              selectedTab === "past"
                ? "bg-[var(--color-primary)] text-white shadow-sm"
                : "text-[var(--color-text-secondary)]"
            }`}
          >
            Past
          </button>
        </div>

        {/* Create Practice Button (Captain Only) */}
        {isCaptain && selectedTab === "upcoming" && (
          <Button
            onClick={() => toast.info("Create practice feature coming soon!")}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Schedule New Practice
          </Button>
        )}

        {/* Practice Cards */}
        <div className="space-y-3">
          {filteredPractices.length === 0 ? (
            <div className="bg-[var(--color-bg-elevated)] rounded-2xl p-8 text-center">
              <Calendar className="w-12 h-12 text-[var(--color-text-tertiary)] mx-auto mb-3" />
              <p className="text-[var(--color-text-secondary)]">
                No {selectedTab} practices
              </p>
            </div>
          ) : (
            filteredPractices.map((practice, index) => (
              <motion.div
                key={practice.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[var(--color-bg-elevated)] rounded-2xl p-4 shadow-sm"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{practice.title}</h3>
                      <Badge className={`${getSportColor(practice.sport)} text-xs capitalize`}>
                        {practice.sport}
                      </Badge>
                    </div>
                    {practice.isGoing !== undefined && practice.status === "upcoming" && (
                      <Badge
                        className={`${
                          practice.isGoing
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        } text-xs`}
                      >
                        {practice.isGoing ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            You're going
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 mr-1" />
                            Not attending
                          </>
                        )}
                      </Badge>
                    )}
                  </div>
                  {isCaptain && practice.status === "upcoming" && (
                    <button
                      onClick={() => toast.info("Edit practice feature coming soon!")}
                      className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                    >
                      <Edit className="w-4 h-4 text-[var(--color-text-secondary)]" />
                    </button>
                  )}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-[var(--color-text-tertiary)]" />
                    <span className="text-[var(--color-text-secondary)]">{practice.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-[var(--color-text-tertiary)]" />
                    <span className="text-[var(--color-text-secondary)]">{practice.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm col-span-2">
                    <MapPin className="w-4 h-4 text-[var(--color-text-tertiary)]" />
                    <span className="text-[var(--color-text-secondary)]">{practice.location}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 py-2 border-y border-[var(--color-border)]">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-[var(--color-text-tertiary)]" />
                    <span>
                      {practice.attendees}
                      {practice.maxAttendees && `/${practice.maxAttendees}`} attending
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-[var(--color-text-tertiary)]" />
                    <span>{practice.duration}</span>
                  </div>
                </div>

                {/* Notes */}
                {practice.notes && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-xl">
                    <p className="text-sm text-blue-900">
                      <strong>Note:</strong> {practice.notes}
                    </p>
                  </div>
                )}

                {/* Actions */}
                {practice.status === "upcoming" && (
                  <div className="flex gap-2 mt-3">
                    {practice.isGoing ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => toast.success("Marked as not attending")}
                      >
                        Can't Attend
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => toast.success("Marked as attending!")}
                      >
                        I'm Going
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast.info("Calendar export coming soon!")}
                    >
                      Add to Calendar
                    </Button>
                  </div>
                )}

                {/* Organizer */}
                <p className="text-xs text-[var(--color-text-tertiary)] mt-3">
                  Organized by {practice.organizer}
                </p>
              </motion.div>
            ))
          )}
        </div>

        {/* Info Card */}
        {selectedTab === "upcoming" && (
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium mb-1 text-purple-900">
                  {isCaptain ? "Schedule Regular Practices" : "Stay Active"}
                </h3>
                <p className="text-sm text-purple-700">
                  {isCaptain
                    ? "Regular practice sessions help your team improve and build chemistry."
                    : "Attend practices to improve your skills and build team chemistry."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
