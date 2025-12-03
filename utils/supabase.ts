
import { createClient } from '@supabase/supabase-js';

// ==========================================
// ⚠️ CLIENT HANDOVER INSTRUCTIONS ⚠️
// ==========================================
// To connect this website to your own database:
// 1. Go to https://supabase.com and create a new project.
// 2. Run the provided SQL setup script in the SQL Editor.
// 3. Go to Project Settings -> API.
// 4. Copy the "Project URL" and "anon / public" Key.
// 5. Replace the values below with your own.

// --- REPLACE THE VALUES INSIDE THE QUOTES BELOW ---

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL; // <--- PASTE YOUR CLIENT'S PROJECT URL HERE
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY; // <--- PASTE YOUR CLIENT'S ANON KEY HERE

export const supabase = createClient(supabaseUrl, supabaseKey);
