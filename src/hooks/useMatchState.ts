
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
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
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load data from Supabase on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const [lastMatchData, upcomingMatchData, teamScoreboardData] = await Promise.all([
          fetchLastMatch(),
          fetchUpcomingMatch(),
          fetchTeamScoreboard()
        ]);
        
        setLastMatchState(lastMatchData);
        setUpcomingMatchState(upcomingMatchData);
        setTeamScoreboardState(teamScoreboardData);
      } catch (err) {
        console.error("Failed to load match data:", err);
        setError("Failed to load match data");
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Could not load match data from database",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Custom setters that update Supabase
  const setLastMatch = async (match: LastMatch) => {
    try {
      setLastMatchState(match);
      await updateLastMatch(match);
      toast({
        title: "Last match updated",
        description: "Match details have been saved",
      });
    } catch (err) {
      console.error("Failed to update last match:", err);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to save last match to database",
      });
    }
  };

  const setUpcomingMatch = async (match: UpcomingMatch) => {
    try {
      setUpcomingMatchState(match);
      await updateUpcomingMatch(match);
      toast({
        title: "Upcoming match updated",
        description: "Match details have been saved",
      });
    } catch (err) {
      console.error("Failed to update upcoming match:", err);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to save upcoming match to database",
      });
    }
  };

  const setTeamScoreboard = async (teams: TeamData[]) => {
    try {
      setTeamScoreboardState(teams);
      await updateTeamScoreboard(teams);
      toast({
        title: "Team scoreboard updated",
        description: "Team standings have been saved",
      });
    } catch (err) {
      console.error("Failed to update team scoreboard:", err);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to save team scoreboard to database",
      });
    }
  };

  return {
    lastMatch,
    setLastMatch,
    upcomingMatch,
    setUpcomingMatch,
    teamScoreboard,
    setTeamScoreboard,
    isLoading,
    error
  };
};
