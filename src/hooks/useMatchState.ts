
import { useState, useEffect } from 'react';
import { LastMatch, UpcomingMatch, TeamData } from '@/types/store-types';
import { 
  fetchLastMatch, updateLastMatch,
  fetchUpcomingMatch, updateUpcomingMatch,
  fetchTeamScoreboard, updateTeamScoreboard
} from '@/services/database';

export const useMatchState = () => {
  const [lastMatch, setLastMatchState] = useState<LastMatch>({
    homeTeam: '',
    homeScore: 0,
    awayTeam: '',
    awayScore: 0,
    date: '',
    venue: '',
    cleanSheet: false,
    saves: 0
  });

  const [upcomingMatch, setUpcomingMatchState] = useState<UpcomingMatch>({
    homeTeam: '',
    awayTeam: '',
    date: '',
    time: '',
    venue: '',
    competition: ''
  });

  const [teamScoreboard, setTeamScoreboardState] = useState<TeamData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from Supabase on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      const [lastMatchData, upcomingMatchData, teamScoreboardData] = await Promise.all([
        fetchLastMatch(),
        fetchUpcomingMatch(),
        fetchTeamScoreboard()
      ]);
      
      setLastMatchState(lastMatchData);
      setUpcomingMatchState(upcomingMatchData);
      setTeamScoreboardState(teamScoreboardData);
      
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  // Custom setters that update Supabase
  const setLastMatch = async (match: LastMatch) => {
    setLastMatchState(match);
    await updateLastMatch(match);
  };

  const setUpcomingMatch = async (match: UpcomingMatch) => {
    setUpcomingMatchState(match);
    await updateUpcomingMatch(match);
  };

  const setTeamScoreboard = async (teams: TeamData[]) => {
    setTeamScoreboardState(teams);
    await updateTeamScoreboard(teams);
  };

  return {
    lastMatch,
    setLastMatch,
    upcomingMatch,
    setUpcomingMatch,
    teamScoreboard,
    setTeamScoreboard,
    isLoading
  };
};
