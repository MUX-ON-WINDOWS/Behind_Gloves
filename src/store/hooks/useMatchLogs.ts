
import { useState, useEffect } from 'react';
import { LOCAL_STORAGE_KEYS } from '@/constants/storage-keys';
import { generateInitialMatchLogs } from '@/utils/store-utils';
import { MatchLog } from '@/types/store-types';

export const useMatchLogs = () => {
  // Match logs
  const [matchLogs, setMatchLogs] = useState<MatchLog[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.MATCH_LOGS);
    return saved ? JSON.parse(saved) : generateInitialMatchLogs();
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.MATCH_LOGS, JSON.stringify(matchLogs));
  }, [matchLogs]);

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

  return {
    matchLogs,
    setMatchLogs,
    addMatchLog,
    updateMatchLog,
    deleteMatchLog
  };
};
