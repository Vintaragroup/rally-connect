# Phase 1 Testing - Step-by-Step Guide

## What Was Just Fixed

**Issue:** Players who completed onboarding without joining a team saw no options to join teams on the home dashboard.

**Solution:** Added a "Ready to Join a Team?" section on the home dashboard that appears when a player has no teams. This section provides two paths:
1. **Enter a team code** (if they were given one)
2. **Discover teams** (browse available teams looking for players)

---

## Testing Scenario 1: New Player Dashboard (No Teams)

### Prerequisites
- Fresh account created (just signed up)
- Completed onboarding as a **Player**
- Either skipped joining a team OR didn't find any teams to join

### Steps to Test

1. **Sign In to Your Account**
   - Use your newly created player account
   - You should see the Home dashboard

2. **Verify "Ready to Join a Team?" Section Appears**
   - Look for a blue card with title: "Ready to Join a Team?"
   - You should see two options:
     - 📌 "Have a Team Code?" (left card with key icon)
     - 🔍 "Discover Teams" (right card with search icon)

3. **Check Card Styling**
   - Cards should have light blue/indigo background
   - Should be responsive on mobile/tablet
   - Icons should be visible and clear
   - Hover effect should make cards interactive-looking

4. **Check "Upcoming Matches" Section Below**
   - Should show message: "No teams yet"
   - Description: "Complete joining a team above to see your schedule"
   - No empty match list

5. **Verify Dashboard Elements**
   - Header greeting: "Welcome back, [Your Name]"
   - "Quick Actions" section should be visible
   - No stats cards (those only appear when you have a team)
   - No division standings (those only appear when you have a team)

---

## Testing Scenario 2: Join via Team Code

### Prerequisites
- You have a valid team code from a captain (format: `TM_BOCCE_xxxxxx`)
- You're on the home dashboard with no teams
- "Ready to Join a Team?" section is visible

### Steps to Test

1. **Click "Have a Team Code?" Card**
   - The join form should slide into view below
   - You should see a title: "Find Your Team"
   - An X button to close should appear in top-right

2. **View Join Team Form**
   - Should show two tabs: "Enter Code" and "Discover Teams"
   - Code tab should be selected by default
   - Should have an input field for code entry
   - Should show a progress bar: "Step 3 of 4"

3. **Enter a Valid Team Code**
   - Type the team code (e.g., `TM_BOCCE_ABC123XYZ`)
   - Code should auto-uppercase as you type
   - Click "Join Team" button

4. **Verify Success**
   - Should show success message: "You've joined [Team Name]!"
   - Form should close automatically
   - Dashboard should refresh
   - "Ready to Join a Team?" section should disappear
   - Upcoming matches should now show your team's schedule
   - Performance cards (Rating, Stats) should appear

5. **Check Roster**
   - Go to Teams tab
   - Select your team
   - You should appear in the roster as PLAYER role

### Testing Code Entry Validation

1. **Invalid Code**
   - Enter: `INVALID123`
   - Click "Join Team"
   - Should show error: "Team code not found"
   - Form should stay open for correction

2. **Expired/Used Code**
   - If you have an old code, try it
   - Should show error: "This code is no longer valid" (or similar)

3. **Already Member**
   - Join a team with code
   - Go back to home
   - Try joining same team with code again
   - Should show error: "You're already part of this team"

---

## Testing Scenario 3: Discover Teams and Request to Join

### Prerequisites
- You're on home dashboard with no teams
- There are at least 2-3 teams with `isLookingForPlayers: true`
- "Ready to Join a Team?" section is visible

### Steps to Test

1. **Click "Discover Teams" Card**
   - Join form slides into view
   - Select the "Discover Teams" tab
   - Should load a list of teams

2. **Verify Team List**
   - See teams with names, sport icons, player counts
   - Each team should show:
     - Team name
     - Sport icon (bocce, pickleball, padel)
     - Current player count (e.g., "5 players")
     - Badge showing: "Need 2 more"
   - Teams should be sorted or organized logically

3. **Request to Join a Team**
   - Click "Request to Join" button on a team
   - Modal should pop up: "Request to Join [Team Name]"
   - Optional message field should appear (500 char limit)
   - Type a message: "Hello! I'd love to join your team!"
   - Click "Send Request" button

4. **Verify Request Submitted**
   - Should show success: "Request sent!"
   - Modal closes
   - Status indicator should show "Request pending"
   - Team request count should update if visible

5. **Test Message Character Limit**
   - Click another team's "Request to Join"
   - Type message with exactly 500 characters
   - Should show character counter: "500 / 500"
   - Try typing more - additional characters should not appear
   - Counter should turn red/warning color at 500

6. **Test Optional Message**
   - Click another team's "Request to Join"
   - Leave message empty
   - Click "Send Request"
   - Should succeed without message

---

## Testing Scenario 4: Captain Managing Requests

### Prerequisites
- You're signed in as a Team Captain
- Players have sent join requests to your team
- You have Admin Dashboard access

### Steps to Test

1. **Navigate to Admin Dashboard**
   - Click profile icon → "Admin Settings" or
   - Go to More tab → "Association Admin"
   - You should see admin navigation

2. **Go to "Join Requests" Page**
   - In left sidebar or navigation, find "Join Requests"
   - Click to open the Join Requests management page
   - Should show: "Manage Team Join Requests"

3. **Select Your Team**
   - You should see a list or grid of your teams
   - Click on the team that has pending requests
   - Should load the pending requests for that team

4. **View Pending Requests**
   - See a list of players who requested to join
   - Each request shows:
     - Player name
     - Request message (if provided)
     - "Approve" button (green)
     - "Decline" button (outline)

5. **Approve a Request**
   - Click green "Approve" button for a player
   - Button should show "Approving..." with loading spinner
   - After success:
     - Status should change to "APPROVED"
     - Request moves to "Processed Requests" section
     - Player should appear in your team roster

6. **Verify Approved Player**
   - Go to Teams tab
   - Select your team
   - New player should appear in roster with PLAYER role

7. **Decline a Request**
   - Click outline "Decline" button for another request
   - Should show "Declining..." with loading spinner
   - After success:
     - Status should change to "DECLINED"
     - Request moves to "Processed Requests" section
     - Player should NOT appear in team roster

8. **View Processed Requests**
   - Scroll down to see request history
   - Should show all APPROVED and DECLINED requests
   - Status badges should show clearly

---

## Testing Scenario 5: Real-Time Updates

### Prerequisites
- Two browsers/devices open
- Browser A: Player account requesting to join
- Browser B: Captain account viewing requests

### Steps to Test

1. **Player Sends Request (Browser A)**
   - On home dashboard
   - Click "Discover Teams"
   - Click "Request to Join" for a team
   - Send request with message

2. **Captain Views Requests (Browser B)**
   - In admin Join Requests page for that team
   - Should see the NEW request appear in real-time (or after refresh)
   - Name, message, and buttons should be visible

3. **Captain Approves (Browser B)**
   - Click "Approve" button
   - Request should move to processed

4. **Player Sees Update (Browser A)**
   - Navigate away and back to home (or refresh)
   - The team should now appear in the player's team list
   - "Ready to Join a Team?" section should be gone
   - Dashboard should show the new team's data

---

## Testing Scenario 6: Mobile Responsiveness

### Prerequisites
- Same tests as above, but on mobile device or mobile-sized browser

### Steps to Test

1. **Home Dashboard Mobile**
   - "Ready to Join a Team?" cards should stack vertically
   - Both cards should be full width or side-by-side depending on screen width
   - Text should not overflow
   - Icons should be visible and appropriately sized

2. **Form on Mobile**
   - Join form should take full width or almost full width
   - Input fields should be tall enough to tap easily
   - Buttons should be large (44px minimum height)
   - Modal/form should not be cut off at bottom
   - Back button should be easily reachable

3. **List on Mobile**
   - Team discovery list should be vertical (one per row)
   - Team info should be readable
   - "Request to Join" button should be tappable
   - Request modal should fit on screen

4. **Admin on Mobile**
   - Admin page should be navigable
   - Join requests should be readable
   - Approve/Decline buttons should be tappable
   - Team selector should work smoothly

---

## Testing Scenario 7: Dark Mode

### Prerequisites
- Dark mode enabled in app settings (if available)
- OR system-wide dark mode enabled

### Steps to Test

1. **Home Dashboard Dark Mode**
   - "Ready to Join a Team?" card should be visible
   - Text should be readable (not too light)
   - Button backgrounds should contrast with text
   - Icons should be visible

2. **Form Elements Dark Mode**
   - Input fields should be dark with light text
   - Buttons should have good contrast
   - Labels/placeholders should be readable
   - Success messages should be visible

3. **Lists Dark Mode**
   - Team list should have appropriate background
   - Text should be readable
   - Icons should be visible
   - Hover states should be clear

---

## Testing Scenario 8: Error States

### Prerequisites
- Network access available for testing errors

### Test Network Error
1. Turn off internet/disable network in DevTools
2. Try to join with code
3. Should show: "Network error - check your connection"
4. Turn on network
5. Retry should work

### Test Already Joined
1. Join a team successfully
2. Go back to home
3. In "Discover Teams", look for that same team
4. Click "Request to Join"
5. Should show error: "You're already part of this team"

### Test Team Full
1. Join a team with `minPlayersNeeded: 0`
2. Should show: "This team is not accepting new members"

### Test Invalid Message
1. Try to send request with extremely long message
2. Should be capped at 500 chars
3. Form should still submit

---

## Testing Checklist

### Frontend Components
- [ ] "Ready to Join a Team?" card appears when no teams
- [ ] "Enter Code" tab works for code-based joining
- [ ] "Discover Teams" tab shows available teams
- [ ] Character counter works (500 char limit)
- [ ] Approve/Decline buttons work in admin
- [ ] Request history shows correctly
- [ ] Form closes after successful join
- [ ] Dashboard refreshes after join
- [ ] Mobile responsive (iPhone, iPad, desktop)
- [ ] Dark mode compatible
- [ ] Loading states show progress
- [ ] Error messages are clear and helpful

### API Integration
- [ ] POST /teams/join-by-code returns 200
- [ ] GET /leagues/:id/teams-looking returns team list
- [ ] POST /teams/:id/request-join creates request
- [ ] GET /teams/:id/pending-joins returns pending list
- [ ] POST /teams/:id/approve-join/:requestId approves
- [ ] POST /teams/:id/decline-join/:requestId declines

### User Experience
- [ ] Flow is intuitive
- [ ] No confusing messaging
- [ ] Loading indicators present
- [ ] Success/error feedback clear
- [ ] No broken links or dead ends
- [ ] Navigation works smoothly
- [ ] Can go back without issues

### Database
- [ ] TeamJoinRequest records created
- [ ] LeagueMember records created on approval
- [ ] Team roster updates after approval
- [ ] No orphaned records

---

## Quick Testing Commands

### Test Join by Code (curl)
```bash
curl -X POST http://localhost:4800/teams/join-by-code \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"code": "TM_BOCCE_ABC123XYZ"}'
```

### Test Discover Teams (curl)
```bash
curl -X GET "http://localhost:4800/leagues/YOUR_LEAGUE_ID/teams-looking" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test Request Join (curl)
```bash
curl -X POST http://localhost:4800/teams/YOUR_TEAM_ID/request-join \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"message": "I want to join!"}'
```

### Test Approve (curl)
```bash
curl -X POST "http://localhost:4800/teams/YOUR_TEAM_ID/approve-join/REQUEST_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Debugging Tips

### Check if user has teams
```javascript
// In browser console on home page
console.log('Teams:', userTeams);
console.log('Showing join UI:', userTeams.length === 0);
```

### Check API responses
- Open DevTools → Network tab
- Look for requests to `/teams`, `/teams-looking`, `/pending-joins`
- Check Status: should be 200
- Check Response: verify data structure

### Check localStorage
```javascript
console.log('leagueId:', localStorage.getItem('leagueId'));
```

### Check database
```bash
# SSH to server
ssh root@138.197.31.8

# Connect to database
psql -U youruser -d yourdb

# Check pending requests
SELECT * FROM "TeamJoinRequest" WHERE "status" = 'PENDING';

# Check league members
SELECT u."email", lm."role" FROM "User" u 
JOIN "LeagueMember" lm ON u."id" = lm."userId"
WHERE lm."leagueId" = 'YOUR_LEAGUE_ID';
```

---

## Success Criteria

Phase 1D is **COMPLETE** when all of the following pass:

✅ Player with no teams sees "Ready to Join a Team?" on dashboard  
✅ Player can join via code successfully  
✅ Player can discover teams successfully  
✅ Player can request to join team with optional message  
✅ Captain can approve requests from admin  
✅ Captain can decline requests from admin  
✅ Approved player appears in team roster  
✅ Declined request doesn't add player  
✅ All forms work on mobile  
✅ All forms work in dark mode  
✅ Error messages are clear  
✅ No TypeScript errors  
✅ Database records created correctly  
✅ Real-time updates work (or after refresh)  

---

## Next Steps

Once all tests pass:

1. **Commit & Push**
   ```bash
   git add .
   git commit -m "test: Phase 1D complete - all tests passing"
   git push origin main
   ```

2. **Deploy to Staging**
   - Push to staging branch
   - Test on staging server
   - Verify database migration applied

3. **Deploy to Production**
   - Deploy backend changes
   - Deploy frontend changes
   - Monitor error logs
   - Gather user feedback

4. **Monitor & Improve**
   - Watch for join errors
   - Track feature usage
   - Collect feedback
   - Plan enhancements (notifications, expiration, etc.)

---

**Last Updated:** December 1, 2025  
**Ready for Testing:** Yes ✅  
**Estimated Testing Time:** 2-3 hours for full coverage
