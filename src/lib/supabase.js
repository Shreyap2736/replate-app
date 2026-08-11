import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bgeyyryhnrfxzhkaowcq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnZXl5cnlobnJmeHpoa2Fvd2NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI4NTI2ODksImV4cCI6MjAzODQyODY4OX0.P0m3UqJm0U1wRz-T5OqXN4R4bU0L7x1Y8aZ9Q9wZ0xE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
