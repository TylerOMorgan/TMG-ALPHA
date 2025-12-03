
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

const supabaseUrl = 'https://gekekeczrsjjxyjmxojl.supabase.co'; // <--- PASTE YOUR CLIENT'S PROJECT URL HERE
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdla2VrZWN6cnNqanh5am14b2psIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NTQxMjQsImV4cCI6MjA4MDMzMDEyNH0.uyNfswZkeeuK5H30kd5PYsyLsgC7NhryEtQqSEhHbw8'; // <--- PASTE YOUR CLIENT'S ANON KEY HERE

export const supabase = createClient(supabaseUrl, supabaseKey);
