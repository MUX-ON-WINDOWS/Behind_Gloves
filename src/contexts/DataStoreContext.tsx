
import { createContext, ReactNode, useEffect, useState } from 'react';
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
  const userSettingsState = useUserSettings();
  
  const [isLoading, setIsLoading] = useState(true);
  
  // Extract properties from state for clarity
  const { matchLogs } = matchLogState;
  const { userSettings } = userSettingsState;
  
  // Track loading states from all hooks
  useEffect(() => {
    setIsLoading(
      matchLogState.isLoading || 
      videoAnalysisState.isLoading || 
      performanceState.isLoading || 
      matchState.isLoading || 
      userSettingsState.isLoading
    );
  }, [
    matchLogState.isLoading,
    videoAnalysisState.isLoading,
    performanceState.isLoading,
    matchState.isLoading,
    userSettingsState.isLoading
  ]);

  // Recalculate performance statistics whenever match logs or club team changes
  const recalculatePerformanceSummary = async () => {
    const stats = calculatePerformanceSummary(matchLogs, userSettings);
    
    // Update performance summary
    await performanceState.setPerformanceSummary({
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
    
    await matchState.setTeamScoreboard(updatedTeamScoreboard);
  };
  
  // Update chart data based on match logs
  const updateChartData = async () => {
    if (matchLogs.length > 0) {
      const { goalsConcededData, savesMadeData } = calculateChartData(matchLogs, userSettings);
      
      await Promise.all([
        performanceState.setGoalsConcededData(goalsConcededData),
        performanceState.setSavesMadeData(savesMadeData)
      ]);
    }
  };
  
  // Update data when match logs change
  useEffect(() => {
    if (!isLoading && matchLogs.length > 0) {
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
      
      // Update performance summary and chart data
      recalculatePerformanceSummary();
      updateChartData();
    }
  }, [matchLogs, isLoading]);
  
  // Update when club team changes
  useEffect(() => {
    if (!isLoading) {
      updateChartData();
      recalculatePerformanceSummary();
    }
  }, [userSettings.clubTeam, isLoading]);
  
  // Combine all state and functions into the context value
  return (
    <DataStoreContext.Provider
      value={{
        ...performanceState,
        ...matchState,
        ...matchLogState,
        userSettings,
        setUserSettings: userSettingsState.setUserSettings,
        recalculatePerformanceSummary,
        ...videoAnalysisState,
        isLoading
      }}
    >
      {children}
    </DataStoreContext.Provider>
  );
};
