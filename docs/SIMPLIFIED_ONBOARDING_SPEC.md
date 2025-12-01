# Simplified Onboarding & Role Management Specification

**Status**: Final Requirements Approved  
**Date**: December 1, 2025  
**Version**: 1.0

---

## 1. SIGN-UP FLOW (Simplified)

### Step 1: Authentication
- **OAuth** (Google, Apple) OR **Email + Password**
- System automatically captures: `full_name`, `email`
- ✅ NO manual name entry required
- User lands on: Code Entry Screen

### Step 2: Invitation Code Entry (Optional)
**Screen**: "Do you have an organization code?"
- User can enter organization code (e.g., "BOCCE2025ABC")
- Code validation happens immediately
- **If valid code**: 
  - Auto-joins organization
  - Auto-selects sport (based on code)
  - Proceed to Step 3b (Sport Confirmation)
- **If invalid/no code**: 
  - Proceed to Step 3a (Organization Selection)

### Step 3a: Organization Selection (No Code Path)
- Display list of all organizations
- User selects their organization
- Proceed to Step 4 (Sport Selection)

### Step 3b: Sport Confirmation (Valid Code Path)
- Display: "Organization: [Org Name]"
- Display: "Sport: [Sport Name]"
- Confirm selection
- Proceed to Step 5 (Dashboard)

### Step 4: Sport Selection (Manual Org Path)
- Display all sports offered by selected organization
- User selects 1+ sports of interest
- Proceed to Step 5 (Dashboard)

### Step 5: Dashboard (Success)
- User lands in dashboard as **MEMBER** role
- View upcoming matches, team rosters, seasons
- Cannot create teams or modify team settings
- Can see available teams and request invites

---

## 2. ROLE HIERARCHY & PERMISSIONS

### User Roles (In Priority Order)

#### **MEMBER** (Default for all new signups)
**Permissions**:
- ✅ View organization events/matches
- ✅ View team rosters
- ✅ View available teams to join
- ✅ See upcoming seasons
- ✅ Send practice requests to team members
- ✅ Accept invites from captains to join teams
- ✅ Accept captain role if offered by admin
- ❌ Cannot create teams
- ❌ Cannot modify team settings
- ❌ Cannot manage roster
- ❌ Cannot invite other members

#### **CAPTAIN** (Assigned by Admin)
**How to Get**:
1. Admin identifies skilled member
2. Admin sends: "Request to be Captain of [Team Name]"
3. Member receives notification
4. Member can: **Accept** or **Decline**
5. If accepted: Becomes team captain

**Permissions**:
- ✅ Manage team roster (add/remove members)
- ✅ Assign 1-2 co-captains from team members
- ✅ Approve/reject member invite requests
- ✅ Schedule matches
- ✅ Manage team members
- ✅ View team analytics
- ✅ Respond to season renewal prompts
- ❌ Cannot change team name
- ❌ Cannot remove themselves as captain
- ❌ Cannot create new co-captains if 2 already assigned

#### **CO-CAPTAIN** (Assigned by Captain)
**How to Get**:
1. Captain selects 1-2 team members as co-captains
2. Co-captain receives notification
3. Co-captain can accept or decline

**Permissions**:
- ✅ Do EVERYTHING captain does EXCEPT:
- ❌ Cannot change team name
- ❌ Cannot remove the captain
- ❌ Cannot manage co-captains (can't assign/remove)

#### **ADMIN** (Organization/Club level)
**Permissions**:
- ✅ Manage club settings
- ✅ Generate invitation codes
- ✅ Send captain requests to members
- ✅ View all teams and members
- ✅ Manage seasons
- ✅ Create new sports
- ✅ Approve new organizations (if applicable)

---

## 3. INVITATION CODE SYSTEM

### Code Generation (Admin Only)
**Input Fields**:
- Organization: (auto-selected for org admin)
- Sport: (dropdown of org's sports)
- Single-use: Yes/No toggle
- Expiration: Optional date

**Code Format**: Random 12-character string (e.g., "BOCCE2025ABC")

### Code Validation Rules
- **Scope**: One code per Organization + Sport combination
- **Type**: Single-use (once redeemed, code is consumed)
- **Expiration**: Optional (admin can set or leave open)
- **Multiple Uses**: Multiple people can use same code until it's consumed
- **Redemption**: Code auto-enrolls user in organization + sport

### Code Database Model
```typescript
InvitationCode {
  id: String (UUID)
  code: String (unique)
  organizationId: String
  sportId: String
  createdBy: String (admin userId)
  createdAt: DateTime
  expiresAt: DateTime (optional)
  isUsed: Boolean
  usedBy: String[] (array of userId who used it)
  usageLimit: Int (e.g., unlimited or 1)
}
```

---

## 4. CAPTAIN REQUEST WORKFLOW

### Admin Flow
1. Admin navigates to: Teams → [Team Name] → "Manage Captain"
2. Admin sees: "Team needs a captain" or "Current captain: [Name]"
3. Admin clicks: "Request captain assignment"
4. Admin selects player from team roster
5. System sends notification to player

### Player Flow
1. Player receives notification: "Invited to be Captain of [Team Name]"
2. Options: **Accept** or **Decline**
3. **If Accept**: 
   - Role changes to CAPTAIN
   - Gains captain permissions
   - Dashboard updates to show captain controls
4. **If Decline**: 
   - Admin notified of decline
   - Admin can request another player
   - Relationship remains MEMBER

---

## 5. MEMBER INVITE & PRACTICE REQUEST SYSTEM

### Practice Request (Member to Member)
**Initiated by**: Any member
**To**: Specific team members or open to all
**Message**: "Hey, want to practice bocce this Saturday?"
**Options**:
- Approve (captain/co-captain required if in team)
- Decline
- Suggest alternative time

### Team Member Invite Request
**Initiated by**: Member (wants to join specific team)
**To**: Team captain or co-captain
**Message**: "Can I join your bocce team?"
**Options**:
- Approve by captain (member joins team)
- Decline (member notified)
- Request more info (member can provide)

### Member Invite by Captain
**Initiated by**: Captain or co-captain
**To**: Selected member
**Message**: Formal invite to join team
**Options**:
- Accept (member joins team)
- Decline

---

## 6. CO-CAPTAIN SYSTEM

### Assignment (Captain Only)
1. Captain navigates to: Team → Members
2. Selects player (currently on roster)
3. Clicks: "Make Co-Captain"
4. System notifies selected player
5. Player can accept or decline
6. If accepted: Gains co-captain permissions

### Limits
- **Maximum**: 2 co-captains per team
- **Removal**: Only captain can remove co-captains
- **Capability**: Cannot assign co-captains (that's captain-only)

### Permissions
Co-captains can do everything captains do EXCEPT:
- ❌ Change team name
- ❌ Remove the captain
- ❌ Assign/remove other co-captains

---

## 7. SEASON RENEWAL WORKFLOW

### Trigger
- Season end date reached
- Teams are staying same for next season

### Admin Action (Pre-Season)
1. Admin marks season as "ended"
2. System triggers captain renewal prompts

### Captain Flow
1. Captain receives notification: "Season [Year] is ending. Will you stay captain for [Team] next season?"
2. Options: **Accept** or **Decline**
3. **If Accept**: 
   - Captain remains for new season
   - Team roster carries over
   - Dashboard refreshes for new season
4. **If Decline**: 
   - Admin notified
   - Admin can request another player to be captain
   - Team marked as "needs captain"

### Admin Reassignment
- If captain declines, admin sends captain request to new player
- Process repeats

---

## 8. MEMBER DASHBOARD (Post-Signup)

### What Members See
- **My Teams**: Teams they're members of
- **Available Teams**: Other teams in organization they can request to join
- **Upcoming Matches**: For their sports/teams
- **Seasons**: Current season + future seasons
- **Practice Requests**: Pending requests
- **Notifications**: Captain requests, invite approvals, etc.

### What Members CANNOT Do
- Create teams
- Modify team settings
- Invite others (unless explicitly changed in future)
- Assign roles
- Remove members

---

## 9. DATABASE CHANGES REQUIRED

### New Models
```typescript
// Invitation codes for joining organizations
InvitationCode {
  id: String (UUID)
  code: String (unique, indexed)
  organizationId: String (FK)
  sportId: String (FK)
  createdBy: String (userId, FK)
  createdAt: DateTime
  expiresAt: DateTime?
  isUsed: Boolean
  usedBy: String[] (array of userId)
}

// Captain role requests from admin
CaptainRequest {
  id: String (UUID)
  teamId: String (FK)
  playerId: String (userId, FK)
  requestedBy: String (adminId, FK)
  status: 'pending' | 'accepted' | 'declined'
  createdAt: DateTime
  respondedAt: DateTime?
  response: String? (reason for decline)
}

// Practice requests between members
PracticeRequest {
  id: String (UUID)
  initiatorId: String (userId, FK)
  recipientId: String (userId, FK)
  message: String
  suggestedTime: DateTime
  status: 'pending' | 'approved' | 'declined'
  createdAt: DateTime
  respondedAt: DateTime?
}

// Member invite requests to join team
TeamInviteRequest {
  id: String (UUID)
  playerId: String (userId, FK)
  teamId: String (FK)
  requestedBy: String (userId - captain, FK)
  message: String?
  status: 'pending' | 'accepted' | 'declined'
  createdAt: DateTime
  respondedAt: DateTime?
}

// Co-captain relationships
CoCaptan {
  id: String (UUID)
  teamId: String (FK)
  playerId: String (userId, FK)
  assignedBy: String (captainId, FK)
  status: 'pending' | 'accepted' | 'declined'
  createdAt: DateTime
  respondedAt: DateTime?
}
```

### Modifications to Existing Models
```typescript
User {
  // ... existing fields
  role: 'member' | 'captain' | 'co-captain' | 'admin' (per-team role)
  currentOrganizationId: String (FK) - for quick dashboard access
}

Team {
  // ... existing fields
  captainId: String (userId, FK) - single captain only
  coCaptainIds: String[] (max 2)
  // remove "captains" array if it existed
}

Organization {
  // ... existing fields
  invitationCodes: InvitationCode[] (relationship)
}
```

---

## 10. BACKEND ENDPOINTS NEEDED

### Authentication (Modified)
- `POST /auth/signup` - Unchanged
- `POST /auth/login` - Unchanged
- `POST /auth/code-validation` - NEW: Validate invitation code before org selection

### Invitation Codes (Admin)
- `POST /admin/invitation-codes/generate` - Generate new code
- `GET /admin/invitation-codes` - List codes for organization
- `DELETE /admin/invitation-codes/:codeId` - Revoke code

### Captain Requests
- `POST /admin/captain-requests/:playerId/:teamId` - Send captain request
- `POST /member/captain-requests/:requestId/accept` - Accept captain role
- `POST /member/captain-requests/:requestId/decline` - Decline captain role
- `GET /admin/captain-requests` - View pending requests

### Team Management (Captain/Co-Captain)
- `POST /teams/:teamId/co-captains` - Assign co-captain
- `DELETE /teams/:teamId/co-captains/:playerId` - Remove co-captain
- `POST /teams/:teamId/members/:playerId` - Add member to team
- `DELETE /teams/:teamId/members/:playerId` - Remove member from team

### Practice Requests
- `POST /practice-requests` - Create practice request
- `POST /practice-requests/:requestId/approve` - Approve practice request
- `POST /practice-requests/:requestId/decline` - Decline practice request

### Team Invite Requests
- `POST /team-invites/request` - Member requests to join team
- `POST /team-invites/:requestId/approve` - Captain approves join request
- `POST /team-invites/:requestId/decline` - Captain declines request
- `POST /teams/:teamId/members/:playerId/invite` - Captain invites member

### Season Renewal
- `POST /seasons/mark-ended/:seasonId` - Admin marks season ended
- `GET /member/season-renewal-prompts` - Get pending captain renewals
- `POST /captain-renewal/:captainId/accept` - Accept renewal
- `POST /captain-renewal/:captainId/decline` - Decline renewal

---

## 11. FRONTEND SCREENS NEEDED

### Onboarding Flow
1. ✅ **Code Entry Screen** - "Do you have an org code?"
2. ✅ **Organization Selection** - List all orgs (if no code)
3. ✅ **Sport Selection** - List org's sports
4. ✅ **Dashboard** - Post-signup member view

### Member Dashboard
1. ✅ **My Teams** - Teams member belongs to
2. ✅ **Available Teams** - Teams to request join
3. ✅ **Upcoming Matches** - Filtered by member's teams
4. ✅ **Notifications** - Captain requests, practice requests, etc.
5. ✅ **Practice Requests** - Send/manage practice requests

### Captain/Co-Captain Dashboard
1. ✅ **Team Management** - View roster, manage members
2. ✅ **Assign Co-Captains** - Select 1-2 members
3. ✅ **Pending Invites** - Accept/decline member requests
4. ✅ **Schedule Matches** - Create/manage matches
5. ✅ **Captain Analytics** - Team stats, performance

### Admin Dashboard
1. ✅ **Generate Invitation Codes** - Create new codes
2. ✅ **Manage Captains** - Send captain requests
3. ✅ **View All Teams** - Organization overview
4. ✅ **Member Management** - Approve new members
5. ✅ **Season Management** - Create, edit, end seasons

---

## 12. IMPLEMENTATION PHASES

### Phase 1: Foundation (Week 1-2)
- [ ] Update Prisma schema (InvitationCode, CaptainRequest, etc.)
- [ ] Create database migrations
- [ ] Build invitation code backend endpoints
- [ ] Build captain request backend endpoints

### Phase 2: Frontend Onboarding (Week 2-3)
- [ ] Simplify signup flow (remove manual name entry)
- [ ] Build code entry screen
- [ ] Build organization selection screen
- [ ] Build sport selection screen
- [ ] Update dashboard home screen

### Phase 3: Role Management UI (Week 3-4)
- [ ] Captain request notification UI
- [ ] Accept/decline captain UI
- [ ] Co-captain assignment UI
- [ ] Member dashboard updates

### Phase 4: Advanced Features (Week 4-5)
- [ ] Practice request system
- [ ] Team invite request system
- [ ] Season renewal workflow
- [ ] Admin interfaces

### Phase 5: Testing & Refinement (Week 5-6)
- [ ] End-to-end testing
- [ ] User acceptance testing
- [ ] Bug fixes & refinements
- [ ] Production deployment

---

## 13. MIGRATION PATH (Existing Users)

For users already in the system:
1. Auto-assign MEMBER role if not yet assigned
2. Identify existing captains → Mark as CAPTAIN
3. Run migration script to update roles
4. Send email: "Your dashboard has been updated with new features"
5. No forced re-onboarding required

---

## Summary of Changes

**What's SIMPLER**:
- ✅ Signup: 5 steps → 3-4 steps (removed role selection, removed manual profile setup)
- ✅ Name entry: Twice → Once (auto-grabbed from OAuth/email)
- ✅ No confusing player/captain choice at signup
- ✅ Clearer role assignment process

**What's NEW**:
- ✅ Invitation code system
- ✅ Practice request system
- ✅ Co-captain assignment
- ✅ Season renewal prompts
- ✅ More granular permission control

**What's REMOVED**:
- ❌ Manual team creation by new members
- ❌ Player/captain selection at signup
- ❌ Profile phone entry at signup

---

Ready to proceed with implementation?
