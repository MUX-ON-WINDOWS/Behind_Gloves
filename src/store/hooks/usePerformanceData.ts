
import { useState, useEffect } from 'react';
import { LOCAL_STORAGE_KEYS } from '@/constants/storage-keys';
import { 
  performanceSummary as initialPerformanceSummary,
  lastMatch as initialLastMatch,
  upcomingMatch as initialUpcomingMatch
} from '@/lib/chart-data';
import { 
  PerformanceSummary, 
  LastMatch, 
  UpcomingMatch, 
  MatchLog,
  UserSettings
} from '@/types/store-types';

interface UsePerformanceDataProps {
  matchLogs: MatchLog[];
}

export const usePerformanceData = ({ matchLogs }: UsePerformanceDataProps) => {
  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_SETTINGS);
    return saved ? JSON.parse(saved) : { clubTeam: "VV Dongen" };
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

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PERFORMANCE_SUMMARY, JSON.stringify(performanceSummary));
  }, [performanceSummary]);
  
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_MATCH, JSON.stringify(lastMatch));
  }, [lastMatch]);
  
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.UPCOMING_MATCH, JSON.stringify(upcomingMatch));
  }, [upcomingMatch]);
  
  // Save user settings
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER_SETTINGS, JSON.stringify(userSettings));
  }, [userSettings]);

  // Function to recalculate performance summary based on match logs
  const recalculatePerformanceSummary = () => {
    const totalMatches = matchLogs.length;
    let totalSaves = 0;
    let totalGoalsConceded = 0;
    let totalCleanSheets = 0;
    
    matchLogs.forEach(match => {
      totalSaves += match.saves;
      
      const isHomeGame = match.homeTeam === userSettings.clubTeam;
      
      // Determine goals conceded 
      if (isHomeGame) {
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
    
    // Update last match if there are matches
    if (matchLogs.length > 0) {
      // Update last match
      const sortedMatches = [...matchLogs].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      const recentMatch = sortedMatches[0];
      setLastMatch({
        homeTeam: recentMatch.homeTeam,
        homeScore: recentMatch.homeScore,
        awayTeam: recentMatch.awayTeam,
        awayScore: recentMatch.awayScore,
        date: recentMatch.date,
        venue: recentMatch.venue,
        cleanSheet: recentMatch.cleanSheet,
        saves: recentMatch.saves
      });
    }
  };
  
  // Update last match and performance summary when match logs change
  useEffect(() => {
    recalculatePerformanceSummary();
  }, [matchLogs]);

  return {
    performanceSummary,
    setPerformanceSummary,
    lastMatch,
    setLastMatch,
    upcomingMatch,
    setUpcomingMatch,
    recalculatePerformanceSummary
  };
};
