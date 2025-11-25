import { ChevronRight, Trophy, Calendar, Users, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

interface WelcomeScreenProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

export function WelcomeScreen({ onSignIn, onSignUp }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 flex flex-col w-full">
      <div className="app-container mx-auto flex flex-col min-h-screen">
        {/* Logo/Brand Section */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="mb-6 sm:mb-8"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl">
              <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-[var(--color-primary)]" />
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3">
              RallyOS
            </h1>
            <p className="text-blue-100 text-base sm:text-lg md:text-xl">
              Your Multi-Sport League Platform
            </p>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-8 sm:mb-12 px-4"
          >
            <div className="bg-white/10 backdrop-blur-sm text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm">
              🎾 Bocce
            </div>
            <div className="bg-white/10 backdrop-blur-sm text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm">
              🏓 Pickleball
            </div>
            <div className="bg-white/10 backdrop-blur-sm text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm">
              🎯 Padel
            </div>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="p-4 sm:p-6 space-y-3 sm:space-y-4"
        >
          <Button
            onClick={onSignUp}
            size="lg"
            className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-gray-900 font-semibold text-base sm:text-lg h-12 sm:h-14"
          >
            Get Started
          </Button>
          <Button
            onClick={onSignIn}
            size="lg"
            variant="outline"
            className="w-full bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm font-medium text-base sm:text-lg h-12 sm:h-14"
          >
            Sign In
          </Button>
          <p className="text-center text-blue-100 text-xs sm:text-sm px-4">
            Join leagues, track stats, and compete with players in your area
          </p>
        </motion.div>
      </div>
    </div>
  );
}