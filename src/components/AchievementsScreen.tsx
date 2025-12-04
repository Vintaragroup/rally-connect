import { Trophy, Star, Flame, Target, Users, Calendar, TrendingUp, Lock, Sparkles } from "lucide-react";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { useState } from "react";
import { motion } from "motion/react";
import { EmptyState } from "./EmptyState";

interface AchievementsScreenProps {
  onBack: () => void;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  points: number;
  unlocked: boolean;
  unlockedDate?: string;
  progress?: number;
  maxProgress?: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export function AchievementsScreen({ onBack }: AchievementsScreenProps) {
  const [selectedTab, setSelectedTab] = useState<"unlocked" | "locked">("unlocked");
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  const getRarityColor = (rarity: Achievement["rarity"]) => {
    switch (rarity) {
      case "common": return "text-gray-600 bg-gray-100";
      case "rare": return "text-blue-600 bg-blue-100";
      case "epic": return "text-purple-600 bg-purple-100";
      case "legendary": return "text-amber-600 bg-amber-100";
    }
  };

  const getRarityBorder = (rarity: Achievement["rarity"]) => {
    switch (rarity) {
      case "common": return "border-gray-300";
      case "rare": return "border-blue-300";
      case "epic": return "border-purple-300";
      case "legendary": return "border-amber-300 shadow-lg shadow-amber-200";
    }
  };

  const filteredAchievements = achievements.filter(a => 
    selectedTab === "unlocked" ? a.unlocked : !a.unlocked
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[var(--color-primary)] to-purple-700 text-white p-4 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="text-white/90">
            ← Back
          </button>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-white mb-1">Achievements</h1>
            <p className="text-sm text-white/80">
              Unlock badges and earn points
            </p>
          </div>
          <motion.div 
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Trophy className="w-8 h-8 text-white" />
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="text-2xl font-bold text-white">{totalPoints}</div>
            <div className="text-xs text-white/80">Total Points</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="text-2xl font-bold text-white">
              {unlockedCount}/{totalCount}
            </div>
            <div className="text-xs text-white/80">Unlocked</div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Tabs */}
        <div className="flex gap-2 bg-[var(--color-bg-elevated)] rounded-xl p-1">
          <button
            onClick={() => setSelectedTab("unlocked")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              selectedTab === "unlocked"
                ? "bg-[var(--color-primary)] text-white shadow-sm"
                : "text-[var(--color-text-secondary)]"
            }`}
          >
            Unlocked ({unlockedCount})
          </button>
          <button
            onClick={() => setSelectedTab("locked")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              selectedTab === "locked"
                ? "bg-[var(--color-primary)] text-white shadow-sm"
                : "text-[var(--color-text-secondary)]"
            }`}
          >
            Locked ({totalCount - unlockedCount})
          </button>
        </div>

        {/* Achievements Grid */}
        <div className="space-y-3">
          {filteredAchievements.length === 0 ? (
            <EmptyState
              icon={selectedTab === "unlocked" ? Star : Lock}
              title={selectedTab === "unlocked" ? "No achievements yet" : "No locked achievements"}
              description={selectedTab === "unlocked" ? "Complete challenges to unlock achievements and earn points." : "You've unlocked all available achievements!"}
            />
          ) : (
            filteredAchievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-[var(--color-bg-elevated)] rounded-2xl p-4 shadow-sm border-2 ${getRarityBorder(achievement.rarity)} ${
                  achievement.unlocked ? "" : "opacity-75"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <motion.div 
                    className={`w-14 h-14 rounded-xl ${achievement.bgColor} flex items-center justify-center flex-shrink-0 relative`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {achievement.unlocked ? (
                      <>
                        <Icon className={`w-7 h-7 ${achievement.color}`} />
                        <motion.div
                          className="absolute -top-1 -right-1"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: "spring" }}
                        >
                          <Sparkles className="w-4 h-4 text-amber-500" />
                        </motion.div>
                      </>
                    ) : (
                      <Lock className="w-7 h-7 text-gray-400" />
                    )}
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-medium">{achievement.title}</h3>
                      <Badge className={`${getRarityColor(achievement.rarity)} text-xs capitalize`}>
                        {achievement.rarity}
                      </Badge>
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                      {achievement.description}
                    </p>

                    {/* Progress Bar for Locked */}
                    {!achievement.unlocked && achievement.progress !== undefined && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[var(--color-text-secondary)]">
                            Progress: {achievement.progress}/{achievement.maxProgress}
                          </span>
                          <span className="text-[var(--color-text-secondary)]">
                            {Math.round((achievement.progress / (achievement.maxProgress || 1)) * 100)}%
                          </span>
                        </div>
                        <Progress 
                          value={(achievement.progress / (achievement.maxProgress || 1)) * 100} 
                          className="h-2"
                        />
                      </div>
                    )}

                    {/* Unlocked Date */}
                    {achievement.unlocked && (
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--color-border)]">
                        <span className="text-xs text-[var(--color-text-tertiary)]">
                          Unlocked {achievement.unlockedDate}
                        </span>
                        <Badge className="bg-amber-100 text-amber-700 text-xs">
                          +{achievement.points} pts
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
            })
          )}
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <Trophy className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium mb-1 text-purple-900">
                Keep Playing to Unlock More!
              </h3>
              <p className="text-sm text-purple-700">
                Complete matches, set availability, and engage with your team to earn achievements and climb the leaderboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
