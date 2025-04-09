
import { useState, useEffect } from 'react';
import { MatchLog } from '@/types/store-types';
import { LOCAL_STORAGE_KEYS } from '@/constants/storage-keys';
import { generateInitialMatchLogs } from '@/utils/store-utils';

export const useMatchLogState = () => {
  const [matchLogs, setMatchLogs] = useState<MatchLog[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.MATCH_LOGS);
    return saved ? JSON.parse(saved) : generateInitialMatchLogs();
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.MATCH_LOGS, JSON.stringify(matchLogs));
  }, [matchLogs]);

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
