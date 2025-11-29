import { useState, useEffect } from "react";
import { SportSelectionScreen } from "./SportSelectionScreen";
import { RoleSelectionScreen } from "./RoleSelectionScreen";
import { ProfileSetupScreen } from "./ProfileSetupScreen";
import { CreateTeamScreen } from "./CreateTeamScreen";
import { InvitePlayersScreen } from "./InvitePlayersScreen";
import { JoinTeamScreen } from "./JoinTeamScreen";
import { OnboardingCompleteScreen } from "./OnboardingCompleteScreen";
import { useAuth } from "@/contexts/AuthContext";
import { completeOnboarding, syncUserProfile } from "@/lib/api/authApi";

interface OnboardingFlowProps {
  onComplete: (role: "player" | "captain") => void;
  isReturningUser?: boolean;
}

type OnboardingStep = 
  | "sport-selection"
  | "role-selection"
  | "profile-setup"
  | "create-team"
  | "invite-players"
  | "join-team"
  | "complete";

interface OnboardingData {
  sports: string[];
  role?: "player" | "captain";
  profile?: {
    name: string;
    phone: string;
  };
  team?: {
    id?: string;
    name: string;
    sport?: string;
    club?: string;
  };
}

export function OnboardingFlow({ onComplete, isReturningUser = false }: OnboardingFlowProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("sport-selection");
  const [data, setData] = useState<OnboardingData>({
    sports: [],
  });

  // Pre-fill profile data from authenticated Supabase user
  useEffect(() => {
    if (user && user.user_metadata?.full_name) {
      setData((prev) => ({
        ...prev,
        profile: {
          name: user.user_metadata.full_name || "",
          phone: "",
        },
      }));
    }
  }, [user]);

  const handleSportSelection = (sports: string[]) => {
    setData({ ...data, sports });
    setCurrentStep("role-selection");
  };

  const handleRoleSelection = (role: "player" | "captain") => {
    setData({ ...data, role });
    
    // For returning users, skip profile and team setup - go straight to complete
    if (isReturningUser) {
      // Mock team name for returning users
      setData({ 
        ...data, 
        role,
        team: { name: role === "captain" ? "Merion Bocce Club" : "Your Team" }
      });
      setCurrentStep("complete");
    } else {
      setCurrentStep("profile-setup");
    }
  };

  const handleProfileSetup = (profile: { name: string; phone: string }) => {
    setData({ ...data, profile });
    if (data.role === "captain") {
      setCurrentStep("create-team");
    } else {
      // For new players: show optional team join, they can skip and join later via invite
      setCurrentStep("join-team");
    }
  };

  const handleCreateTeam = (team: { name: string; sport: string; club: string }) => {
    setData({ ...data, team });
    setCurrentStep("invite-players");
  };

  const handleInvitePlayers = () => {
    setCurrentStep("complete");
  };

  const handleJoinTeam = (team: { id: string; name: string } | null) => {
    // Team can be null if player skips joining
    if (team) {
      setData({ ...data, team });
    } else {
      // Player chose to skip - create a placeholder
      setData({ ...data, team: { name: "No Team (Pending Invite)", id: "" } });
    }
    setCurrentStep("complete");
  };

  const handleComplete = async () => {
    console.log("✅ Onboarding complete with data:", data);
    
    // Call backend to mark onboarding as complete and sync profile
    if (user?.id) {
      try {
        // Sync user profile with backend
        if (data.profile) {
          await syncUserProfile({
            full_name: data.profile.name,
            phone: data.profile.phone,
            sports: data.sports,
            role: data.role || "player",
          });
        }

        // Mark onboarding as complete
        await completeOnboarding({
          sports: data.sports,
          role: data.role || "player",
          teamId: data.team?.id,
          teamName: data.team?.name,
        });
        
        console.log("✓ Onboarding marked complete on backend");
      } catch (err) {
        console.error("Error completing onboarding on backend:", err);
        // Still proceed even if backend fails (fallback gracefully)
      }
    }
    
    onComplete(data.role!);
  };

  const goBack = () => {
    switch (currentStep) {
      case "role-selection":
        setCurrentStep("sport-selection");
        break;
      case "profile-setup":
        setCurrentStep("role-selection");
        break;
      case "create-team":
        setCurrentStep("profile-setup");
        break;
      case "invite-players":
        setCurrentStep("create-team");
        break;
      case "join-team":
        setCurrentStep("profile-setup");
        break;
    }
  };

  if (currentStep === "sport-selection") {
    return <SportSelectionScreen onNext={handleSportSelection} />;
  }

  if (currentStep === "role-selection") {
    return (
      <RoleSelectionScreen
        onNext={handleRoleSelection}
        onBack={goBack}
        isReturningUser={isReturningUser}
      />
    );
  }

  if (currentStep === "profile-setup" && data.role) {
    return (
      <ProfileSetupScreen
        role={data.role}
        onNext={handleProfileSetup}
        onBack={goBack}
      />
    );
  }

  if (currentStep === "create-team") {
    return (
      <CreateTeamScreen
        selectedSports={data.sports}
        onNext={handleCreateTeam}
        onBack={goBack}
      />
    );
  }

  if (currentStep === "invite-players" && data.team) {
    return (
      <InvitePlayersScreen
        teamName={data.team.name}
        onComplete={handleInvitePlayers}
        onSkip={handleInvitePlayers}
      />
    );
  }

  if (currentStep === "join-team") {
    return (
      <JoinTeamScreen
        onComplete={handleJoinTeam}
        onBack={goBack}
      />
    );
  }

  if (currentStep === "complete" && data.role && data.team) {
    return (
      <OnboardingCompleteScreen
        role={data.role}
        teamName={data.team.name}
        onComplete={handleComplete}
        isReturningUser={isReturningUser}
      />
    );
  }

  return null;
}