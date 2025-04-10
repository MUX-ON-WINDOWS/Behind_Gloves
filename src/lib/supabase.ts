
import { createClient } from '@supabase/supabase-js';

// These should come from environment variables in production
const supabaseUrl = 'https://byfnoivaiavwthgwooui.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5Zm5vaXZhaWF2d3RoZ3dvb3VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMzIxMjEsImV4cCI6MjA1OTgwODEyMX0.LdwCV-Oh4Y9v7s2uYg2_Wa6MSrkn1msX8hUgwlWqs0Y';

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
// postgresql://postgres.byfnoivaiavwthgwooui:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres