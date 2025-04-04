
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { goalsConcededData as initialGoalsConcededData, 
         savesMadeData as initialSavesMadeData, 
         shotPositionData as initialShotPositionData,
         performanceSummary as initialPerformanceSummary,
         lastMatch as initialLastMatch,
         upcomingMatch as initialUpcomingMatch,
         teamScoreboard as initialTeamScoreboard } from './chart-data';

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
interface DataStoreContextType {
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

// Local storage keys
const LOCAL_STORAGE_KEYS = {
  GOALS_CONCEDED: 'keeper-dashboard-goals-conceded',
  SAVES_MADE: 'keeper-dashboard-saves-made',
  SHOT_POSITION: 'keeper-dashboard-shot-position',
  PERFORMANCE_SUMMARY: 'keeper-dashboard-performance-summary',
  LAST_MATCH: 'keeper-dashboard-last-match',
  UPCOMING_MATCH: 'keeper-dashboard-upcoming-match',
  TEAM_SCOREBOARD: 'keeper-dashboard-team-scoreboard',
  MATCH_LOGS: 'keeper-dashboard-match-logs'
};

// Create the context
export const DataStoreContext = createContext<DataStoreContextType | undefined>(undefined);

// Generate sample match logs based on the goals conceded data
const generateInitialMatchLogs = (): MatchLog[] => {
  return initialGoalsConcededData.map((match, index) => {
    const isHomeGame = index % 2 === 0;
    const savesMade = initialSavesMadeData[index]?.saves || 0;
    const goalsConceded = match.goals;
    const homeScore = isHomeGame ? Math.floor(Math.random() * 4) : goalsConceded;
    const awayScore = isHomeGame ? goalsConceded : Math.floor(Math.random() * 4);
    
    const matchDate = new Date();
    matchDate.setDate(matchDate.getDate() - (initialGoalsConcededData.length - index) * 7);
    
    return {
      id: `match-${index + 1}`,
      date: matchDate.toISOString().split('T')[0],
      homeTeam: isHomeGame ? 'FC United' : `Opponent ${index + 1}`,
      awayTeam: isHomeGame ? `Opponent ${index + 1}` : 'FC United',
      homeScore: isHomeGame ? homeScore : awayScore,
      awayScore: isHomeGame ? awayScore : homeScore,
      venue: isHomeGame ? 'United Stadium' : `Away Stadium ${index + 1}`,
      saves: savesMade,
      cleanSheet: goalsConceded === 0,
      notes: `Match ${index + 1} notes`
    };
  });
};

// Provider component
export const DataStoreProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state from localStorage or defaults
  const [goalsConcededData, setGoalsConcededData] = useState<GoalsConcededDataPoint[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.GOALS_CONCEDED);
    return saved ? JSON.parse(saved) : initialGoalsConcededData;
  });
  
  const [savesMadeData, setSavesMadeData] = useState<SavesMadeDataPoint[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SAVES_MADE);
    return saved ? JSON.parse(saved) : initialSavesMadeData;
  });
  
  const [shotPositionData, setShotPositionData] = useState<ShotPositionDataPoint[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SHOT_POSITION);
    return saved ? JSON.parse(saved) : initialShotPositionData;
  });
  
  const [performanceSummary, setPerformanceSummary] = useState<PerformanceSummary>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PERFORMANCE_SUMMARY);
    return saved ? JSON.parse(saved) : initialPerformanceSummary;
  });
  
  const [lastMatch, setLastMatch] = useState<LastMatch>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_MATCH);
    return saved ? JSON.parse(saved) : initialLastMatch;
  });
  
  const [upcomingMatch, setUpcomingMatch] = useState<UpcomingMatch>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.UPCOMING_MATCH);
    return saved ? JSON.parse(saved) : initialUpcomingMatch;
  });
  
  const [teamScoreboard, setTeamScoreboard] = useState<TeamData[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.TEAM_SCOREBOARD);
    return saved ? JSON.parse(saved) : initialTeamScoreboard;
  });
  
  const [matchLogs, setMatchLogs] = useState<MatchLog[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.MATCH_LOGS);
    return saved ? JSON.parse(saved) : generateInitialMatchLogs();
  });
  
  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.GOALS_CONCEDED, JSON.stringify(goalsConcededData));
  }, [goalsConcededData]);
  
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SAVES_MADE, JSON.stringify(savesMadeData));
  }, [savesMadeData]);
  
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SHOT_POSITION, JSON.stringify(shotPositionData));
  }, [shotPositionData]);
  
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PERFORMANCE_SUMMARY, JSON.stringify(performanceSummary));
  }, [performanceSummary]);
  
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_MATCH, JSON.stringify(lastMatch));
  }, [lastMatch]);
  
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.UPCOMING_MATCH, JSON.stringify(upcomingMatch));
  }, [upcomingMatch]);
  
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.TEAM_SCOREBOARD, JSON.stringify(teamScoreboard));
  }, [teamScoreboard]);
  
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.MATCH_LOGS, JSON.stringify(matchLogs));
  }, [matchLogs]);
  
  // Helper functions for match logs
  const addMatchLog = (match: Omit<MatchLog, "id">) => {
    const newMatch: MatchLog = {
      ...match,
      id: `match-${Date.now()}`
    };
    setMatchLogs(prev => [...prev, newMatch]);
  };
  
  const updateMatchLog = (id: string, match: Partial<MatchLog>) => {
    setMatchLogs(prev => 
      prev.map(log => log.id === id ? { ...log, ...match } : log)
    );
  };
  
  const deleteMatchLog = (id: string) => {
    setMatchLogs(prev => prev.filter(log => log.id !== id));
  };
  
  // Function to recalculate performance summary based on match logs
  const recalculatePerformanceSummary = () => {
    const totalMatches = matchLogs.length;
    let totalSaves = 0;
    let totalGoalsConceded = 0;
    let totalCleanSheets = 0;
    
    matchLogs.forEach(match => {
      totalSaves += match.saves;
      
      // Determine goals conceded based on whether FC United was home or away
      if (match.homeTeam === 'FC United') {
        totalGoalsConceded += match.awayScore;
        if (match.awayScore === 0) totalCleanSheets++;
      } else {
        totalGoalsConceded += match.homeScore;
        if (match.homeScore === 0) totalCleanSheets++;
      }
    });
    
    // Calculate save percentage
    const savePercentage = totalMatches > 0 
      ? parseFloat(((totalSaves / (totalSaves + totalGoalsConceded)) * 100).toFixed(1))
      : 0;
    
    const newSummary = {
      matches: totalMatches,
      totalSaves,
      totalGoalsConceded,
      cleanSheets: totalCleanSheets,
      savePercentage
    };
    
    setPerformanceSummary(newSummary);
  };
  
  return (
    <DataStoreContext.Provider
      value={{
        goalsConcededData,
        setGoalsConcededData,
        savesMadeData,
        setSavesMadeData,
        shotPositionData,
        setShotPositionData,
        performanceSummary,
        setPerformanceSummary,
        lastMatch,
        setLastMatch,
        upcomingMatch,
        setUpcomingMatch,
        teamScoreboard,
        setTeamScoreboard,
        matchLogs,
        setMatchLogs,
        addMatchLog,
        updateMatchLog,
        deleteMatchLog,
        recalculatePerformanceSummary
      }}
    >
      {children}
    </DataStoreContext.Provider>
  );
};

// Hook to use the data store
export const useDataStore = () => {
  const context = useContext(DataStoreContext);
  if (context === undefined) {
    throw new Error('useDataStore must be used within a DataStoreProvider');
  }
  return context;
};
