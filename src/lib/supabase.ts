
import { createClient } from '@supabase/supabase-js';

// These should come from environment variables in production
const supabaseUrl = 'https://byfnoivaiavwthgwooui.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5Zm5vaXZhaWF2d3RoZ3dvb3VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI3NDA0MzUsImV4cCI6MjAyODMxNjQzNX0.QlxHpYg3-zcLtK_0NsG4buYPjQNO7BfJnqlEUQYoKaA';

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to check if Supabase connection is working
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('UserSettings').select('count', { count: 'exact', head: true });
    if (error) throw error;
    console.log('Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
};
