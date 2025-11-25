import { useState, useEffect } from "react";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { RegisterScreen } from "./components/RegisterScreen";
import { OnboardingFlow } from "./components/onboarding/OnboardingFlow";
import { AppShell } from "./components/AppShell";
import { HomeScreen } from "./components/HomeScreen";
import { OAuthCallbackHandler } from "./pages/OAuthCallbackHandler";
import { DebugPage } from "./pages/DebugPage";
import { ScheduleScreen } from "./components/ScheduleScreen";
import { TeamsScreen } from "./components/TeamsScreen";
import { TeamDetailScreen } from "./components/TeamDetailScreen";
import { RatingsScreen } from "./components/RatingsScreen";
import { MoreScreen } from "./components/MoreScreen";
import { MatchDetailScreen } from "./components/MatchDetailScreen";
import { CourtBookingScreen } from "./components/CourtBookingScreen";
import { WaitlistScreen } from "./components/WaitlistScreen";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { NotificationsScreen } from "./components/NotificationsScreen";
import { AvailabilityScreen } from "./components/AvailabilityScreen";
import { StandingsScreen } from "./components/StandingsScreen";
import { AchievementsScreen } from "./components/AchievementsScreen";
import { PersonalStatsScreen } from "./components/PersonalStatsScreen";
import { PlayerDirectoryScreen } from "./components/PlayerDirectoryScreen";
import { PhotoGalleryScreen } from "./components/PhotoGalleryScreen";
import { DuesPaymentScreen } from "./components/DuesPaymentScreen";
import { TeamChatScreen } from "./components/TeamChatScreen";
import { PracticeSchedulerScreen } from "./components/PracticeSchedulerScreen";
import { FeedbackScreen } from "./components/FeedbackScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import { DivisionStandingsScreen } from "./components/DivisionStandingsScreen";
import { TeamSeasonReportScreen } from "./components/TeamSeasonReportScreen";
import { MyStandingsScreen } from "./components/MyStandingsScreen";
import { toast } from "sonner@2.0.3";
import { Toaster } from "./components/ui/sonner";
import { useAuth } from "./contexts/AuthContext";

type Screen = 
  | "welcome" 
  | "sign-in" 
  | "sign-up" 
  | "onboarding" 
  | "home" 
  | "schedule" 
  | "teams" 
  | "team-detail" 
  | "ratings" 
  | "more" 
  | "match-detail"
  | "court-booking"
  | "waitlist"
  | "analytics"
  | "notifications"
  | "availability"
  | "standings"
  | "achievements"
  | "personal-stats"
  | "player-directory"
  | "photo-gallery"
  | "dues-payment"
  | "team-chat"
  | "practice-scheduler"
  | "feedback"
  | "settings"
  | "division-standings"
  | "team-season-report"
  | "my-standings"
  | "loading"
  | "oauth-callback"
  | "debug";

export default function App() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>("loading");
  const [activeTab, setActiveTab] = useState<"home" | "schedule" | "teams" | "ratings" | "more">("home");
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [userRole, setUserRole] = useState<"player" | "captain" | null>(null);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [userSynced, setUserSynced] = useState(false);

  // Sync user to backend on first authentication
  useEffect(() => {
    const syncUserToBackend = async () => {
      if (user?.id && isAuthenticated && !isLoading && !userSynced) {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4800";
          const syncResponse = await fetch(`${apiUrl}/auth/sync-user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              stackUserId: user.id,
              email: user.email,
              displayName: user.user_metadata?.full_name || user.email || 'User',
            }),
          });

          if (syncResponse.ok) {
            console.log('✓ User synced to backend in App');
            setUserSynced(true);
          } else {
            console.warn('⚠️ Failed to sync user in App:', syncResponse.status);
          }
        } catch (error) {
          console.error('⚠️ Error syncing user in App:', error);
        }
      }
    };

    syncUserToBackend();
  }, [user?.id, isAuthenticated, isLoading, userSynced]);

  // Fetch onboarding status from backend AFTER user is synced
  useEffect(() => {
    const fetchOnboardingStatus = async () => {
      // Only fetch after user is synced
      if (user?.id && isAuthenticated && !isLoading && userSynced) {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4800";
          const response = await fetch(`${apiUrl}/auth/me`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id }),
          });

          if (response.ok) {
            const data = await response.json();
            console.log('✓ Fetched onboarding status:', data.onboardingCompleted);
            setOnboardingCompleted(data.onboardingCompleted ?? false);
          } else if (response.status === 404) {
            // User not found in backend - clear session and sign out
            console.warn('⚠️ User not found in backend, clearing session');
            await import('./lib/supabase/client').then(mod => mod.signOutUser());
            setOnboardingCompleted(false);
          } else {
            console.warn('⚠️ Failed to fetch onboarding status:', response.status);
          }
        } catch (error) {
          console.error('⚠️ Error fetching onboarding status:', error);
        }
      }
    };

    fetchOnboardingStatus();
  }, [user?.id, isAuthenticated, isLoading, userSynced]);

  // Route based on current URL path and auth state
  useEffect(() => {
    // FIRST: Check special routes (these take precedence over auth state)
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/auth/callback')) {
      console.log('✓ Detected OAuth callback route');
      setCurrentScreen("oauth-callback");
      return;
    }
    
    if (currentPath.includes('/debug')) {
      console.log('✓ Detected debug route');
      setCurrentScreen("debug");
      return;
    }

    // THEN: Route based on auth state
    if (isLoading) {
      setCurrentScreen("loading");
    } else if (isAuthenticated && user) {
      if (onboardingCompleted) {
        // Returning user who completed onboarding - go to home
        setCurrentScreen("home");
        setIsReturningUser(true);
      } else {
        // Returning user or new user - go to onboarding
        setCurrentScreen("onboarding");
        setIsReturningUser(false); // New/incomplete onboarding flow
      }
    } else {
      // Not authenticated - show welcome screen
      setCurrentScreen("welcome");
    }
  }, [isLoading, isAuthenticated, user, onboardingCompleted]);

  return (
    <div className="w-full min-h-screen bg-[var(--color-bg)]">
      <Toaster />
      
      {/* Loading Screen */}
      {currentScreen === "loading" && (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full border-4 border-[var(--color-bg-elevated)] border-t-[var(--color-primary)] animate-spin mx-auto mb-4" />
            <p className="text-[var(--color-text-secondary)]">Loading...</p>
          </div>
        </div>
      )}
      
      {/* OAuth Callback Handler */}
      {currentScreen === "oauth-callback" && (
        <OAuthCallbackHandler />
      )}
      
      {/* Debug Page */}
      {currentScreen === "debug" && (
        <DebugPage />
      )}
      
      {currentScreen === "welcome" && (
        <WelcomeScreen
          onSignIn={() => setCurrentScreen("sign-in")}
          onSignUp={() => setCurrentScreen("sign-up")}
        />
      )}
      
      {currentScreen === "sign-in" && (
        <RegisterScreen
          isSignIn={true}
          onComplete={() => {
            // Force a re-check of auth state by setting to loading
            // This triggers the useEffect to re-evaluate routing
            setCurrentScreen("loading");
          }}
          onBack={() => setCurrentScreen("welcome")}
        />
      )}
      
      {currentScreen === "sign-up" && (
        <RegisterScreen
          isSignIn={false}
          onComplete={() => {
            // Force a re-check of auth state by setting to loading
            // This triggers the useEffect to re-evaluate routing
            setCurrentScreen("loading");
          }}
          onBack={() => setCurrentScreen("welcome")}
        />
      )}
      
      {currentScreen === "onboarding" && (
        <OnboardingFlow
          isReturningUser={isReturningUser}
          onComplete={(role) => {
            setUserRole(role);
            
            // Mark onboarding as complete on backend
            const saveOnboarding = async () => {
              try {
                if (user?.id) {
                  // Call backend to mark onboarding complete
                  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4800";
                  const response = await fetch(
                    `${apiUrl}/auth/complete-onboarding`,
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ userId: user.id }),
                    }
                  );
                  
                  if (response.ok) {
                    setOnboardingCompleted(true);
                  } else {
                    console.error("Failed to mark onboarding complete");
                  }
                }
              } catch (error) {
                console.error("Failed to save onboarding status:", error);
                toast.error("Failed to save your progress");
              }
            };
            saveOnboarding();
            
            // The routing will be handled by the useEffect watching authState
            // Once onboarding is marked complete, it will navigate to home
          }}
        />
      )}
      {currentScreen === "match-detail" && (
        <AppShell
          title="Match Details"
          showBack
          onBack={() => {
            setCurrentScreen(activeTab === "schedule" ? "schedule" : activeTab === "teams" ? "teams" : "home");
          }}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setCurrentScreen(tab);
          }}
        >
          <MatchDetailScreen isCaptain={userRole === "captain"} />
        </AppShell>
      )}
      {currentScreen === "team-detail" && (
        <AppShell
          title="Team Details"
          showBack
          onBack={() => {
            setCurrentScreen("teams");
            setActiveTab("teams");
          }}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setCurrentScreen(tab);
          }}
        >
          <TeamDetailScreen 
            onViewMatch={() => {
              setCurrentScreen("match-detail");
            }}
            isCaptain={userRole === "captain"}
          />
        </AppShell>
      )}
      {currentScreen === "home" && (
        <AppShell 
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setCurrentScreen(tab);
          }}
        >
          <HomeScreen
            onViewMatch={() => {
              setCurrentScreen("match-detail");
            }}
            onViewAllSchedule={() => {
              setActiveTab("schedule");
              setCurrentScreen("schedule");
            }}
            onViewRatings={() => {
              setActiveTab("ratings");
              setCurrentScreen("ratings");
            }}
            onBookCourt={() => {
              setCurrentScreen("court-booking");
            }}
            onViewWaitlist={() => {
              setCurrentScreen("waitlist");
            }}
            onViewAnalytics={() => {
              setCurrentScreen("analytics");
            }}
            onSetAvailability={() => {
              setCurrentScreen("availability");
            }}
            onViewStandings={() => {
              setCurrentScreen("standings");
            }}
            isCaptain={userRole === "captain"}
          />
        </AppShell>
      )}
      {currentScreen === "schedule" && (
        <AppShell
          title="Schedule"
          showBack
          onBack={() => {
            setCurrentScreen("home");
            setActiveTab("home");
          }}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setCurrentScreen(tab);
          }}
        >
          <ScheduleScreen
            onViewMatch={() => {
              setCurrentScreen("match-detail");
            }}
          />
        </AppShell>
      )}
      {currentScreen === "teams" && (
        <AppShell
          title="Teams"
          showBack
          onBack={() => {
            setCurrentScreen("home");
            setActiveTab("home");
          }}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setCurrentScreen(tab);
          }}
        >
          <TeamsScreen
            onViewTeam={() => {
              setCurrentScreen("team-detail");
            }}
            isCaptain={userRole === "captain"}
          />
        </AppShell>
      )}
      {currentScreen === "ratings" && (
        <AppShell
          title="Ratings"
          showBack
          onBack={() => {
            setCurrentScreen("home");
            setActiveTab("home");
          }}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setCurrentScreen(tab);
          }}
        >
          <RatingsScreen />
        </AppShell>
      )}
      {currentScreen === "more" && (
        <AppShell
          title="More"
          showBack
          onBack={() => {
            setCurrentScreen("home");
            setActiveTab("home");
          }}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setCurrentScreen(tab);
          }}
        >
          <MoreScreen 
            onViewTeam={() => {
              setCurrentScreen("team-detail");
              setActiveTab("teams");
            }}
            onSignOut={async () => {
              // Sign out from Supabase
              await import('./lib/supabase/client').then(mod => mod.signOutUser());
              setUserRole(null);
              setCurrentScreen("welcome");
            }}
            onManageRoster={() => {
              setCurrentScreen("team-detail");
              setActiveTab("teams");
            }}
            onSetLineups={() => {
              setCurrentScreen("match-detail");
            }}
            onViewAnalytics={() => {
              setCurrentScreen("analytics");
            }}
            onViewNotifications={() => {
              setCurrentScreen("notifications");
            }}
            onEditProfile={() => {
              toast.info("Edit Profile feature coming soon!");
            }}
            onViewPreferences={() => {
              setCurrentScreen("settings");
            }}
            onViewAchievements={() => {
              setCurrentScreen("achievements");
            }}
            onViewPersonalStats={() => {
              setCurrentScreen("personal-stats");
            }}
            onViewPlayerDirectory={() => {
              setCurrentScreen("player-directory");
            }}
            onViewPhotoGallery={() => {
              setCurrentScreen("photo-gallery");
            }}
            onViewDuesPayment={() => {
              setCurrentScreen("dues-payment");
            }}
            onViewTeamChat={() => {
              setCurrentScreen("team-chat");
            }}
            onViewPracticeScheduler={() => {
              setCurrentScreen("practice-scheduler");
            }}
            onViewFeedback={() => {
              setCurrentScreen("feedback");
            }}
            onViewSettings={() => {
              setCurrentScreen("settings");
            }}
            onViewMyStandings={() => {
              setCurrentScreen("my-standings");
            }}
            onViewDivisionStandings={() => {
              setCurrentScreen("division-standings");
            }}
            isCaptain={userRole === "captain"}
          />
        </AppShell>
      )}
      {currentScreen === "court-booking" && (
        <AppShell
          title="Court Booking"
          showBack
          onBack={() => {
            setCurrentScreen("home");
            setActiveTab("home");
          }}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setCurrentScreen(tab);
          }}
        >
          <CourtBookingScreen 
            onBack={() => setCurrentScreen("home")}
            onConfirm={() => {
              // Show success message and go back
              toast.success("Court booked successfully!");
              setCurrentScreen("home");
            }}
          />
        </AppShell>
      )}
      {currentScreen === "waitlist" && (
        <AppShell
          title="Waitlist"
          showBack
          onBack={() => {
            setCurrentScreen("home");
            setActiveTab("home");
          }}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setCurrentScreen(tab);
          }}
        >
          <WaitlistScreen 
            onBack={() => setCurrentScreen("home")}
            isCaptain={userRole === "captain"}
          />
        </AppShell>
      )}
      {currentScreen === "analytics" && (
        <AppShell
          title="Analytics"
          showBack
          onBack={() => {
            setCurrentScreen("home");
            setActiveTab("home");
          }}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setCurrentScreen(tab);
          }}
        >
          <AnalyticsDashboard 
            onBack={() => setCurrentScreen("home")}
          />
        </AppShell>
      )}
      {currentScreen === "notifications" && (
        <AppShell
          title="Notifications"
          showBack
          onBack={() => {
            setCurrentScreen("home");
            setActiveTab("home");
          }}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setCurrentScreen(tab);
          }}
        >
          <NotificationsScreen 
            onBack={() => setCurrentScreen("home")}
          />
        </AppShell>
      )}
      {currentScreen === "availability" && (
        <AppShell
          title="Availability"
          showBack
          onBack={() => {
            setCurrentScreen("home");
            setActiveTab("home");
          }}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setCurrentScreen(tab);
          }}
        >
          <AvailabilityScreen 
            onBack={() => setCurrentScreen("home")}
          />
        </AppShell>
      )}
      {currentScreen === "standings" && (
        <AppShell
          title="Standings"
          showBack
          onBack={() => {
            setCurrentScreen("home");
            setActiveTab("home");
          }}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setCurrentScreen(tab);
          }}
        >
          <StandingsScreen 
            onBack={() => setCurrentScreen("home")}
          />
        </AppShell>
      )}
      {currentScreen === "achievements" && (
        <AppShell
          title="Achievements"
          showBack
          onBack={() => {
            setCurrentScreen("home");
            setActiveTab("home");
          }}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setCurrentScreen(tab);
          }}
        >
          <AchievementsScreen 
            onBack={() => setCurrentScreen("home")}
          />
        </AppShell>
      )}
      {currentScreen === "personal-stats" && (
        <AppShell
          title="Personal Stats"
          showBack
          onBack={() => {
            setCurrentScreen("home");
            setActiveTab("home");
          }}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setCurrentScreen(tab);
          }}
        >
          <PersonalStatsScreen 
            onBack={() => setCurrentScreen("home")}
            onViewAchievements={() => setCurrentScreen("achievements")}
          />
        </AppShell>
      )}
      {currentScreen === "player-directory" && (
        <AppShell
          title="Player Directory"
          showBack
          onBack={() => {
            setCurrentScreen("home");
            setActiveTab("home");
          }}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setCurrentScreen(tab);
          }}
        >
          <PlayerDirectoryScreen 
            onBack={() => setCurrentScreen("home")}
          />
        </AppShell>
      )}
      {currentScreen === "photo-gallery" && (
        <AppShell
          title="Photo Gallery"
          showBack
          onBack={() => {
            setCurrentScreen("home");
            setActiveTab("home");
          }}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setCurrentScreen(tab);
          }}
        >
          <PhotoGalleryScreen 
            onBack={() => setCurrentScreen("home")}
          />
        </AppShell>
      )}
      {currentScreen === "dues-payment" && (
        <AppShell
          title="Dues Payment"
          showBack
          onBack={() => {
            setCurrentScreen("home");
            setActiveTab("home");
          }}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setCurrentScreen(tab);
          }}
        >
          <DuesPaymentScreen 
            onBack={() => setCurrentScreen("home")}
          />
        </AppShell>
      )}
      {currentScreen === "team-chat" && (
        <AppShell
          title="Team Chat"
          showBack
          onBack={() => {
            setCurrentScreen("home");
            setActiveTab("home");
          }}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setCurrentScreen(tab);
          }}
        >
          <TeamChatScreen 
            onBack={() => setCurrentScreen("home")}
          />
        </AppShell>
      )}
      {currentScreen === "practice-scheduler" && (
        <AppShell
          title="Practice Scheduler"
          showBack
          onBack={() => {
            setCurrentScreen("home");
            setActiveTab("home");
          }}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setCurrentScreen(tab);
          }}
        >
          <PracticeSchedulerScreen 
            onBack={() => setCurrentScreen("home")}
            isCaptain={userRole === "captain"}
          />
        </AppShell>
      )}
      {currentScreen === "feedback" && (
        <AppShell
          title="Feedback"
          showBack
          onBack={() => {
            setCurrentScreen("home");
            setActiveTab("home");
          }}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setCurrentScreen(tab);
          }}
        >
          <FeedbackScreen 
            onBack={() => setCurrentScreen("home")}
          />
        </AppShell>
      )}
      {currentScreen === "settings" && (
        <AppShell
          title="Settings"
          showBack
          onBack={() => {
            setCurrentScreen("home");
            setActiveTab("home");
          }}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setCurrentScreen(tab);
          }}
        >
          <SettingsScreen 
            onBack={() => setCurrentScreen("home")}
          />
        </AppShell>
      )}
      {currentScreen === "division-standings" && (
        <AppShell
          title="Division Standings"
          showBack
          onBack={() => {
            setCurrentScreen("home");
            setActiveTab("home");
          }}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setCurrentScreen(tab);
          }}
        >
          <DivisionStandingsScreen 
            onBack={() => setCurrentScreen("home")}
            onTeamClick={(teamId) => setCurrentScreen("team-season-report")}
          />
        </AppShell>
      )}
      {currentScreen === "team-season-report" && (
        <AppShell
          title="Team Season Report"
          showBack
          onBack={() => {
            setCurrentScreen("division-standings");
          }}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setCurrentScreen(tab);
          }}
        >
          <TeamSeasonReportScreen 
            onBack={() => setCurrentScreen("division-standings")}
          />
        </AppShell>
      )}
      {currentScreen === "my-standings" && (
        <AppShell
          title="My Standings"
          showBack
          onBack={() => {
            setCurrentScreen("home");
            setActiveTab("home");
          }}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setCurrentScreen(tab);
          }}
        >
          <MyStandingsScreen 
            onViewFullStandings={() => setCurrentScreen("division-standings")}
            onViewTeamReport={() => setCurrentScreen("team-season-report")}
          />
        </AppShell>
      )}
    </div>
  );
}