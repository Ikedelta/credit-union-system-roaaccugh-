import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://swshovhsriswvpukdqxh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3c2hvdmhzcmlzd3ZwdWtkcXhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MjkwNDEsImV4cCI6MjA5OTEwNTA0MX0.ebgpYoexYGr0PBplwI0pTUtOJYYAwooBhoJzFVe_tRA';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing from environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
