
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
import { useToast } from '@/hooks/use-toast';
import { checkSupabaseConnection } from '@/lib/supabase';

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
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // Check database connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isConnected = await checkSupabaseConnection();
        if (!isConnected) {
          setConnectionError('Unable to connect to the database');
        } else {
          setConnectionError(null);
        }
      } catch (error) {
        console.error('Database connection check failed:', error);
        setConnectionError('Error checking database connection');
      }
    };
    
    checkConnection();
  }, []);
  
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
    try {
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
    } catch (error) {
      console.error('Failed to recalculate performance summary:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to update performance statistics"
      });
    }
  };
  
  // Update chart data based on match logs
  const updateChartData = async () => {
    if (matchLogs.length > 0) {
      try {
        const { goalsConcededData, savesMadeData } = calculateChartData(matchLogs, userSettings);
        
        await Promise.all([
          performanceState.setGoalsConcededData(goalsConcededData),
          performanceState.setSavesMadeData(savesMadeData)
        ]);
      } catch (error) {
        console.error('Failed to update chart data:', error);
        toast({
          variant: "destructive",
          title: "Update failed",
          description: "Failed to update chart data"
        });
      }
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
        isLoading,
        connectionError
      }}
    >
      {connectionError && !isLoading ? (
        <div className="flex items-center justify-center min-h-screen bg-background">
          {import('./DatabaseConnectionError').then(module => (
            <module.DatabaseConnectionError />
          )).catch(() => (
            <div className="text-center p-4">
              <h1 className="text-xl font-bold">Database Connection Error</h1>
              <p className="text-muted-foreground mt-2">Unable to connect to the database.</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4"
              >
                Retry
              </Button>
            </div>
          ))}
        </div>
      ) : (
        children
      )}
    </DataStoreContext.Provider>
  );
};
