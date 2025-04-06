import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  DataStoreContextType, 
  GoalsConcededDataPoint, 
  SavesMadeDataPoint, 
  ShotPositionDataPoint, 
  PerformanceSummary, 
  LastMatch, 
  UpcomingMatch, 
  TeamData, 
  MatchLog,
  UserSettings 
} from '@/types/store-types';
import { LOCAL_STORAGE_KEYS } from '@/constants/storage-keys';
import { generateInitialMatchLogs } from '@/utils/store-utils';
import { 
  goalsConcededData as initialGoalsConcededData, 
  savesMadeData as initialSavesMadeData, 
  shotPositionData as initialShotPositionData,
  performanceSummary as initialPerformanceSummary,
  lastMatch as initialLastMatch,
  upcomingMatch as initialUpcomingMatch,
  teamScoreboard as initialTeamScoreboard 
} from '@/lib/chart-data';

// Create the context
export const DataStoreContext = createContext<DataStoreContextType | undefined>(undefined);

// Provider component
export const DataStoreProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state from localStorage or defaults
  const [matchLogs, setMatchLogs] = useState<MatchLog[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.MATCH_LOGS);
    return saved ? JSON.parse(saved) : generateInitialMatchLogs();
  });
  
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
    const loadedSummary = saved ? JSON.parse(saved) : initialPerformanceSummary;
    
    // If we have match logs, make sure performance summary matches the number of logs
    const savedLogs = localStorage.getItem(LOCAL_STORAGE_KEYS.MATCH_LOGS);
    if (savedLogs) {
      const parsedLogs = JSON.parse(savedLogs);
      if (parsedLogs.length !== loadedSummary.matches) {
        loadedSummary.matches = parsedLogs.length;
      }
    }
    
    return loadedSummary;
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
  
  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_SETTINGS);
    return saved ? JSON.parse(saved) : { clubTeam: "VV Dongen" };
  });
  
  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.MATCH_LOGS, JSON.stringify(matchLogs));
    // Ensure performance summary is updated when match logs change
    recalculatePerformanceSummary();
  }, [matchLogs]);
  
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
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER_SETTINGS, JSON.stringify(userSettings));
  }, [userSettings]);
  
  // Generate statistics from match logs
  useEffect(() => {
    if (matchLogs.length > 0) {
      // Update goals conceded and saves made data
      const last6Matches = [...matchLogs]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 6)
        .reverse();
      
      const newGoalsConceded = last6Matches.map((match, index) => {
        const isHomeGame = match.homeTeam === userSettings.clubTeam;
        const goalsAgainst = isHomeGame ? match.awayScore : match.homeScore;
        // Format date to show just month/day
        const matchDate = new Date(match.date);
        const formattedDate = `${matchDate.getMonth() + 1}/${matchDate.getDate()}`;
        
        return {
          name: formattedDate,
          goals: goalsAgainst
        };
      });
      
      const newSavesMade = last6Matches.map((match, index) => {
        // Format date to show just month/day
        const matchDate = new Date(match.date);
        const formattedDate = `${matchDate.getMonth() + 1}/${matchDate.getDate()}`;
        
        return {
          name: formattedDate,
          saves: match.saves
        };
      });
      
      setGoalsConcededData(newGoalsConceded);
      setSavesMadeData(newSavesMade);
    }
  }, [matchLogs, userSettings.clubTeam]);
  
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
    let teamWins = 0;
    let teamDraws = 0;
    let teamLosses = 0;
    
    matchLogs.forEach(match => {
      totalSaves += match.saves;
      
      const isHomeGame = match.homeTeam === userSettings.clubTeam;
      const teamScore = isHomeGame ? match.homeScore : match.awayScore;
      const opponentScore = isHomeGame ? match.awayScore : match.homeScore;
      
      // Determine goals conceded 
      if (isHomeGame) {
        totalGoalsConceded += match.awayScore;
        if (match.awayScore === 0) totalCleanSheets++;
      } else {
        totalGoalsConceded += match.homeScore;
        if (match.homeScore === 0) totalCleanSheets++;
      }
      
      // Determine match result
      if (teamScore > opponentScore) {
        teamWins++;
      } else if (teamScore === opponentScore) {
        teamDraws++;
      } else {
        teamLosses++;
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
    
    // Update team scoreboard
    const updatedTeamScoreboard = [...teamScoreboard];
    const teamIndex = updatedTeamScoreboard.findIndex(team => team.team === userSettings.clubTeam);
    
    if (teamIndex !== -1) {
      updatedTeamScoreboard[teamIndex] = {
        ...updatedTeamScoreboard[teamIndex],
        played: totalMatches,
        won: teamWins,
        drawn: teamDraws,
        lost: teamLosses,
        goalsFor: matchLogs.reduce((total, match) => {
          return total + (match.homeTeam === userSettings.clubTeam ? match.homeScore : match.awayScore);
        }, 0),
        goalsAgainst: totalGoalsConceded,
        points: teamWins * 3 + teamDraws
      };
      
      // Resort teams by points
      updatedTeamScoreboard.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        // Goal difference as tiebreaker
        const aGD = a.goalsFor - a.goalsAgainst;
        const bGD = b.goalsFor - b.goalsAgainst;
        return bGD - aGD;
      });
      
      // Update positions
      updatedTeamScoreboard.forEach((team, index) => {
        team.position = index + 1;
      });
      
      setTeamScoreboard(updatedTeamScoreboard);
    }
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
        userSettings,
        setUserSettings,
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
