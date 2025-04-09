
import { createContext, ReactNode, useEffect } from 'react';
import { DataStoreContextType } from '@/types/store-types';
import { useMatchLogState } from '@/hooks/useMatchLogState';
import { useVideoAnalysisState } from '@/hooks/useVideoAnalysisState';
import { usePerformanceState } from '@/hooks/usePerformanceState';
import { useMatchState } from '@/hooks/useMatchState';
import { useUserSettings } from '@/hooks/useUserSettings';
import { 
  calculatePerformanceSummary, 
  updateTeamScoreboard,
  calculateChartData
} from '@/utils/performance-calculator';

// Create the context
export const DataStoreContext = createContext<DataStoreContextType | undefined>(undefined);

// Provider component
export const DataStoreProvider = ({ children }: { children: ReactNode }) => {
  // Use the extracted state management hooks
  const matchLogState = useMatchLogState();
  const videoAnalysisState = useVideoAnalysisState();
  const performanceState = usePerformanceState();
  const matchState = useMatchState();
  const { userSettings, setUserSettings } = useUserSettings();
  
  // Extract properties from state for clarity
  const { matchLogs } = matchLogState;

  // Recalculate performance statistics whenever match logs or club team changes
  const recalculatePerformanceSummary = () => {
    const stats = calculatePerformanceSummary(matchLogs, userSettings);
    
    // Update performance summary
    performanceState.setPerformanceSummary({
      matches: stats.matches,
      totalSaves: stats.totalSaves,
      totalGoalsConceded: stats.totalGoalsConceded,
      cleanSheets: stats.cleanSheets,
      savePercentage: stats.savePercentage
    });
    
    // Update team scoreboard
    const updatedTeamScoreboard = updateTeamScoreboard(
      matchState.teamScoreboard, 
      userSettings, 
      matchLogs, 
      stats
    );
    
    matchState.setTeamScoreboard(updatedTeamScoreboard);
  };
  
  // Update chart data based on match logs
  const updateChartData = () => {
    if (matchLogs.length > 0) {
      const { goalsConcededData, savesMadeData } = calculateChartData(matchLogs, userSettings);
      
      performanceState.setGoalsConcededData(goalsConcededData);
      performanceState.setSavesMadeData(savesMadeData);
    }
  };
  
  // Update data when match logs change
  useEffect(() => {
    if (matchLogs.length > 0) {
      // Update last match
      const sortedMatches = [...matchLogs].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      const recentMatch = sortedMatches[0];
      matchState.setLastMatch({
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
    
    // Update performance summary and chart data
    recalculatePerformanceSummary();
    updateChartData();
  }, [matchLogs]);
  
  // Update when club team changes
  useEffect(() => {
    updateChartData();
    recalculatePerformanceSummary();
  }, [userSettings.clubTeam]);
  
  // Combine all state and functions into the context value
  return (
    <DataStoreContext.Provider
      value={{
        ...performanceState,
        ...matchState,
        ...matchLogState,
        userSettings,
        setUserSettings,
        recalculatePerformanceSummary,
        ...videoAnalysisState
      }}
    >
      {children}
    </DataStoreContext.Provider>
  );
};
