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

// Helper function for error handling
const handleSupabaseError = (error: any, operation: string) => {
  // console.error(`Error ${operation}:`, error);
  if (error?.message?.includes('JWT')) {
    console.error('Authentication error - please check your Supabase API key');
  }
  throw error;
};

// Goals Conceded Data
export async function fetchGoalsConcededData(): Promise<GoalsConcededDataPoint[]> {
  try {
    const { data, error } = await supabase.from('GoalsConcededData').select('*');
    if (error) throw error;
    return data || [];
  } catch (error) {
    return handleSupabaseError(error, 'fetching goals conceded data');
  }
}

export async function updateGoalsConcededData(data: GoalsConcededDataPoint[]): Promise<void> {
  try {
    // First delete all existing entries
    const { error: deleteError } = await supabase.from('GoalsConcededData').delete().neq('name', 'dummy_value');
    if (deleteError) throw deleteError;

    // Then insert all new entries
    if (data.length > 0) {
      const { error: insertError } = await supabase.from('GoalsConcededData').insert(data);
      if (insertError) throw insertError;
    }
  } catch (error) {
    handleSupabaseError(error, 'updating goals conceded data');
  }
}

// Saves Made Data
export async function fetchSavesMadeData(): Promise<SavesMadeDataPoint[]> {
  try {
    const { data, error } = await supabase.from('SavesMadeData').select('*');
    if (error) throw error;
    return data || [];
  } catch (error) {
    return handleSupabaseError(error, 'fetching saves made data');
  }
}

export async function updateSavesMadeData(data: SavesMadeDataPoint[]): Promise<void> {
  try {
    // First delete all existing entries
    const { error: deleteError } = await supabase.from('SavesMadeData').delete().neq('name', 'dummy_value');
    if (deleteError) throw deleteError;

    // Then insert all new entries
    if (data.length > 0) {
      const { error: insertError } = await supabase.from('SavesMadeData').insert(data);
      if (insertError) throw insertError;
    }
  } catch (error) {
    handleSupabaseError(error, 'updating saves made data');
  }
}

// Shot Position Data
export async function fetchShotPositionData(): Promise<ShotPositionDataPoint[]> {
  try {
    const { data, error } = await supabase.from('ShotPositionData').select('*');
    if (error) throw error;
    return data || [];
  } catch (error) {
    return handleSupabaseError(error, 'fetching shot position data');
  }
}

export async function updateShotPositionData(data: ShotPositionDataPoint[]): Promise<void> {
  try {
    // First delete all existing entries
    const { error: deleteError } = await supabase.from('ShotPositionData').delete().neq('name', 'dummy_value');
    if (deleteError) throw deleteError;

    // Then insert all new entries
    if (data.length > 0) {
      const { error: insertError } = await supabase.from('ShotPositionData').insert(data);
      if (insertError) throw insertError;
    }
  } catch (error) {
    handleSupabaseError(error, 'updating shot position data');
  }
}

// Performance Summary
export async function fetchPerformanceSummary(): Promise<PerformanceSummary> {
  try {
    const { data, error } = await supabase.from('PerformanceSummary').select('*').order('id', { ascending: false }).limit(1);
    if (error) throw error;
    return data[0] || {
      matches: 0,
      totalSaves: 0,
      totalGoalsConceded: 0,
      cleanSheets: 0,
      savePercentage: 0
    };
  } catch (error) {
    return handleSupabaseError(error, 'fetching performance summary');
  }
}

export async function updatePerformanceSummary(summary: PerformanceSummary): Promise<void> {
  try {
    // Check if any record exists
    const { data, error: checkError } = await supabase.from('PerformanceSummary').select('id').limit(1);
    
    if (checkError) throw checkError;
    
    if (data && data.length > 0) {
      // Update existing record
      const { error } = await supabase.from('PerformanceSummary').update(summary).eq('id', data[0].id);
      if (error) throw error;
    } else {
      // Insert new record
      const { error } = await supabase.from('PerformanceSummary').insert(summary);
      if (error) throw error;
    }
  } catch (error) {
    handleSupabaseError(error, 'updating performance summary');
  }
}

// Last Match
export async function fetchLastMatch(): Promise<LastMatch> {
  try {
    const { data, error } = await supabase.from('LastMatch').select('*').order('id', { ascending: false }).limit(1);
    if (error) throw error;
    
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
  } catch (error) {
    return handleSupabaseError(error, 'fetching last match');
  }
}

export async function updateLastMatch(match: LastMatch): Promise<void> {
  try {
    // Check if any record exists
    const { data, error: checkError } = await supabase.from('LastMatch').select('id').limit(1);
    
    if (checkError) throw checkError;
    
    if (data && data.length > 0) {
      // Update existing record
      const { error } = await supabase.from('LastMatch').update(match).eq('id', data[0].id);
      if (error) throw error;
    } else {
      // Insert new record
      const { error } = await supabase.from('LastMatch').insert(match);
      if (error) throw error;
    }
  } catch (error) {
    handleSupabaseError(error, 'updating last match');
  }
}

// Upcoming Match
export async function fetchUpcomingMatch(): Promise<UpcomingMatch> {
  try {
    const { data, error } = await supabase.from('UpcomingMatch').select('*').order('id', { ascending: false }).limit(1);
    if (error) throw error;
    
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
  } catch (error) {
    return handleSupabaseError(error, 'fetching upcoming match');
  }
}

export async function updateUpcomingMatch(match: UpcomingMatch): Promise<void> {
  try {
    // Check if any record exists
    const { data, error: checkError } = await supabase.from('UpcomingMatch').select('id').limit(1);
    
    if (checkError) throw checkError;
    
    if (data && data.length > 0) {
      // Update existing record
      const { error } = await supabase.from('UpcomingMatch').update(match).eq('id', data[0].id);
      if (error) throw error;
    } else {
      // Insert new record
      const { error } = await supabase.from('UpcomingMatch').insert(match);
      if (error) throw error;
    }
  } catch (error) {
    handleSupabaseError(error, 'updating upcoming match');
  }
}

// Team Scoreboard
export async function fetchTeamScoreboard(): Promise<TeamData[]> {
  try {
    const { data, error } = await supabase.from('TeamScoreboard').select('*').order('position', { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (error) {
    return handleSupabaseError(error, 'fetching team scoreboard');
  }
}

export async function updateTeamScoreboard(teams: TeamData[]): Promise<void> {
  try {
    // First delete all existing entries
    const { error: deleteError } = await supabase.from('TeamScoreboard').delete().neq('team', 'dummy_value');
    if (deleteError) throw deleteError;

    // Then insert all new entries
    if (teams.length > 0) {
      const { error: insertError } = await supabase.from('TeamScoreboard').insert(teams);
      if (insertError) throw insertError;
    }
  } catch (error) {
    handleSupabaseError(error, 'updating team scoreboard');
  }
}

// Match Logs
export async function fetchMatchLogs(): Promise<MatchLog[]> {
  try {
    const { data, error } = await supabase.from('MatchLog').select('*').order('date', { ascending: false });
    if (error) throw error;
    // Convert dates to string format
    return (data || []).map(match => ({
      ...match,
      date: match.date ? new Date(match.date).toISOString() : ''
    }));
  } catch (error) {
    return handleSupabaseError(error, 'fetching match logs');
  }
}

export async function addMatchLog(match: Omit<MatchLog, 'id'>): Promise<string | null> {
  try {
    const newId = crypto.randomUUID();
    const newMatch = { ...match, id: newId };
    
    const { error } = await supabase.from('MatchLog').insert(newMatch);
    if (error) throw error;
    return newId;
  } catch (error) {
    handleSupabaseError(error, 'adding match log');
    return null;
  }
}

export async function updateMatchLog(id: string, match: Partial<MatchLog>): Promise<void> {
  try {
    const { error } = await supabase.from('MatchLog').update(match).eq('id', id);
    if (error) throw error;
  } catch (error) {
    handleSupabaseError(error, 'updating match log');
  }
}

export async function deleteMatchLog(id: string): Promise<void> {
  try {
    const { error } = await supabase.from('MatchLog').delete().eq('id', id);
    if (error) throw error;
  } catch (error) {
    handleSupabaseError(error, 'deleting match log');
  }
}

// Video Analysis
export async function fetchVideoAnalyses(): Promise<VideoAnalysis[]> {
  try {
    // First fetch the main video analysis data
    const { data: videoData, error: videoError } = await supabase
      .from('VideoAnalysis')
      .select('*')
      .order('date', { ascending: false });
      
    if (videoError) throw videoError;
    
    if (!videoData || videoData.length === 0) {
      return [];
    }
    
    // For each video, fetch its saves and goals timestamps
    const videosWithDetails = await Promise.all(videoData.map(async (video) => {
      try {
        // Fetch saves
        const { data: savesData, error: savesError } = await supabase
          .from('VideoSaves')
          .select('*')
          .eq('video_id', video.id);
          
        if (savesError) {
          console.error(`Error fetching saves for video ${video.id}:`, savesError);
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
              events: Array.isArray(video.videoEventData)
                ? video.videoEventData
                : (video.videoEventData?.events || []),
              saves: [],
              goals: []
            }
          };
        }
        
        // Fetch goals
        const { data: goalsData, error: goalsError } = await supabase
          .from('VideoGoals')
          .select('*')
          .eq('video_id', video.id);
          
        if (goalsError) {
          console.error(`Error fetching goals for video ${video.id}:`, goalsError);
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
              events: Array.isArray(video.videoEventData)
                ? video.videoEventData
                : (video.videoEventData?.events || []),
              saves: savesData || [],
              goals: []
            }
          };
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
            events: Array.isArray(video.videoEventData)
              ? video.videoEventData
              : (video.videoEventData?.events || []),
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
      } catch (error) {
        console.error(`Error fetching details for video ${video.id}:`, error);
        // Return basic video info without details in case of error
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
            events: Array.isArray(video.videoEventData)
              ? video.videoEventData
              : (video.videoEventData?.events || []),
            saves: [],
            goals: []
          }
        };
      }
    }));
    
    return videosWithDetails;
  } catch (error) {
    return handleSupabaseError(error, 'fetching video analyses');
  }
}

export async function addVideoAnalysis(video: Omit<VideoAnalysis, 'id'>): Promise<string | null> {
  try {
    // Generate a new UUID for the video
    const newId = crypto.randomUUID();
    
    const videoUrl = video.videoStats.videoUrl;
    const videoId = videoUrl.split('/').pop()?.replace('.mp4.mp4', '.mp4') || '';
    
    // Insert the main video record
    const { error: videoError } = await supabase.from('VideoAnalysis').insert({
      id: newId,
      videoId: videoId,
      date: video.date,
      title: video.title,
      description: video.description,
      saves: video.saves,
      VideoSaves: video.saves,
      goals: video.goals,
      VideoGoals: video.goals,
      analysis: video.videoStats.analysis,
      summary: video.videoStats.summary,
      videoTitle: video.videoStats.title,
      videoEventData: video.videoStats.events || []
    });
    
    if (videoError) throw videoError;
    
    // Insert save timestamps if any
    if (video.videoStats.saves && video.videoStats.saves.length > 0) {
      const saveRecords = video.videoStats.saves.map(save => ({
        videoId: newId,
        timestamp: save.timestamp,
        description: save.description
      }));
      
      const { error: savesError } = await supabase.from('VideoSaves').insert(saveRecords);
      if (savesError) throw savesError;
    }
    
    // Insert goal timestamps if any
    if (video.videoStats.goals && video.videoStats.goals.length > 0) {
      const goalRecords = video.videoStats.goals.map(goal => ({
        videoId: newId,
        timestamp: goal.timestamp,
        description: goal.description
      }));
      
      const { error: goalsError } = await supabase.from('VideoGoals').insert(goalRecords);
      if (goalsError) throw goalsError;
    }
    
    return newId;
  } catch (error) {
    handleSupabaseError(error, 'adding video analysis');
    return null;
  }
}

export async function deleteVideoAnalysis(id: string): Promise<void> {
  try {
    // First delete related saves and goals (due to foreign key constraints)
    const { error: savesError } = await supabase.from('VideoSaves').delete().eq('videoId', id);
    if (savesError) throw savesError;
    
    const { error: goalsError } = await supabase.from('VideoGoals').delete().eq('videoId', id);
    if (goalsError) throw goalsError;
    
    // Then delete the main video record
    const { error: videoError } = await supabase.from('VideoAnalysis').delete().eq('id', id);
    if (videoError) throw videoError;
    
    console.log('Video analysis deleted successfully');
  } catch (error) {
    handleSupabaseError(error, 'deleting video analysis');
  }
}

// User Settings
export async function fetchUserSettings(): Promise<UserSettings> {
  try {
    const { data, error } = await supabase.from('UserSettings').select('*').order('id', { ascending: false }).limit(1);
    if (error) throw error;
    return data[0] || { clubTeam: 'VV Dongen' };
  } catch (error) {
    return handleSupabaseError(error, 'fetching user settings');
  }
}

export async function updateUserSettings(settings: UserSettings): Promise<void> {
  try {
    // Check if any record exists
    const { data, error: checkError } = await supabase.from('UserSettings').select('id').limit(1);
    
    if (checkError) throw checkError;
    
    if (data && data.length > 0) {
      // Update existing record
      const { error } = await supabase.from('UserSettings').update(settings).eq('id', data[0].id);
      if (error) throw error;
    } else {
      // Insert new record
      const { error } = await supabase.from('UserSettings').insert(settings);
      if (error) throw error;
    }
    console.log('User settings updated successfully');
  } catch (error) {
    handleSupabaseError(error, 'updating user settings');
  }
}
