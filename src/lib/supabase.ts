
import { createClient } from '@supabase/supabase-js';

// These should come from environment variables in production
const supabaseUrl = 'https://byfnoivaiavwthgwooui.supabase.co';
const supabaseKey = 'YOUR_ANON_KEY'; // Replace with your actual anon key

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseKey);
