import { Trophy, TrendingUp, Target, Flame, Calendar, Award, Plus, BarChart3, Camera } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner@2.0.3";

interface PersonalStatsScreenProps {
  onBack: () => void;
  onViewAchievements: () => void;
}

interface StatCard {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: any;
  color: string;
}

interface Match {
  id: string;
  date: string;
  opponent: string;
  result: "W" | "L";
  score: string;
  personalStats?: {
    points?: number;
    assists?: number;
    rating?: number;
  };
}

export function PersonalStatsScreen({ onBack, onViewAchievements }: PersonalStatsScreenProps) {
  const [selectedSport, setSelectedSport] = useState("all");
  const [stats, setStats] = useState<StatCard[]>([]);
  const [recentMatches, setRecentMatches] = useState<Match[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] text-white p-4 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="text-white/90">
            ← Back
          </button>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-white mb-1">My Stats</h1>
            <p className="text-sm text-white/80">Track your performance</p>
          </div>
          <button 
            onClick={onViewAchievements}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <Award className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Profile Summary */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl">
              AR
            </div>
            <div className="flex-1">
              <h2 className="text-white mb-1">Your Stats</h2>
              <div className="flex items-center gap-2">
                <Badge className="bg-white/20 text-white text-xs">Level 12</Badge>
                <Badge className="bg-amber-500/20 text-amber-200 text-xs">⭐ Captain</Badge>
              </div>
            </div>
            <button
              onClick={() => toast.info("Profile photo update coming soon!")}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
            >
              <Camera className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Sport Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["all", "bocce", "pickleball", "padel"].map((sport) => (
            <button
              key={sport}
              onClick={() => setSelectedSport(sport)}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                selectedSport === sport
                  ? "bg-white text-[var(--color-primary)]"
                  : "bg-white/20 text-white/90"
              }`}
            >
              {sport.charAt(0).toUpperCase() + sport.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[var(--color-bg-elevated)] rounded-2xl p-4 shadow-sm"
              >
                <Icon className={`w-5 h-5 ${stat.color} mb-2`} />
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-xs text-[var(--color-text-secondary)] mb-1">
                  {stat.label}
                </div>
                <div className={`text-xs ${
                  stat.trend === "up" ? "text-green-600" :
                  stat.trend === "down" ? "text-red-600" :
                  "text-[var(--color-text-tertiary)]"
                }`}>
                  {stat.change}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Milestones */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2>Progress Milestones</h2>
            <Button 
              size="sm" 
              variant="outline"
              onClick={onViewAchievements}
            >
              <Award className="w-4 h-4 mr-1" />
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {milestones.map((milestone) => {
              const progress = (milestone.current / milestone.target) * 100;
              return (
                <div
                  key={milestone.id}
                  className="bg-[var(--color-bg-elevated)] rounded-2xl p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium">{milestone.title}</h3>
                    <Badge className="bg-purple-100 text-purple-700 text-xs">
                      {milestone.reward}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--color-text-secondary)]">
                        {milestone.current} / {milestone.target}
                      </span>
                      <span className="text-[var(--color-text-secondary)]">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Matches with Stats */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2>Recent Performance</h2>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => toast.info("Log match stats feature coming soon!")}
            >
              <Plus className="w-4 h-4 mr-1" />
              Log Stats
            </Button>
          </div>
          <div className="space-y-2">
            {recentMatches.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[var(--color-bg-elevated)] rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      match.result === "W" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-red-100 text-red-700"
                    }`}>
                      {match.result}
                    </div>
                    <div>
                      <div className="font-medium text-sm">vs {match.opponent}</div>
                      <div className="text-xs text-[var(--color-text-secondary)]">
                        {match.date} • {match.score}
                      </div>
                    </div>
                  </div>
                  <BarChart3 className="w-5 h-5 text-[var(--color-text-tertiary)]" />
                </div>

                {/* Personal Stats */}
                {match.personalStats && (
                  <div className="flex gap-4 pt-3 border-t border-[var(--color-border)]">
                    <div className="flex-1 text-center">
                      <div className="text-lg font-semibold">
                        {match.personalStats.points}
                      </div>
                      <div className="text-xs text-[var(--color-text-secondary)]">
                        Points
                      </div>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="text-lg font-semibold">
                        {match.personalStats.assists}
                      </div>
                      <div className="text-xs text-[var(--color-text-secondary)]">
                        Assists
                      </div>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="text-lg font-semibold">
                        {match.personalStats.rating}
                      </div>
                      <div className="text-xs text-[var(--color-text-secondary)]">
                        Rating
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-4"
        >
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium mb-1 text-purple-900">
                Log Your Stats to Improve!
              </h3>
              <p className="text-sm text-purple-700 mb-3">
                Track your performance after each match to see your progress and earn achievements.
              </p>
              <Button 
                size="sm" 
                className="w-full"
                onClick={() => toast.info("Quick log feature coming soon!")}
              >
                Quick Log Last Match
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
