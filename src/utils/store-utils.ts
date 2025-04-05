
import { MatchLog } from '@/types/store-types';
import { goalsConcededData, savesMadeData } from '@/lib/chart-data';

// Generate sample match logs based on the goals conceded data
export const generateInitialMatchLogs = (): MatchLog[] => {
  return goalsConcededData.map((match, index) => {
    const isHomeGame = index % 2 === 0;
    const savesMade = savesMadeData[index]?.saves || 0;
    const goalsConceded = match.goals;
    const homeScore = isHomeGame ? Math.floor(Math.random() * 4) : goalsConceded;
    const awayScore = isHomeGame ? goalsConceded : Math.floor(Math.random() * 4);
    
    const matchDate = new Date();
    matchDate.setDate(matchDate.getDate() - (goalsConcededData.length - index) * 7);
    
    return {
      id: `match-${index + 1}`,
      date: matchDate.toISOString().split('T')[0],
      homeTeam: isHomeGame ? 'FC United' : `Opponent ${index + 1}`,
      awayTeam: isHomeGame ? `Opponent ${index + 1}` : 'FC United',
      homeScore: isHomeGame ? homeScore : awayScore,
      awayScore: isHomeGame ? awayScore : homeScore,
      venue: isHomeGame ? 'United Stadium' : `Away Stadium ${index + 1}`,
      saves: savesMade,
      cleanSheet: goalsConceded === 0,
      notes: `Match ${index + 1} notes`
    };
  });
};
