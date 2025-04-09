
import { useState, useEffect } from 'react';
import { 
  GoalsConcededDataPoint,
  SavesMadeDataPoint,
  ShotPositionDataPoint,
  PerformanceSummary
} from '@/types/store-types';
import { LOCAL_STORAGE_KEYS } from '@/constants/storage-keys';
import { 
  goalsConcededData as initialGoalsConcededData, 
  savesMadeData as initialSavesMadeData, 
  shotPositionData as initialShotPositionData,
  performanceSummary as initialPerformanceSummary
} from '@/lib/chart-data';

export const usePerformanceState = () => {
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

  return {
    goalsConcededData,
    setGoalsConcededData,
    savesMadeData,
    setSavesMadeData,
    shotPositionData,
    setShotPositionData,
    performanceSummary,
    setPerformanceSummary
  };
};
