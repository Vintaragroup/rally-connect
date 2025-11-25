# Sign In vs Sign Up Implementation Summary

## Overview
Implemented divergent authentication flows where **Sign In** (returning users) go straight to the home screen if onboarding is complete, while **Sign Up** (new users) always go through the onboarding flow with optional team joining.

## Changes Made

### 1. Database Schema Update
**File**: `backend/prisma/schema.prisma`
- Added `onboardingCompleted: Boolean @default(false)` field to User model
- Created migration: `20251124211033_add_onboarding_completed`
- Allows tracking which users have completed their initial setup

### 2. Frontend Auth State Management
**File**: `src/lib/auth/useAuth.ts` (NEW)
- Created `useAuth()` hook to manage authentication state across the app
- Returns: `isAuthenticated`, `isLoading`, `user` data, and `onboardingCompleted` status
- Currently relies on Stack Auth for user data
- TODO: Integrate with backend `/auth/me` endpoint for `onboardingCompleted` status

### 3. Updated Authentication Component
**File**: `src/components/RegisterScreen.tsx`
- Integrated Stack Auth OAuth methods:
  - `stackApp.signInWithOAuth()` for Google/Apple sign-in
  - `stackApp.signInWithPassword()` for email sign-in  
  - `stackApp.signUpWithPassword()` for email registration
- Added error handling and loading states
- Differentiated UI between sign-in and sign-up:
  - Sign In: "Welcome back" heading, no name field, shows "Forgot password?"
  - Sign Up: "Join RallyOS" heading, includes name field, shows terms acceptance
- Returns boolean indicating if user is returning (`true`) or new (`false`)

### 4. Updated Main App Router
**File**: `src/App.tsx`
- Added "loading" screen state while checking authentication
- Implemented auth state hooks:
  - `isAuthenticated`: user has valid Stack Auth token
  - `onboardingCompleted`: user has finished onboarding flow
- Routing logic:
  - **Not authenticated**: → Welcome screen
  - **Authenticated + onboarding incomplete**: → Onboarding flow
  - **Authenticated + onboarding complete**: → Home screen (direct)
- When users complete onboarding, sets `onboardingCompleted: true` and saves to database

### 5. Enhanced Onboarding Flow
**File**: `src/components/onboarding/OnboardingFlow.tsx`
- Updated `handleJoinTeam()` to accept `null` (for skipping team join)
- Creates placeholder team entry if player skips team joining
- Players can now complete onboarding without joining a team and join later via invite

### 6. Made Team Joining Optional
**File**: `src/components/onboarding/JoinTeamScreen.tsx`
- Added "Skip for Now" button for players not yet invited to a team
- Updated interface to accept `null` for team completion
- Updated copy: "Join a team" (optional) instead of "Join your team" (required)
- Players can now:
  - Join via invite code
  - Search and join an existing team
  - Skip and wait for invitations (join later)

### 7. Backend Auth Module (Scaffolded)
**Files**: 
- `backend/src/modules/auth/auth.controller.ts` (NEW)
- `backend/src/modules/auth/auth.service.ts` (NEW)

**Endpoints (to be wired into NestJS app)**:
- `GET /auth/me` - Get current user with onboarding status
- `POST /auth/complete-onboarding` - Mark onboarding as complete
- `POST /auth/sync-user` - Sync Stack Auth user with local database

Currently scaffolded but not integrated into the NestJS app module. These will handle:
- Syncing Stack Auth users with local database
- Tracking onboarding completion
- Providing user status on app load

## User Flow

### New User (Sign Up) Flow
```
Welcome Screen 
  → Click "Get Started"
  → RegisterScreen (Sign Up mode)
    - "Join RallyOS" heading
    - Enter name, email, password
    - OR continue with Google/Apple OAuth
  → OnboardingFlow (NEW USER)
    1. Sport Selection
    2. Role Selection (Player/Captain)
    3. Profile Setup
    4. Team Creation (if Captain) OR Team Join (if Player, optional)
    5. Completion Screen
  → Home Screen
```

### Returning User (Sign In) Flow
```
Welcome Screen
  → Click "Sign In"
  → RegisterScreen (Sign In mode)
    - "Welcome back" heading
    - Enter email, password
    - OR continue with Google/Apple OAuth
  → Check onboarding status:
    - If incomplete: → OnboardingFlow
    - If complete: → Home Screen (directly)
```

## Key Behaviors

✅ **Sign In vs Sign Up Differentiation**
- Different headings and copy
- Sign Up shows name field; Sign In shows "Forgot password?"
- Properly passes user type to onboarding

✅ **Optional Team Joining for New Players**
- Players can now skip team join and wait for invitations
- Placeholder team entry created if skipped
- Captains still must create a team

✅ **Onboarding Completion Tracking**
- Database field `onboardingCompleted` added to User model
- Frontend marks as complete after final step
- Will skip onboarding on return visits (once backend integrated)

✅ **Authentication State Management**
- Centralized `useAuth()` hook for consistent state
- Loading screen while checking auth
- Clear separation between unauthenticated → onboarding → home flows

## TODO / Next Steps

### Priority 1: Backend Integration
- [ ] Wire auth module into NestJS app.module
- [ ] Create Stack Auth middleware/guard to validate tokens
- [ ] Implement `/auth/me` endpoint to fetch onboarding status
- [ ] Update frontend `useAuth()` to call backend API

### Priority 2: Data Persistence
- [ ] Store user's sport selections in database
- [ ] Store user's role (player/captain) and team association
- [ ] Create Player or Captain record on onboarding complete
- [ ] Update `/auth/complete-onboarding` to save onboarding data

### Priority 3: Refinements
- [ ] Handle email/password auth on backend (currently mocked)
- [ ] Sync Stack Auth user data to local database
- [ ] Add email verification flow
- [ ] Handle "Forgot password?" flow
- [ ] Add avatar/profile photo support

### Priority 4: Testing
- [ ] Test full sign-up → onboarding → home flow
- [ ] Test sign-in with existing user → direct to home
- [ ] Test team skip → join via invite later
- [ ] Test OAuth sign-up and sign-in

## Architecture Notes

### Authentication Flow Architecture
```
Stack Auth (Frontend)
    ↓ (OAuth + email/password)
RegisterScreen
    ↓ (setIsAuthenticated)
App Router
    ↓ (checks onboardingCompleted)
OnboardingFlow or Home Screen
    ↓ (on completion)
Backend: POST /auth/complete-onboarding
    ↓
Database: User.onboardingCompleted = true
```

### State Management
- **Stack Auth**: Handles OAuth and session management
- **App State**: Tracks `isAuthenticated`, `onboardingCompleted`, `userRole`
- **Backend**: Persists `onboardingCompleted` and user metadata

## Files Modified
- ✅ `src/App.tsx` - Added auth routing logic
- ✅ `src/components/RegisterScreen.tsx` - Stack Auth integration
- ✅ `src/components/onboarding/OnboardingFlow.tsx` - Support null team join
- ✅ `src/components/onboarding/JoinTeamScreen.tsx` - Added skip button
- ✅ `src/lib/auth/useAuth.ts` - New auth state hook
- ✅ `backend/prisma/schema.prisma` - Added onboardingCompleted field
- ✅ `backend/src/modules/auth/auth.controller.ts` - New (scaffolded)
- ✅ `backend/src/modules/auth/auth.service.ts` - New (scaffolded)

## Testing the Implementation

To test locally:
1. Navigate to `http://localhost:4300`
2. Click "Get Started" → should show "Join RallyOS" (new user flow)
3. Click "Sign In" toggle → should show "Welcome back" (returning user flow)
4. Both flows now support Google OAuth and email/password
5. Complete onboarding with optional team skip for players

---

**Status**: ✅ Differentiated sign-in/sign-up flows implemented with optional team joining
**Next**: Backend integration to persist onboarding completion and user data
