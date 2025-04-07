
import { useState, useEffect } from 'react';
import { LOCAL_STORAGE_KEYS } from '@/constants/storage-keys';
import { 
  goalsConcededData as initialGoalsConcededData, 
  savesMadeData as initialSavesMadeData, 
  shotPositionData as initialShotPositionData
} from '@/lib/chart-data';
import { GoalsConcededDataPoint, SavesMadeDataPoint, ShotPositionDataPoint } from '@/types/store-types';

export const useChartData = () => {
  // Chart data
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

  return {
    goalsConcededData, setGoalsConcededData,
    savesMadeData, setSavesMadeData,
    shotPositionData, setShotPositionData
  };
};
