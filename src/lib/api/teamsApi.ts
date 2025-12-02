/**
 * Teams API Service
 * Handles team joining, discovery, and management operations
 * Phase 1B & 1C: Code-based, request-based joining, and team discovery
 */

import { apiService } from '@/services/api';

/**
 * Join a team using an invitation code
 * POST /teams/join-by-code
 */
export async function joinTeamByCode(code: string, userId: string) {
  try {
    const response = await apiService.joinTeamByCode(code, userId);
    
    if (response.error) {
      throw new Error(response.error || 'Failed to join team');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error joining team by code:', error);
    throw error;
  }
}

/**
 * Request to join a team (pending admin approval)
 * POST /teams/:teamId/request-join
 */
export async function requestJoinTeam(teamId: string, userId: string, message?: string) {
  try {
    const response = await apiService.requestJoinTeam(teamId, userId, message);
    
    if (response.error) {
      throw new Error(response.error || 'Failed to request join');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error requesting to join team:', error);
    throw error;
  }
}

/**
 * Get teams looking for players in a league
 * GET /leagues/:leagueId/teams-looking
 */
export async function getTeamsLookingForPlayers(leagueId: string) {
  try {
    const response = await apiService.getTeamsLookingForPlayers(leagueId);
    
    if (response.error) {
      throw new Error(response.error || 'Failed to fetch teams');
    }
    
    return response.data || [];
  } catch (error) {
    console.error('Error fetching teams looking for players:', error);
    throw error;
  }
}

/**
 * Get pending join requests for a team (admin only)
 * GET /teams/:teamId/pending-joins
 */
export async function getPendingJoinRequests(teamId: string) {
  try {
    const response = await apiService.getPendingJoinRequests(teamId);
    
    if (response.error) {
      throw new Error(response.error || 'Failed to fetch pending requests');
    }
    
    return response.data || [];
  } catch (error) {
    console.error('Error fetching pending join requests:', error);
    throw error;
  }
}

/**
 * Approve a join request (admin only)
 * POST /teams/:teamId/approve-join/:requestId
 */
export async function approveJoinRequest(teamId: string, requestId: string) {
  try {
    const response = await apiService.approveJoinRequest(teamId, requestId);
    
    if (response.error) {
      throw new Error(response.error || 'Failed to approve request');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error approving join request:', error);
    throw error;
  }
}

/**
 * Decline a join request (admin only)
 * POST /teams/:teamId/decline-join/:requestId
 */
export async function declineJoinRequest(teamId: string, requestId: string) {
  try {
    const response = await apiService.declineJoinRequest(teamId, requestId);
    
    if (response.error) {
      throw new Error(response.error || 'Failed to decline request');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error declining join request:', error);
    throw error;
  }
}
