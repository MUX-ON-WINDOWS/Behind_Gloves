
import { useState, useEffect } from 'react';
import { LastMatch, UpcomingMatch, TeamData } from '@/types/store-types';
import { LOCAL_STORAGE_KEYS } from '@/constants/storage-keys';
import {
  lastMatch as initialLastMatch,
  upcomingMatch as initialUpcomingMatch,
  teamScoreboard as initialTeamScoreboard
} from '@/lib/chart-data';

export const useMatchState = () => {
  const [lastMatch, setLastMatch] = useState<LastMatch>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_MATCH);
    return saved ? JSON.parse(saved) : initialLastMatch;
  });

  const [upcomingMatch, setUpcomingMatch] = useState<UpcomingMatch>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.UPCOMING_MATCH);
    return saved ? JSON.parse(saved) : initialUpcomingMatch;
  });

  const [teamScoreboard, setTeamScoreboard] = useState<TeamData[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.TEAM_SCOREBOARD);
    return saved ? JSON.parse(saved) : initialTeamScoreboard;
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_MATCH, JSON.stringify(lastMatch));
  }, [lastMatch]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.UPCOMING_MATCH, JSON.stringify(upcomingMatch));
  }, [upcomingMatch]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.TEAM_SCOREBOARD, JSON.stringify(teamScoreboard));
  }, [teamScoreboard]);

  return {
    lastMatch,
    setLastMatch,
    upcomingMatch,
    setUpcomingMatch,
    teamScoreboard,
    setTeamScoreboard
  };
};
