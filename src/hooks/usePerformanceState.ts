
import { useState, useEffect } from 'react';
import { 
  GoalsConcededDataPoint,
  SavesMadeDataPoint,
  ShotPositionDataPoint,
  PerformanceSummary
} from '@/types/store-types';
import {
  fetchGoalsConcededData, updateGoalsConcededData,
  fetchSavesMadeData, updateSavesMadeData,
  fetchShotPositionData, updateShotPositionData,
  fetchPerformanceSummary, updatePerformanceSummary
} from '@/services/database';

export const usePerformanceState = () => {
  const [goalsConcededData, setGoalsConcededDataState] = useState<GoalsConcededDataPoint[]>([]);
  const [savesMadeData, setSavesMadeDataState] = useState<SavesMadeDataPoint[]>([]);
  const [shotPositionData, setShotPositionDataState] = useState<ShotPositionDataPoint[]>([]);
  const [performanceSummary, setPerformanceSummaryState] = useState<PerformanceSummary>({
    matches: 0,
    totalSaves: 0,
    totalGoalsConceded: 0,
    cleanSheets: 0,
    savePercentage: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load data from Supabase on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      const [
        goalsConcededResult, 
        savesMadeResult, 
        shotPositionResult, 
        performanceSummaryResult
      ] = await Promise.all([
        fetchGoalsConcededData(),
        fetchSavesMadeData(),
        fetchShotPositionData(),
        fetchPerformanceSummary()
      ]);
      
      setGoalsConcededDataState(goalsConcededResult);
      setSavesMadeDataState(savesMadeResult);
      setShotPositionDataState(shotPositionResult);
      setPerformanceSummaryState(performanceSummaryResult);
      
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  // Custom setters that update Supabase
  const setGoalsConcededData = async (data: GoalsConcededDataPoint[]) => {
    setGoalsConcededDataState(data);
    await updateGoalsConcededData(data);
  };

  const setSavesMadeData = async (data: SavesMadeDataPoint[]) => {
    setSavesMadeDataState(data);
    await updateSavesMadeData(data);
  };

  const setShotPositionData = async (data: ShotPositionDataPoint[]) => {
    setShotPositionDataState(data);
    await updateShotPositionData(data);
  };

  const setPerformanceSummary = async (data: PerformanceSummary) => {
    setPerformanceSummaryState(data);
    await updatePerformanceSummary(data);
  };

  return {
    goalsConcededData,
    setGoalsConcededData,
    savesMadeData,
    setSavesMadeData,
    shotPositionData,
    setShotPositionData,
    performanceSummary,
    setPerformanceSummary,
    isLoading
  };
};
