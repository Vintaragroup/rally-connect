export interface AdminStats {
  totalPlayers: number;
  totalTeams: number;
  totalLeagues: number;
  totalSeasons: number;
  pendingCaptainRequests: number;
}

export interface CaptainRequest {
  id: string;
  playerId: string;
  playerName: string;
  playerEmail: string;
  playerAvatar?: string;
  teamId: string;
  teamName: string;
  leagueId: string;
  leagueName: string;
  seasonId: string;
  seasonName: string;
  source: 'player' | 'admin';
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: Date;
  notes?: string;
  reviewedBy?: string;
  reviewedDate?: Date;
}

export interface League {
  id: string;
  name: string;
  sport: 'bocce' | 'pickleball' | 'padel';
  description?: string;
  status: 'active' | 'archived';
  activeSeasonsCount: number;
  createdDate: Date;
}

export interface Season {
  id: string;
  name: string;
  leagueId: string;
  leagueName: string;
  sport: 'bocce' | 'pickleball' | 'padel';
  startDate: Date;
  endDate: Date;
  divisionsCount: number;
  teamsCount: number;
  status: 'upcoming' | 'active' | 'completed';
}

export interface Division {
  id: string;
  name: string;
  seasonId: string;
  seasonName: string;
  leagueId: string;
  leagueName: string;
  teamCount: number;
  status: 'active' | 'completed';
  minTeams?: number;
  maxTeams?: number;
}

export interface AdminTeam {
  id: string;
  name: string;
  divisionId: string;
  divisionName: string;
  seasonId: string;
  seasonName: string;
  leagueId: string;
  leagueName: string;
  captains: { id: string; name: string; avatar?: string }[];
  playerCount: number;
  status: 'active' | 'inactive';
}

export interface AdminPlayer {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  teams: { id: string; name: string; seasonName: string }[];
  roles: ('player' | 'captain' | 'admin')[];
  status: 'active' | 'suspended';
  joinedDate: Date;
  matchesPlayed?: number;
  winLossRecord?: { wins: number; losses: number };
}

export interface AdminMatch {
  id: string;
  homeTeamId: string;
  homeTeamName: string;
  awayTeamId: string;
  awayTeamName: string;
  divisionId: string;
  divisionName: string;
  seasonId: string;
  seasonName: string;
  leagueId: string;
  leagueName: string;
  date: Date;
  time: string;
  location?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  homeScore?: number;
  awayScore?: number;
}

export interface Activity {
  id: string;
  type: 'captain_request' | 'score_override' | 'player_transfer' | 'team_created';
  title: string;
  description: string;
  timestamp: Date;
  actionBy?: string;
}
