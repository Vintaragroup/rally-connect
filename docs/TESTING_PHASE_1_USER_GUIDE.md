# Phase 1 Testing - User Guide

## Current Issue

When a player completes onboarding but skips joining a team (or hasn't been invited), they land on the home dashboard with **no visible way to join a team**. They should see clear options to:

1. **Join a team using an invitation code**
2. **Discover teams that are looking for players**

These joining options currently exist in the onboarding flow, but not on the main dashboard.

---

## Testing Scenario 1: New Player Without Team

### Setup
1. Create a new account (sign up as new player)
2. Go through onboarding:
   - Select sport(s)
   - Select role: **Player**
   - Set up profile
   - **Skip** joining a team (or just click continue)
   - Complete onboarding

### Expected Behavior
**Currently Missing:**
- The home dashboard should show prominent buttons/sections to:
  - ✅ Join a team with code
  - ✅ Discover teams needing players
  - ✅ See any pending join requests

**Currently Showing:**
- ❌ Empty state: "Join a team to see your schedule"
- ❌ No action buttons to actually join a team

### What Needs to Be Added

The `HomeScreen.tsx` needs to be updated to show joining options when `userTeams.length === 0`. This should be a prominent section that says:

```
"No Teams Yet?"
Get started by:
- Entering a team code (if you have one)
- Discovering teams looking for players

[Join by Code] [Discover Teams]
```

---

## Testing Scenario 2: Team Code Joining

### Setup
1. Have a team captain (skip this if testing flow)
2. Captain generates a team code in admin dashboard
3. Player receives the code

### Test: Player joins with code
1. New player goes to home dashboard
2. Clicks "Join by Code" button
3. Enters the code
4. Should see success: "You've joined [Team Name]!"
5. Dashboard updates to show:
   - Upcoming matches for that team
   - Team snapshot
   - Division standings
   - Stats

### Expected Results
- ✅ Code input validates uppercase
- ✅ Success message shows team name
- ✅ Player appears in team roster
- ✅ Dashboard refreshes automatically

---

## Testing Scenario 3: Team Discovery Joining

### Setup
1. Have a team marked with `isLookingForPlayers: true`
2. Team has `minPlayersNeeded` > 0

### Test: Player discovers and requests to join
1. Player goes to home dashboard
2. Clicks "Discover Teams" button
3. Sees list of teams with:
   - Team name
   - Current players
   - "Need X more players" badge
4. Player clicks "Request to Join"
5. Optional: Adds a message
6. Clicks "Send Request"
7. Sees "Request sent!" notification

### Expected Results
- ✅ Teams list shows only teams looking for players
- ✅ Player count and need badge display correctly
- ✅ Join request is created (status: PENDING)
- ✅ Request shows in captain's "Join Requests" admin page

---

## Testing Scenario 4: Captain Managing Requests

### Setup
1. Player has sent join requests (from Scenario 3)
2. You're logged in as captain of that team

### Test: Approve/Decline flow
1. Go to Admin → Join Requests
2. Select your team from dropdown
3. See pending requests with player info
4. **Approve**: Click green "Approve" button
   - Player should appear in team roster
   - Status changes to "APPROVED" in history
   - Player gets notification (ideally)
5. **Decline**: Click "Decline" button
   - Request moves to history
   - Status shows "DECLINED"

### Expected Results
- ✅ Pending requests list shows correctly
- ✅ Approve adds player to team + league
- ✅ Decline removes request without adding player
- ✅ Processed requests show in history with status

---

## Testing Scenario 5: Club Settings Integration

### What Should Happen
Different clubs/leagues can have different joining rules:
- Some require captain approval (request-based)
- Some allow open joining with codes only
- Some allow both

### Current Implementation
- All clubs currently support both:
  1. Code-based joining (instant)
  2. Request-based joining (captain approval)

### What Needs to Be Added
When a player is on the home dashboard, the joining options should reflect club settings:

```
Example A (Code only club):
"Join With Team Code"
[Input field for code]

Example B (Open discovery club):
"Discover Teams"
[Browse teams looking for players]

Example C (Both enabled):
"Find a Team"
[Tab 1: Enter Code] [Tab 2: Discover Teams]
```

This uses the `Team.isLookingForPlayers` and `Team.minPlayersNeeded` fields.

---

## Implementation Checklist

### What Exists (Already Built)
- ✅ JoinByCodeForm component
- ✅ TeamDiscovery component
- ✅ JoinTeamScreen (combines both)
- ✅ API endpoints for joining
- ✅ Database tables (TeamJoinRequest, LeagueMember)
- ✅ Admin dashboard for managing requests

### What Needs to Be Built
- ❌ Add "Find a Team" section to HomeScreen when `userTeams.length === 0`
- ❌ Integrate JoinTeamScreen or its components into HomeScreen
- ❌ Add real-time updates when joins are approved
- ❌ Add notifications for join request status changes

### Files to Modify
1. **src/components/HomeScreen.tsx**
   - Add section for team joining when no teams
   - Import and render JoinTeamScreen (or integrate its logic)
   - Refresh team list after successful join

2. **src/components/onboarding/OnboardingFlow.tsx**
   - Already good, may need minor tweaks

3. **src/components/AppShell.tsx** (optional)
   - Consider adding "Join Team" quick action in navigation

---

## Testing Endpoints (Manual API Testing)

### 1. Test Code-Based Joining
```bash
curl -X POST http://localhost:4800/teams/join-by-code \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"code": "TM_BOCCE_ABC123XYZ"}'

# Expected Response:
{
  "status": "success",
  "message": "Successfully joined team",
  "data": {
    "teamId": "uuid",
    "teamName": "Team Name",
    "leagueId": "uuid"
  }
}
```

### 2. Test Team Discovery
```bash
curl -X GET "http://localhost:4800/leagues/LEAGUE_ID/teams-looking" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Expected Response:
{
  "status": "success",
  "data": [
    {
      "id": "team_uuid",
      "name": "Team Name",
      "sport": "bocce",
      "isLookingForPlayers": true,
      "minPlayersNeeded": 3,
      "currentPlayerCount": 5,
      "division": { "name": "Division A" }
    }
  ]
}
```

### 3. Test Join Request Submission
```bash
curl -X POST http://localhost:4800/teams/TEAM_ID/request-join \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "message": "I would love to join your team!"
  }'

# Expected Response:
{
  "status": "success",
  "data": {
    "requestId": "uuid",
    "status": "PENDING",
    "createdAt": "2025-12-01T..."
  }
}
```

### 4. Test Captain Approve Request
```bash
curl -X POST http://localhost:4800/teams/TEAM_ID/approve-join/REQUEST_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Expected Response:
{
  "status": "success",
  "message": "Join request approved",
  "data": {
    "userId": "uuid",
    "teamId": "uuid",
    "status": "APPROVED"
  }
}
```

---

## Mobile Testing Checklist

- [ ] Responsive on iPhone SE (375px width)
- [ ] Responsive on iPad (768px width)
- [ ] Responsive on iPad Pro (1024px width)
- [ ] Touch targets are 44x44px minimum
- [ ] Forms are easy to fill on mobile
- [ ] No horizontal scrolling
- [ ] Bottom navigation doesn't cover content

---

## Dark Mode Testing

- [ ] Join Team buttons visible in dark mode
- [ ] Input fields readable
- [ ] Error messages visible
- [ ] Loading spinners visible
- [ ] Icons render correctly

---

## Error Handling Tests

### Invalid Code
- Enter: "INVALID123"
- Expected: Error message "Team code not found"

### Already Joined
- Try to join a team you're already in
- Expected: "You're already part of this team"

### Team Full
- Join request to team with `minPlayersNeeded: 0`
- Expected: "This team is not accepting new members"

### Expired Code (if implemented)
- Use old code
- Expected: "This code has expired"

### Network Error
- Turn off internet, try to join
- Expected: Offline message, queue for sync

---

## Success Criteria

✅ **Phase 1D is complete when:**

1. Player sees joining options on home dashboard when no teams
2. Player can join via code on dashboard
3. Player can discover teams on dashboard
4. Captain can approve/decline requests from admin
5. All endpoints return expected responses
6. Mobile responsive throughout
7. Error handling works for all failure cases
8. No TypeScript errors
9. Testing guide followed top-to-bottom

---

## Debugging Tips

### Check if user has teams
Open browser console:
```javascript
// From HomeScreen or any component with data
console.log('userTeams:', userTeams);
console.log('Has teams:', userTeams.length > 0);
```

### Check API response
In browser DevTools → Network:
- Look for request to `/teams` or `/api/teams`
- Check status (should be 200)
- Check response body
- Verify token is sent

### Check database
```bash
# SSH to server or local database
psql

# List user's teams
SELECT * FROM "User_Teams" WHERE "userId" = 'your_user_id';

# List join requests for a team
SELECT * FROM "TeamJoinRequest" WHERE "teamId" = 'team_uuid';
```

### Check backend logs
```bash
# SSH to server
ssh root@138.197.31.8

# Check logs
docker logs rally_backend -f

# Look for errors around join endpoints
```

---

## Next Steps After Testing

1. **If all tests pass:**
   - Merge Phase 1D code
   - Deploy to staging
   - Do full E2E testing
   - Deploy to production

2. **If tests fail:**
   - Document failures
   - Debug using tips above
   - Fix issues
   - Re-test

3. **Missing features to add later:**
   - User notifications on approval
   - Request expiration
   - Pagination for large lists
   - Club-specific settings
   - Rate limiting

---

## Support Resources

- **Phase 1 API Docs:** `docs/PHASE_1_TESTING_GUIDE.md`
- **Component Reference:** `docs/PHASE_1D_FRONTEND_IMPLEMENTATION.md`
- **Backend Status:** `docs/PHASE_1_COMPLETION_STATUS.md`
- **Database Schema:** `backend/prisma/schema.prisma`

---

**Last Updated:** December 1, 2025  
**Ready to Test:** Yes  
**Estimated Time:** 2-3 hours for full testing
