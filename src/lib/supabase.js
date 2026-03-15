import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fhczdcsjusreftfpfdba.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoY3pkY3NqdXNyZWZ0ZnBmZGJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1NjU5MjMsImV4cCI6MjA4OTE0MTkyM30.8WBhASnpCdnx3S6Uso9_2uSUcy-wpMAJoNZxfzSzZ8A';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);