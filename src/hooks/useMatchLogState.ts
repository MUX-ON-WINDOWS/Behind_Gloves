
import { useState, useEffect } from 'react';
import { MatchLog } from '@/types/store-types';
import { fetchMatchLogs, addMatchLog as addLog, updateMatchLog as updateLog, deleteMatchLog as deleteLog } from '@/services/database';

export const useMatchLogState = () => {
  const [matchLogs, setMatchLogs] = useState<MatchLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load match logs from Supabase on component mount
  useEffect(() => {
    const loadMatchLogs = async () => {
      setIsLoading(true);
      const logs = await fetchMatchLogs();
      setMatchLogs(logs);
      setIsLoading(false);
    };
    
    loadMatchLogs();
  }, []);

  const addMatchLog = async (match: Omit<MatchLog, "id">) => {
    const newId = await addLog(match);
    if (newId) {
      // Refresh the logs from the database to ensure consistency
      const updatedLogs = await fetchMatchLogs();
      setMatchLogs(updatedLogs);
    }
  };

  const updateMatchLog = async (id: string, match: Partial<MatchLog>) => {
    await updateLog(id, match);
    // Refresh the logs to ensure consistency
    const updatedLogs = await fetchMatchLogs();
    setMatchLogs(updatedLogs);
  };

  const deleteMatchLog = async (id: string) => {
    await deleteLog(id);
    setMatchLogs(prev => prev.filter(log => log.id !== id));
  };

  return {
    matchLogs,
    setMatchLogs,
    addMatchLog,
    updateMatchLog,
    deleteMatchLog,
    isLoading
  };
};
