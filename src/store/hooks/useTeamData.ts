
import { useState, useEffect } from 'react';
import { LOCAL_STORAGE_KEYS } from '@/constants/storage-keys';
import { teamScoreboard as initialTeamScoreboard } from '@/lib/chart-data';
import { TeamData } from '@/types/store-types';

export const useTeamData = () => {
  const [teamScoreboard, setTeamScoreboard] = useState<TeamData[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.TEAM_SCOREBOARD);
    return saved ? JSON.parse(saved) : initialTeamScoreboard;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.TEAM_SCOREBOARD, JSON.stringify(teamScoreboard));
  }, [teamScoreboard]);

  return {
    teamScoreboard,
    setTeamScoreboard
  };
};
