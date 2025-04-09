
import { MatchLog, UserSettings } from '@/types/store-types';

export const calculatePerformanceSummary = (matchLogs: MatchLog[], userSettings: UserSettings) => {
  const totalMatches = matchLogs.length;
  let totalSaves = 0;
  let totalGoalsConceded = 0;
  let totalCleanSheets = 0;
  let teamWins = 0;
  let teamDraws = 0;
  let teamLosses = 0;
  
  matchLogs.forEach(match => {
    totalSaves += match.saves;
    
    const isHomeGame = match.homeTeam === userSettings.clubTeam;
    const teamScore = isHomeGame ? match.homeScore : match.awayScore;
    const opponentScore = isHomeGame ? match.awayScore : match.homeScore;
    
    // Determine goals conceded 
    if (isHomeGame) {
      totalGoalsConceded += match.awayScore;
      if (match.awayScore === 0) totalCleanSheets++;
    } else {
      totalGoalsConceded += match.homeScore;
      if (match.homeScore === 0) totalCleanSheets++;
    }
    
    // Determine match result
    if (teamScore > opponentScore) {
      teamWins++;
    } else if (teamScore === opponentScore) {
      teamDraws++;
    } else {
      teamLosses++;
    }
  });
  
  // Calculate save percentage
  const savePercentage = totalMatches > 0 
    ? parseFloat(((totalSaves / (totalSaves + totalGoalsConceded)) * 100).toFixed(1))
    : 0;
  
  return {
    matches: totalMatches,
    totalSaves,
    totalGoalsConceded,
    cleanSheets: totalCleanSheets,
    savePercentage,
    teamWins,
    teamDraws,
    teamLosses
  };
};

export const updateTeamScoreboard = (
  teamScoreboard: any[], 
  userSettings: UserSettings, 
  matchLogs: MatchLog[], 
  stats: any
) => {
  const updatedTeamScoreboard = [...teamScoreboard];
  const teamIndex = updatedTeamScoreboard.findIndex(team => team.team === userSettings.clubTeam);
  
  if (teamIndex !== -1) {
    updatedTeamScoreboard[teamIndex] = {
      ...updatedTeamScoreboard[teamIndex],
      played: stats.matches,
      won: stats.teamWins,
      drawn: stats.teamDraws,
      lost: stats.teamLosses,
      goalsFor: matchLogs.reduce((total, match) => {
        return total + (match.homeTeam === userSettings.clubTeam ? match.homeScore : match.awayScore);
      }, 0),
      goalsAgainst: stats.totalGoalsConceded,
      points: stats.teamWins * 3 + stats.teamDraws
    };
    
    // Resort teams by points
    updatedTeamScoreboard.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      // Goal difference as tiebreaker
      const aGD = a.goalsFor - a.goalsAgainst;
      const bGD = b.goalsFor - b.goalsAgainst;
      return bGD - aGD;
    });
    
    // Update positions
    updatedTeamScoreboard.forEach((team, index) => {
      team.position = index + 1;
    });
  }
  
  return updatedTeamScoreboard;
};

export const calculateChartData = (matchLogs: MatchLog[], userSettings: UserSettings) => {
  if (matchLogs.length === 0) return { goalsConcededData: [], savesMadeData: [] };
  
  // Get most recent 6 matches
  const last6Matches = [...matchLogs]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6)
    .reverse();
  
  const goalsConcededData = last6Matches.map((match) => {
    const isHomeGame = match.homeTeam === userSettings.clubTeam;
    const goalsAgainst = isHomeGame ? match.awayScore : match.homeScore;
    // Format date to show just month/day
    const matchDate = new Date(match.date);
    const formattedDate = `${matchDate.getMonth() + 1}/${matchDate.getDate()}`;
    
    return {
      name: formattedDate,
      goals: goalsAgainst
    };
  });
  
  const savesMadeData = last6Matches.map((match) => {
    // Format date to show just month/day
    const matchDate = new Date(match.date);
    const formattedDate = `${matchDate.getMonth() + 1}/${matchDate.getDate()}`;
    
    return {
      name: formattedDate,
      saves: match.saves
    };
  });

  return { goalsConcededData, savesMadeData };
};
