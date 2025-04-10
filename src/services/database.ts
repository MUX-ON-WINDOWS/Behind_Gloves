
import { supabase } from '@/lib/supabase';
import {
  GoalsConcededDataPoint,
  SavesMadeDataPoint,
  ShotPositionDataPoint,
  PerformanceSummary,
  LastMatch,
  UpcomingMatch,
  TeamData,
  MatchLog,
  VideoAnalysis,
  UserSettings
} from '@/types/store-types';

// Goals Conceded Data
export async function fetchGoalsConcededData(): Promise<GoalsConcededDataPoint[]> {
  const { data, error } = await supabase.from('GoalsConcededData').select('*');
  if (error) {
    console.error('Error fetching goals conceded data:', error);
    return [];
  }
  return data;
}

export async function updateGoalsConcededData(data: GoalsConcededDataPoint[]): Promise<void> {
  // First delete all existing entries
  const { error: deleteError } = await supabase.from('GoalsConcededData').delete().neq('name', 'dummy_value');
  if (deleteError) {
    console.error('Error deleting goals conceded data:', deleteError);
    return;
  }

  // Then insert all new entries
  if (data.length > 0) {
    const { error: insertError } = await supabase.from('GoalsConcededData').insert(data);
    if (insertError) {
      console.error('Error updating goals conceded data:', insertError);
    }
  }
}

// Saves Made Data
export async function fetchSavesMadeData(): Promise<SavesMadeDataPoint[]> {
  const { data, error } = await supabase.from('SavesMadeData').select('*');
  if (error) {
    console.error('Error fetching saves made data:', error);
    return [];
  }
  return data;
}

export async function updateSavesMadeData(data: SavesMadeDataPoint[]): Promise<void> {
  // First delete all existing entries
  const { error: deleteError } = await supabase.from('SavesMadeData').delete().neq('name', 'dummy_value');
  if (deleteError) {
    console.error('Error deleting saves made data:', deleteError);
    return;
  }

  // Then insert all new entries
  if (data.length > 0) {
    const { error: insertError } = await supabase.from('SavesMadeData').insert(data);
    if (insertError) {
      console.error('Error updating saves made data:', insertError);
    }
  }
}

// Shot Position Data
export async function fetchShotPositionData(): Promise<ShotPositionDataPoint[]> {
  const { data, error } = await supabase.from('ShotPositionData').select('*');
  if (error) {
    console.error('Error fetching shot position data:', error);
    return [];
  }
  return data;
}

export async function updateShotPositionData(data: ShotPositionDataPoint[]): Promise<void> {
  // First delete all existing entries
  const { error: deleteError } = await supabase.from('ShotPositionData').delete().neq('name', 'dummy_value');
  if (deleteError) {
    console.error('Error deleting shot position data:', deleteError);
    return;
  }

  // Then insert all new entries
  if (data.length > 0) {
    const { error: insertError } = await supabase.from('ShotPositionData').insert(data);
    if (insertError) {
      console.error('Error updating shot position data:', insertError);
    }
  }
}

// Performance Summary
export async function fetchPerformanceSummary(): Promise<PerformanceSummary> {
  const { data, error } = await supabase.from('PerformanceSummary').select('*').order('id', { ascending: false }).limit(1);
  if (error) {
    console.error('Error fetching performance summary:', error);
    return {
      matches: 0,
      totalSaves: 0,
      totalGoalsConceded: 0,
      cleanSheets: 0,
      savePercentage: 0
    };
  }
  return data[0] || {
    matches: 0,
    totalSaves: 0,
    totalGoalsConceded: 0,
    cleanSheets: 0,
    savePercentage: 0
  };
}

export async function updatePerformanceSummary(summary: PerformanceSummary): Promise<void> {
  // Check if any record exists
  const { data, error: checkError } = await supabase.from('PerformanceSummary').select('id').limit(1);
  
  if (checkError) {
    console.error('Error checking performance summary:', checkError);
    return;
  }
  
  if (data && data.length > 0) {
    // Update existing record
    const { error } = await supabase.from('PerformanceSummary').update(summary).eq('id', data[0].id);
    if (error) {
      console.error('Error updating performance summary:', error);
    }
  } else {
    // Insert new record
    const { error } = await supabase.from('PerformanceSummary').insert(summary);
    if (error) {
      console.error('Error inserting performance summary:', error);
    }
  }
}

// Last Match
export async function fetchLastMatch(): Promise<LastMatch> {
  const { data, error } = await supabase.from('LastMatch').select('*').order('id', { ascending: false }).limit(1);
  if (error) {
    console.error('Error fetching last match:', error);
    return {
      homeTeam: '',
      homeScore: 0,
      awayTeam: '',
      awayScore: 0,
      date: '',
      venue: '',
      cleanSheet: false,
      saves: 0
    };
  }
  
  const lastMatch = data[0] || {
    homeTeam: '',
    homeScore: 0,
    awayTeam: '',
    awayScore: 0,
    date: '',
    venue: '',
    cleanSheet: false,
    saves: 0
  };
  
  // Convert the date to string format if it's a Date object
  return {
    ...lastMatch,
    date: lastMatch.date ? new Date(lastMatch.date).toISOString() : ''
  };
}

export async function updateLastMatch(match: LastMatch): Promise<void> {
  // Check if any record exists
  const { data, error: checkError } = await supabase.from('LastMatch').select('id').limit(1);
  
  if (checkError) {
    console.error('Error checking last match:', checkError);
    return;
  }
  
  if (data && data.length > 0) {
    // Update existing record
    const { error } = await supabase.from('LastMatch').update(match).eq('id', data[0].id);
    if (error) {
      console.error('Error updating last match:', error);
    }
  } else {
    // Insert new record
    const { error } = await supabase.from('LastMatch').insert(match);
    if (error) {
      console.error('Error inserting last match:', error);
    }
  }
}

// Upcoming Match
export async function fetchUpcomingMatch(): Promise<UpcomingMatch> {
  const { data, error } = await supabase.from('UpcomingMatch').select('*').order('id', { ascending: false }).limit(1);
  if (error) {
    console.error('Error fetching upcoming match:', error);
    return {
      homeTeam: '',
      awayTeam: '',
      date: '',
      time: '',
      venue: '',
      competition: ''
    };
  }
  
  const upcomingMatch = data[0] || {
    homeTeam: '',
    awayTeam: '',
    date: '',
    time: '',
    venue: '',
    competition: ''
  };
  
  // Convert the date to string format if it's a Date object
  return {
    ...upcomingMatch,
    date: upcomingMatch.date ? new Date(upcomingMatch.date).toISOString() : '',
    time: upcomingMatch.time || '' // Ensure time is a string
  };
}

export async function updateUpcomingMatch(match: UpcomingMatch): Promise<void> {
  // Check if any record exists
  const { data, error: checkError } = await supabase.from('UpcomingMatch').select('id').limit(1);
  
  if (checkError) {
    console.error('Error checking upcoming match:', checkError);
    return;
  }
  
  if (data && data.length > 0) {
    // Update existing record
    const { error } = await supabase.from('UpcomingMatch').update(match).eq('id', data[0].id);
    if (error) {
      console.error('Error updating upcoming match:', error);
    }
  } else {
    // Insert new record
    const { error } = await supabase.from('UpcomingMatch').insert(match);
    if (error) {
      console.error('Error inserting upcoming match:', error);
    }
  }
}

// Team Scoreboard
export async function fetchTeamScoreboard(): Promise<TeamData[]> {
  const { data, error } = await supabase.from('TeamScoreboard').select('*').order('position', { ascending: true });
  if (error) {
    console.error('Error fetching team scoreboard:', error);
    return [];
  }
  return data;
}

export async function updateTeamScoreboard(teams: TeamData[]): Promise<void> {
  // First delete all existing entries
  const { error: deleteError } = await supabase.from('TeamScoreboard').delete().neq('team', 'dummy_value');
  if (deleteError) {
    console.error('Error deleting team scoreboard data:', deleteError);
    return;
  }

  // Then insert all new entries
  if (teams.length > 0) {
    const { error: insertError } = await supabase.from('TeamScoreboard').insert(teams);
    if (insertError) {
      console.error('Error updating team scoreboard data:', insertError);
    }
  }
}

// Match Logs
export async function fetchMatchLogs(): Promise<MatchLog[]> {
  const { data, error } = await supabase.from('MatchLog').select('*').order('date', { ascending: false });
  if (error) {
    console.error('Error fetching match logs:', error);
    return [];
  }
  // Convert dates to string format
  return data.map(match => ({
    ...match,
    date: match.date ? new Date(match.date).toISOString() : ''
  }));
}

export async function addMatchLog(match: Omit<MatchLog, 'id'>): Promise<string | null> {
  const newId = crypto.randomUUID();
  const newMatch = { ...match, id: newId };
  
  const { error } = await supabase.from('MatchLog').insert(newMatch);
  if (error) {
    console.error('Error adding match log:', error);
    return null;
  }
  return newId;
}

export async function updateMatchLog(id: string, match: Partial<MatchLog>): Promise<void> {
  const { error } = await supabase.from('MatchLog').update(match).eq('id', id);
  if (error) {
    console.error('Error updating match log:', error);
  }
}

export async function deleteMatchLog(id: string): Promise<void> {
  const { error } = await supabase.from('MatchLog').delete().eq('id', id);
  if (error) {
    console.error('Error deleting match log:', error);
  }
}

// Video Analysis
export async function fetchVideoAnalyses(): Promise<VideoAnalysis[]> {
  // First fetch the main video analysis data
  const { data: videoData, error: videoError } = await supabase
    .from('VideoAnalysis')
    .select('*')
    .order('date', { ascending: false });
    
  if (videoError) {
    console.error('Error fetching video analyses:', videoError);
    return [];
  }
  
  // For each video, fetch its saves and goals timestamps
  const videosWithDetails = await Promise.all(videoData.map(async (video) => {
    // Fetch saves
    const { data: savesData, error: savesError } = await supabase
      .from('VideoSaves')
      .select('*')
      .eq('videoId', video.id);
      
    if (savesError) {
      console.error(`Error fetching saves for video ${video.id}:`, savesError);
    }
    
    // Fetch goals
    const { data: goalsData, error: goalsError } = await supabase
      .from('VideoGoals')
      .select('*')
      .eq('videoId', video.id);
      
    if (goalsError) {
      console.error(`Error fetching goals for video ${video.id}:`, goalsError);
    }
    
    // Construct the full video analysis object
    return {
      id: video.id,
      date: video.date ? new Date(video.date).toISOString() : '',
      title: video.title || '',
      description: video.description || '',
      saves: video.saves || 0,
      goals: video.goals || 0,
      videoStats: {
        analysis: video.analysis || '',
        summary: video.summary || '',
        title: video.videoTitle || video.title || '',
        description: video.videoDescription || video.description || '',
        saves: (savesData || []).map(save => ({
          timestamp: save.timestamp,
          description: save.description
        })),
        goals: (goalsData || []).map(goal => ({
          timestamp: goal.timestamp,
          description: goal.description
        }))
      }
    };
  }));
  
  return videosWithDetails;
}

export async function addVideoAnalysis(video: Omit<VideoAnalysis, 'id'>): Promise<string | null> {
  // Generate a new UUID for the video
  const newId = crypto.randomUUID();
  
  // Insert the main video record
  const { error: videoError } = await supabase.from('VideoAnalysis').insert({
    id: newId,
    date: video.date,
    title: video.title,
    description: video.description,
    saves: video.saves,
    goals: video.goals,
    analysis: video.videoStats.analysis,
    summary: video.videoStats.summary,
    videoTitle: video.videoStats.title,
    videoDescription: video.videoStats.description
  });
  
  if (videoError) {
    console.error('Error adding video analysis:', videoError);
    return null;
  }
  
  // Insert save timestamps if any
  if (video.videoStats.saves && video.videoStats.saves.length > 0) {
    const saveRecords = video.videoStats.saves.map(save => ({
      videoId: newId,
      timestamp: save.timestamp,
      description: save.description
    }));
    
    const { error: savesError } = await supabase.from('VideoSaves').insert(saveRecords);
    if (savesError) {
      console.error('Error adding video saves:', savesError);
    }
  }
  
  // Insert goal timestamps if any
  if (video.videoStats.goals && video.videoStats.goals.length > 0) {
    const goalRecords = video.videoStats.goals.map(goal => ({
      videoId: newId,
      timestamp: goal.timestamp,
      description: goal.description
    }));
    
    const { error: goalsError } = await supabase.from('VideoGoals').insert(goalRecords);
    if (goalsError) {
      console.error('Error adding video goals:', goalsError);
    }
  }
  
  return newId;
}

export async function deleteVideoAnalysis(id: string): Promise<void> {
  // First delete related saves and goals (due to foreign key constraints)
  const { error: savesError } = await supabase.from('VideoSaves').delete().eq('videoId', id);
  if (savesError) {
    console.error('Error deleting video saves:', savesError);
  }
  
  const { error: goalsError } = await supabase.from('VideoGoals').delete().eq('videoId', id);
  if (goalsError) {
    console.error('Error deleting video goals:', goalsError);
  }
  
  // Then delete the main video record
  const { error: videoError } = await supabase.from('VideoAnalysis').delete().eq('id', id);
  if (videoError) {
    console.error('Error deleting video analysis:', videoError);
  }
}

// User Settings
export async function fetchUserSettings(): Promise<UserSettings> {
  const { data, error } = await supabase.from('UserSettings').select('*').order('id', { ascending: false }).limit(1);
  if (error) {
    console.error('Error fetching user settings:', error);
    return { clubTeam: 'VV Dongen' };
  }
  return data[0] || { clubTeam: 'VV Dongen' };
}

export async function updateUserSettings(settings: UserSettings): Promise<void> {
  // Check if any record exists
  const { data, error: checkError } = await supabase.from('UserSettings').select('id').limit(1);
  
  if (checkError) {
    console.error('Error checking user settings:', checkError);
    return;
  }
  
  if (data && data.length > 0) {
    // Update existing record
    const { error } = await supabase.from('UserSettings').update(settings).eq('id', data[0].id);
    if (error) {
      console.error('Error updating user settings:', error);
    }
  } else {
    // Insert new record
    const { error } = await supabase.from('UserSettings').insert(settings);
    if (error) {
      console.error('Error inserting user settings:', error);
    }
  }
}
