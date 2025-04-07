
import { ReactNode } from 'react';
import { DataStoreContext } from './DataStoreContext';
import { useChartData } from './hooks/useChartData';
import { useMatchLogs } from './hooks/useMatchLogs';
import { usePerformanceData } from './hooks/usePerformanceData';
import { useTeamData } from './hooks/useTeamData';
import { useUserSettings } from './hooks/useUserSettings';

// Provider component
export const DataStoreProvider = ({ children }: { children: ReactNode }) => {
  // Initialize all our data hooks
  const { 
    goalsConcededData, setGoalsConcededData,
    savesMadeData, setSavesMadeData,
    shotPositionData, setShotPositionData
  } = useChartData();
  
  const {
    matchLogs, setMatchLogs,
    addMatchLog, updateMatchLog, deleteMatchLog
  } = useMatchLogs();
  
  const {
    performanceSummary, setPerformanceSummary,
    lastMatch, setLastMatch,
    upcomingMatch, setUpcomingMatch,
    recalculatePerformanceSummary
  } = usePerformanceData({ matchLogs });
  
  const {
    teamScoreboard, setTeamScoreboard
  } = useTeamData();
  
  const {
    userSettings, setUserSettings
  } = useUserSettings();
  
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
