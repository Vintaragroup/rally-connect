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
import { AdminLayout } from "./components/AdminLayout";
import { OfflineBanner } from "./components/OfflineBanner";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";
import { useAuth } from "./contexts/AuthContext";
import { useCurrentUser } from "./hooks/useCurrentUser";

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
  | "admin"
  | "loading"
  | "oauth-callback"
  | "debug";

export default function App() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { user: currentUser, loading: userLoading } = useCurrentUser();
  const [currentScreen, setCurrentScreen] = useState<Screen>("loading");
  const [activeTab, setActiveTab] = useState<"home" | "schedule" | "teams" | "ratings" | "more" | "admin">("home");
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [userRole, setUserRole] = useState<"player" | "captain" | "admin" | null>(null);
  const [isAssociationAdmin, setIsAssociationAdmin] = useState(false);
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

  // Update admin status based on currentUser roles
  useEffect(() => {
    if (currentUser) {
      setIsAssociationAdmin(currentUser.isAdmin);
    }
  }, [currentUser?.isAdmin]);

  // Route based on current URL path and auth state
  useEffect(() => {
    // FIRST: Check special routes (these take precedence over auth state)
    const currentPath = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    const testScreen = searchParams.get('test');
    
    // Allow test mode for team chat
    if (testScreen === 'team-chat') {
      console.log('✓ Accessing team chat in test mode');
      setCurrentScreen("team-chat");
      return;
    }
    // Allow test mode for teams screen
    if (testScreen === 'teams') {
      console.log('✓ Accessing teams screen in test mode');
      setCurrentScreen("teams");
      setActiveTab("teams");
      setUserRole("captain");
      return;
    }
    // Allow test mode for team detail
    if (testScreen === 'team-detail') {
      console.log('✓ Accessing team detail in test mode');
      setCurrentScreen("team-detail");
      setUserRole("captain");
      return;
    }

    // Allow test mode for team detail as admin
    if (testScreen === 'team-detail-admin') {
      console.log('✓ Accessing team detail as admin in test mode');
      setCurrentScreen("team-detail");
      setUserRole("player");
      setIsAssociationAdmin(true);
      return;
    }

    // Allow test mode for match detail
    if (testScreen === 'match-detail') {
      console.log('✓ Accessing match detail in test mode');
      setCurrentScreen("match-detail");
      setUserRole("captain");
      return;
    }
    // Allow test mode for ratings
    if (testScreen === 'ratings') {
      console.log('✓ Accessing ratings in test mode');
      setCurrentScreen("ratings");
      return;
    }

    // Allow test mode for schedule as captain
    if (testScreen === 'schedule-captain') {
      console.log('✓ Accessing schedule as captain in test mode');
      setCurrentScreen("schedule");
      setUserRole("captain");
      return;
    }

    // Allow test mode for schedule as admin
    if (testScreen === 'schedule-admin') {
      console.log('✓ Accessing schedule as admin in test mode');
      setCurrentScreen("schedule");
      setUserRole("admin");
      return;
    }

    // Allow test mode for schedule as player
    if (testScreen === 'schedule-player') {
      console.log('✓ Accessing schedule as player in test mode');
      setCurrentScreen("schedule");
      setUserRole("player");
      return;
    }

    // Allow test mode for home
    if (testScreen === 'home') {
      console.log('✓ Accessing home in test mode');
      setCurrentScreen("home");
      setUserRole("player");
      return;
    }
    
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
    if (isLoading || userLoading) {
      setCurrentScreen("loading");
    } else if (isAuthenticated && user && currentUser) {
      if (currentUser.onboardingCompleted) {
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
  }, [isLoading, userLoading, isAuthenticated, user, currentUser]);

  // Role-based redirect guard: prevent unauthorized access to admin screens
  useEffect(() => {
    if (currentScreen === "admin" && currentUser && !currentUser.isAdmin) {
      console.warn('⚠️ Non-admin user tried to access admin screen, redirecting to home');
      setCurrentScreen("home");
      setActiveTab("home");
    }
  }, [currentScreen, currentUser]);

  return (
    <div className="w-full min-h-screen bg-[var(--color-bg)]">
      <Toaster />
      <OfflineBanner />
      
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
                    console.log('✓ Onboarding marked complete, refetching user data');
                    // Refetch user to get updated onboardingCompleted status
                    // The useCurrentUser hook will update automatically
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
            
            // The routing will be handled by the useEffect watching currentUser
            // Once currentUser updates with onboardingCompleted=true, it will navigate to home
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
          <MatchDetailScreen 
            isCaptain={currentUser?.isCaptain || false}
            onSetLineups={() => {
              toast.info("Set Lineups feature coming soon!");
            }}
            onViewStats={() => {
              toast.info("Match Stats feature coming soon!");
            }}
            onMessageTeam={() => {
              toast.info("Team messaging feature coming soon!");
            }}
            onViewAvailability={() => {
              toast.info("Availability responses feature coming soon!");
            }}
          />
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
            onViewTeamChat={() => {
              setCurrentScreen("team-chat");
            }}
            onViewTeamReport={() => {
              setCurrentScreen("team-season-report");
            }}
            isCaptain={currentUser?.isCaptain || false}
            isAssociationAdmin={isAssociationAdmin}
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
            isCaptain={currentUser?.isCaptain || false}
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
            userRole={userRole}
            isAdmin={currentUser?.isAdmin || false}
            isCaptain={currentUser?.isCaptain || false}
            isPlayer={currentUser?.isPlayer || true}
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
            onOpenChat={() => {
              setCurrentScreen("team-chat");
            }}
            isCaptain={currentUser?.isCaptain || userRole === "captain" || false}
            showChatIcon={true}
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
          <RatingsScreen 
            onViewAllLeaderboard={() => toast.info("Full leaderboard view coming soon!")}
            onViewPlayerProfile={(playerName) => toast.info(`Viewing profile for ${playerName} - feature coming soon!`)}
            onLearnAboutRatings={() => toast.info("Rating system details coming soon!")}
          />
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
            onViewAssociationAdmin={() => {
              setCurrentScreen("admin");
            }}
            isCaptain={currentUser?.isCaptain || false}
            isAssociationAdmin={isAssociationAdmin}
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
            isCaptain={currentUser?.isCaptain || false}
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
            isCaptain={currentUser?.isCaptain || false}
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
            onTeamClick={() => setCurrentScreen("team-season-report")}
          />
        </AppShell>
      )}
      {currentScreen === "team-season-report" && (
        <AppShell
          title="Team Season Report"
          showBack
          onBack={() => {
            setCurrentScreen("team-detail");
          }}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setCurrentScreen(tab);
          }}
        >
          <TeamSeasonReportScreen 
            onBack={() => setCurrentScreen("team-detail")}
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
      {currentScreen === "admin" && (
        <AdminLayout 
          onExit={() => {
            setCurrentScreen("more");
            setActiveTab("more");
          }}
        />
      )}
    </div>
  );
}