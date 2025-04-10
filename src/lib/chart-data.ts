// Sample data for goalkeeper statistics
export const goalsConcededData = [
  {
    name: "Match 1",
    goals: 1,
  },
  {
    name: "Match 2",
    goals: 0,
  },
  {
    name: "Match 3",
    goals: 2,
  },
  {
    name: "Match 4",
    goals: 1,
  },
  {
    name: "Match 5",
    goals: 0,
  },
  {
    name: "Match 6",
    goals: 2,
  },
  {
    name: "Match 7",
    goals: 0,
  },
];

export const savesMadeData = [
  {
    name: "Match 1",
    saves: 5,
  },
  {
    name: "Match 2",
    saves: 3,
  },
  {
    name: "Match 3",
    saves: 7,
  },
  {
    name: "Match 4",
    saves: 2,
  },
  {
    name: "Match 5",
    saves: 6,
  },
  {
    name: "Match 6",
    saves: 4,
  },
  {
    name: "Match 7",
    saves: 8,
  },
];

export const shotPositionData = [
  { name: "Top Left", value: 8 },
  { name: "Top Right", value: 6 },
  { name: "Bottom Left", value: 4 },
  { name: "Bottom Right", value: 3 },
  { name: "Center", value: 2 },
];

export const performanceSummary = {
  matches: 7,
  totalSaves: 35,
  totalGoalsConceded: 6,
  cleanSheets: 3,
  savePercentage: 85.4,
};

// New data for matches and scoreboard
export const lastMatch = {
  homeTeam: "FC United",
  homeScore: 2,
  awayTeam: "City FC",
  awayScore: 0,
  date: "2025-03-28",
  venue: "United Stadium",
  cleanSheet: true,
  saves: 6,
};

export const upcomingMatch = {
  homeTeam: "FC United",
  awayTeam: "Rovers FC",
  date: "2025-04-10",
  time: "19:45",
  venue: "United Stadium",
  competition: "Premier League",
};

export const teamScoreboard = [
  { 
    position: 1, 
    team: "City FC", 
    played: 32, 
    won: 24, 
    drawn: 5, 
    lost: 3, 
    goalsFor: 68, 
    goalsAgainst: 21,
    points: 77
  },
  { 
    position: 2, 
    team: "FC United", 
    played: 32, 
    won: 22, 
    drawn: 6, 
    lost: 4, 
    goalsFor: 65, 
    goalsAgainst: 28,
    points: 72
  },
  { 
    position: 3, 
    team: "Athletic FC", 
    played: 32, 
    won: 19, 
    drawn: 8, 
    lost: 5, 
    goalsFor: 59, 
    goalsAgainst: 32,
    points: 65
  },
  { 
    position: 4, 
    team: "Rovers FC", 
    played: 32, 
    won: 18, 
    drawn: 7, 
    lost: 7, 
    goalsFor: 52, 
    goalsAgainst: 34,
    points: 61
  },
  { 
    position: 5, 
    team: "United City", 
    played: 32, 
    won: 16, 
    drawn: 10, 
    lost: 6, 
    goalsFor: 47, 
    goalsAgainst: 29,
    points: 58
  }
];
