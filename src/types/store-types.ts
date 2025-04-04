
// Define types for all our data structures
export interface GoalsConcededDataPoint {
  name: string;
  goals: number;
}

export interface SavesMadeDataPoint {
  name: string;
  saves: number;
}

export interface ShotPositionDataPoint {
  name: string;
  value: number;
}

export interface PerformanceSummary {
  matches: number;
  totalSaves: number;
  totalGoalsConceded: number;
  cleanSheets: number;
  savePercentage: number;
}

export interface LastMatch {
  homeTeam: string;
  homeScore: number;
  awayTeam: string;
  awayScore: number;
  date: string;
  venue: string;
  cleanSheet: boolean;
  saves: number;
}

export interface UpcomingMatch {
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue: string;
  competition: string;
}

export interface TeamData {
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export interface MatchLog {
  id: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  venue: string;
  saves: number;
  cleanSheet: boolean;
  notes?: string;
}

// Store context type
export interface DataStoreContextType {
  goalsConcededData: GoalsConcededDataPoint[];
  setGoalsConcededData: (data: GoalsConcededDataPoint[]) => void;
  savesMadeData: SavesMadeDataPoint[];
  setSavesMadeData: (data: SavesMadeDataPoint[]) => void;
  shotPositionData: ShotPositionDataPoint[];
  setShotPositionData: (data: ShotPositionDataPoint[]) => void;
  performanceSummary: PerformanceSummary;
  setPerformanceSummary: (data: PerformanceSummary) => void;
  lastMatch: LastMatch;
  setLastMatch: (data: LastMatch) => void;
  upcomingMatch: UpcomingMatch;
  setUpcomingMatch: (data: UpcomingMatch) => void;
  teamScoreboard: TeamData[];
  setTeamScoreboard: (data: TeamData[]) => void;
  matchLogs: MatchLog[];
  setMatchLogs: (logs: MatchLog[]) => void;
  addMatchLog: (match: Omit<MatchLog, "id">) => void;
  updateMatchLog: (id: string, match: Partial<MatchLog>) => void;
  deleteMatchLog: (id: string) => void;
  recalculatePerformanceSummary: () => void;
}
