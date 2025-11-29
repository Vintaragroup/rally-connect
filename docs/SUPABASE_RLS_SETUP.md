# Supabase Row-Level Security (RLS) Production Guide

## Overview
This document outlines the RLS policies needed for production safety. RLS ensures users can only access their own data and authorized team data.

## Critical Tables Requiring RLS

### 1. **users table**
```sql
-- Allow users to see their own profile
CREATE POLICY "Users can view their own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);
```

**Status**: ⚠️ NOT YET CONFIGURED

---

### 2. **teams table**
```sql
-- Allow team members to view their teams
CREATE POLICY "Users can view teams they are members of"
  ON public.teams
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = teams.id
      AND team_members.user_id = auth.uid()
    )
  );

-- Allow captains to update their team
CREATE POLICY "Team captains can update team"
  ON public.teams
  FOR UPDATE
  USING (
    captain_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );
```

**Status**: ⚠️ NOT YET CONFIGURED

---

### 3. **matches table**
```sql
-- Allow users to view matches for teams they're in
CREATE POLICY "Users can view team matches"
  ON public.matches
  FOR SELECT
  USING (
    home_team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
    OR
    away_team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );
```

**Status**: ⚠️ NOT YET CONFIGURED

---

### 4. **messages (Chat) table**
```sql
-- Allow users to view messages in their team chats
CREATE POLICY "Users can view team messages"
  ON public.messages
  FOR SELECT
  USING (
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

-- Allow users to send messages to their teams
CREATE POLICY "Users can send team messages"
  ON public.messages
  FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );
```

**Status**: ⚠️ NOT YET CONFIGURED

---

### 5. **notifications table**
```sql
-- Allow users to view their own notifications
CREATE POLICY "Users can view their notifications"
  ON public.notifications
  FOR SELECT
  USING (user_id = auth.uid());

-- Allow users to update their own notifications (mark as read)
CREATE POLICY "Users can update their notifications"
  ON public.notifications
  FOR UPDATE
  USING (user_id = auth.uid());
```

**Status**: ⚠️ NOT YET CONFIGURED

---

## Implementation Checklist

- [ ] Enable RLS on `users` table
- [ ] Enable RLS on `teams` table
- [ ] Enable RLS on `team_members` table
- [ ] Enable RLS on `matches` table
- [ ] Enable RLS on `messages` table (chat)
- [ ] Enable RLS on `notifications` table
- [ ] Enable RLS on `captain_requests` table
- [ ] Test policies with different user roles (player, captain, admin)
- [ ] Test cross-team data access prevention
- [ ] Test admin bypass policies

## Testing RLS Policies

### 1. Disable RLS Temporarily for Testing
```sql
-- View current RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE rowsecurity;

-- Disable RLS on a table for testing (use WITH CAUTION)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

### 2. Test as Different User Roles
Use Supabase dashboard to:
1. Sign in as regular player
2. Attempt to access team data (should work for own teams only)
3. Attempt to access other users' data (should fail)
4. Sign in as captain
5. Verify captain-specific permissions work
6. Sign in as admin (if applicable)
7. Verify admin bypass policies work

---

## Production Deployment Steps

1. **Backup Database**
   ```bash
   pg_dump $DATABASE_URL > backup.sql
   ```

2. **Enable RLS on All Tables**
   - Use Supabase dashboard SQL editor
   - Or run migration: `npx prisma migrate dev --name enable_rls`

3. **Test All User Flows**
   - Sign up → Onboarding → Home
   - Join team via invite
   - Create team (captain)
   - Send chat messages
   - View matches

4. **Monitor Logs**
   - Watch for RLS policy violations
   - Check Supabase logs for denied access attempts

5. **Gradual Rollout** (if possible)
   - Enable for read operations first
   - Enable for write operations after testing

---

## Common RLS Issues & Solutions

### Issue: "Policy requires a variable to be assigned"
**Solution**: Ensure `auth.uid()` is used in policies

### Issue: "Row security is not enabled"
**Solution**: 
```sql
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

### Issue: "Permission denied" errors in production
**Possible Causes**:
- User not member of team
- RLS policy too restrictive
- Missing service role key usage

---

## Additional Security Recommendations

1. **Service Role Key** - Only use server-side for admin operations
2. **Token Expiry** - Set JWT token expiry to 1 hour
3. **Refresh Tokens** - Implement refresh token rotation
4. **Audit Logging** - Log all policy violations
5. **Rate Limiting** - Implement on API endpoints

---

**Last Updated**: November 29, 2025
**Status**: 🔴 NOT YET IMPLEMENTED
**Blocker**: Need to confirm Prisma schema matches actual database structure
