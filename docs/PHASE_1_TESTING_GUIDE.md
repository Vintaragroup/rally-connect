# Phase 1 Testing Guide - Complete Implementation

**Date:** December 1, 2025  
**Status:** ✅ Backend Complete | ✅ Frontend Complete | 🔄 Ready for Testing

---

## Testing Overview

Phase 1 implementation is complete across backend (Phase 1B & 1C) and frontend (Phase 1D). This guide provides instructions for comprehensive testing of the team joining system.

---

## Testing Checklist

### Part 1: Onboarding Flow Testing

#### 1.1 Test New Player Onboarding with Code Joining
**Scenario:** New player wants to join team using invite code

**Steps:**
1. Sign up as new user (player role)
2. Go through sport selection
3. Select "Player" role
4. Fill in profile (name, phone)
5. On "Join a Team" screen, should see two tabs:
   - "Enter Code" (active by default)
   - "Discover" 
6. In "Enter Code" tab:
   - See input field labeled "Team Invite Code"
   - Helper text: "Ask your team captain for the invite code"
   - Paste/enter valid team code (format: TM_SPORT_XXXX)
   - Click "Join Team" button
7. Verify:
   - ✅ Code is validated on backend
   - ✅ Success shows team name
   - ✅ "Skip for Now" button works (goes to complete)
   - ✅ Error message shows for invalid code
   - ✅ Button disabled while loading

**Valid Test Codes:**
- Ask team captain to generate code via `/teams/:teamId/generate-code` endpoint
- Or use Postman to create test data with valid codes

---

#### 1.2 Test New Player Onboarding with Team Discovery
**Scenario:** New player wants to discover and request to join teams

**Steps:**
1. Go through onboarding (steps 1-4 same as 1.1)
2. On "Join a Team" screen, click "Discover" tab
3. Should see:
   - List of teams with `isLookingForPlayers=true`
   - Team name, sport icon, player count ("X / Y players")
   - "Need Z more" badge in orange
   - "Request to Join" button per team
   - Loading spinner while loading
4. Click "Request to Join" on a team:
   - Modal pops up titled "Request to Join Team"
   - Shows team name in subtitle
   - Optional message textarea
   - Character counter (shows X/500)
   - Loading state on submit button
5. Leave message empty and click "Send Request":
   - Request submits successfully
   - Modal closes
   - Progress continues to completion
6. Verify:
   - ✅ Backend creates TeamJoinRequest with PENDING status
   - ✅ Empty message is accepted
   - ✅ Error message shows for network failure
   - ✅ "Cancel" button closes modal without submitting

---

#### 1.3 Test Captain Onboarding
**Scenario:** Captain creates team and invites players

**Steps:**
1. Sign up as new user (captain role)
2. Go through sport selection and captain role selection
3. Fill in profile
4. On "Create Team" screen:
   - Enter team name (e.g., "Merion Bocce Club")
   - Select sport
   - Enter club/location
   - Click "Create Team"
5. On "Invite Players" screen:
   - Generate code button or skip
6. Complete onboarding
7. Verify:
   - ✅ Team created in backend
   - ✅ Captain is team owner

---

### Part 2: Admin Dashboard Testing

#### 2.1 Test Join Requests Admin Page
**Scenario:** Team captain/admin views and manages join requests

**Steps:**
1. Sign in as team captain/admin
2. Navigate to Admin Dashboard
3. Click "Join Requests" in sidebar:
   - Should show page titled "Join Requests"
   - Subtitle: "Manage team join requests..."
4. See "Select a Team" section:
   - List teams user is captain/admin of
   - Click to select a team
5. After selecting team, see "Join Requests" section:
   - Empty state: "No pending join requests"
   - OR list of pending requests with:
     - Player name
     - Player email
     - Request date
     - Optional message in box
     - Green "Approve" button
     - Outline "Decline" button
6. Click "Approve":
   - Button shows "Approving..." with spinner
   - Request status changes to "APPROVED"
   - Moves to "Previous Requests" section
   - Verify backend added user to team + league
7. For another request, click "Decline":
   - Button shows "Declining..." with spinner
   - Request status changes to "DECLINED"
   - Moves to "Previous Requests" section
   - Verify backend marked as declined
8. See "Previous Requests" section:
   - Shows approved/declined requests
   - Faded styling (opacity-60)
   - Status badge (green for APPROVED, red for DECLINED)

**Test Data Setup:**
```bash
# Create a team with captain user
POST /teams
{
  "name": "Test Team",
  "sport": "bocce",
  "userId": "captain-user-id"
}

# Have another user request to join
POST /teams/:teamId/request-join
{
  "userId": "player-user-id",
  "message": "I'd like to join your team!"
}

# Admin approves
POST /teams/:teamId/approve-join/:requestId

# Admin declines another
POST /teams/:teamId/decline-join/:requestId2
```

---

### Part 3: API Endpoint Testing

Use Postman or curl to test all endpoints:

#### 3.1 Join by Code
```bash
POST /teams/join-by-code
Content-Type: application/json
Authorization: Bearer {token}

{
  "code": "TM_BOCCE_ABC123",
  "userId": "{user-id}"
}

# Success Response (200)
{
  "teamId": "team-uuid",
  "teamName": "Merion Bocce Club",
  "leagueId": "league-uuid",
  "success": true
}

# Error Response (400)
{
  "error": "Invalid or expired code"
}
```

**Test Cases:**
- ✅ Valid code
- ❌ Invalid code format
- ❌ Expired code
- ❌ Non-existent code
- ❌ User already on team

---

#### 3.2 Generate Code
```bash
POST /teams/:teamId/generate-code
Content-Type: application/json
Authorization: Bearer {token}

{
  "createdBy": "{user-id}",
  "expiresAt": "2024-12-31T23:59:59Z"
}

# Success Response (200)
{
  "code": "TM_BOCCE_XXXXXXX",
  "teamId": "team-uuid",
  "expiresAt": "2024-12-31T23:59:59Z",
  "success": true
}
```

---

#### 3.3 Request to Join
```bash
POST /teams/:teamId/request-join
Content-Type: application/json
Authorization: Bearer {token}

{
  "userId": "{user-id}",
  "message": "I'd like to join your team!"
}

# Success Response (200)
{
  "requestId": "request-uuid",
  "teamName": "Merion Bocce Club",
  "status": "PENDING",
  "success": true
}

# Error Response (400)
{
  "error": "User already on this team"
}
```

**Test Cases:**
- ✅ Valid request with message
- ✅ Valid request without message
- ❌ User already on team
- ❌ Duplicate pending request
- ❌ Invalid team

---

#### 3.4 Get Teams Looking for Players
```bash
GET /leagues/:leagueId/teams-looking
Authorization: Bearer {token}

# Success Response (200)
[
  {
    "id": "team-uuid",
    "name": "Merion Bocce Club",
    "sportId": "sport-uuid",
    "sportName": "bocce",
    "currentPlayerCount": 4,
    "minPlayersNeeded": 8,
    "playersNeeded": 4,
    "description": "Friendly bocce league...",
    "logo": "url"
  },
  ...
]
```

**Test Cases:**
- ✅ Valid league with teams looking
- ✅ Valid league with no teams looking
- ❌ Invalid league

---

#### 3.5 Get Pending Requests (Admin)
```bash
GET /teams/:teamId/pending-joins
Authorization: Bearer {token} (must be team captain/admin)

# Success Response (200)
[
  {
    "id": "request-uuid",
    "userId": "user-uuid",
    "userName": "John Smith",
    "userEmail": "john@example.com",
    "message": "I'd like to join!",
    "createdAt": "2024-12-01T10:00:00Z",
    "status": "PENDING"
  },
  ...
]
```

**Test Cases:**
- ✅ Valid team with pending requests
- ✅ Valid team with no pending requests
- ❌ Unauthorized (non-captain)
- ❌ Invalid team

---

#### 3.6 Approve Request
```bash
POST /teams/:teamId/approve-join/:requestId
Authorization: Bearer {token} (must be team captain/admin)

# Success Response (200)
{
  "teamId": "team-uuid",
  "leagueId": "league-uuid",
  "userId": "user-uuid",
  "success": true
}
```

**Test Cases:**
- ✅ Valid request approval
- ❌ Request already processed
- ❌ Unauthorized
- ❌ Invalid team/request

---

#### 3.7 Decline Request
```bash
POST /teams/:teamId/decline-join/:requestId
Authorization: Bearer {token} (must be team captain/admin)

# Success Response (200)
{
  "success": true
}
```

---

### Part 4: Error Handling Testing

#### 4.1 Frontend Error Messages
Test that error messages display correctly:

1. **Invalid Code**
   - User sees: "Invalid or expired code"
   - Input field highlighted in red

2. **Network Error**
   - Shows: "Network error" with retry option
   - User can click back or retry

3. **Already on Team**
   - Shows: "You're already a member of this team"
   - Can skip or go back

4. **Team at Capacity**
   - Shows: "This team is at maximum capacity"
   - Can't join

5. **Server Error**
   - Shows: "Server error. Please try again."
   - Can skip or retry

---

#### 4.2 Backend Error Handling
Verify proper error responses:

- 400 Bad Request: Invalid input
- 404 Not Found: Team/code/request not found
- 409 Conflict: User already on team
- 401 Unauthorized: Invalid token
- 500 Server Error: Database/system error

---

### Part 5: Mobile Responsiveness Testing

Test on various screen sizes:

**iPhone (375px width):**
1. ✅ JoinByCodeForm fits on screen
2. ✅ Code input is easily tappable
3. ✅ TeamDiscovery scrolls properly
4. ✅ Request modal is full-screen appropriate
5. ✅ Admin team selector is stacked

**Tablet (768px width):**
1. ✅ Components layout properly
2. ✅ Not too much wasted space
3. ✅ All buttons are easily clickable

**Desktop (1024px+ width):**
1. ✅ Admin selects multiple teams
2. ✅ Request list is readable
3. ✅ Optimal use of space

---

### Part 6: End-to-End Scenarios

#### Scenario 1: Complete New Player Onboarding (Code)
1. New user signs up
2. Goes through onboarding
3. Enters team code
4. Successfully joins team
5. Sees team in Teams screen
6. ✅ Flow complete

#### Scenario 2: Complete New Player Onboarding (Discovery)
1. New user signs up
2. Goes through onboarding
3. Discovers teams
4. Requests to join team
5. Completes onboarding
6. Later: Team captain approves
7. ✅ User added to team + league

#### Scenario 3: Captain Team Setup
1. New user signs up as captain
2. Creates team
3. Generates codes
4. Shares codes
5. Players use codes to join
6. ✅ Team built with players

#### Scenario 4: Admin Management
1. Captain enters admin dashboard
2. Navigates to Join Requests
3. Selects team
4. Sees pending requests
5. Approves requests
6. Users are added to team
7. ✅ Requests processed

---

## Performance Testing

### Load Testing Checklist

- [ ] TeamDiscovery loads 50+ teams
- [ ] PendingJoinRequests loads 100+ requests
- [ ] No UI freezing during load
- [ ] Pagination not needed (for now)
- [ ] API responds within 2 seconds

---

## Browser Compatibility

Test in:
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## Database Verification

After approving requests, verify in database:

```sql
-- User should be in TeamPlayer
SELECT * FROM TeamPlayer WHERE userId = '{user-id}' AND teamId = '{team-id}';

-- User should have LeagueMember record
SELECT * FROM LeagueMember WHERE userId = '{user-id}' AND leagueId = '{league-id}';

-- Request should be marked APPROVED
SELECT * FROM TeamJoinRequest WHERE id = '{request-id}';
```

---

## Deployment Prerequisites

Before deploying to production:

- [ ] All tests pass
- [ ] Database migration tested on staging
- [ ] Error handling verified
- [ ] Performance acceptable
- [ ] Mobile responsive on real devices
- [ ] Team captains trained on admin interface
- [ ] Backup of production database taken

---

## Known Issues / Not Yet Tested

- [ ] Very large team rosters (100+ players)
- [ ] Concurrent requests from multiple users
- [ ] Deleted teams/leagues in data
- [ ] Special characters in team names
- [ ] Timezone handling for request dates
- [ ] Request expiration (not implemented)
- [ ] Pagination for large lists (not implemented)
- [ ] Rate limiting (not implemented)

---

## Test Data Setup Commands

Create test data for manual testing:

```bash
# Start backend
cd backend
npm run dev

# Create test league (if needed)
POST /leagues
{
  "name": "Test League",
  "sport": "bocce"
}

# Create test team
POST /teams
{
  "name": "Test Team",
  "sport": "bocce",
  "userId": "captain-user-id"
}

# Generate code
POST /teams/{teamId}/generate-code
{
  "createdBy": "captain-user-id"
}

# Create join request
POST /teams/{teamId}/request-join
{
  "userId": "player-user-id",
  "message": "I want to join!"
}
```

---

## Monitoring Checklist

After deployment, monitor:

- [ ] Error logs for failed joins
- [ ] Database for data integrity
- [ ] Admin page load times
- [ ] User feedback in support channels
- [ ] Unusual patterns in request data

---

## Rollback Plan

If issues discovered in production:

1. Revert commit `adbda0e` (integration)
2. Revert commit `25a787f` (frontend components)
3. Revert commit `19b1c71` (Phase 1C backend)
4. Revert database migration with `npx prisma migrate resolve --rolled-back`
5. Notify team and document issues
6. Plan fixes and retest thoroughly

---

## Success Criteria

Phase 1 is complete when:

✅ All endpoints respond correctly  
✅ Error handling works as expected  
✅ Mobile responsive on all sizes  
✅ Admin dashboard fully functional  
✅ Onboarding integrates smoothly  
✅ Database integrity verified  
✅ Performance acceptable  
✅ 0 critical bugs found  

---

**Last Updated:** 2024-12-01  
**Phase Status:** Ready for Testing  
**Next Steps:** Execute testing checklist, fix issues, deploy
